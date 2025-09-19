from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import logging
from assistant import AIAssistant

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=False)

# Initialize AI Assistant
try:
    csv_path = os.getenv('CSV_PATH', 'finalwebsite.csv')
    assistant = AIAssistant(csv_path)
    logger.info(f"AI Assistant initialized with CSV: {csv_path}")
except Exception as e:
    logger.error(f"Failed to initialize AI Assistant: {str(e)}")
    assistant = None

@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint"""
    return jsonify({"status": "ok"})

@app.route("/api/ai/chat", methods=["POST"])
def chat():
    """AI chat endpoint"""
    try:
        if not assistant:
            return jsonify({
                "answer": "AI Assistant is not available. Please check the service configuration.",
                "recommendations": [],
                "debug": {"error": "Assistant not initialized"}
            }), 500

        data = request.get_json()
        if not data or "message" not in data:
            return jsonify({
                "answer": "Please provide a message in the request.",
                "recommendations": [],
                "debug": {"error": "Missing message field"}
            }), 400

        user_message = data["message"]
        product_context = data.get("product_context")
        logger.info(f"Received chat message: {user_message[:100]}...")

        # Get AI response with recommendations
        response = assistant.chat(user_message, product_context)
        
        return jsonify(response), 200

    except Exception as e:
        logger.error(f"Chat endpoint error: {str(e)}")
        return jsonify({
            "answer": "Sorry, I encountered an error processing your request.",
            "recommendations": [],
            "debug": {"error": str(e)}
        }), 500

if __name__ == "__main__":
    port = int(os.getenv('PORT', 5002))
    app.run(debug=True, host="0.0.0.0", port=port)
