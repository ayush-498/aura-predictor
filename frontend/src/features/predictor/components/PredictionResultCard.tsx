import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  FileText,
  Printer,
  Copy,
  Check,
  X,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { Card, CardHeaderTitle } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { PredictionResponse, PredictionRequest } from '../../../types';
import { formatINR, formatPercent } from '../../../lib/utils';
import { useAppraisalLedger } from '../../../context/AppraisalLedgerContext';

interface PredictionResultCardProps {
  prediction: PredictionResponse;
  params: PredictionRequest;
  loading: boolean;
  onApproveCandidate?: () => void;
}

export const PredictionResultCard: React.FC<PredictionResultCardProps> = ({
  prediction,
  params,
  loading,
  onApproveCandidate,
}) => {
  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [approvedToast, setApprovedToast] = useState(false);
  const { addFromSimulator } = useAppraisalLedger();

  const hike = prediction.recommended_hike_pct;
  const isHighPerformer = params.rating >= 4.0;

  const confVal = prediction.confidence_score > 1
    ? prediction.confidence_score
    : prediction.confidence_score * 100;
  const confFormatted = confVal.toFixed(1);
  const confBadgeVariant = confVal >= 90 ? 'success' : (confVal >= 80 ? 'info' : 'warning');
  const modelDisparity = Math.abs(prediction.gradient_boosting_pct - prediction.linear_regression_pct).toFixed(1);

  const letterDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handleCopyLetter = () => {
    const text = `
COMPENSATION REVISION & APPRAISAL MEMORANDUM
Date: ${letterDate}
Job Role: ${params.role ? `${params.role} Engineer` : 'Software Professional'}
Location: ${params.location || 'Bangalore'}
Performance Rating: ${params.rating.toFixed(1)} / 5.0
Experience Tenure: ${params.experience.toFixed(1)} Years

Current Annual Base: ${params.salary ? formatINR(params.salary) : 'N/A'}
Approved Salary Hike: +${formatPercent(hike)}
Projected Revised Base: ${prediction.projected_new_salary ? formatINR(prediction.projected_new_salary) : 'N/A'}
Annual Increment: +${prediction.salary_increment ? formatINR(prediction.salary_increment) : 'N/A'}

Governance Standard: ML Production Model
Status: Confirmed & Digitally Authenticated
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleApprove = () => {
    addFromSimulator(params, prediction);
    setApprovedToast(true);
    if (onApproveCandidate) {
      setTimeout(() => {
        onApproveCandidate();
      }, 500);
    }
  };

  return (
    <>
      <Card className="p-6 relative overflow-hidden border-emerald-500/25">
        {/* Glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/[0.08] rounded-full blur-3xl pointer-events-none" />

        <CardHeaderTitle
          icon={Sparkles}
          title="Recommended Increment"
          subtitle="Precision ML-calibrated hike recommendation"
          action={
            <div className="flex items-center gap-2">
              {prediction.is_live_prediction !== false ? (
                <Badge variant="success" className="font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  Live ML Inference
                </Badge>
              ) : (
                <Badge variant="warning" className="font-mono flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  Offline Demo Mode
                </Badge>
              )}
              <Badge variant={confBadgeVariant} className="font-mono hidden sm:inline-flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Confidence {confFormatted}%
              </Badge>
            </div>
          }
        />

        {approvedToast && (
          <div className="my-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Candidate appraisal approved and added to active appraisal cohort!
          </div>
        )}

        <div className="py-6 space-y-6">
          {/* Main Hike Percentage Callout */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
                  +{formatPercent(hike)}
                </span>
                <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                  Annual CTC Hike
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Optimized via {prediction.model_used}
              </p>
            </div>

            <div className="flex flex-col items-start sm:items-end">
              <span className="text-xs text-zinc-400 font-medium">HR Approval Tier</span>
              <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                {isHighPerformer ? 'Fast-Track Approved' : 'Standard Committee Review'}
              </span>
            </div>
          </div>

          {/* Visual percentage meter */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium text-zinc-500">
              <span>Minimum (5%)</span>
              <span>Target ({hike}%)</span>
              <span>Ceiling (35%)</span>
            </div>
            <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-zinc-200 dark:border-zinc-700">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, ((hike - 5) / 30) * 100))}%` }}
              />
            </div>
          </div>

          {/* Financial Breakdown (Old CTC, Increment, New Projected CTC) */}
          {params.salary ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="dashboard-metric-tile dashboard-metric-tile-neutral p-3.5">
                <span className="text-[11px] font-medium text-zinc-400 block">
                  Current CTC
                </span>
                <span className="text-base font-bold text-zinc-100 font-mono mt-0.5 block">
                  {formatINR(params.salary)}
                </span>
              </div>

              <div className="dashboard-metric-tile dashboard-metric-tile-accent p-3.5">
                <span className="text-[11px] font-medium text-emerald-400 block flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> Annual Delta
                </span>
                <span className="text-base font-bold text-emerald-300 font-mono mt-0.5 block">
                  +{formatINR(prediction.salary_increment)}
                </span>
              </div>

              <div className="dashboard-metric-tile dashboard-metric-tile-projected p-3.5">
                <span className="text-[11px] font-medium text-zinc-300 block">
                  Projected New CTC
                </span>
                <span className="text-base font-black text-emerald-400 font-mono mt-0.5 block">
                  {formatINR(prediction.projected_new_salary)}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-white/[0.025] border border-dashed border-white/10 text-center text-xs text-zinc-400">
              Enter Current Salary to view exact rupee delta and projected total compensation
            </div>
          )}

          {/* Dynamic Model Certainty & Disparity Index */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between p-3 rounded-xl bg-white/[0.025] border border-white/8 text-[11px] font-mono gap-2">
              <span className="text-zinc-400 flex items-center gap-1.5 font-sans font-medium">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Dynamic Certainty Index:
              </span>
              <div className="flex items-center gap-2.5">
                <span className="text-zinc-400">
                  Model Delta: <strong className="text-zinc-200">|GB - LR| = {modelDisparity}%</strong>
                </span>
                <span>•</span>
                <span className={confVal >= 90 ? 'text-emerald-400 font-bold' : (confVal >= 80 ? 'text-blue-400 font-bold' : 'text-amber-400 font-bold')}>
                  Certainty: {confFormatted}%
                </span>
              </div>
            </div>

            {/* Active Multi-Skill Stack Strip */}
            {((params.roles && params.roles.length > 1) || (params.skills && params.skills.length > 0)) && (
              <div className="flex flex-wrap items-center justify-between p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-400" /> Active Stack:
                  </span>
                  {(params.roles && params.roles.length > 0 ? params.roles : (params.role ? [params.role] : [])).map(r => (
                    <span key={r} className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                      {r}
                    </span>
                  ))}
                  {(params.skills || []).map(s => (
                    <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 font-medium">
                      {s}
                    </span>
                  ))}
                </div>
                {(prediction.synergy_bonus_pct || 0) > 0 && (
                  <span className="text-[11px] font-bold text-emerald-400 font-mono">
                    +{prediction.synergy_bonus_pct}% Synergy
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Interactive Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <Button size="sm" onClick={handleApprove}>
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              Approve & Add to Ledger
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setIsLetterModalOpen(true)}>
              <FileText className="w-3.5 h-3.5 mr-1" />
              Generate Official Letter
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Model: {prediction.model_used}
          </span>
          <div className="flex items-center gap-3 font-mono">
            {prediction.latency_ms !== undefined && (
              <span className="text-[11px] text-zinc-400">⚡ {prediction.latency_ms}ms</span>
            )}
            <span>Bound: [5.0% - 35.0%]</span>
          </div>
        </div>
      </Card>

      {/* Official Appraisal Memorandum Modal */}
      {isLetterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Official Compensation Revision Memorandum
                </h3>
              </div>
              <button onClick={() => setIsLetterModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950 font-serif text-zinc-800 dark:text-zinc-200 text-xs leading-relaxed space-y-3">
              <div className="flex justify-between font-mono text-[10px] text-zinc-400 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                <span>MEMO REF: AURA-{Math.floor(100000 + Math.random() * 900000)}</span>
                <span>Date: {letterDate}</span>
              </div>
              <p className="font-sans font-bold text-sm text-zinc-900 dark:text-zinc-100">
                SUBJECT: Annual Compensation Review & Performance Appraisal
              </p>
              <p>
                In alignment with our engineering merit matrix and the Machine Learning decision engine, we are pleased to confirm your annual appraisal revision:
              </p>
              <div className="p-3 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 font-mono text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Role:</span>
                  <strong>{params.role ? `${params.role} Engineer` : 'Software Professional'} ({params.location})</strong>
                </div>
                <div className="flex justify-between">
                  <span>Performance Rating:</span>
                  <strong>★ {params.rating.toFixed(1)} / 5.0</strong>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Approved Increment:</span>
                  <strong>+{formatPercent(hike)}</strong>
                </div>
                {params.salary && (
                  <>
                    <div className="flex justify-between">
                      <span>Previous Base CTC:</span>
                      <span>{formatINR(params.salary)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-zinc-900 dark:text-zinc-100 pt-1 border-t border-zinc-200 dark:border-zinc-700">
                      <span>Revised Annual Base CTC:</span>
                      <span>{formatINR(prediction.projected_new_salary)}</span>
                    </div>
                  </>
                )}
              </div>
              <p className="font-sans text-[11px] text-zinc-500">
                Effective from the next payroll cycle. Authenticated by Compensation & People Ops Committee.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="secondary" size="sm" onClick={() => window.print()}>
                <Printer className="w-3.5 h-3.5 mr-1" /> Print
              </Button>
              <Button size="sm" onClick={handleCopyLetter}>
                {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copied ? 'Copied' : 'Copy Text'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
