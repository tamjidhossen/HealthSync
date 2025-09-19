import pandas as pd
from sklearn.metrics import accuracy_score
from train import main

def evaluate_models(rf_model, svm_model, nb_model, voting_model, X_train, X_test, y_train, y_test):
    models = {
        "Random Forest": rf_model,
        "SVM": svm_model,
        "Naive Bayes": nb_model,
        "Voting": voting_model
    }
    for name, model in models.items():
        train_preds = model.predict(X_train)
        test_preds = model.predict(X_test)
        train_acc = accuracy_score(y_train, train_preds) * 100
        test_acc = accuracy_score(y_test, test_preds) * 100
        print(f"{name} Train Accuracy: {train_acc:.2f}%")
        print(f"{name} Test Accuracy: {test_acc:.2f}%")

def predict_disease_from_input(user_input, rf_model, svm_model, nb_model, voting_model, encoder, X):
    symptoms = X.columns.values
    symptom_index = {symptom: idx for idx, symptom in enumerate(symptoms)}
    input_symptoms = user_input.split(",")
    input_vector = [0] * len(symptom_index)
    for symptom in input_symptoms:
        symptom = symptom.strip()
        if symptom in symptom_index:
            input_vector[symptom_index[symptom]] = 1
    input_df = pd.DataFrame([input_vector], columns=symptoms)
    rf_pred = rf_model.predict(input_df)[0]
    nb_pred = nb_model.predict(input_df)[0]
    svm_pred = svm_model.predict(input_df)[0]
    voting_pred = voting_model.predict(input_df)[0]
    rf_pred_decoded = encoder.inverse_transform([rf_pred])[0]
    nb_pred_decoded = encoder.inverse_transform([nb_pred])[0]
    svm_pred_decoded = encoder.inverse_transform([svm_pred])[0]
    voting_pred_decoded = encoder.inverse_transform([voting_pred])[0]
    return {
        "Random Forest Prediction": rf_pred_decoded,
        "Naive Bayes Prediction": nb_pred_decoded,
        "SVM Prediction": svm_pred_decoded,
        "Final Prediction (Voting)": voting_pred_decoded
    }

if __name__ == "__main__":
    rf_model, svm_model, nb_model, voting_model, encoder, X_train, X_test, y_train, y_test, X = main()
    evaluate_models(rf_model, svm_model, nb_model, voting_model, X_train, X_test, y_train, y_test)
    user_input = "anxiety and nervousness,shortness of breath,depressive or psychotic symptoms,irregular heartbea,breathing fast"
    predictions = predict_disease_from_input(user_input, rf_model, svm_model, nb_model, voting_model, encoder, X)
    print("=== Disease Predictions ===")
    for model_name, disease in predictions.items():
        print(f"{model_name}: {disease}")