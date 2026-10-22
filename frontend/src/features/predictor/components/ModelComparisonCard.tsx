import React from 'react';
import { Cpu, GitCompare, CheckCircle2, TrendingUp } from 'lucide-react';
import { Card, CardHeaderTitle } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { PredictionResponse } from '../../../types';
import { formatPercent } from '../../../lib/utils';

interface ModelComparisonCardProps {
  prediction: PredictionResponse;
}

export const ModelComparisonCard: React.FC<ModelComparisonCardProps> = ({ prediction }) => {
  const gb = prediction.gradient_boosting_pct;
  const lr = prediction.linear_regression_pct;
  const diff = Math.round((gb - lr) * 10) / 10;

  return (
    <Card className="p-6 space-y-4">
      <CardHeaderTitle
        icon={GitCompare}
        title="Dual-Model Architectural Comparison"
        subtitle="Gradient Boosting Ensemble vs Linear Regression Benchmark"
        action={
          <Badge variant="outline" className="text-[10px]">
            Parallel Evaluation
          </Badge>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Gradient Boosting Box */}
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.07] space-y-2 shadow-[inset_0_1px_0_0_rgba(167,243,208,0.14)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Gradient Boosting (Production)
            </span>
            <Badge variant="success" className="text-[10px] px-1.5 py-0 font-mono">
              Primary
            </Badge>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {formatPercent(gb)}
          </div>
          <div className="text-[11px] text-zinc-400 leading-snug">
            Tuned tree ensemble with non-linear interaction modeling (Rating × Experience interaction).
          </div>
        </div>

        {/* Linear Regression Box */}
        <div className="p-4 rounded-xl border border-white/10 bg-white/[0.035] space-y-2 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300">
              Linear Regression (Baseline)
            </span>
            <Badge variant="default" className="text-[10px] px-1.5 py-0 font-mono">
              Benchmark
            </Badge>
          </div>
          <div className="text-2xl font-bold text-zinc-200 font-mono">
            {formatPercent(lr)}
          </div>
          <div className="text-[11px] text-zinc-400 leading-snug">
            Linear OLS baseline with one-hot encoded categories.
          </div>
        </div>
      </div>

      <div className="text-xs text-zinc-400 p-3.5 rounded-xl bg-white/[0.025] border border-white/8 flex items-start gap-2 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
        <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        <span>
          Gradient Boosting is currently predicting{' '}
          <strong className="text-zinc-100">
            {diff >= 0 ? `+${diff}% higher` : `${Math.abs(diff)}% lower`}
          </strong>{' '}
          than linear baseline due to non-linear marginal returns observed in historical appraisal datasets.
        </span>
      </div>
    </Card>
  );
};
