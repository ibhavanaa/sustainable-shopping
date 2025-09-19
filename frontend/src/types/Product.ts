export interface Product {
  asin: string;
  title: string;
  imgUrl: string;
  productURL: string;
  stars: number;
  reviews: number;
  price: number;
  isBestSeller: boolean;
  boughtInLastMonth: number;
  categoryName: string;
  EcoLabel: number;
  description?: string;
}

export interface EcoPrediction {
  ecoLabel: number; // 0 harmful, 1 moderate, 2 eco-friendly
  confidence: number;
}

export interface ProductWithEco extends Product {
  ecoFriendly?: EcoPrediction;
  recommendations?: Product[];
}