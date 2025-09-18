import React from 'react';
import { Star, Award } from 'lucide-react';
import { Product } from '../../types/Product';
import { formatPrice, formatStars, formatReviews } from '../../utils/helpers';
import EcoFriendlyBadge from './EcoFriendlyBadge';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  showEcoBadge?: boolean;
  ecoLabelOverride?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onClick, 
  showEcoBadge = false,
  ecoLabelOverride 
}) => {
  return (
    <div
      onClick={() => onClick(product)}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer group overflow-hidden"
    >
      <div className="relative">
        <img
          src={product.imgUrl}
          alt={product.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg';
          }}
        />
        {product.isBestSeller && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
            <Award className="h-3 w-3 mr-1" />
            Best Seller
          </div>
        )}
        {showEcoBadge && (
          <div className="absolute top-2 right-2">
            <EcoFriendlyBadge ecoLabel={ecoLabelOverride ?? product.EcoLabel} size="sm" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
          {product.title}
        </h3>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.stars)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">
            {formatStars(product.stars)} ({formatReviews(product.reviews)})
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-green-600">
            {formatPrice(product.price)}
          </span>
          <span className="text-sm text-gray-500 capitalize">
            {product.categoryName}
          </span>
        </div>
        
        {product.boughtInLastMonth > 0 && (
          <div className="mt-2 text-xs text-orange-600">
            {product.boughtInLastMonth}+ bought in past month
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;