from pydantic import BaseModel

class PredictRequest(BaseModel):
    symptoms: str  # comma-separated symptoms string

class PredictResponse(BaseModel):
    rf_prediction: str
    nb_prediction: str
    svm_prediction: str
    voting_prediction: str
