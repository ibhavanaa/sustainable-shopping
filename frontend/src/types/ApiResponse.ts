import { Product } from './Product';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface PredictionResponse {
  ecoLabel: number; // 0 harmful, 1 moderate, 2 eco-friendly
  confidence: number;
  productId: string;
}

export interface RecommendationResponse {
  recommendations: Product[];
  originalProductId: string;
}