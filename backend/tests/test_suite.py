"""
AURA Predictor — Enterprise ML & Backend Test Suite
Automated validation of ML models, API contracts, input boundaries, and financial arithmetic.
"""

import os
import sys
import unittest
import urllib.request
import urllib.error
import json
import joblib
import numpy as np
import pandas as pd

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, 'models')
DATA_DIR = os.path.join(BASE_DIR, 'data')
API_URL = os.environ.get('TEST_API_URL', 'http://localhost:5050')

class TestMLModelArtifacts(unittest.TestCase):
    """Phase 3: Machine Learning Model Validation Tests"""

    @classmethod
    def setUpClass(cls):
        cls.models = {}
        for m_name in [
            'gradient_boosting_core.joblib',
            'linear_regression_core.joblib',
            'gradient_boosting_full.joblib',
            'linear_regression_full.joblib'
        ]:
            path = os.path.join(MODELS_DIR, m_name)
            assert os.path.exists(path), f"Missing model artifact: {path}"
            cls.models[m_name] = joblib.load(path)

    def test_01_all_models_loaded(self):
        """Verify all 4 models are loaded and are sklearn pipelines."""
        self.assertEqual(len(self.models), 4)
        for name, pipe in self.models.items():
            self.assertTrue(hasattr(pipe, 'predict'), f"{name} lacks predict method")
            self.assertTrue('preprocessor' in pipe.named_steps, f"{name} lacks preprocessor step")
            self.assertTrue('regressor' in pipe.named_steps, f"{name} lacks regressor step")

    def test_02_core_models_inference_and_bounds(self):
        """Verify Core models accept valid inputs and produce bounded predictions."""
        sample = pd.DataFrame([{
            'Experience': 6.0,
            'Rating': 4.5,
            'Job Roles': 'SDE'
        }])
        gb_pred = float(self.models['gradient_boosting_core.joblib'].predict(sample)[0])
        lr_pred = float(self.models['linear_regression_core.joblib'].predict(sample)[0])

        self.assertTrue(np.isfinite(gb_pred), "GB Core prediction is non-finite")
        self.assertTrue(np.isfinite(lr_pred), "LR Core prediction is non-finite")
        self.assertGreaterEqual(gb_pred, 5.0)
        self.assertLessEqual(gb_pred, 35.0)

    def test_03_full_models_inference_and_bounds(self):
        """Verify Full models accept 7-feature inputs and produce valid outputs."""
        sample = pd.DataFrame([{
            'Experience': 8.0,
            'Rating': 4.7,
            'Salary': 1500000.0,
            'Salaries Reported': 1,
            'Job Roles': 'Backend',
            'Employment Status': 'Full Time',
            'Location': 'Bangalore'
        }])
        gb_pred = float(self.models['gradient_boosting_full.joblib'].predict(sample)[0])
        lr_pred = float(self.models['linear_regression_full.joblib'].predict(sample)[0])

        self.assertTrue(np.isfinite(gb_pred))
        self.assertTrue(np.isfinite(lr_pred))
        self.assertGreaterEqual(gb_pred, 5.0)
        self.assertLessEqual(gb_pred, 35.0)

    def test_04_unknown_categorical_handling(self):
        """Verify OneHotEncoder handles unseen categories without raising errors."""
        unseen_sample = pd.DataFrame([{
            'Experience': 3.0,
            'Rating': 3.5,
            'Salary': 600000.0,
            'Salaries Reported': 1,
            'Job Roles': 'UnseenNewRoleXYZ',
            'Employment Status': 'Contractor',
            'Location': 'NonExistentCity'
        }])
        # Should not crash because handle_unknown='ignore'
        pred = self.models['gradient_boosting_full.joblib'].predict(unseen_sample)[0]
        self.assertTrue(np.isfinite(pred))


