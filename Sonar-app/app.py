import numpy as np
import pandas as pd
from flask import Flask, request, jsonify, send_from_directory
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

app = Flask(__name__, static_folder="static", static_url_path="")

# ---- Train the model once, when the server starts (same as your notebook) ----
sonar_data = pd.read_csv("sonar data.csv", header=None)   # keep this file next to app.py
X = sonar_data.drop(columns=60)
Y = sonar_data[60]
X_train, X_test, Y_train, Y_test = train_test_split(
    X, Y, test_size=0.1, stratify=Y, random_state=1
)
model = LogisticRegression()
model.fit(X_train, Y_train)
print("Train accuracy:", accuracy_score(model.predict(X_train), Y_train))
print("Test accuracy :", accuracy_score(model.predict(X_test), Y_test))


@app.route("/")
def home():
    return send_from_directory("static", "Web.html")


@app.route("/predict", methods=["POST"])
def predict():
    values = (request.get_json(silent=True) or {}).get("values", [])
    try:
        # Use the first 60 columns; a 61st column (R/M label) is ignored if present
        features = [float(v) for v in values[:60]]
    except ValueError:
        return jsonify(error="The first 60 values must be numbers."), 400
    if len(features) < 60:
        return jsonify(error=f"Need 60 values, got {len(features)}."), 400

    data = np.asarray(features).reshape(1, -1)
    label = model.predict(data)[0]
    confidence = float(model.predict_proba(data).max())
    message = "The object is a Rock" if label == "R" else "The object is a Mine"
    return jsonify(label=label, message=message, confidence=confidence)


if __name__ == "__main__":
    app.run(debug=True)
