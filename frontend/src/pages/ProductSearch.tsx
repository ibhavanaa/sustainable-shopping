import React, { useState, useMemo } from 'react';
import { Product } from '../types/Product';
import { useProducts } from '../hooks/useProducts';
import { usePrediction } from '../hooks/usePrediction';
import ProductGrid from '../components/products/ProductGrid';
import FilterBar from '../components/products/FilterBar';
import ProductDetail from '../components/products/ProductDetail';
import RecommendationList from '../components/recommendations/RecommendationList';
import { sortProducts } from '../utils/helpers';

interface ProductSearchProps {
  searchQuery: string;
  onProductClick?: (product: Product) => void;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ 
  searchQuery, 
  onProductClick 
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<string>('');
  const [onlyBestSellers, setOnlyBestSellers] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 9999]);
  const [minStars, setMinStars] = useState<number>(0);

  const { products, loading, error, refetch } = useProducts(undefined, searchQuery);
  const { prediction, recommendations } = usePrediction(selectedProduct);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      if (onlyBestSellers && !product.isBestSeller) return false;
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
      if (product.stars < minStars) return false;
      return true;
    });

    if (sortBy) {
      filtered = sortProducts(filtered, sortBy);
    }

    return filtered;
  }, [products, onlyBestSellers, priceRange, minStars, sortBy]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    onProductClick?.(product);
  };

  const handleBackToResults = () => {
    setSelectedProduct(null);
  };

  // Show product detail if a product is selected
  if (selectedProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductDetail
          product={selectedProduct}
          prediction={prediction}
          onBack={handleBackToResults}
        />
        
        {recommendations.length > 0 && (
          <RecommendationList
            recommendations={recommendations}
            onProductClick={handleProductClick}
          />
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Search Results for "{searchQuery}"
        </h1>
        <p className="text-gray-600">
          Found {filteredProducts.length} products
        </p>
      </div>

      <FilterBar
        sortBy={sortBy}
        onSortChange={setSortBy}
        onlyBestSellers={onlyBestSellers}
        onBestSellersToggle={setOnlyBestSellers}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        minStars={minStars}
        onMinStarsChange={setMinStars}
      />

      <ProductGrid
        products={filteredProducts}
        loading={loading}
        error={error}
        onProductClick={handleProductClick}
        onRetry={refetch}
      />
    </div>
  );
};

export default ProductSearch;