import numpy as np
from sklearn.ensemble import IsolationForest


def detect_anomaly(window):
    if len(window) < 10:
        return {'is_anomaly': False}
    values = np.array([[r['voltage'], r['temperature'], r['actual_generation']] for r in window], dtype=float)
    model = IsolationForest(contamination=0.1, random_state=42)
    result = model.fit_predict(values)[-1]
    return {'is_anomaly': result == -1}