class TestBackendAPI(unittest.TestCase):
    """Phase 4 & 5: Backend REST API Contract & Security Tests"""

    def _get(self, endpoint):
        req = urllib.request.Request(f"{API_URL}{endpoint}")
        with urllib.request.urlopen(req, timeout=5) as resp:
            return resp.status, json.loads(resp.read().decode('utf-8'))

    def _post(self, endpoint, payload):
        req = urllib.request.Request(
            f"{API_URL}{endpoint}",
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        with urllib.request.urlopen(req, timeout=5) as resp:
            return resp.status, json.loads(resp.read().decode('utf-8'))

    def test_05_health_endpoint(self):
        """GET /api/health should return ready and report 4 models loaded."""
        status, data = self._get('/api/health')
        self.assertEqual(status, 200)
        self.assertEqual(data.get('status'), 'healthy')
        self.assertTrue(data.get('ready'))
        self.assertTrue(data.get('all_models_ready'))
        self.assertEqual(data.get('models_loaded'), 4)

    def test_06_metrics_endpoint(self):
        """GET /api/metrics should return verified metrics and feature importances."""
        status, data = self._get('/api/metrics')
        self.assertEqual(status, 200)
        self.assertIn('metrics', data)
        self.assertIn('feature_importances', data)
        self.assertGreater(len(data['metrics']), 0)
        self.assertGreater(len(data['feature_importances']), 0)

    def test_07_prediction_endpoint_success(self):
        """POST /api/predict returns correct schema and financial calculations."""
        payload = {
            'experience': 5.0,
            'rating': 4.5,
            'role': 'SDE',
            'salary': 1000000.0,
            'location': 'Bangalore',
            'status': 'Full Time'
        }
        status, data = self._post('/api/predict', payload)
        self.assertEqual(status, 200)
        self.assertEqual(data.get('status'), 'success')
        self.assertTrue(data.get('is_live_prediction'))

        hike = data['recommended_hike_pct']
        current = data['current_salary']
        projected = data['projected_new_salary']
        increment = data['salary_increment']

        # Verify exact mathematical invariants:
        # Revised = Current * (1 + Hike / 100)
        # Delta = Revised - Current
        expected_projected = round(current * (1.0 + hike / 100.0), 2)
        expected_increment = round(expected_projected - current, 2)

        self.assertAlmostEqual(projected, expected_projected, delta=1.0)
        self.assertAlmostEqual(increment, expected_increment, delta=1.0)

    def test_08_prediction_input_validation_rejections(self):
        """POST /api/predict must reject negative salary, out-of-range rating, and bad types."""
        bad_cases = [
            ({'experience': -2, 'rating': 4.0, 'role': 'SDE'}, 400),
            ({'experience': 5, 'rating': 6.5, 'role': 'SDE'}, 400),     # rating > 5.0
            ({'experience': 5, 'rating': 0.5, 'role': 'SDE'}, 400),     # rating < 1.0
            ({'experience': 5, 'rating': 4.0, 'role': 'SDE', 'salary': -50000}, 400), # negative salary
            ({'experience': None, 'rating': 4.0, 'role': 'SDE'}, 400),  # missing field
        ]
        for payload, expected_code in bad_cases:
            req = urllib.request.Request(
                f"{API_URL}/api/predict",
                data=json.dumps(payload).encode('utf-8'),
                headers={'Content-Type': 'application/json'}
            )
            try:
                with urllib.request.urlopen(req, timeout=5) as resp:
                    self.fail(f"Expected HTTP {expected_code} but got {resp.status}")
            except urllib.error.HTTPError as e:
                self.assertEqual(e.code, expected_code)

    def test_09_batch_prediction_endpoint(self):
        """POST /api/batch-predict processes candidate lists with real model inference."""
        candidates = [
            {'id': 'T-1', 'role': 'SDE', 'experience': 4.0, 'rating': 4.2, 'salary': 1000000},
            {'id': 'T-2', 'role': 'Backend', 'experience': 7.0, 'rating': 4.8, 'salary': 1800000},
            {'id': 'T-3', 'role': 'Testing', 'experience': 3.0, 'rating': 3.5, 'salary': 600000}
        ]
        status, data = self._post('/api/batch-predict', candidates)
        self.assertEqual(status, 200)
        self.assertEqual(data['count'], 3)
        self.assertEqual(len(data['results']), 3)
        for res in data['results']:
            self.assertIn('predictedHike', res)
            self.assertIn('newSalary', res)
            self.assertGreaterEqual(res['predictedHike'], 5.0)

    def test_10_telemetry_endpoint(self):
        """GET /api/telemetry retrieves recorded inference execution audit records."""
        status, data = self._get('/api/telemetry')
        self.assertEqual(status, 200)
        self.assertIn('logs', data)
        self.assertGreater(data.get('total_tracked', 0), 0)


if __name__ == '__main__':
    print("Executing AURA Predictor Automated Validation Suite...\n")
    suite = unittest.TestSuite()
    suite.addTest(unittest.makeSuite(TestMLModelArtifacts))
    suite.addTest(unittest.makeSuite(TestBackendAPI))
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    sys.exit(0 if result.wasSuccessful() else 1)
