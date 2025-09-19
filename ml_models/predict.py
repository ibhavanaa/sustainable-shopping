import joblib

class EcoClassifier:
    def __init__(self):
        self.model = joblib.load("eco_model.pkl")
        self.vectorizer = joblib.load("vectorizer.pkl")

    def predict(self, title):
        X = self.vectorizer.transform([title])
        y_pred = self.model.predict(X)[0]
        y_prob = self.model.predict_proba(X)[0].max()  # confidence
        return {
            "eco_friendly": int(y_pred),
            "confidence": float(y_prob)
        }


if __name__ == "__main__":
    classifier = EcoClassifier()

    test_titles = [
        "Organic Cotton T-Shirt Natural Fiber Sustainable Fashion",
        "Plastic Water Bottles 24-pack Disposable",
        "Recycled Paper Notebook Eco-Friendly Writing"
    ]

    for title in test_titles:
        result = classifier.predict(title)
        print(f"Product: {title}")
        print(f"Eco-friendly: {result['eco_friendly']}")
        print(f"Confidence: {result['confidence']:.2f}")
        print("---")
