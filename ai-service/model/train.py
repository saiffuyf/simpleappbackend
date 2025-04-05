from sklearn.ensemble import RandomForestClassifier
import joblib
import numpy as np

# Simulate training with real data structure
X = np.array([
    [5, 10, 3, 2],   # likely crush
    [0, 1, 0, 10],   # not a crush
    [3, 6, 2, 3],
    [1, 2, 0, 6]
])
y = [1, 0, 1, 0]

model = RandomForestClassifier()
model.fit(X, y)

# joblib.dump(model, "model/crush_model.pkl")
joblib.dump(model, "crush_model.pkl")
print("Model saved!")
