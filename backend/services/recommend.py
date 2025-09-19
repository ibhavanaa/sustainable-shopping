import os
import pandas as pd
import joblib

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # backend/
PRODUCTS_PATH = os.path.join(BASE_DIR, "data", "finalwebsite.csv")
MODEL_PATH = os.path.join(BASE_DIR, "..", "ml_models", "eco_model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "..", "ml_models", "vectorizer.pkl")

# Load model and vectorizer once
model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)

# Load dataset once
df = pd.read_csv(PRODUCTS_PATH)


def recommend_alternatives(product_title: str, product_price: float, category_name: str, top_n: int = 3):
    """
    Recommend cheaper eco-friendly (label=2) alternatives from products.csv in same category
    """
    try:
        # Filter products from the same category
        same_cat = df[df["categoryName"] == category_name]

        if same_cat.empty:
            return []

        # Predict EcoLabel for these products
        titles = same_cat["title"].astype(str).tolist()
        X = vectorizer.transform(titles)
        preds = model.predict(X)

        # Add prediction column
        same_cat = same_cat.assign(EcoLabel=preds)

        # ✅ Only keep eco-friendly (label=2)
        eco_products = same_cat[same_cat["EcoLabel"] == 2]

        # Only recommend cheaper ones
        cheaper = eco_products[eco_products["price"] < product_price]

        # Sort by price ascending
        cheaper_sorted = cheaper.sort_values(by="price", ascending=True)

        # Pick top N
        recommendations = cheaper_sorted.head(top_n).to_dict(orient="records")

        return recommendations

    except Exception as e:
        return {"error": str(e)}