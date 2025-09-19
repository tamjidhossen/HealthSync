import os
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB
from preprocess import load_data, encode_labels, get_features_targets
from config import RANDOM_STATE, N_ESTIMATORS, TEST_SIZE
import joblib

def plot_distribution(y):
    plt.figure(figsize=(18, 8))
    sns.countplot(x=y)
    plt.title("Disease Class Distribution Before Resampling")
    plt.xticks(rotation=90)
    plt.show()

def train_models(X_train, y_train):
    rf_model = RandomForestClassifier(n_estimators=N_ESTIMATORS, random_state=RANDOM_STATE)
    svm_model = SVC(random_state=RANDOM_STATE)
    nb_model = GaussianNB()
    rf_model.fit(X_train, y_train)
    svm_model.fit(X_train, y_train)
    nb_model.fit(X_train, y_train)
    voting_model = VotingClassifier(
        estimators=[('rf', rf_model), ('svm', svm_model), ('nb', nb_model)],
        voting='hard'
    )
    voting_model.fit(X_train, y_train)
    return rf_model, svm_model, nb_model, voting_model

def save_models(rf_model, svm_model, nb_model, voting_model, encoder, symptom_index):
    save_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "saved_models"))
    os.makedirs(save_dir, exist_ok=True)
    joblib.dump(rf_model, os.path.join(save_dir, "rf.joblib"), compress=3)
    joblib.dump(svm_model, os.path.join(save_dir, "svm.joblib"), compress=3)
    joblib.dump(nb_model, os.path.join(save_dir, "nb.joblib"), compress=3)
    joblib.dump(voting_model, os.path.join(save_dir, "voting.joblib"), compress=3)
    joblib.dump(encoder, os.path.join(save_dir, "encoder.joblib"), compress=3)
    joblib.dump(symptom_index, os.path.join(save_dir, "symptom_index.joblib"), compress=3)

    print(f"Models and symptom_index saved in {save_dir}")

def main():
    data = load_data()
    data, encoder = encode_labels(data)
    X, y = get_features_targets(data)
    plot_distribution(y)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE)
    rf_model, svm_model, nb_model, voting_model = train_models(X_train, y_train)
    symptoms = X.columns.values
    symptom_index = {symptom: idx for idx, symptom in enumerate(symptoms)}
    save_models(rf_model, svm_model, nb_model, voting_model, encoder, symptom_index)
    return rf_model, svm_model, nb_model, voting_model, encoder, symptom_index, X_train, X_test, y_train, y_test, X

if __name__ == "__main__":
    main()