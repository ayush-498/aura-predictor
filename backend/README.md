# HR Salary Hike Prediction — Machine Learning Backend

Production-grade ML prediction microservice and model repository for the HR Salary Hike Decision Support system.

## Directory Structure

```
backend/
├── app.py                # REST API microservice (GET /api/health, GET /api/metrics, POST /api/predict)
├── requirements.txt      # Python dependencies
├── models/               # Serialized ML pipelines (.joblib & .pkl)
│   ├── gradient_boosting_core.joblib
│   ├── gradient_boosting_full.joblib
│   ├── linear_regression_core.joblib
│   └── linear_regression_full.joblib
├── data/                 # Raw datasets and evaluation exports
│   ├── salary_data.csv
│   ├── model_evaluation_metrics.csv
│   └── model_performance_comparison.png
├── scripts/              # Training and CLI decision support scripts
│   ├── train_models.py
│   ├── hr_decision_support.py
│   └── generate_notebook.py
└── notebooks/            # Jupyter analytical and exploratory notebooks
    └── Employee_Salary_Hike_Prediction.ipynb
```

## Running the API Server

```bash
# From workspace root using existing .venv:
.\.venv\Scripts\python.exe backend\app.py

# Or from backend directory:
cd backend
python app.py
```

Server binds to port `5050` by default.

### Endpoints
- `GET /api/health`: Health status & loaded model pipelines inspection
- `GET /api/metrics`: Performance metrics across model architectures (RMSE, R², MAE)
- `POST /api/predict`: Real-time inference
  - Body:
    ```json
    {
      "experience": 5.5,
      "rating": 4.5,
      "role": "SDE",
      "salary": 1400000,
      "location": "Bangalore",
      "status": "Full Time"
    }
    ```
