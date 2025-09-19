import joblib
import os

# Paths point to root/ml_models
BASE_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../ml_models"))
MODEL_PATH = os.path.join(BASE_PATH, "eco_model.pkl")
VECTORIZER_PATH = os.path.join(BASE_PATH, "vectorizer.pkl")

# Load once on startup
vectorizer = joblib.load(VECTORIZER_PATH)
model = joblib.load(MODEL_PATH)

def predict_eco(description: str):
    """Predict eco-friendliness of a product description.
    Returns: (eco_label, confidence)
        eco_label: 0 = Harmful, 1 = Moderate, 2 = Eco-friendly
    """
    X = vectorizer.transform([description])
    eco_label = int(model.predict(X)[0])  # 0, 1, or 2
    confidence = float(model.predict_proba(X).max())
    return eco_label, confidence