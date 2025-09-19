import { useState, useEffect } from 'react';
import Header from './components/common/Header';
import Home from './pages/Home';
import ProductSearch from './pages/ProductSearch';
import CategoryPage from './pages/CategoryPage';
import ChatAssistant from './components/ChatAssistant';
import { Product } from './types/Product';
import { apiService } from './services/api';

type PageState = 
  | { type: 'home' }
  | { type: 'search'; query: string }
  | { type: 'category'; category: string };

function App() {
  const [currentPage, setCurrentPage] = useState<PageState>({ type: 'home' });
  const [searchQuery, setSearchQuery] = useState('');
  const [history, setHistory] = useState<PageState[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Check backend health on app load
  useEffect(() => {
    const checkHealth = async () => {
      try {
        await apiService.checkHealth();
        console.log('Backend connection established');
      } catch (error) {
        console.error('Backend connection failed:', error);
      }
    };
    
    checkHealth();
  }, []);

  const navigateTo = (nextPage: PageState) => {
    setHistory((prev) => [...prev, currentPage]);
    setCurrentPage(nextPage);
  };

  const goHome = () => {
    setCurrentPage({ type: 'home' });
    setHistory([]);
    setSearchQuery('');
  };

  const goBack = () => {
    if (history.length === 0) {
      setCurrentPage({ type: 'home' });
      setSearchQuery('');
      return;
    }
    setHistory((prev) => {
      const newHistory = prev.slice(0, -1);
      const previousPage = prev[prev.length - 1];
      setCurrentPage(previousPage);
      if (previousPage.type === 'search') {
        setSearchQuery(previousPage.query);
      } else if (previousPage.type === 'home') {
        setSearchQuery('');
      }
      return newHistory;
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      navigateTo({ type: 'search', query: query.trim() });
    } else {
      goHome();
    }
  };

  const handleCategorySelect = (category: string) => {
    navigateTo({ type: 'category', category });
    setSearchQuery('');
  };

  const handleProductClick = (product: Product) => {
    // Set selected product for AI assistant
    setSelectedProduct(product);
    console.log('Product clicked:', product);
  };

  // Retained for potential future use: clicking logo navigates home

  const renderCurrentPage = () => {
    switch (currentPage.type) {
      case 'search':
        return (
          <ProductSearch
            searchQuery={currentPage.query}
            onProductClick={handleProductClick}
          />
        );
      case 'category':
        return (
          <CategoryPage
            category={currentPage.category}
            onProductClick={handleProductClick}
          />
        );
      default:
        return <Home onCategorySelect={handleCategorySelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSearchChange={handleSearch}
        searchValue={searchQuery}
        onHomeClick={goHome}
        onBackClick={goBack}
        showBack={currentPage.type !== 'home'}
      />
      {renderCurrentPage()}
      <ChatAssistant selectedProduct={selectedProduct} />
    </div>
  );
}

export default App;