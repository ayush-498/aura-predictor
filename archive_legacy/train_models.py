"""
Employee Salary Hike Prediction
Algorithms: Linear Regression & Gradient Boosting Regressor
Metrics: RMSE, R2, MAE
"""

import os
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error

def main():
    # 1. Load Data
    data_path = 'salary_data.csv'
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"{data_path} not found in workspace.")
    
    df = pd.read_csv(data_path)
    print(f"Loaded dataset with shape: {df.shape}")

    # Handle any null values
    df['Company Name'] = df['Company Name'].fillna('Unknown')
    
    # 2. Features and Target Definition
    target_col = 'Percentage Salary Hike'
    y = df[target_col]
    
    # Setup candidate feature sets:
    # Set A: Core Features strictly specified in prompt: Experience, Rating, Job Role
    # Set B: Comprehensive Features (including Current Salary, Employment Status, Location)
    numeric_features_core = ['Experience', 'Rating']
    categorical_features_core = ['Job Roles']

    numeric_features_full = ['Experience', 'Rating', 'Salary', 'Salaries Reported']
    categorical_features_full = ['Job Roles', 'Employment Status', 'Location']

    # We evaluate both setups to give HR full decision visibility
    experiments = [
        ("Core_Features (Rating, Experience, Role)", numeric_features_core, categorical_features_core),
        ("Full_Features (Core + Salary, Status, Location)", numeric_features_full, categorical_features_full)
    ]

    results = []
    trained_pipelines = {}

    for exp_name, num_cols, cat_cols in experiments:
        print(f"\n=======================================================")
        print(f"Running Experiment: {exp_name}")
        print(f"Features: Numerical={num_cols}, Categorical={cat_cols}")
        print(f"=======================================================")

        X = df[num_cols + cat_cols]
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        preprocessor = ColumnTransformer(
            transformers=[
                ('num', StandardScaler(), num_cols),
                ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), cat_cols)
            ]
        )

        models = {
            'Linear Regression': LinearRegression(),
            'Gradient Boosting': GradientBoostingRegressor(
                n_estimators=150,
                learning_rate=0.08,
                max_depth=4,
                subsample=0.85,
                random_state=42
            )
        }

        for model_name, model in models.items():
            pipe = Pipeline(steps=[
                ('preprocessor', preprocessor),
                ('regressor', model)
            ])

            pipe.fit(X_train, y_train)
            y_pred_train = pipe.predict(X_train)
            y_pred_test = pipe.predict(X_test)

            rmse_train = np.sqrt(mean_squared_error(y_train, y_pred_train))
            rmse_test = np.sqrt(mean_squared_error(y_test, y_pred_test))
            r2_train = r2_score(y_train, y_pred_train)
            r2_test = r2_score(y_test, y_pred_test)
            mae_test = mean_absolute_error(y_test, y_pred_test)

            results.append({
                'Experiment': exp_name,
                'Model': model_name,
                'Train RMSE': round(rmse_train, 4),
                'Test RMSE': round(rmse_test, 4),
                'Train R2': round(r2_train, 4),
                'Test R2': round(r2_test, 4),
                'Test MAE (%)': round(mae_test, 4)
            })

            print(f"[{model_name}]")
            print(f"  Test RMSE : {rmse_test:.4f}")
            print(f"  Test R2   : {r2_test:.4f}")
            print(f"  Test MAE  : {mae_test:.4f}%")

            key = f"{exp_name}_{model_name.replace(' ', '_')}"
            trained_pipelines[key] = (pipe, X_test, y_test, y_pred_test)

    # 3. Save Summary
    res_df = pd.DataFrame(results)
    res_df.to_csv('model_evaluation_metrics.csv', index=False)
    print("\n--- Model Benchmark Summary ---")
    print(res_df.to_string(index=False))

    # 4. Save Best Production Models & Preprocessor
    os.makedirs('saved_models', exist_ok=True)
    
    # Save Core Models
    core_lr = trained_pipelines['Core_Features (Rating, Experience, Role)_Linear_Regression'][0]
    core_gb = trained_pipelines['Core_Features (Rating, Experience, Role)_Gradient_Boosting'][0]
    joblib.dump(core_lr, 'saved_models/linear_regression_core.joblib')
    joblib.dump(core_gb, 'saved_models/gradient_boosting_core.joblib')

    # Save Full Models
    full_lr = trained_pipelines['Full_Features (Core + Salary, Status, Location)_Linear_Regression'][0]
    full_gb = trained_pipelines['Full_Features (Core + Salary, Status, Location)_Gradient_Boosting'][0]
    joblib.dump(full_lr, 'saved_models/linear_regression_full.joblib')
    joblib.dump(full_gb, 'saved_models/gradient_boosting_full.joblib')

    print("\nModels successfully serialized to 'saved_models/' directory.")

    # 5. Generate Evaluation Plot
    plt.figure(figsize=(12, 5))
    
    # Linear Regression plot
    _, _, y_test_c, y_pred_lr = trained_pipelines['Core_Features (Rating, Experience, Role)_Linear_Regression']
    plt.subplot(1, 2, 1)
    plt.scatter(y_test_c[:200], y_pred_lr[:200], alpha=0.6, color='#1f77b4', edgecolors='k', s=30)
    plt.plot([5, 30], [5, 30], '--r', linewidth=2, label='Ideal Fit')
    plt.title('Linear Regression: Actual vs Predicted Hike')
    plt.xlabel('Actual Percentage Salary Hike (%)')
    plt.ylabel('Predicted Percentage Salary Hike (%)')
    plt.legend()
    plt.grid(True, linestyle=':', alpha=0.6)

    # Gradient Boosting plot
    _, _, _, y_pred_gb = trained_pipelines['Core_Features (Rating, Experience, Role)_Gradient_Boosting']
    plt.subplot(1, 2, 2)
    plt.scatter(y_test_c[:200], y_pred_gb[:200], alpha=0.6, color='#2ca02c', edgecolors='k', s=30)
    plt.plot([5, 30], [5, 30], '--r', linewidth=2, label='Ideal Fit')
    plt.title('Gradient Boosting: Actual vs Predicted Hike')
    plt.xlabel('Actual Percentage Salary Hike (%)')
    plt.ylabel('Predicted Percentage Salary Hike (%)')
    plt.legend()
    plt.grid(True, linestyle=':', alpha=0.6)

    plt.tight_layout()
    plt.savefig('model_performance_comparison.png', dpi=300)
    print("Saved evaluation plot: model_performance_comparison.png")

if __name__ == '__main__':
    main()
