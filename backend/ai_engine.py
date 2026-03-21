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


def make_prediction(window):
    if len(window) < SEQ_LEN:
        return None
    payload = np.array([[r[f] for f in FEATURES] for r in window[-SEQ_LEN:]], dtype=float)
    payload = payload.reshape(1, SEQ_LEN, len(FEATURES))
    model = build_model()
    pred = float(model.predict(payload, verbose=0)[0][0])
    return max(pred, 1.0)


def diagnose_efficiency(actual, predicted):
    efficiency = (actual / predicted) * 100 if predicted else 0
    if efficiency < 60:
        status = 'Hardware Fault'
    elif efficiency < 85:
        status = 'Panel Soiling'
    else:
        status = 'Optimal'
    return {'efficiency': efficiency, 'diagnosis': status}
