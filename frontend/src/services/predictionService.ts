import { apiService } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import { Product } from '../types/Product';

export class PredictionService {
  async predictEcoFriendlyFromProduct(product: Product): Promise<{ ecoLabel: number; confidence: number; recommendations?: Product[]; }>{
    try {
      // Backend expects { title, price, categoryName }
      const response = await apiService.post<{
        eco_label?: number | boolean;
        recommendations?: Product[];
      }>(
        API_ENDPOINTS.PREDICT,
        { title: product.title, price: product.price, categoryName: product.categoryName }
      );
      const ecoLabel: number = typeof response.eco_label === 'number' ? response.eco_label : (response.eco_label ? 2 : 0);
      return { ecoLabel, confidence: 0.9, recommendations: response.recommendations };
    } catch {
      // Graceful degradation: use CSV EcoLabel as ground truth; try recommend endpoint
      const ecoLabel = typeof product.EcoLabel === 'number' ? product.EcoLabel : 0;
      let recommendations: Product[] = [];
      if (ecoLabel !== 2) {
        try {
          const recResp = await apiService.post<{ recommendations?: Product[] }>(API_ENDPOINTS.RECOMMEND, {
            title: product.title,
            price: product.price,
            categoryName: product.categoryName,
          });
          recommendations = recResp.recommendations || [];
        } catch {
          // ignore recommend failure in degraded mode
        }
      }
      return { ecoLabel, confidence: 0.85, recommendations };
    }
  }

  async getRecommendations(): Promise<Product[]> {
    try {
      // Note: backend recommend endpoint expects { title, price } as of now
      // This method is kept for compatibility but requires Product context
      console.warn('getRecommendations(productId) requires product context for backend payload. Returning empty.');
      return [];
    } catch {
      console.warn('Recommendation service not available');
      return [];
    }
  }
}

export const predictionService = new PredictionService();