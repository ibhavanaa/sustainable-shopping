import os
import pandas as pd
import joblib
import logging
from groq import Groq
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Download NLTK data if not present
try:
    nltk.download('stopwords', quiet=True)
    nltk.download('wordnet', quiet=True)
    nltk.download('omw-1.4', quiet=True)
except:
    pass

logger = logging.getLogger(__name__)

class AIAssistant:
    def __init__(self, csv_path="finalwebsite.csv"):
        self.csv_path = csv_path
        self.df = None
        self.vectorizer = None
        self.model = None
        self.groq_client = None
        
        # Initialize Groq client
        try:
            api_key = os.getenv('GROQ_API_KEY')
            if not api_key:
                # Try to load from .env file
                try:
                    with open('.env', 'r') as f:
                        for line in f:
                            if line.startswith('GROQ_API_KEY='):
                                api_key = line.split('=', 1)[1].strip()
                                break
                except FileNotFoundError:
                    pass
            
            if not api_key:
                logger.warning("GROQ_API_KEY not found. AI responses will be limited.")
                self.groq_client = None
            else:
                self.groq_client = Groq(api_key=api_key)
                logger.info("Groq client initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Groq client: {str(e)}")
            self.groq_client = None
        
        # Load or train ML model
        self._load_or_train_model()
        
        # Load dataset
        self._load_dataset()
    
    def _load_dataset(self):
        """Load the product dataset"""
        try:
            self.df = pd.read_csv(self.csv_path)
            logger.info(f"Dataset loaded: {len(self.df)} products")
        except Exception as e:
            logger.error(f"Failed to load dataset: {str(e)}")
            self.df = None
    
    def _load_or_train_model(self):
        """Load existing model or train a new one"""
        models_dir = "assistant_service/models"
        os.makedirs(models_dir, exist_ok=True)
        
        vectorizer_path = os.path.join(models_dir, "vectorizer.pkl")
        model_path = os.path.join(models_dir, "classifier.pkl")
        
        try:
            # Try to load existing models
            if os.path.exists(vectorizer_path) and os.path.exists(model_path):
                self.vectorizer = joblib.load(vectorizer_path)
                self.model = joblib.load(model_path)
                logger.info("Loaded existing ML models")
                return
        except Exception as e:
            logger.warning(f"Failed to load existing models: {str(e)}")
        
        # Train new models if loading failed
        self._train_model()
    
    def _train_model(self):
        """Train a minimal TF-IDF + LogisticRegression model"""
        try:
            if self.df is None:
                self._load_dataset()
            
            if self.df is None or 'EcoLabel' not in self.df.columns:
                logger.error("Dataset not available or missing EcoLabel column")
                return
            
            # Text preprocessing
            def clean_text(text):
                if pd.isna(text):
                    return ""
                text = str(text).lower()
                text = re.sub(r'[^a-z\s]', '', text)
                words = text.split()
                stop_words = set(stopwords.words('english'))
                lemmatizer = WordNetLemmatizer()
                words = [lemmatizer.lemmatize(w) for w in words if w not in stop_words]
                return " ".join(words)
            
            # Prepare data
            self.df['title_clean'] = self.df['title'].apply(clean_text)
            X = self.df['title_clean']
            y = self.df['EcoLabel']
            
            # Train-test split
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # TF-IDF Vectorizer
            self.vectorizer = TfidfVectorizer(
                stop_words="english",
                max_features=5000,
                ngram_range=(1, 2)
            )
            X_train_tfidf = self.vectorizer.fit_transform(X_train)
            
            # Logistic Regression
            self.model = LogisticRegression(
                max_iter=1000,
                random_state=42,
                class_weight='balanced'
            )
            self.model.fit(X_train_tfidf, y_train)
            
            # Save models
            models_dir = "assistant_service/models"
            os.makedirs(models_dir, exist_ok=True)
            joblib.dump(self.vectorizer, os.path.join(models_dir, "vectorizer.pkl"))
            joblib.dump(self.model, os.path.join(models_dir, "classifier.pkl"))
            
            logger.info("ML model trained and saved successfully")
            
        except Exception as e:
            logger.error(f"Failed to train model: {str(e)}")
            self.vectorizer = None
            self.model = None
    
    def _get_dataset_context(self):
        """Generate dataset context for AI"""
        if self.df is None:
            return "No dataset available."
        
        try:
            total_products = len(self.df)
            categories = self.df['categoryName'].nunique()
            price_range = f"${self.df['price'].min():.2f} - ${self.df['price'].max():.2f}"
            
            # Eco-label distribution
            eco_dist = self.df['EcoLabel'].value_counts().to_dict()
            eco_summary = {
                0: eco_dist.get(0, 0),
                1: eco_dist.get(1, 0), 
                2: eco_dist.get(2, 0)
            }
            
            # Top categories
            top_categories = self.df['categoryName'].value_counts().head(5).to_dict()
            
            context = f"""
            Dataset Summary:
            - Total products: {total_products}
            - Categories: {categories}
            - Price range: {price_range}
            - Eco-label distribution: Harmful={eco_summary[0]}, Moderate={eco_summary[1]}, Eco-friendly={eco_summary[2]}
            - Top categories: {top_categories}
            """
            return context
        except Exception as e:
            logger.error(f"Failed to generate dataset context: {str(e)}")
            return "Dataset available but context generation failed."
    
    def _get_recommendations(self, product_title, product_price, category_name):
        """Get eco-friendly recommendations for a product"""
        if self.df is None or self.model is None or self.vectorizer is None:
            return []
        
        try:
            # Filter same category
            same_cat = self.df[self.df['categoryName'] == category_name]
            if same_cat.empty:
                return []
            
            # Predict eco-labels for products in same category
            titles = same_cat['title'].astype(str).tolist()
            X = self.vectorizer.transform(titles)
            preds = self.model.predict(X)
            
            # Add predictions to dataframe
            same_cat = same_cat.copy()
            same_cat['predicted_eco'] = preds
            
            # Filter eco-friendly (label=2) and cheaper products
            eco_products = same_cat[
                (same_cat['predicted_eco'] == 2) & 
                (same_cat['price'] < product_price)
            ]
            
            # Sort by price and return top 3
            recommendations = eco_products.sort_values('price').head(3)
            
            return recommendations.to_dict('records')
            
        except Exception as e:
            logger.error(f"Failed to get recommendations: {str(e)}")
            return []
    
    def _detect_product_in_message(self, message):
        """Simple product detection in user message"""
        if self.df is None:
            return None, None, None
        
        message_lower = message.lower()
        
        # Look for product titles in the message
        for _, row in self.df.iterrows():
            title_words = row['title'].lower().split()
            # Check if any significant words from title appear in message
            matches = sum(1 for word in title_words if len(word) > 3 and word in message_lower)
            if matches >= 2:  # At least 2 significant word matches
                return row['title'], row['price'], row['categoryName']
        
        return None, None, None
    
    def _fallback_response(self, user_message, product_context=None):
        """Provide fallback responses when Groq is not available"""
        message_lower = user_message.lower()
        
        # Use product context if provided, otherwise detect from message
        if product_context:
            product_title = product_context.get('title')
            product_price = product_context.get('price')
            category_name = product_context.get('category')
            eco_label = product_context.get('ecoLabel', 0)
        else:
            product_title, product_price, category_name = self._detect_product_in_message(user_message)
            eco_label = 0
        
        recommendations = []
        
        if product_title:
            recommendations = self._get_recommendations(product_title, product_price, category_name)
        
        # Simple keyword-based responses
        if any(word in message_lower for word in ['eco', 'sustainable', 'green', 'environment']):
            answer = "I can help you find eco-friendly products! Our database contains many sustainable alternatives. "
            if recommendations:
                answer += f"I found {len(recommendations)} eco-friendly alternatives for you."
            else:
                answer += "Try asking about specific products for personalized recommendations."
        
        elif any(word in message_lower for word in ['recommend', 'suggest', 'alternative']):
            answer = "I can recommend eco-friendly alternatives! "
            if recommendations:
                answer += f"Here are {len(recommendations)} sustainable options for you."
            else:
                answer += "Please mention a specific product for recommendations."
        
        elif any(word in message_lower for word in ['help', 'what', 'how']):
            answer = "I'm here to help you find sustainable products! You can ask me about eco-friendly alternatives, product recommendations, or sustainability tips."
        
        else:
            answer = "I'm a sustainability assistant! I can help you find eco-friendly products and alternatives. Ask me about specific products or sustainability topics."
        
        return {
            "answer": answer,
            "recommendations": recommendations,
            "debug": {
                "fallback_mode": True,
                "product_detected": product_title is not None,
                "recommendations_count": len(recommendations)
            }
        }
    
    def chat(self, user_message, product_context=None):
        """Process chat message and return AI response with recommendations"""
        try:
            if not self.groq_client:
                # Fallback response when Groq is not available
                return self._fallback_response(user_message, product_context)
            
            # Get dataset context
            dataset_context = self._get_dataset_context()
            
            # Use product context if provided, otherwise detect from message
            if product_context:
                product_title = product_context.get('title')
                product_price = product_context.get('price')
                category_name = product_context.get('category')
                eco_label = product_context.get('ecoLabel', 0)
            else:
                product_title, product_price, category_name = self._detect_product_in_message(user_message)
                eco_label = 0
            
            recommendations = []
            
            if product_title:
                recommendations = self._get_recommendations(product_title, product_price, category_name)
            
            # Prepare system prompt
            product_info = ""
            if product_context:
                eco_status = ["Harmful", "Moderate", "Eco-friendly"][eco_label] if eco_label in [0, 1, 2] else "Unknown"
                product_info = f"""
Current Product Context:
- Product: {product_title}
- Price: ${product_price}
- Category: {category_name}
- Eco-label: {eco_status}
"""
            
            system_prompt = f"""You are an AI assistant for a sustainable e-commerce platform. You help users make eco-friendly purchasing decisions.

{dataset_context}
{product_info}

You can:
- Analyze product sustainability
- Recommend eco-friendly alternatives
- Provide general advice about sustainable shopping
- Answer questions about the product catalog

When users ask about specific products or need alternatives, provide helpful recommendations based on the dataset.

Keep responses concise and helpful. If you detect a product in the user's message, you may receive recommendations to suggest."""
            
            # Get AI response
            response = self.groq_client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.4,
                max_tokens=600
            )
            
            answer = response.choices[0].message.content
            
            return {
                "answer": answer,
                "recommendations": recommendations,
                "debug": {
                    "product_detected": product_title is not None,
                    "recommendations_count": len(recommendations)
                }
            }
            
        except Exception as e:
            logger.error(f"Chat processing error: {str(e)}")
            return {
                "answer": "I'm sorry, I encountered an error processing your request. Please try again.",
                "recommendations": [],
                "debug": {"error": str(e)}
            }
