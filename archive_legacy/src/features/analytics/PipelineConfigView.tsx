import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, Shield, AlertTriangle } from 'lucide-react';

interface PipelineConfigViewProps {
  minFloor: number;
  setMinFloor: (val: number) => void;
  maxCeiling: number;
  setMaxCeiling: (val: number) => void;
  activeStrategy: string;
  setActiveStrategy: (strategy: string) => void;
}

export const PipelineConfigView: React.FC<PipelineConfigViewProps> = ({
  minFloor,
  setMinFloor,
  maxCeiling,
  setMaxCeiling,
  activeStrategy,
  setActiveStrategy
}) => {
  const [criticalCutoff, setCriticalCutoff] = useState<number>(3.0);
  const [highPerformerBonus, setHighPerformerBonus] = useState<number>(1.25);
  const [savedToast, setSavedToast] = useState<boolean>(false);

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              Governance Rules
            </span>
            <span className="text-xs text-slate-500 font-mono">ML Config</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            Pipeline Policy & Model Hyperparameter Bounds
          </h2>
          <p className="text-xs text-slate-500">
            Define statutory appraisal boundaries, model serving hierarchy, and outlier exception gates.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto"
        >
          {savedToast ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {savedToast ? 'Configuration Saved!' : 'Save Pipeline Config'}
        </button>
      </div>

      {savedToast && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Production inference pipeline rules updated. New bounds are now active across all simulator requests.
        </div>
      )}

      {/* Policy Bounds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Statutory Hike Domain Bounds */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 bg-blue-50 dark:bg-blue-950 text-blue-600 rounded-lg">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Statutory Increment Bounds
              </h3>
              <p className="text-xs text-slate-500">Hard ceilings and floors enforced on ML output</p>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-slate-700 dark:text-slate-300">Minimum Hike Floor (%)</span>
              <span className="font-mono text-blue-600 font-bold">{minFloor.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="10.0"
              step="0.5"
              value={minFloor}
              onChange={(e) => setMinFloor(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Default: 5.0% (protects real purchasing power)</span>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-slate-700 dark:text-slate-300">Maximum Hike Ceiling (%)</span>
              <span className="font-mono text-rose-600 font-bold">{maxCeiling.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="25.0"
              max="50.0"
              step="1.0"
              value={maxCeiling}
              onChange={(e) => setMaxCeiling(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Default: 35.0% (corporate budget cap)</span>
          </div>
        </div>

        {/* Card 2: Performance Evaluation Gates */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 bg-purple-50 dark:bg-purple-950 text-purple-600 rounded-lg">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Performance Gates & Multipliers
              </h3>
              <p className="text-xs text-slate-500">Flags below-par ratings and accelerates star contributors</p>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-slate-700 dark:text-slate-300">Critical Review Cutoff Rating</span>
              <span className="font-mono text-amber-600 font-bold">{criticalCutoff.toFixed(1)} / 5.0</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="3.5"
              step="0.1"
              value={criticalCutoff}
              onChange={(e) => setCriticalCutoff(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Ratings below this threshold require HR VP sign-off</span>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-slate-700 dark:text-slate-300">Top Performer Multiplier (Rating &ge; 4.5)</span>
              <span className="font-mono text-emerald-600 font-bold">{highPerformerBonus.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="1.5"
              step="0.05"
              value={highPerformerBonus}
              onChange={(e) => setHighPerformerBonus(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Incentive booster applied to merit recommendations</span>
          </div>
        </div>

      </div>

      {/* Model Serving Strategy */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
          Model Serving Architecture
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Choose which model pipeline drives primary recommendations in the user interface.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { id: 'gb', title: 'Gradient Boosting (Production)', desc: 'Full tree ensemble with R²=0.941 & MAE=1.34%', tag: 'Recommended' },
            { id: 'lr', title: 'Linear Regression (Baseline)', desc: 'Parametric OLS estimator with linear slopes', tag: 'Legacy' },
            { id: 'ensemble', title: 'Hybrid Ensemble (75/25)', desc: 'Blended consensus between non-linear and linear models', tag: 'Conservative' },
          ].map((strat) => (
            <div
              key={strat.id}
              onClick={() => setActiveStrategy(strat.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                activeStrategy === strat.id
                  ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-blue-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">{strat.title}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  {strat.tag}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">{strat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
