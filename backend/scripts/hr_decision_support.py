"""
HR Decision Support System - Salary Hike Percentage Predictor
Uses trained Machine Learning models (Linear Regression & Gradient Boosting Regressor)
"""

import os
import argparse
import joblib
import pandas as pd

def _find_model_path(filename):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    candidates = [
        os.path.join(script_dir, '..', 'models', filename),
        os.path.join(script_dir, 'models', filename),
        os.path.join(os.getcwd(), 'backend', 'models', filename),
        os.path.join(os.getcwd(), 'saved_models', filename),
        os.path.join('saved_models', filename),
    ]
    for p in candidates:
        if os.path.exists(p):
            return p
    return candidates[0]

CORE_MODEL_PATH = _find_model_path('gradient_boosting_core.joblib')
FULL_MODEL_PATH = _find_model_path('gradient_boosting_full.joblib')
LR_CORE_PATH = _find_model_path('linear_regression_core.joblib')

VALID_ROLES = [
    'SDE', 'Android', 'Frontend', 'Java', 'Testing', 
    'IOS', 'Backend', 'Web', 'Python', 'Database', 'Mobile'
]

VALID_LOCATIONS = [
    'Bangalore', 'Hyderabad', 'New Delhi', 'Chennai', 'Pune', 
    'Mumbai', 'Kolkata', 'Madhya Pradesh', 'Kerala', 'Jaipur'
]

def predict_hike(rating, experience, role, salary=None, location='Bangalore', status='Full Time'):
    """
    Predict salary hike percentage using trained ML models.
    """
    if not os.path.exists(CORE_MODEL_PATH):
        raise FileNotFoundError("Model files not found. Run train_models.py first.")

    model_core = joblib.load(CORE_MODEL_PATH)
    model_lr = joblib.load(LR_CORE_PATH)

    core_input = pd.DataFrame([{
        'Experience': float(experience),
        'Rating': float(rating),
        'Job Roles': str(role)
    }])

    pred_gb_core = model_core.predict(core_input)[0]
    pred_lr_core = model_lr.predict(core_input)[0]

    # Full model prediction if salary is supplied
    pred_gb_full = None
    if salary is not None and os.path.exists(FULL_MODEL_PATH):
        model_full = joblib.load(FULL_MODEL_PATH)
        full_input = pd.DataFrame([{
            'Experience': float(experience),
            'Rating': float(rating),
            'Salary': float(salary),
            'Salaries Reported': 1,
            'Job Roles': str(role),
            'Employment Status': str(status),
            'Location': str(location)
        }])
        pred_gb_full = model_full.predict(full_input)[0]

    recommended_hike = pred_gb_full if pred_gb_full is not None else pred_gb_core
    # Cap to reasonable bounded domain [5.0%, 35.0%]
    recommended_hike = max(5.0, min(35.0, recommended_hike))

    return {
        'rating': rating,
        'experience': experience,
        'role': role,
        'salary': salary,
        'recommended_hike_pct': round(recommended_hike, 2),
        'gb_core_hike_pct': round(pred_gb_core, 2),
        'lr_core_hike_pct': round(pred_lr_core, 2),
        'gb_full_hike_pct': round(pred_gb_full, 2) if pred_gb_full is not None else None,
        'new_salary': round(salary * (1 + recommended_hike / 100), 2) if salary else None
    }

def print_decision_report(result):
    print("\n" + "=" * 55)
    print("      HR DECISION SUPPORT - SALARY HIKE REPORT")
    print("=" * 55)
    print(f"Employee Role           : {result['role']}")
    print(f"Experience (Years)      : {result['experience']}")
    print(f"Performance Rating      : {result['rating']} / 5.0")
    if result['salary']:
        print(f"Current Base Salary     : INR {result['salary']:,.2f}")
    print("-" * 55)
    print(f"RECOMMENDED HIKE        : {result['recommended_hike_pct']}%")
    if result['new_salary']:
        print(f"Projected New Salary    : INR {result['new_salary']:,.2f}")
        print(f"Absolute Increase       : INR {(result['new_salary'] - result['salary']):,.2f}")
    print("-" * 55)
    print("Model Comparison Breakdown:")
    print(f"  • Gradient Boosting (Ensemble) : {result['recommended_hike_pct']}%")
    print(f"  • Linear Regression (Baseline) : {result['lr_core_hike_pct']}%")
    print("=" * 55 + "\n")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="HR Decision Support: Predict Salary Increment Percentage")
    parser.add_argument('--rating', type=float, default=4.2, help="Performance Rating (1.0 to 5.0)")
    parser.add_argument('--experience', type=float, default=6.0, help="Years of Experience")
    parser.add_argument('--role', type=str, default='SDE', choices=VALID_ROLES, help=f"Job Role: {VALID_ROLES}")
    parser.add_argument('--salary', type=float, default=800000, help="Current Annual Salary in INR (optional)")
    parser.add_argument('--location', type=str, default='Bangalore', choices=VALID_LOCATIONS, help="Location")

    args = parser.parse_args()
    res = predict_hike(
        rating=args.rating,
        experience=args.experience,
        role=args.role,
        salary=args.salary,
        location=args.location
    )
    print_decision_report(res)
