import React from 'react';
import { Search, ShoppingBag, Leaf, ArrowLeft, Home as HomeIcon } from 'lucide-react';

interface HeaderProps {
  onSearchChange?: (query: string) => void;
  searchValue?: string;
  onHomeClick?: () => void;
  onBackClick?: () => void;
  showBack?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onSearchChange, searchValue, onHomeClick, onBackClick, showBack }) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            {showBack && (
              <button
                aria-label="Go back"
                onClick={onBackClick}
                className="p-2 rounded hover:bg-gray-100 text-gray-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={onHomeClick}
              className="flex items-center space-x-2 group"
              aria-label="Go home"
            >
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-gray-900 group-hover:text-green-700">EcoMarket</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchValue || ''}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* Shopping Bag */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onHomeClick}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <HomeIcon className="h-4 w-4 mr-1" />
              Home
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <ShoppingBag className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;