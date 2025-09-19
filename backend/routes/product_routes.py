from flask import Blueprint, jsonify
import os
import pandas as pd

# Blueprint for product routes
product_bp = Blueprint("products", __name__)

# Path to products.csv (pointing to finalwebsite.csv for consistency)
BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # backend/
PRODUCTS_PATH = os.path.join(BASE_DIR, "data", "finalwebsite.csv")


@product_bp.route("/products", methods=["GET"])
def get_products():
    """
    Fetch all products from finalwebsite.csv and return as JSON.
    """
    try:
        df = pd.read_csv(PRODUCTS_PATH)

        # Convert DataFrame to list of dicts
        products = df.to_dict(orient="records")

        return jsonify({"products": products}), 200

    except FileNotFoundError:
        return jsonify({"error": "finalwebsite.csv not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
