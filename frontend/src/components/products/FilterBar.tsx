import React from 'react';
import { Filter } from 'lucide-react';
import { SORT_OPTIONS } from '../../utils/constants';

interface FilterBarProps {
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  onlyBestSellers: boolean;
  onBestSellersToggle: (enabled: boolean) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  minStars: number;
  onMinStarsChange: (stars: number) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  sortBy,
  onSortChange,
  onlyBestSellers,
  onBestSellersToggle,
  priceRange,
  onPriceRangeChange,
  minStars,
  onMinStarsChange,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
      <div className="flex items-center space-x-4 flex-wrap">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <span className="font-medium text-gray-900">Filters:</span>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-2">
          <label htmlFor="sort" className="text-sm text-gray-600">Sort by:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Best Sellers Toggle */}
        <div className="flex items-center space-x-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={onlyBestSellers}
              onChange={(e) => onBestSellersToggle(e.target.checked)}
              className="rounded text-green-600 focus:ring-green-500"
            />
            <span className="ml-2 text-sm text-gray-600">Best Sellers Only</span>
          </label>
        </div>

        {/* Price Range */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Price:</label>
          <input
            type="number"
            placeholder="Min"
            value={priceRange[0] || ''}
            onChange={(e) => onPriceRangeChange([Number(e.target.value) || 0, priceRange[1]])}
            className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            placeholder="Max"
            value={priceRange[1] || ''}
            onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value) || 9999])}
            className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>

        {/* Minimum Stars */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Min Stars:</label>
          <select
            value={minStars}
            onChange={(e) => onMinStarsChange(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value={0}>Any</option>
            <option value={1}>1+ Stars</option>
            <option value={2}>2+ Stars</option>
            <option value={3}>3+ Stars</option>
            <option value={4}>4+ Stars</option>
            <option value={5}>5 Stars</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;