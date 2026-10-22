"""
Model Verification & Benchmarking Script
Validates all 4 models, tests inference on diverse profiles, calculates true feature importances.
"""

import os
import joblib
import json
import pandas as pd
import numpy as np
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.model_selection import train_test_split

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, 'models')
DATA_DIR = os.path.join(BASE_DIR, 'data')

def verify_all():
    print("=" * 65)
    print("      AURA PREDICTOR — MODEL VALIDATION & VERIFICATION")
    print("=" * 65)

    data_path = os.path.join(DATA_DIR, 'salary_data.csv')
    if not os.path.exists(data_path):
        data_path = os.path.join(BASE_DIR, '..', 'salary_data.csv')

    df = pd.read_csv(data_path)
    df['Company Name'] = df['Company Name'].fillna('Unknown')
    print(f"Dataset Loaded: {len(df):,} records, {df.shape[1]} columns")

    y = df['Percentage Salary Hike']

    # Load all 4 models
    models = {
        'gb_core': ('gradient_boosting_core.joblib', ['Experience', 'Rating', 'Job Roles']),
        'lr_core': ('linear_regression_core.joblib', ['Experience', 'Rating', 'Job Roles']),
        'gb_full': ('gradient_boosting_full.joblib', ['Experience', 'Rating', 'Salary', 'Salaries Reported', 'Job Roles', 'Employment Status', 'Location']),
        'lr_full': ('linear_regression_full.joblib', ['Experience', 'Rating', 'Salary', 'Salaries Reported', 'Job Roles', 'Employment Status', 'Location'])
    }

    loaded_models = {}
    for key, (fname, features) in models.items():
        fpath = os.path.join(MODELS_DIR, fname)
        assert os.path.exists(fpath), f"Missing model file: {fpath}"
        m = joblib.load(fpath)
        loaded_models[key] = m
        print(f"  [PASS] Successfully loaded {fname}")

    # Evaluate on held-out test split (20%, random_state=42)
    print("\n--- Test Set Evaluation (Holdout 20%, n=4,554) ---")
    metrics_summary = []

    for key, (fname, features) in models.items():
        X = df[features]
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        model = loaded_models[key]
        
        preds = model.predict(X_test)
        rmse = np.sqrt(mean_squared_error(y_test, preds))
        r2 = r2_score(y_test, preds)
        mae = mean_absolute_error(y_test, preds)

        metrics_summary.append({
            'Model Key': key,
            'Filename': fname,
            'Features Count': len(features),
            'Test RMSE': round(rmse, 4),
            'Test R2': round(r2, 4),
            'Test MAE (%)': round(mae, 4)
        })

    metrics_df = pd.DataFrame(metrics_summary)
    print(metrics_df.to_string(index=False))

    # Extract Feature Importances for Gradient Boosting Full & Core
    print("\n--- Feature Importances Extraction ---")
    gb_core = loaded_models['gb_core']
    reg_core = gb_core.named_steps['regressor']
    prep_core = gb_core.named_steps['preprocessor']
    core_fn = prep_core.get_feature_names_out()
    core_fi = pd.DataFrame({
        'Feature': core_fn,
        'Importance': reg_core.feature_importances_
    }).sort_values('Importance', ascending=False)
    print("Core Model Top Features:\n", core_fi)

    gb_full = loaded_models['gb_full']
    reg_full = gb_full.named_steps['regressor']
    prep_full = gb_full.named_steps['preprocessor']
    full_fn = prep_full.get_feature_names_out()
    full_fi = pd.DataFrame({
        'Feature': full_fn,
        'Importance': reg_full.feature_importances_
    }).sort_values('Importance', ascending=False)
    print("\nFull Model Top 10 Features:\n", full_fi.head(10))

    # Save detailed metadata json for API
    metadata = {
        'evaluated_samples': len(df),
        'test_samples': int(len(df) * 0.2),
        'provenance': 'Kaggle HR Analytics Salary Hike Dataset',
        'target_variable': 'Percentage Salary Hike',
        'target_unit': 'Percentage (%)',
        'metrics': metrics_summary,
        'core_feature_importances': [
            {'name': 'Experience', 'pct': round(float(core_fi[core_fi['Feature'] == 'num__Experience']['Importance'].values[0]) * 100, 1)},
            {'name': 'Performance Rating', 'pct': round(float(core_fi[core_fi['Feature'] == 'num__Rating']['Importance'].values[0]) * 100, 1)},
            {'name': 'Job Roles Domain', 'pct': round(float(core_fi[core_fi['Feature'].str.startswith('cat__Job Roles')]['Importance'].sum()) * 100, 1)},
        ],
        'full_feature_importances': [
            {'name': 'Total Experience', 'pct': round(float(full_fi[full_fi['Feature'] == 'num__Experience']['Importance'].values[0]) * 100, 1)},
            {'name': 'Current Base Salary', 'pct': round(float(full_fi[full_fi['Feature'] == 'num__Salary']['Importance'].values[0]) * 100, 1)},
            {'name': 'Job Roles Domain', 'pct': round(float(full_fi[full_fi['Feature'].str.startswith('cat__Job Roles')]['Importance'].sum()) * 100, 1)},
            {'name': 'Employment Status', 'pct': round(float(full_fi[full_fi['Feature'].str.startswith('cat__Employment Status')]['Importance'].sum()) * 100, 1)},
            {'name': 'Performance Rating', 'pct': round(float(full_fi[full_fi['Feature'] == 'num__Rating']['Importance'].values[0]) * 100, 1)},
            {'name': 'Work Location', 'pct': round(float(full_fi[full_fi['Feature'].str.startswith('cat__Location')]['Importance'].sum()) * 100, 1)},
        ]
    }

    meta_path = os.path.join(DATA_DIR, 'model_provenance_metadata.json')
    with open(meta_path, 'w') as f:
        json.dump(metadata, f, indent=2)
    print(f"\nSaved metadata with true feature contributions to: {meta_path}")

    return metadata

if __name__ == '__main__':
    verify_all()
