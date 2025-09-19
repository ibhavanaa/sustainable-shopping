import { Product } from '../types/Product';

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const formatStars = (stars: number): string => {
  return stars.toFixed(1);
};

export const formatReviews = (reviews: number): string => {
  if (reviews >= 1000) {
    return `${(reviews / 1000).toFixed(1)}k`;
  }
  return reviews.toString();
};

export const sortProducts = (products: Product[], sortBy: string): Product[] => {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price_asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'stars_asc':
      return sorted.sort((a, b) => a.stars - b.stars);
    case 'stars_desc':
      return sorted.sort((a, b) => b.stars - a.stars);
    case 'reviews_asc':
      return sorted.sort((a, b) => a.reviews - b.reviews);
    case 'reviews_desc':
      return sorted.sort((a, b) => b.reviews - a.reviews);
    case 'bestseller':
      return sorted.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    default:
      return sorted;
  }
};

export const generateStars = (rating: number): string => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(emptyStars);
};