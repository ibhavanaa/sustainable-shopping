import { apiService } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import { Product } from '../types/Product';
import { ProductsResponse } from '../types/ApiResponse';

export class ProductService {
  private normalizeBoolean(value: unknown): boolean {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value === 1;
    const str = String(value || '').toLowerCase().trim();
    return str === 'true' || str === 'yes' || str === '1' || str === 'bestseller';
  }

  private normalizeNumber(value: unknown): number {
    if (typeof value === 'number' && isFinite(value)) return value;
    const str = String(value || '')
      .replace(/[,\s]/g, '')
      .replace(/[^0-9.-]/g, '');
    const parsed = parseFloat(str);
    return isFinite(parsed) ? parsed : 0;
  }

  private normalizeStars(value: unknown): number {
    // Handles formats like "4.5", "4.5 out of 5 stars"
    if (typeof value === 'number' && isFinite(value)) return value;
    const match = String(value || '').match(/([0-9]+(?:\.[0-9]+)?)/);
    return match ? Math.min(5, Math.max(0, parseFloat(match[1]))) : 0;
  }

  private normalizeProduct(record: Record<string, unknown>): Product {
    return {
      asin: record.asin || record.ASIN || record.id || record.Id || '',
      title: record.title || record.Name || record.productTitle || '',
      imgUrl: record.imgUrl || record.imageURL || record.image || record.img || '',
      productURL: record.productURL || record.url || record.link || record.productUrl || '',
      stars: this.normalizeStars(record.stars || record.rating || record.starsOutOf5),
      reviews: this.normalizeNumber(record.reviews || record.numReviews || record.reviewsCount),
      price: this.normalizeNumber(record.price || record.Price),
      isBestSeller: this.normalizeBoolean(record.isBestSeller || record.bestSeller || record.bestseller),
      boughtInLastMonth: this.normalizeNumber(record.boughtInLastMonth || record.bought_last_month || 0),
      categoryName: record.categoryName || record.category || record.Category || '',
      EcoLabel: typeof record.EcoLabel === 'number' ? record.EcoLabel : this.normalizeBoolean(record.EcoLabel) ? 1 : 0,
      description: record.description || record.Details || record.detail || undefined,
    };
  }

  // Minimal CSV parser supporting quoted fields and commas inside quotes
  private parseCsv(text: string): Array<Record<string, string>> {
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length === 0) return [];
    const headers = this.parseCsvLine(lines[0]);
    const rows: Array<Record<string, string>> = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = this.parseCsvLine(lines[i]);
      if (cols.length === 1 && cols[0] === '') continue;
      const obj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        obj[h] = cols[idx];
      });
      rows.push(obj);
    }
    return rows;
  }

  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (inQuotes) {
        if (char === '"') {
          if (i + 1 < line.length && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          current += char;
        }
      } else {
        if (char === ',') {
          result.push(current);
          current = '';
        } else if (char === '"') {
          inQuotes = true;
        } else {
          current += char;
        }
      }
    }
    result.push(current);
    return result.map(s => s.trim());
  }

  private async loadFromCsvFallback(): Promise<Product[]> {
    try {
      const csvUrl = new URL('../assets/finalwebsite.csv', import.meta.url).href;
      const res = await fetch(csvUrl);
      if (!res.ok) {
        throw new Error('CSV not found');
      }
      const text = await res.text();
      const records = this.parseCsv(text);
      return records.map((r) => this.normalizeProduct(r));
    } catch {
      console.warn('Failed to load pinned CSV from src/assets/finalwebsite.csv');
      return [];
    }
  }

  async getProducts(params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ProductsResponse> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 1000;
    let products: Product[] = [];
    try {
      // Backend returns { products: Product[] }
      const raw = await apiService.get<{ products: Array<Record<string, unknown>> }>(API_ENDPOINTS.PRODUCTS);
      products = (raw.products || []).map((r) => this.normalizeProduct(r));
    } catch {
      console.warn('API not available, loading from CSV fallback');
      products = await this.loadFromCsvFallback();
    }

    // Apply client-side filters consistently for both API and CSV paths
    if (params?.category) {
      const wanted = params.category.toLowerCase();
      products = products.filter(p => (p.categoryName || '').toLowerCase() === wanted);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      products = products.filter(p =>
        (p.title || '').toLowerCase().includes(q)
        || (p.categoryName || '').toLowerCase().includes(q)
      );
    }

    // Pagination
    const start = (page - 1) * limit;
    const paged = products.slice(start, start + limit);

    return {
      products: paged,
      total: products.length,
      page,
      limit,
    };
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      // No backend endpoint for single by id; fetch all and find locally
      const list = await this.getProducts({ limit: 100000 });
      return list.products.find(p => p.asin === id) || null;
    } catch {
      console.warn('Product not found:', id);
      return null;
    }
  }

  async searchProducts(query: string): Promise<Product[]> {
    const response = await this.getProducts({ search: query, limit: 50 });
    return response.products;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const response = await this.getProducts({ category, limit: 100 });
    return response.products;
  }
}

export const productService = new ProductService();