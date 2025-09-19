import pandas as pd
from sklearn.preprocessing import LabelEncoder
from config import DATA_PATH, N_ROWS

def load_data():
    data = pd.read_csv(DATA_PATH)
    return data

def encode_labels(data):
    encoder = LabelEncoder()
    data["diseases"] = encoder.fit_transform(data["diseases"])
    return data, encoder

def get_features_targets(data):
    X = data.iloc[:N_ROWS, 1:]
    y = data.iloc[:N_ROWS, 0]
    return X, y