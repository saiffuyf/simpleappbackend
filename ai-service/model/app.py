from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.ensemble import RandomForestClassifier
import numpy as np
import joblib

app = Flask(__name__)
CORS(app)
model = joblib.load("model/crush_model.pkl")

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    features = np.array([
        data['likes'], 
        data['comments'], 
        data['dms'], 
        data['responseTime']
    ]).reshape(1, -1)

    prediction = model.predict(features)
    return jsonify({'crush': bool(prediction[0])})

if __name__ == '__main__':
    app.run(debug=True, port=5006)
