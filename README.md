# healthsync-test

An ensemble machine learning model for predicting diseases based on symptoms using FastAPI.

---

## Workflow

1.  **Training**: The `train/train_models.py` script trains **Random Forest, SVM, and Gaussian Naive Bayes** models.
2.  **Saving Models**: The trained models are saved as `.joblib` files inside the `saved_models/` directory.
3.  **Prediction**: The `app/models.py` file contains the **`ModelEnsemble`** class, which loads these models at startup. When a user submits a list of symptoms to the `/predict` endpoint, the API:
    - Runs the input through all three models.
    - Combines the individual predictions using a majority voting system.
    - Returns the final predicted disease.
4.  **Retraining**: (Optional) Models can be retrained on new data by making a request to the `/train` endpoint.

---

## Running Locally

Follow these steps to set up and run the project on your local machine.

1.  **Clone the Repository**:
    ```bash
    git clone <repo-url>
    cd <repo-folder>
    ```

2.  **Create and Activate a Virtual Environment**:
    
    * **Linux/macOS:**
        ```bash
        python3 -m venv .venv
        source .venv/bin/activate
        ```
    * **Windows:**
        ```bash
        python -m venv .venv
        .venv\Scripts\activate
        ```

3.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Train the Models**:
    ```bash
    python ML/train/train_models.py
    ```

5.  **Run the FastAPI Server**:
    ```bash
    uvicorn ML.app.main:app --reload
    ```

6.  **Access API Documentation**:
    Open your browser and navigate to the following URL to see the interactive API documentation.
    
    [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## API Endpoints

### `/predict`

-   **Method**: `POST`
-   **Description**: Predicts a disease based on a list of symptoms.
-   **Request Body**:
    ```json
    {
      "symptoms": "depression , insomnia, leg pain , weakness , caugh"
    }
    ```