import re
import pandas as pd
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score
import joblib

# ------------------------
# Setup NLTK
# ------------------------s
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('omw-1.4')

stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

# ------------------------
# Custom Preprocessing
# ------------------------
def clean_text(text):
    if pd.isna(text):
        return ""
    text = text.lower()                               # lowercase
    text = re.sub(r'[^a-z\s]', '', text)              # keep only letters
    words = text.split()
    words = [lemmatizer.lemmatize(w) for w in words if w not in stop_words]  # remove stopwords + lemmatize
    return " ".join(words)

# ------------------------
# Load dataset
# ------------------------
df = pd.read_csv("finalwebsite_with_ecolabel.csv")

# Clean product titles
df['title'] = df['title'].apply(clean_text)

# Features (X) and Labels (y)
X = df['title']
y = df['EcoLabel']

# ------------------------
# Train-Test Split
# ------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ------------------------
# TF-IDF Vectorizer
# ------------------------
vectorizer = TfidfVectorizer(
    stop_words="english",
    max_features=15000,
    ngram_range=(1, 3)
)
X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)

# ------------------------
# Hyperparameter Tuning with GridSearchCV
# ------------------------
param_grid = {
    "C": [0.5, 1.0, 2.0, 3.0, 5.0],
    "solver": ["liblinear", "saga"],
    "penalty": ["l1", "l2"],
    "class_weight": [None, "balanced"]
}

grid = GridSearchCV(
    LogisticRegression(max_iter=2000),
    param_grid,
    cv=5,
    scoring="accuracy",
    n_jobs=-1,
    verbose=2
)

grid.fit(X_train_tfidf, y_train)

print("🔍 Best Parameters:", grid.best_params_)
print("✅ Best CV Accuracy:", grid.best_score_)

# ------------------------
# Evaluate Best Model
# ------------------------
best_model = grid.best_estimator_
y_pred = best_model.predict(X_test_tfidf)

print("\nTest Accuracy:", accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))

# ------------------------
# Save model + vectorizer separately
# ------------------------
joblib.dump(best_model, "eco_model.pkl")     # Logistic Regression model
joblib.dump(vectorizer, "vectorizer.pkl")    # TF-IDF Vectorizer

print("🚀 Best model and vectorizer saved as eco_model.pkl and vectorizer.pkl")