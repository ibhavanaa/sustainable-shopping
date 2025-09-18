import { useEffect, useState } from 'react';
import { productService } from '../services/productService';
import { Category } from '../types/Category';
import { getCategoryImage } from '../utils/categoryImages';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { products } = await productService.getProducts({ limit: 100000 });
        const counts: Record<string, number> = {};
        for (const p of products) {
          const key = (p.categoryName || '').trim() || 'Uncategorized';
          counts[key] = (counts[key] || 0) + 1;
        }
        const items: Category[] = Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .map(([name, count]) => ({ id: name, name, image: getCategoryImage(name), productCount: count }));
        setCategories(items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { categories, loading, error };
};


