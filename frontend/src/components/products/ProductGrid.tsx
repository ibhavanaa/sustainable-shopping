import React from 'react';
import { Product } from '../../types/Product';
import ProductCard from './ProductCard';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  onProductClick: (product: Product) => void;
  onRetry?: () => void;
  showEcoBadges?: boolean;
  ecoLabelsByProduct?: Map<string, number>;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading,
  error,
  onProductClick,
  onRetry,
  showEcoBadges = false,
  ecoLabelsByProduct = new Map(),
}) => {
  if (loading) {
    return <Loading text="Loading products..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.asin}
          product={product}
          onClick={onProductClick}
          showEcoBadge={showEcoBadges}
          ecoLabelOverride={ecoLabelsByProduct.get(product.asin)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;