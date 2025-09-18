import React from 'react';
import { Product } from '../../types/Product';
import ProductCard from '../products/ProductCard';

interface RecommendationListProps {
  recommendations: Product[];
  onProductClick: (product: Product) => void;
}

const RecommendationList: React.FC<RecommendationListProps> = ({
  recommendations,
  onProductClick,
}) => {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Eco-Friendly Recommendations
      </h2>
        <p className="text-gray-600 mb-6">
          Since the selected product isn't eco-friendly, here are some sustainable alternatives:
        </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={onProductClick}
            showEcoBadge={true}
            ecoLabelOverride={2}
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendationList;