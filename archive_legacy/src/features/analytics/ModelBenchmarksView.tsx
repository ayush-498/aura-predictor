import React, { useState } from 'react';
import { Award, Zap, Sliders, CheckCircle2, TrendingUp, BarChart2, Cpu } from 'lucide-react';
import { MODEL_EVALUATION_SPECS } from '@/src/services/predictionEngine';

interface ModelBenchmarksViewProps {
  activeStrategy: string;
  setActiveStrategy: (strategy: string) => void;
}

export const ModelBenchmarksView: React.FC<ModelBenchmarksViewProps> = ({
  activeStrategy,
  setActiveStrategy
}) => {
  const [nEstimators, setNEstimators] = useState<number>(150);
  const [maxDepth, setMaxDepth] = useState<number>(4);
  const [learningRate, setLearningRate] = useState<number>(0.08);
  const [selectedAlgo, setSelectedAlgo] = useState<string>('gb');

  // Simulated metrics based on hyperparameter tuning
  const simR2 = (0.925 + (maxDepth * 0.003) - Math.abs(learningRate - 0.08) * 0.1).toFixed(3);
  const simMae = (1.42 - (maxDepth * 0.018) + (nEstimators > 200 ? 0.05 : 0)).toFixed(2);

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
              Evaluation Suite
            </span>
            <span className="text-xs text-slate-500 font-mono">20% Holdout Split</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            Machine Learning Model Benchmarks
          </h2>
          <p className="text-xs text-slate-500">
            Compare Gradient Boosting Regressor vs Linear Regression and configure active inference engine.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Active Serving Engine:</span>
          <span className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold font-mono">
            {activeStrategy === 'gb' ? 'Gradient Boosting' : (activeStrategy === 'lr' ? 'Linear Regression' : 'Ensemble')}
          </span>
        </div>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Gradient Boosting */}
        <div 
          onClick={() => setSelectedAlgo('gb')}
          className={`cursor-pointer p-5 rounded-2xl border transition-all ${
            selectedAlgo === 'gb' 
              ? 'border-blue-600 dark:border-blue-500 bg-blue-50/40 dark:bg-blue-950/30 shadow-md ring-2 ring-blue-500/20' 
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
              <Zap className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
              Production Winner
            </span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Gradient Boosting Regressor</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">Non-linear decision tree ensemble</p>
          
          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Test MAE:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">1.34%</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Consensus R²:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">0.941</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Test RMSE:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">6.14</span>
            </div>
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              setActiveStrategy('gb');
            }}
            className="w-full mt-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
          >
            {activeStrategy === 'gb' ? 'Currently Serving' : 'Deploy as Primary'}
          </button>
        </div>

        {/* Card 2: Linear Regression */}
        <div 
          onClick={() => setSelectedAlgo('lr')}
          className={`cursor-pointer p-5 rounded-2xl border transition-all ${
            selectedAlgo === 'lr' 
              ? 'border-purple-600 dark:border-purple-500 bg-purple-50/40 dark:bg-purple-950/30 shadow-md ring-2 ring-purple-500/20' 
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="p-2.5 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-xl">
              <BarChart2 className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              Baseline
            </span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Linear Regression Baseline</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">Ordinary Least Squares parametric fit</p>
          
          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Test MAE:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">4.88%</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Consensus R²:</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">0.280</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Test RMSE:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">7.05</span>
            </div>
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              setActiveStrategy('lr');
            }}
            className="w-full mt-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors"
          >
            {activeStrategy === 'lr' ? 'Currently Serving' : 'Deploy as Primary'}
          </button>
        </div>

        {/* Card 3: Weighted Ensemble */}
        <div 
          onClick={() => setSelectedAlgo('ensemble')}
          className={`cursor-pointer p-5 rounded-2xl border transition-all ${
            selectedAlgo === 'ensemble' 
              ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 shadow-md ring-2 ring-emerald-500/20' 
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Cpu className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
              High Stability
            </span>
          </div>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Hybrid Consensus Ensemble</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">75% GBR + 25% LR blending</p>
          
          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Test MAE:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">1.82%</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Consensus R²:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">0.912</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Variance Dampening:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">High</span>
            </div>
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              setActiveStrategy('ensemble');
            }}
            className="w-full mt-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
          >
            {activeStrategy === 'ensemble' ? 'Currently Serving' : 'Deploy as Primary'}
          </button>
        </div>

      </div>

      {/* Interactive Hyperparameter Simulator */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 dark:bg-blue-950 text-blue-600 rounded-lg">
              <Sliders className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Interactive Hyperparameter Fine-Tuner (Gradient Boosting)
              </h3>
              <p className="text-xs text-slate-500">Simulate how loss metrics respond to tree depth and learning rate adjustments.</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-mono">Projected R²</span>
            <span className="text-lg font-black text-blue-600 dark:text-blue-400 font-mono">{simR2}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-slate-700 dark:text-slate-300">N-Estimators (Trees)</span>
              <span className="font-mono text-blue-600">{nEstimators}</span>
            </div>
            <input 
              type="range" 
              min="50" 
              max="300" 
              step="10" 
              value={nEstimators} 
              onChange={(e) => setNEstimators(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Default: 150 iterations</span>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-slate-700 dark:text-slate-300">Max Tree Depth</span>
              <span className="font-mono text-purple-600">{maxDepth}</span>
            </div>
            <input 
              type="range" 
              min="2" 
              max="8" 
              step="1" 
              value={maxDepth} 
              onChange={(e) => setMaxDepth(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Optimal bound: 4 (avoids overfitting)</span>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-slate-700 dark:text-slate-300">Learning Rate (η)</span>
              <span className="font-mono text-emerald-600">{learningRate.toFixed(2)}</span>
            </div>
            <input 
              type="range" 
              min="0.01" 
              max="0.25" 
              step="0.01" 
              value={learningRate} 
              onChange={(e) => setLearningRate(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Default: 0.08 shrinkage factor</span>
          </div>
        </div>

        {/* Simulated Residual Loss Curve */}
        <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs mb-3">
            <span className="font-bold text-slate-700 dark:text-slate-300">Cross-Validation Loss Convergence</span>
            <span className="text-slate-400 font-mono">Target Error: {simMae}% MAE</span>
          </div>
          <div className="flex items-end gap-1.5 h-16 w-full pt-2">
            {[90, 78, 65, 52, 44, 38, 33, 29, 26, 23, 20, 18, 17, 16, 15, 14, 14, 13].map((val, idx) => (
              <div 
                key={idx}
                className="flex-1 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t transition-all duration-300"
                style={{ height: `${Math.max(10, val * (maxDepth / 4))}px` }}
                title={`Epoch ${idx * 10}: Loss ${(val * 0.1).toFixed(2)}`}
              />
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>Epoch 0</span>
            <span>Epoch 75</span>
            <span>Epoch 150 (Converged)</span>
          </div>
        </div>
      </div>

      {/* Official CSV Evaluation Matrix */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
          Official Model Evaluation Matrix (Trained Pipelines)
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Exported from training run on 22,770 records across feature subsets.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 font-semibold text-slate-400 uppercase tracking-wider">
                <th className="pb-3">Experiment Feature Set</th>
                <th className="pb-3">Model Architecture</th>
                <th className="pb-3">Train RMSE</th>
                <th className="pb-3">Test RMSE</th>
                <th className="pb-3">Train R²</th>
                <th className="pb-3">Test R²</th>
                <th className="pb-3 text-right">Test MAE (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {MODEL_EVALUATION_SPECS.map((spec, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-sans text-slate-800 dark:text-slate-200 font-semibold">{spec.experiment}</td>
                  <td className="py-3 font-sans text-blue-600 dark:text-blue-400 font-bold">{spec.model}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">{spec.trainRmse.toFixed(4)}</td>
                  <td className="py-3 text-slate-900 dark:text-slate-100 font-bold">{spec.testRmse.toFixed(4)}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">{spec.trainR2.toFixed(4)}</td>
                  <td className="py-3 text-emerald-600 dark:text-emerald-400 font-bold">{spec.testR2.toFixed(4)}</td>
                  <td className="py-3 text-right text-slate-900 dark:text-slate-100 font-bold">{spec.testMae.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
