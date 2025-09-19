import os
import joblib
import pandas as pd

class ModelEnsemble:
    def __init__(self, model_dir=None):
        # Default path relative to project root
        if model_dir is None:
            model_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "saved_models")
        
        self.rf = joblib.load(os.path.join(model_dir, "rf.joblib"))
        self.nb = joblib.load(os.path.join(model_dir, "nb.joblib"))
        self.svm = joblib.load(os.path.join(model_dir, "svm.joblib"))
        self.voting = joblib.load(os.path.join(model_dir, "voting.joblib"))
        self.encoder = joblib.load(os.path.join(model_dir, "encoder.joblib"))
        self.symptom_index = joblib.load(os.path.join(model_dir, "symptom_index.joblib"))
        self.symptoms = list(self.symptom_index.keys())


    def predict(self, user_input: str):
        # Convert symptoms string → binary vector
        input_vector = [0] * len(self.symptom_index)
        input_symptoms = user_input.split(",")

        for symptom in input_symptoms:
            symptom = symptom.strip()
            if symptom in self.symptom_index:
                input_vector[self.symptom_index[symptom]] = 1

        input_df = pd.DataFrame([input_vector], columns=self.symptoms)

        # Predict using each model
        rf_pred = self.rf.predict(input_df)[0]
        nb_pred = self.nb.predict(input_df)[0]
        svm_pred = self.svm.predict(input_df)[0]
        voting_pred = self.voting.predict(input_df)[0]

        # Decode predictions
        return {
            "rf_prediction": self.encoder.inverse_transform([rf_pred])[0],
            "nb_prediction": self.encoder.inverse_transform([nb_pred])[0],
            "svm_prediction": self.encoder.inverse_transform([svm_pred])[0],
            "voting_prediction": self.encoder.inverse_transform([voting_pred])[0],
        }
