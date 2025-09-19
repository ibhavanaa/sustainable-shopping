import React from 'react';
import Hero from '../components/home/Hero';
import CategoryGrid from '../components/home/CategoryGrid';

interface HomeProps {
  onCategorySelect: (category: string) => void;
}

const Home: React.FC<HomeProps> = ({ onCategorySelect }) => {
  return (
    <div>
      <Hero />
      <CategoryGrid onCategorySelect={onCategorySelect} />
    </div>
  );
};

export default Home;