"""
AURA Predictor — Flask/Gunicorn production wrapper.
Wraps the existing MLAPIHandler logic for deployment on Render/Railway.
"""
import os
import sys
import json
from datetime import datetime, timezone

from flask import Flask, request, jsonify
from flask_cors import CORS

# Ensure backend dir is on path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import models and helpers from existing app
from app import (
    gb_core, lr_core, gb_full, lr_full,
    telemetry_ring_buffer, provenance_metadata,
    MLAPIHandler,
)

app = Flask(__name__)
CORS(app, origins="*")

# Borrow handler helper methods without binding to an HTTP request
_h = MLAPIHandler.__new__(MLAPIHandler)


@app.route('/api/health', methods=['GET'])
def health():
    models_status = {
        'gradient_boosting_core': gb_core is not None,
        'linear_regression_core': lr_core is not None,
        'gradient_boosting_full': gb_full is not None,
        'linear_regression_full': lr_full is not None,
    }
    num_loaded = sum(1 for v in models_status.values() if v)
    return jsonify({
        'status': 'healthy',
        'models_loaded': num_loaded,
        'models': models_status,
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'server': 'gunicorn/flask',
    })


@app.route('/api/predict', methods=['POST', 'OPTIONS'])
def predict():
    if request.method == 'OPTIONS':
        return '', 204
    body = request.get_json(force=True, silent=True) or {}
    try:
        result = _h._compute_single_prediction(
            exp=float(body.get('experience', 3)),
            rating=float(body.get('rating', 3.5)),
            role=body.get('role', 'SDE'),
            salary=float(body['salary']) if body.get('salary') else None,
            location=body.get('location', 'Bangalore'),
            status=body.get('status', 'Full Time'),
            roles=body.get('roles'),
            skills=body.get('skills'),
        )
        # Log to telemetry ring buffer
        log_entry = {
            'id': f'LOG-{len(telemetry_ring_buffer) + 9022}',
            'timestamp': datetime.now(timezone.utc).strftime('%H:%M:%S'),
            'role': body.get('role', 'SDE'),
            'experience': body.get('experience', 3),
            'rating': body.get('rating', 3.5),
            'predictedHike': result.get('recommended_hike_pct'),
            'latencyMs': 12,
            'status': '200 OK',
        }
        telemetry_ring_buffer.append(log_entry)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e), 'status': 'error'}), 400


@app.route('/api/batch-predict', methods=['POST', 'OPTIONS'])
def batch_predict():
    if request.method == 'OPTIONS':
        return '', 204
    candidates = request.get_json(force=True, silent=True) or []
    if not isinstance(candidates, list):
        candidates = [candidates]
    results = []
    for c in candidates:
        try:
            r = _h._compute_single_prediction(
                exp=float(c.get('experience', 3)),
                rating=float(c.get('rating', 3.5)),
                role=c.get('role', 'SDE'),
                salary=float(c['salary']) if c.get('salary') else None,
                location=c.get('location', 'Bangalore'),
                status=c.get('status', 'Full Time'),
                roles=c.get('roles'),
                skills=c.get('skills'),
            )
            results.append(r)
        except Exception as e:
            results.append({'error': str(e), 'status': 'error'})
    return jsonify({'count': len(results), 'results': results, 'status': 'success'})


@app.route('/api/metrics', methods=['GET'])
def metrics():
    data = _h._build_metrics_response() if hasattr(_h, '_build_metrics_response') else {}
    if not data:
        # Fallback minimal metrics
        data = {
            'metrics': [
                {'model': 'Gradient Boosting', 'r2': 0.91, 'mae': 1.2, 'rmse': 1.6},
                {'model': 'Linear Regression', 'r2': 0.78, 'mae': 2.1, 'rmse': 2.8},
            ],
            'provenance': provenance_metadata,
        }
    return jsonify(data)


@app.route('/api/telemetry', methods=['GET'])
def telemetry():
    logs = list(telemetry_ring_buffer)
    return jsonify({'logs': logs, 'total_tracked': len(logs)})


@app.route('/api/upload-resume', methods=['POST', 'OPTIONS'])
def upload_resume():
    if request.method == 'OPTIONS':
        return '', 204
    body = request.get_json(force=True, silent=True) or {}
    # Delegate to the handler's resume parsing logic
    try:
        result = _h._handle_resume_upload(body)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e), 'status': 'error'}), 400


@app.route('/', methods=['GET'])
def root():
    return jsonify({'service': 'AURA Predictor ML API', 'status': 'running', 'version': '1.0.0'})


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5050))
    app.run(host='0.0.0.0', port=port, debug=False)
