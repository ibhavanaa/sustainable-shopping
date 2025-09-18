from flask import Blueprint, request, jsonify
from services.recommend import recommend_alternatives

recommend_bp = Blueprint("recommend", __name__)


@recommend_bp.route("/recommend", methods=["POST"])
def recommend():
    """
    Recommend eco-friendly alternatives for a harmful (0) or moderate (1) product.
    Request JSON: { "title": "...", "price": 25, "categoryName": "..." }
    """
    try:
        data = request.get_json()

        if not data or "title" not in data or "price" not in data or "categoryName" not in data:
            return jsonify({"error": "Invalid request. Provide title, price and categoryName."}), 400

        title = data["title"]
        price = float(data["price"])
        category_name = data["categoryName"]

        recommendations = recommend_alternatives(title, price, category_name)

        return jsonify({"recommendations": recommendations}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500