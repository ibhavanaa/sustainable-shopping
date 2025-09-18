from flask import Flask, jsonify
from flask_cors import CORS
from routes.predict_routes import predict_bp
from routes.health_routes import health_bp
from routes.product_routes import product_bp
from routes.recommend_routes import recommend_bp  # 👈 new route


def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=False)

    # Default route to avoid 404 on "/"
    @app.route("/")
    def index():
        return jsonify({
            "message": "Backend is running!",
            "available_endpoints": [
                "/api/health",
                "/api/products",
                "/api/predict",
                "/api/recommend"
            ]
        })

    # Register Blueprints
    app.register_blueprint(predict_bp, url_prefix="/api")
    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(product_bp, url_prefix="/api")
    app.register_blueprint(recommend_bp, url_prefix="/api")  # 👈 register recommend

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, host="0.0.0.0", port=5001)
