from flask import Blueprint, jsonify
import os
import pandas as pd

# Blueprint for product routes
product_bp = Blueprint("products", __name__)

# Path to products.csv
BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # backend/
<<<<<<< HEAD
PRODUCTS_PATH = os.path.join(BASE_DIR, "data", "finalwebsite.csv")
=======
PRODUCTS_PATH = os.path.join(BASE_DIR, "data", "finalwebsite.csv")
>>>>>>> e5e0c99991257b0eabcd013b11a24e2136c02ec4


@product_bp.route("/products", methods=["GET"])
def get_products():
    """
    Fetch all products from products.csv and return as JSON.
    """
    try:
        df = pd.read_csv(PRODUCTS_PATH)

        # Convert DataFrame to list of dicts
        products = df.to_dict(orient="records")

        return jsonify({"products": products}), 200

    except FileNotFoundError:
<<<<<<< HEAD
        return jsonify({"error": "products.csv not found"}), 404
=======
        return jsonify({"error": "finalwebsite.csv not found"}), 404
>>>>>>> e5e0c99991257b0eabcd013b11a24e2136c02ec4
    except Exception as e:
        return jsonify({"error": str(e)}), 500
