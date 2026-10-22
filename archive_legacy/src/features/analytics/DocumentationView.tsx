import React from 'react';
import { BookOpen, ShieldCheck, CheckCircle2, Code, Terminal, Layers } from 'lucide-react';

export const DocumentationView: React.FC = () => {
  return (
    <div className="space-y-7 max-w-4xl animate-fadeIn">
      {/* Header */}
      <div className="pb-5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
            Technical Specification
          </span>
          <span className="text-xs text-slate-500 font-mono">Document Rev: 2.4.1</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
          Machine Learning Compensation Architecture
        </h2>
        <p className="text-xs text-slate-500">
          Comprehensive guide to feature engineering, loss minimization, policy bounding, and audit logging.
        </p>
      </div>

      {/* Section 1: Executive Overview */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Layers className="h-4 w-4 text-blue-600" /> 1. Overview & Business Rationale
        </h3>
        <p>
          The <strong>Employee Salary Hike Predictor</strong> removes subjectivity from corporate appraisal cycles by modeling historical tech-industry compensation adjustments. Grounded on an authenticated dataset of 22,770 engineering profiles across 11 disciplines, the system predicts optimal salary increment percentages conditioned on:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-200 font-medium">
          <li><strong>Performance Rating:</strong> Evaluated on a continuous scale from 1.0 (Critical) to 5.0 (Top Performer).</li>
          <li><strong>Experience Tenure:</strong> Total verified industry experience in years (0.5 to 20.0y).</li>
          <li><strong>Job Discipline:</strong> 11 technical categories including SDE, Backend, Frontend, Python, Mobile, Android, iOS, Java, Database, Testing, and Web.</li>
          <li><strong>Office Location:</strong> Tier 1 & Tier 2 Indian tech hubs (Bangalore, Hyderabad, Pune, Mumbai, New Delhi, Chennai, Kolkata, Kerala).</li>
          <li><strong>Current Annual Base Salary:</strong> Input in Indian Rupees (INR) to model compression curves.</li>
        </ul>
      </div>

      {/* Section 2: Mathematical Formulation */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Code className="h-4 w-4 text-purple-600" /> 2. Mathematical Formulations
        </h3>
        
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-[11px] space-y-2">
          <span className="text-slate-400 block font-sans font-bold">Gradient Boosting Ensemble Formulation:</span>
          <div className="text-blue-600 dark:text-blue-400 font-bold">
            F_M(x) = F_0(x) + \sum_{m=1}^{M} \gamma_m \cdot h_m(x)
          </div>
          <p className="text-slate-500 font-sans text-[11px]">
            Where M = 150 boosting stages, learning rate \gamma = 0.08, and base estimator F_0 is the sample mean. Individual regression trees h_m(x) capture non-linear interaction terms between performance ratings and tenure.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-[11px] space-y-2">
          <span className="text-slate-400 block font-sans font-bold">Linear Regression OLS Baseline:</span>
          <div className="text-purple-600 dark:text-purple-400 font-bold">
            \hat{y} = \beta_0 + \beta_1(Rating) + \beta_2(Experience) + \sum \beta_k(Role_k)
          </div>
          <p className="text-slate-500 font-sans text-[11px]">
            Trained via Ordinary Least Squares to serve as a linear lower-bound consensus comparator.
          </p>
        </div>
      </div>

      {/* Section 3: REST API Microservice */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Terminal className="h-4 w-4 text-emerald-600" /> 3. Backend Microservice Endpoints
        </h3>
        <p>The companion Python microservice runs at port 5050 and exposes the following endpoints:</p>

        <div className="space-y-2 font-mono text-[11px]">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
            <span><strong className="text-emerald-600">GET</strong> /api/health</span>
            <span className="text-slate-400">Verifies serialized model pipelines in memory</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
            <span><strong className="text-emerald-600">GET</strong> /api/metrics</span>
            <span className="text-slate-400">Returns RMSE, R2, and MAE benchmarks</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
            <span><strong className="text-blue-600">POST</strong> /api/predict</span>
            <span className="text-slate-400">Real-time JSON inference payload evaluation</span>
          </div>
        </div>
      </div>
    </div>
  );
};
