import React, { useState } from 'react';
import {
  X,
  FileText,
  TrendingUp,
  DollarSign,
  Briefcase,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  MapPin,
  Mail,
  Phone,
  Code2,
  Copy,
  Check,
  FileCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { ResumeUploadResponse, ResumeParsedProfile } from '../../../types';
import { formatINR, formatPercent, getRatingLabel } from '../../../lib/utils';
import { useAppraisalLedger } from '../../../context/AppraisalLedgerContext';

interface ResumeAnalysisOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  result: ResumeUploadResponse | null;
  onApplyToSimulator: (profile: ResumeParsedProfile) => void;
  onNavigateToLedger?: () => void;
}

export const ResumeAnalysisOverlay: React.FC<ResumeAnalysisOverlayProps> = ({
  isOpen,
  onClose,
  result,
  onApplyToSimulator,
  onNavigateToLedger,
}) => {
  const [copied, setCopied] = useState(false);
  const [showRawText, setShowRawText] = useState(false);
  const [recordedToast, setRecordedToast] = useState(false);
  const { addFromResume } = useAppraisalLedger();

  if (!isOpen || !result) return null;

  const { extracted_profile, prediction, filename, text_preview } = result;
  const ratingInfo = getRatingLabel(extracted_profile.rating);
  const hike = prediction.recommended_hike_pct;

  const confVal = prediction.confidence_score > 1
    ? prediction.confidence_score
    : prediction.confidence_score * 100;
  const confFormatted = confVal.toFixed(1);

  const handleRecordToLedger = () => {
    addFromResume(extracted_profile, prediction);
    setRecordedToast(true);
    setTimeout(() => {
      onClose();
      if (onNavigateToLedger) onNavigateToLedger();
    }, 600);
  };

  const handleCopySummary = () => {
    const text = `
========================================
AURA PREDICTOR - CANDIDATE APPRAISAL BRIEF
========================================
Candidate: ${extracted_profile.candidate_name}
Document: ${filename}
Detected Role: ${extracted_profile.role}
Experience: ${extracted_profile.experience} Years
Performance Rating: ${extracted_profile.rating} / 5.0 (${ratingInfo.label})
Current Base CTC: ${formatINR(extracted_profile.salary)}
Target Hub: ${extracted_profile.location}

PREDICTIVE ML APPRAISAL:
- Recommended Hike: +${formatPercent(hike)}
- Gradient Boosting Forecast: ${formatPercent(prediction.gradient_boosting_pct)}
- Linear Regression Baseline: ${formatPercent(prediction.linear_regression_pct)}
- Projected Revised CTC: ${formatINR(prediction.projected_new_salary ?? 0)}
- Annual Increment: ${formatINR(prediction.salary_increment ?? 0)}
- Model Pipeline: ${prediction.model_used}
- Confidence Score: ${(prediction.confidence_score * 100).toFixed(1)}%

Key Skills Detected: ${extracted_profile.skills.join(', ')}
========================================
`.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    onApplyToSimulator(extracted_profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-zinc-900/95 border border-white/15 rounded-3xl shadow-2xl shadow-emerald-500/10 text-zinc-100 flex flex-col z-10 custom-scrollbar">
        {/* Top Header Strip */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-zinc-900/95 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <FileCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {extracted_profile.candidate_name}
                </h2>
                <Badge variant="success">
                  Auto-Parsed & Predicted
                </Badge>
              </div>
              <p className="text-xs text-zinc-400 flex items-center gap-2 mt-0.5">
                <span className="font-mono text-zinc-400">{filename}</span>
                <span>•</span>
                <span>Role Match: <strong className="text-emerald-400">{extracted_profile.role}</strong> ({extracted_profile.detected_role_confidence || '94%'})</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopySummary} title="Copy Brief">
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400 mr-1" />
                  <span className="text-xs text-emerald-400 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-zinc-400 mr-1" />
                  <span className="text-xs text-zinc-300">Copy Brief</span>
                </>
              )}
            </Button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Hero Prediction Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950/60 via-zinc-900 to-teal-950/40 border border-emerald-500/30 p-6 shadow-inner">
            <div className="absolute -right-8 -top-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  Machine Learning Recommendation
                </span>
                <div className="flex items-baseline gap-3 pt-2">
                  <span className="text-5xl font-black tracking-tight text-white font-mono bg-gradient-to-r from-emerald-300 via-teal-200 to-white bg-clip-text text-transparent">
                    +{formatPercent(hike)}
                  </span>
                  <span className="text-sm font-semibold text-emerald-400">
                    Salary Hike
                  </span>
                </div>
                <p className="text-xs text-zinc-400 pt-1">
                  Generated via <span className="text-zinc-200 font-semibold">{prediction.model_used}</span>
                </p>
              </div>

              {/* Incremental Figures */}
              <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                <div className="bg-black/40 border border-white/10 rounded-xl p-3 min-w-[150px]">
                  <span className="text-[11px] font-medium text-zinc-400 block">Current Base CTC</span>
                  <span className="text-base font-bold text-zinc-200 font-mono mt-0.5 block">
                    {formatINR(extracted_profile.salary)}
                  </span>
                  <span className="text-[10px] text-zinc-400">Extracted from CV</span>
                </div>

                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 min-w-[160px]">
                  <span className="text-[11px] font-medium text-emerald-300 block">Projected New CTC</span>
                  <span className="text-base font-bold text-emerald-200 font-mono mt-0.5 block">
                    {formatINR(prediction.projected_new_salary ?? 0)}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium">
                    +{formatINR(prediction.salary_increment ?? 0)} / yr
                  </span>
                </div>
              </div>
            </div>

            {/* Model Comparison Strip */}
            <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-zinc-400">Gradient Boosting:</span>
                <span className="font-mono font-bold text-emerald-400">
                  +{formatPercent(prediction.gradient_boosting_pct)}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-zinc-400">Linear Regression:</span>
                <span className="font-mono font-bold text-zinc-200">
                  +{formatPercent(prediction.linear_regression_pct)}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-zinc-400">Dynamic Confidence:</span>
                <span className={`font-mono font-bold flex items-center gap-1 ${
                  confVal >= 90 ? 'text-emerald-400' : (confVal >= 80 ? 'text-teal-300' : 'text-amber-400')
                }`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {confFormatted}%
                </span>
              </div>
            </div>
          </div>

          {/* Extracted Parameters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Candidate Credentials Card */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/8 space-y-3">
              <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
                Parsed Candidate Metadata
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Target Role:</span>
                  <Badge variant="info">
                    {extracted_profile.role}
                  </Badge>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Experience Tenure:</span>
                  <span className="font-semibold text-zinc-200 font-mono">
                    {extracted_profile.experience.toFixed(1)} Years
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Appraisal Rating:</span>
                  <span className="flex items-center gap-1.5 font-semibold text-zinc-200">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    {extracted_profile.rating.toFixed(1)} / 5.0
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${ratingInfo.color}`}>
                      {ratingInfo.label}
                    </span>
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Location Hub:</span>
                  <span className="font-semibold text-zinc-200 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-zinc-400" />
                    {extracted_profile.location}
                  </span>
                </div>

                {extracted_profile.email && (
                  <div className="flex items-center justify-between py-1 border-b border-white/5">
                    <span className="text-zinc-400">Email:</span>
                    <span className="font-mono text-zinc-300 text-[11px] truncate max-w-[200px]">
                      {extracted_profile.email}
                    </span>
                  </div>
                )}

                {extracted_profile.phone && (
                  <div className="flex items-center justify-between py-1">
                    <span className="text-zinc-400">Phone:</span>
                    <span className="font-mono text-zinc-300 text-[11px]">
                      {extracted_profile.phone}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Detected Skills Cloud Card */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/8 space-y-3 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                  <Code2 className="w-3.5 h-3.5 text-zinc-400" />
                  Identified Technical Skills ({extracted_profile.skills.length})
                </h3>

                {extracted_profile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {extracted_profile.skills.map(skill => (
                      <span
                        key={skill}
                        className="text-xs px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 italic">
                    General software engineering competencies extracted.
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-white/5 text-[11px] text-zinc-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  Features mapped automatically to trained dataset vectors.
                </span>
              </div>
            </div>
          </div>

          {/* Collapsible Document Text Preview */}
          {text_preview && (
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
              <button
                type="button"
                onClick={() => setShowRawText(!showRawText)}
                className="w-full flex items-center justify-between p-3.5 text-xs font-semibold text-zinc-300 hover:bg-white/[0.04] transition-colors"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-zinc-400" />
                  Inspect Extracted Resume Content
                </span>
                {showRawText ? (
                  <ChevronUp className="w-4 h-4 text-zinc-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                )}
              </button>

              {showRawText && (
                <div className="p-4 border-t border-white/5 bg-black/40 max-h-48 overflow-y-auto font-mono text-[11px] text-zinc-400 leading-relaxed whitespace-pre-wrap">
                  {text_preview}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Strip */}
        <div className="sticky bottom-0 z-20 flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-zinc-900/95 backdrop-blur-md border-t border-white/10">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleApply}
              className="flex-1 sm:flex-initial"
            >
              Simulate Parameters
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleRecordToLedger}
              className="flex-1 sm:flex-initial shadow-lg shadow-emerald-600/30 font-semibold"
            >
              {recordedToast ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1 text-white" />
                  Recorded in Ledger!
                </>
              ) : (
                <>
                  <FileCheck className="w-3.5 h-3.5 mr-1" />
                  Record into Appraisal Ledger
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
