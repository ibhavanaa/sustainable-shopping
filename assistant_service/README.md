# AI Assistant Service

A Groq-powered AI assistant microservice for the sustainable e-commerce platform that provides dataset-aware responses and eco-friendly product recommendations.

## Features

- 🤖 **AI-Powered Chat**: Uses Groq's Llama-3.1-8b-instant model for intelligent responses
- 📊 **Dataset-Aware**: Analyzes product data to provide contextual recommendations
- 🌱 **Eco-Friendly Focus**: Specializes in sustainability and environmental consciousness
- 🔍 **Product Detection**: Automatically detects products in user messages
- 💡 **Smart Recommendations**: Suggests eco-friendly alternatives for harmful/moderate products
- 🧠 **ML Integration**: Uses trained TF-IDF + Logistic Regression model for product analysis

## Setup Instructions

### 1. Install Dependencies

```bash
cd assistant_service
pip install -r requirements.txt
```

### 2. Set Environment Variables

```bash
# Required: Get your API key from https://console.groq.com/
export GROQ_API_KEY="your_groq_api_key_here"

# Optional: Specify CSV path (defaults to "finalwebsite.csv")
export CSV_PATH="path/to/your/finalwebsite.csv"
```

### 3. Run the Service

```bash
python app.py
```

The service will start on port 5002 by default.

### 4. Verify Installation

```bash
curl http://localhost:5002/health
```

Should return: `{"status": "ok"}`

## API Endpoints

### Health Check
```
GET /health
```
Returns service status.

### Chat with AI
```
POST /api/ai/chat
Content-Type: application/json

{
  "message": "I'm looking for eco-friendly alternatives to plastic water bottles"
}
```

**Response:**
```json
{
  "answer": "I'd be happy to help you find eco-friendly alternatives to plastic water bottles...",
  "recommendations": [
    {
      "title": "Stainless Steel Water Bottle",
      "price": 15.99,
      "categoryName": "Water Bottles",
      "imgUrl": "...",
      "productURL": "..."
    }
  ],
  "debug": {
    "product_detected": true,
    "recommendations_count": 1
  }
}
```

## Frontend Integration

### 1. Import the ChatAssistant Component

```tsx
import ChatAssistant from './components/ChatAssistant';

// Add to your main App component or any page
function App() {
  return (
    <div>
      {/* Your existing app content */}
      <ChatAssistant />
    </div>
  );
}
```

### 2. Component Features

- **Floating Chat Button**: Fixed position in bottom-right corner
- **Chat Interface**: Clean, modern chat UI with message history
- **Product Recommendations**: Displays eco-friendly alternatives
- **Real-time Responses**: Streaming-like experience with loading states
- **Responsive Design**: Works on desktop and mobile

### 3. Customization

The component accepts optional props:

```tsx
<ChatAssistant 
  className="custom-styles" // Additional CSS classes
/>
```

## How It Works

1. **Model Training**: Automatically trains TF-IDF + Logistic Regression model on product data
2. **Product Detection**: Analyzes user messages to identify product mentions
3. **Eco-Label Prediction**: Uses ML model to predict product sustainability
4. **Smart Filtering**: Finds eco-friendly alternatives in same category with lower prices
5. **AI Response**: Groq AI provides contextual, dataset-aware responses

## Configuration

### Environment Variables

- `GROQ_API_KEY`: Required. Get from https://console.groq.com/
- `CSV_PATH`: Optional. Path to product CSV file (default: "finalwebsite.csv")
- `PORT`: Optional. Service port (default: 5002)

### Model Files

The service automatically creates and manages:
- `assistant_service/models/vectorizer.pkl` - TF-IDF vectorizer
- `assistant_service/models/classifier.pkl` - Logistic Regression model

## Troubleshooting

### Common Issues

1. **"Groq client not initialized"**
   - Check that `GROQ_API_KEY` environment variable is set
   - Verify API key is valid at https://console.groq.com/

2. **"Dataset not available"**
   - Ensure CSV file exists at specified path
   - Check file permissions and format

3. **"Model training failed"**
   - Verify CSV has required columns: title, price, categoryName, EcoLabel
   - Check available disk space for model files

### Logs

The service logs important events. Check console output for:
- Model loading/training status
- API request/response details
- Error messages and stack traces

## Development

### Running in Development Mode

```bash
# Enable debug logging
export FLASK_DEBUG=1
python app.py
```

### Testing the API

```bash
# Test health endpoint
curl http://localhost:5002/health

# Test chat endpoint
curl -X POST http://localhost:5002/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, can you help me find eco-friendly products?"}'
```

## Architecture

```
assistant_service/
├── app.py              # Flask microservice
├── assistant.py        # AI logic and ML integration
├── requirements.txt    # Python dependencies
├── models/            # ML model files (auto-generated)
│   ├── vectorizer.pkl
│   └── classifier.pkl
└── README.md          # This file
```

The service is designed to be completely independent from the main application, running on its own port with its own dependencies.
