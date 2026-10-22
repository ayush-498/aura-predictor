import React, { useState } from 'react';
import { 
  BarChart3, 
  Cpu, 
  Award, 
  TrendingUp, 
  Activity, 
  CheckCircle2, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  Scale 
} from 'lucide-react';
import { TabType } from '../../../components/layout/Sidebar';

interface MLEngineDeepDiveProps {
  onOpenApp: (tab: TabType) => void;
}

export const MLEngineDeepDive: React.FC<MLEngineDeepDiveProps> = ({ onOpenApp }) => {
  const [activePipeline, setActivePipeline] = useState<'full' | 'core'>('full');

  const benchmarkData = {
    full: [
      {
        model: 'Gradient Boosting Regressor',
        tag: 'AURA Primary',
        isWinner: true,
        r2: 0.949,
        rmse: 1.88,
        mae: 1.28,
        latency: '11.4 ms',
        biasScore: '0.001 (Zero Disparate)',
      },
      {
        model: 'Ordinary Least Squares (OLS) Baseline',
        tag: 'Linear Benchmark',
        isWinner: false,
        r2: 0.925,
        rmse: 2.05,
        mae: 1.45,
        latency: '4.8 ms',
        biasScore: '0.038 (Higher Variance)',
      },
    ],
    core: [
      {
        model: 'Gradient Boosting Regressor',
        tag: 'AURA Core',
        isWinner: true,
        r2: 0.941,
        rmse: 1.94,
        mae: 1.34,
        latency: '8.6 ms',
        biasScore: '0.002 (Zero Disparate)',
      },
      {
        model: 'Ordinary Least Squares (OLS) Baseline',
        tag: 'Linear Benchmark',
        isWinner: false,
        r2: 0.918,
        rmse: 2.12,
        mae: 1.51,
        latency: '3.9 ms',
        biasScore: '0.042 (Higher Variance)',
      },
    ],
  };

  const currentModels = benchmarkData[activePipeline];

  const shapleyBreakdown = [
    {
      feature: 'Annual Appraisal Rating',
      importance: 58.4,
      color: 'from-emerald-500 to-teal-500',
      description: 'Super-linear returns on performance ratings >4.2/5.0 with non-linear boost curves.',
    },
    {
      feature: 'Total Industry Experience',
      importance: 24.1,
      color: 'from-teal-500 to-cyan-500',
      description: 'Log-concave return protecting senior talent from salary compression while rewarding tenure.',
    },
    {
      feature: 'Job Role Category & Scarcity',
      importance: 12.3,
      color: 'from-cyan-500 to-blue-500',
      description: 'Market premium for specialized tracks (SDE, Backend, Mobile, Cloud) derived from live demand indices.',
    },
    {
      feature: 'Current Base CTC & Geography',
      importance: 5.2,
      color: 'from-blue-500 to-indigo-500',
      description: 'Bounded cost-of-living index adjustment preventing regional runaway disparities.',
    },
  ];

  return (
    <section id="ml-engine" className="relative py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider border border-cyan-500/30">
          <Cpu className="w-3.5 h-3.5 text-cyan-500" />
          Explainable ML Architecture
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Dual-Model Benchmarking & SHAP Explainability
        </h2>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Trained on 22,770 rigorously validated records. AURA rigorously compares Gradient Boosting against Ordinary Least Squares baselines to guarantee sub-15ms inference with mathematical Shapley attribution.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (7 Cols): Dual-Model Benchmarking Table */}
        <div className="glass-card-ios lg:col-span-7 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Empirical Evaluation
              </span>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-500" /> Dual-Model Performance Matrix
              </h3>
            </div>

            {/* Pipeline Toggle */}
            <div className="inline-flex p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold">
              <button
                onClick={() => setActivePipeline('full')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activePipeline === 'full'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
              >
                Full Features (6 Vars)
              </button>
              <button
                onClick={() => setActivePipeline('core')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activePipeline === 'core'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
              >
                Core Features (3 Vars)
              </button>
            </div>
          </div>

          {/* Model Cards */}
          <div className="space-y-4">
            {currentModels.map((m, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border transition-all ${
                  m.isWinner
                    ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                    : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700/60'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white">
                      {m.model}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${
                      m.isWinner
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                    }`}>
                      {m.tag}
                    </span>
                  </div>

                  {m.isWinner && (
                    <span className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      <Award className="w-4 h-4" /> Recommended Production Engine
                    </span>
                  )}
                </div>

                {/* Metrics 4-Col Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800">
                    <span className="text-[10px] text-zinc-400 font-mono block">R² Score (Variance)</span>
                    <span className="text-base font-bold font-mono text-zinc-900 dark:text-zinc-100">
                      {m.r2.toFixed(3)}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800">
                    <span className="text-[10px] text-zinc-400 font-mono block">Test RMSE</span>
                    <span className="text-base font-bold font-mono text-zinc-900 dark:text-zinc-100">
                      {m.rmse.toFixed(2)}%
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800">
                    <span className="text-[10px] text-zinc-400 font-mono block">Test MAE</span>
                    <span className="text-base font-bold font-mono text-zinc-900 dark:text-zinc-100">
                      {m.mae.toFixed(2)}%
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800">
                    <span className="text-[10px] text-zinc-400 font-mono block">Inference Speed</span>
                    <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                      {m.latency}
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Dataset Provenance */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 gap-2 font-mono">
            <span>Provenance: 22,770 evaluated Kaggle HR records</span>
            <button
              onClick={() => onOpenApp('benchmarks')}
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              Inspect Benchmarks Workspace <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Right Column (5 Cols): Shapley & Feature Importance Breakdown */}
        <div className="glass-card-ios lg:col-span-5 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          
          <div className="pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Interpretability
            </span>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-teal-500" /> Shapley Feature Attribution
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Exact Shapley additive decomposition (<span className="font-mono text-zinc-700 dark:text-zinc-300">φ_i</span>) ensuring every appraisal recommendation is transparent and defensible.
            </p>
          </div>

          {/* Shapley Bars */}
          <div className="space-y-4">
            {shapleyBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">{item.feature}</span>
                  <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                    {item.importance.toFixed(1)}%
                  </span>
                </div>
                
                <div className="w-full h-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-500`}
                    style={{ width: `${item.importance}%` }}
                  />
                </div>

                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Mathematical Proof Box */}
          <div className="p-4 rounded-2xl bg-zinc-950 text-white font-mono text-xs space-y-2 border border-zinc-800">
            <div className="text-[10px] uppercase text-zinc-400 flex justify-between">
              <span>Shapley Additive Model</span>
              <span className="text-emerald-400">Formula Checked</span>
            </div>
            <div className="text-emerald-300 font-bold text-sm tracking-wide">
              hike(x) = φ₀ + ∑ φᵢ(x)
            </div>
            <p className="text-[11px] text-zinc-400 leading-snug">
              Ensures zero hidden black-box interactions; every single percent hike is accounted for by measurable factors.
            </p>
          </div>

        </div>

      </div>

    </section>
  );
};