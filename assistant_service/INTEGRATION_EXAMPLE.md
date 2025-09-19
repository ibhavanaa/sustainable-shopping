# ChatAssistant Integration Example

## Quick Integration Steps

### 1. Add to your main App component

```tsx
// In frontend/src/App.tsx
import ChatAssistant from './components/ChatAssistant';

function App() {
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
      
      {/* Add the ChatAssistant component */}
      <ChatAssistant />
    </div>
  );
}
```

### 2. Or add to specific pages

```tsx
// In frontend/src/pages/Home.tsx
import ChatAssistant from '../components/ChatAssistant';

const Home: React.FC<HomeProps> = ({ onCategorySelect }) => {
  return (
    <div>
      <Hero />
      <CategoryGrid onCategorySelect={onCategorySelect} />
      
      {/* Add chat assistant to home page */}
      <ChatAssistant />
    </div>
  );
};
```

### 3. Custom styling

```tsx
// Custom positioning or styling
<ChatAssistant className="bottom-6 right-6" />
```

## Testing the Integration

1. **Start the assistant service:**
   ```bash
   cd assistant_service
   export GROQ_API_KEY="your_api_key"
   python app.py
   ```

2. **Start the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test the chat:**
   - Click the green chat button in bottom-right corner
   - Try asking: "What eco-friendly products do you recommend?"
   - Ask about specific products: "I need alternatives to plastic bottles"

## Example Conversations

**User:** "I'm looking for eco-friendly alternatives to plastic water bottles"

**AI Response:** "I'd be happy to help you find sustainable alternatives! Based on our product database, I recommend stainless steel water bottles, glass bottles, or bamboo water bottles. These are much more environmentally friendly and durable than plastic options."

**User:** "What about art supplies? I need sustainable options for my crafts"

**AI Response:** "Great question! For eco-friendly art supplies, I recommend looking for products made from recycled materials, natural pigments, or biodegradable options. We have several sustainable alternatives in our database that are better for the environment than traditional art supplies."

The AI assistant will automatically detect products in your messages and provide relevant eco-friendly recommendations when available.
