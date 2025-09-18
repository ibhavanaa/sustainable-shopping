import React from 'react';
import { Leaf, X, AlertTriangle } from 'lucide-react';

interface EcoFriendlyBadgeProps {
  ecoLabel?: number; // 0 = harmful, 1 = moderate, 2 = eco-friendly
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  confidence?: number;
}

const EcoFriendlyBadge: React.FC<EcoFriendlyBadgeProps> = ({ 
  ecoLabel, 
  size = 'md',
  showText = false,
  confidence 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-6 w-6'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  if (ecoLabel === undefined || ecoLabel === null) {
    return null;
  }

  const isEcoFriendly = ecoLabel === 2;
  const isModerate = ecoLabel === 1;

  return (
    <div className={`flex items-center ${showText ? 'space-x-2' : ''}`}>
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center ${
          isEcoFriendly
            ? 'bg-green-100 text-green-600'
            : isModerate
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-red-100 text-red-600'
        }`}
      >
        {isEcoFriendly ? (
          <Leaf className={iconSizes[size]} />
        ) : isModerate ? (
          <AlertTriangle className={iconSizes[size]} />
        ) : (
          <X className={iconSizes[size]} />
        )}
      </div>
      {showText && (
        <div>
          <span className={`${textSizes[size]} font-medium ${
            isEcoFriendly ? 'text-green-600' : isModerate ? 'text-yellow-700' : 'text-red-600'
          }`}>
            {isEcoFriendly ? 'Eco-friendly' : isModerate ? 'Moderate' : 'Harmful'}
          </span>
          {confidence && (
            <div className={`${textSizes[size]} text-gray-500`}>
              {Math.round(confidence * 100)}% confidence
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EcoFriendlyBadge;