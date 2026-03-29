import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense

FEATURES = ['irradiation', 'temperature', 'voltage', 'actual_generation']
SEQ_LEN = 25


def build_model():
    model = Sequential([
        LSTM(64, return_sequences=True, input_shape=(SEQ_LEN, len(FEATURES))),
        LSTM(32),
        Dense(1),
    ])
    model.compile(optimizer='adam', loss='mse')
    return model


def _feature_matrix(window):
    return np.array([[float(r[f]) for f in FEATURES] for r in window], dtype=float)


def make_prediction(window):
    # Need at least one sequence plus one target point for supervised LSTM fitting.
    if len(window) < SEQ_LEN + 1:
        return None
    data = _feature_matrix(window)

    # Min-max normalization per feature for stable lightweight training.
    mins = data.min(axis=0)
    maxs = data.max(axis=0)
    denom = np.where((maxs - mins) == 0, 1, (maxs - mins))
    scaled = (data - mins) / denom

    X, y = [], []
    for i in range(len(scaled) - SEQ_LEN):
        X.append(scaled[i:i + SEQ_LEN])
        y.append(scaled[i + SEQ_LEN][FEATURES.index('actual_generation')])
    X = np.array(X, dtype=float)
    y = np.array(y, dtype=float)

    model = build_model()
    model.fit(X, y, epochs=5, batch_size=4, verbose=0)

    next_seq = scaled[-SEQ_LEN:].reshape(1, SEQ_LEN, len(FEATURES))
    pred_scaled = float(model.predict(next_seq, verbose=0)[0][0])
    pred_scaled = min(max(pred_scaled, 0.0), 1.0)
    pred = pred_scaled * denom[FEATURES.index('actual_generation')] + mins[FEATURES.index('actual_generation')]
    return max(float(pred), 1.0)


def diagnose_efficiency(actual, predicted):
    efficiency = (actual / predicted) * 100 if predicted else 0
    if efficiency < 60:
        status = 'Hardware Fault'
    elif efficiency < 85:
        status = 'Panel Soiling'
    else:
        status = 'Optimal'
    return {'efficiency': efficiency, 'diagnosis': status}
