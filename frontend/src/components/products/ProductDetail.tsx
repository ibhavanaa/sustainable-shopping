import React from 'react';
import { Star, Award, ArrowLeft, ExternalLink } from 'lucide-react';
import { Product } from '../../types/Product';
import { formatPrice, formatStars, formatReviews } from '../../utils/helpers';
import EcoFriendlyBadge from './EcoFriendlyBadge';
import { EcoPrediction } from '../../types/Product';

interface ProductDetailProps {
  product: Product;
  prediction?: EcoPrediction | null;
  onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  prediction,
  onBack 
}) => {
  const ecoLabel = prediction?.ecoLabel ?? product.EcoLabel;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Results</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
        {/* Product Image */}
        <div className="relative">
          <img
            src={product.imgUrl}
            alt={product.title}
            className="w-full h-96 object-cover rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg';
            }}
          />
          {product.isBestSeller && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
              <Award className="h-4 w-4 mr-1" />
              Best Seller
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
          
          {/* Price */}
          <div className="text-3xl font-bold text-green-600 mb-4">
            {formatPrice(product.price)}
          </div>

          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.stars)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-3 text-lg text-gray-600">
              {formatStars(product.stars)} ({formatReviews(product.reviews)} reviews)
            </span>
          </div>

          {/* Category */}
          <div className="mb-4">
            <span className="text-sm text-gray-500">Category: </span>
            <span className="text-sm font-medium text-gray-900 capitalize">
              {product.categoryName}
            </span>
          </div>

          {/* Product ASIN */}
          <div className="mb-6">
            <span className="text-sm text-gray-500">Product ID: </span>
            <span className="text-sm font-medium text-gray-900">{product.asin}</span>
          </div>

          {/* Purchase Activity */}
          {product.boughtInLastMonth > 0 && (
            <div className="mb-4 p-3 bg-orange-50 rounded-lg">
              <span className="text-orange-800 font-medium">
                🔥 {product.boughtInLastMonth}+ bought in past month
              </span>
            </div>
          )}

          {/* Environmental Impact */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Environmental Impact</h3>
            <EcoFriendlyBadge
              ecoLabel={ecoLabel}
              size="lg"
              showText={true}
              confidence={prediction?.confidence}
            />
            {ecoLabel !== 2 && (
              <p className="text-sm text-gray-600 mt-2">
                This product may not meet eco-friendly standards. See recommendations below for sustainable alternatives.
              </p>
            )}
          </div>

          {/* External Link */}
          <div className="mb-6">
            <a
              href={product.productURL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span>View on Amazon</span>
            </a>
          </div>

          {/* Add to Cart Button */}
          <button className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;