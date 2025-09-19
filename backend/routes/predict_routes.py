from flask import Blueprint, request, jsonify
import joblib
import os
from services.recommend import recommend_alternatives

predict_bp = Blueprint("predict", __name__)

# Load model and vectorizer
BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # backend/
MODEL_PATH = os.path.join(BASE_DIR, "..", "ml_models", "eco_model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "..", "ml_models", "vectorizer.pkl")

model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)

# Map labels to messages
LABEL_MESSAGES = {
    0: "Harmful ⚠️",
    1: "Moderate ♻️",
    2: "Eco-friendly ✅"
}

@predict_bp.route("/predict", methods=["POST"])
def predict():
    """
    Predict whether a product is harmful, moderate, or eco-friendly.
    If harmful/moderate, also return recommendations.
    Request JSON: { "title": "...", "price": 25, "categoryName": "Smart Speakers" }
    """
    try:
        data = request.get_json()

        if not data or "title" not in data or "price" not in data or "categoryName" not in data:
            return jsonify({"error": "Invalid request. Provide title, price and categoryName."}), 400

        title = data["title"]
        price = float(data["price"])
        category_name = data["categoryName"]

        # Vectorize input and predict
        features = vectorizer.transform([title])
        prediction = int(model.predict(features)[0])  # 0=Harmful, 1=Moderate, 2=Eco-friendly

        response = {
            "title": title,
            "price": price,
            "categoryName": category_name,
            "eco_label": prediction,
            "message": LABEL_MESSAGES[prediction]
        }

        # If harmful or moderate → fetch recommendations
        if prediction in [0, 1]:
            recommendations = recommend_alternatives(title, price, category_name)
            response["recommendations"] = recommendations

        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500