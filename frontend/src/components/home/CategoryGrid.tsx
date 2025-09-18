import React from 'react';
import { useCategories } from '../../hooks/useCategories';

interface CategoryGridProps {
  onCategorySelect: (category: string) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ onCategorySelect }) => {
  const { categories, loading, error } = useCategories();
  if (loading) return <div className="text-center py-12 text-gray-600">Loading categories...</div>;
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className="relative overflow-hidden rounded-lg cursor-pointer group hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                  {category.productCount !== undefined && (
                    <div className="text-sm opacity-90">{category.productCount} products</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;