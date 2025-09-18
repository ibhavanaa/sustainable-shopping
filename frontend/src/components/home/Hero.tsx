import React from 'react';
import { Leaf, Star, Shield } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-green-400 to-blue-500 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Welcome to EcoMarket
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Discover eco-friendly products with AI-powered sustainability recommendations
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="flex flex-col items-center text-white">
              <Leaf className="h-12 w-12 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Eco Labels</h3>
              <p className="text-sm opacity-90">AI-powered sustainability detection</p>
            </div>
            <div className="flex flex-col items-center text-white">
              <Star className="h-12 w-12 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Quality Products</h3>
              <p className="text-sm opacity-90">Curated selection of top-rated items</p>
            </div>
            <div className="flex flex-col items-center text-white">
              <Shield className="h-12 w-12 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Trusted Reviews</h3>
              <p className="text-sm opacity-90">Verified customer reviews and ratings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;