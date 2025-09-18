import { useState, useEffect } from 'react';
import { Product } from '../types/Product';
import { productService } from '../services/productService';

export const useProducts = (category?: string, searchQuery?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let result: Product[] = [];
      
      if (searchQuery) {
        result = await productService.searchProducts(searchQuery);
      } else if (category) {
        result = await productService.getProductsByCategory(category);
      } else {
        const response = await productService.getProducts();
        result = response.products;
      }
      
      setProducts(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, searchQuery]);

  return { products, loading, error, refetch: fetchProducts };
};