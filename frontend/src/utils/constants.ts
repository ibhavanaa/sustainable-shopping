<<<<<<< HEAD
export const API_BASE_URL = 'http://localhost:5001';
=======
// ✅ Use environment variable or fallback
export const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001"
    : "http://35.173.215.140:5001";  // 👈 your EC2 public IP
>>>>>>> e5e0c99991257b0eabcd013b11a24e2136c02ec4

export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  PREDICT: '/api/predict',
  HEALTH: '/api/health',
  RECOMMEND: '/api/recommend',
};

// Categories are now derived dynamically from products via useCategories hook
export const CATEGORIES: never[] = [];

export const SORT_OPTIONS = [
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'stars_asc', label: 'Rating: Low to High' },
  { value: 'stars_desc', label: 'Rating: High to Low' },
  { value: 'reviews_asc', label: 'Reviews: Low to High' },
  { value: 'reviews_desc', label: 'Reviews: High to Low' },
  { value: 'bestseller', label: 'Best Sellers First' },
<<<<<<< HEAD
];
=======
];
>>>>>>> e5e0c99991257b0eabcd013b11a24e2136c02ec4
