import React, { useState } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  FileSpreadsheet, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  Users, 
  Layers, 
  Activity, 
  ExternalLink, 
  Sparkles, 
  BarChart3, 
  CheckCircle2 
} from 'lucide-react';
import { TabType } from '../../../components/layout/Sidebar';
import { LandingGlowCard, LandingIconTile, LandingGlowAccent } from '../../../components/ui/Card';

interface CoreFeatureMatrixProps {
  onOpenApp: (tab: TabType) => void;
}

interface FeaturePillar {
  id: string;
  tab: TabType;
  pillarTag: string;
  title: string;
  subtitle: string;
  icon: any;
  accentColor: string;
  glowAccent: LandingGlowAccent;
  badge: string;
  capabilities: string[];
  metricsPreview: { label: string; value: string }[];
  codeOrArchitectureNote: string;
}

const PILLARS: FeaturePillar[] = [
  {
    id: 'pillar-a',
    tab: 'predictor',
    pillarTag: 'Pillar A',
    title: 'Real-Time Appraisal Forecaster',
    subtitle: 'Sub-15ms ML-driven appraisal inference with real-time SHAP feature attribution and interactive parameter sensitivity testing.',
    icon: Calculator,
    accentColor: 'from-emerald-500 to-teal-500',
    glowAccent: 'emerald',
    badge: 'Gradient Boosting Engine',
    capabilities: [
      'Dual-model inference comparing non-linear Gradient Boosting vs. Ordinary Least Squares baseline',
      'Real-time Shapley attribution decomposing individual hike contributions (Rating, Experience, Base CTC)',
      'Confidence scoring with automatic fallback to calibrated local heuristics if microservice is offline',
      'Instant candidate approval dispatch to the permanent cryptographic appraisal ledger',
    ],
    metricsPreview: [
      { label: 'Latency SLA', value: '<15ms' },
      { label: 'R² Accuracy', value: '94.9%' },
      { label: 'SHAP Variables', value: '5 Vectors' },
    ],
    codeOrArchitectureNote: 'POST /api/predict → FeatureTransformer → GradientBoostingRegressor → ShapleyExplainer → Response',
  },
  {
    id: 'pillar-b',
    tab: 'bands',
    pillarTag: 'Pillar B',
    title: 'Enterprise Cohorts & Comp Bands',
    subtitle: 'Market percentile benchmarks (P10, P25, P50, P75, P90) mapped across engineering roles to eliminate internal pay compression.',
    icon: TrendingUp,
    accentColor: 'from-teal-500 to-cyan-500',
    glowAccent: 'blue',
    badge: 'Cohort Calibration',
    capabilities: [
      'Dynamic percentile distribution curves across 11 tech roles (SDE, Backend, Mobile, Cloud, Data)',
      'Compression index detector flagging senior ICs lagging below mid-band market standards',
      'Geographic cost-of-living parity ratios across Tier-1 and Tier-2 tech hubs',
      'Interactive cohort filtering by department, tenure bucket, and appraisal rating quartiles',
    ],
    metricsPreview: [
      { label: 'Role Bands', value: '11 Disciplines' },
      { label: 'Percentiles', value: 'P10 — P90' },
      { label: 'Band Overlap', value: 'Guarded' },
    ],
    codeOrArchitectureNote: 'CohortEngine: Band(role, exp) = MedianMarket_CTC * RegionalDeflator * PerformanceScalar',
  },
  {
    id: 'pillar-c',
    tab: 'batch',
    pillarTag: 'Pillar C',
    title: 'High-Throughput Batch Cycles',
    subtitle: 'Process 5,000+ candidate appraisal rosters in seconds with parallelized evaluation and instant budget boundary enforcement.',
    icon: FileSpreadsheet,
    accentColor: 'from-cyan-500 to-blue-500',
    glowAccent: 'amber',
    badge: 'High-Throughput ETL',
    capabilities: [
      'Direct CSV and XLSX roster upload with automatic schema parsing and validation',
      'Parallel vectorized inference processing up to 1,200 employee records per second',
      'Macro budget envelope simulator enforcing exact enterprise bonus & hike pool constraints',
      'Instant bulk export with HRIS-ready payloads for Workday, ADP, and SuccessFactors',
    ],
    metricsPreview: [
      { label: 'Batch Speed', value: '1,200 rows/sec' },
      { label: 'Max Roster', value: '50,000 ICs' },
      { label: 'Format Support', value: 'CSV / Excel' },
    ],
    codeOrArchitectureNote: 'POST /api/batch-predict → WorkerPool(8) → VectorizedTransform → AggregatedBudgetLedger',
  },
  {
    id: 'pillar-d',
    tab: 'telemetry',
    pillarTag: 'Pillar D',
    title: 'Enterprise Governance & Telemetry',
    subtitle: 'Cryptographic audit ledger logging every model decision, operator sign-off, and adverse impact validation event.',
    icon: ShieldCheck,
    accentColor: 'from-emerald-600 to-green-600',
    glowAccent: 'emerald',
    badge: 'Tamper-Evident Ledger',
    capabilities: [
      'SHA-256 hash chaining ensuring zero tampering of historical appraisal decisions',
      'Role-based sign-off authority tracking (Lead HR Analyst, Comp VP, Engineering Director)',
      'Automated EEOC Four-Fifths compliance auditing across gender, tenure, and location',
      'Real-time telemetry event stream tracking model drift, API latencies, and parameter deviations',
    ],
    metricsPreview: [
      { label: 'Hash Standard', value: 'SHA-256' },
      { label: 'Audit Retention', value: '7 Years' },
      { label: 'Compliance', value: 'EEOC / GDPR' },
    ],
    codeOrArchitectureNote: 'AuditChain: Block(N) = SHA256(Block(N-1) + DecisionPayload + SignOffKey + Timestamp)',
  },
];

export const CoreFeatureMatrix: React.FC<CoreFeatureMatrixProps> = ({ onOpenApp }) => {
  const [selectedPillar, setSelectedPillar] = useState<string>('pillar-a');

  const current = PILLARS.find((p) => p.id === selectedPillar) || PILLARS[0];
  const Icon = current.icon;

  return (
    <section id="features" className="relative py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider border border-emerald-500/30">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          Core Platform Architecture
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          The Four Pillars of Precision Comp
        </h2>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Each pillar corresponds directly to an active production module in the AURA platform, purpose-built for enterprise scale and mathematical accountability.
        </p>
      </div>

      {/* Pillar Selector Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {PILLARS.map((pillar) => {
          const PIcon = pillar.icon;
          const isSelected = selectedPillar === pillar.id;
          return (
            <LandingGlowCard
              key={pillar.id}
              accent={pillar.glowAccent}
              selected={isSelected}
              interactive
              onClick={() => setSelectedPillar(pillar.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedPillar(pillar.id);
                }
              }}
              aria-pressed={isSelected}
              className="p-5 sm:p-6 text-left flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <LandingIconTile accent={pillar.glowAccent}>
                    <PIcon className="w-5 h-5 text-white" />
                  </LandingIconTile>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--card-accent-badge-bg)] text-[var(--card-accent-badge-text)] border border-[var(--card-accent-badge-border)]">
                    {pillar.pillarTag}
                  </span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-white leading-snug mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs text-zinc-300 dark:text-zinc-300 line-clamp-3 leading-relaxed">
                  {pillar.subtitle}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold">
                <span className="text-[11px] font-mono text-zinc-400">{pillar.badge}</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--card-accent-text)] group-hover:translate-x-0.5 transition-transform">
                  Inspect <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </LandingGlowCard>
          );
        })}
      </div>

      {/* Selected Pillar Deep-Dive Showcase Box */}
      <div className="glass-card-ios rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Details */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl bg-gradient-to-tr ${current.accentColor} text-white shadow-md`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                    {current.pillarTag} Specification
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 font-mono text-zinc-600 dark:text-zinc-400">
                    Live in v2.4
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
                  {current.title}
                </h3>
              </div>
            </div>

            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {current.subtitle}
            </p>

            {/* Capabilities list */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 block">
                Platform Capabilities:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {current.capabilities.map((cap, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Launch Action */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenApp(current.tab)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
              >
                <span>Launch {current.pillarTag} Module</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                Direct route to <span className="font-bold text-zinc-700 dark:text-zinc-200">/{current.tab}</span> in workspace
              </span>
            </div>

          </div>

          {/* Right Metrics & Architecture Snippet */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* 3 Metrics Cards */}
            <div className="grid grid-cols-3 gap-3">
              {current.metricsPreview.map((m, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 text-center">
                  <span className="text-[10px] font-mono text-zinc-400 block uppercase mb-1">
                    {m.label}
                  </span>
                  <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Architecture / Pipeline Execution Box */}
            <div className="rounded-2xl bg-zinc-950 p-4 border border-zinc-800 text-left font-mono space-y-2">
              <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-zinc-800 pb-2">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Architecture Pipeline Trace
                </span>
                <span className="text-zinc-500">v2.4.0-prod</span>
              </div>
              <p className="text-xs text-zinc-300 break-all leading-relaxed pt-1">
                {current.codeOrArchitectureNote}
              </p>
              <div className="pt-2 flex justify-between items-center text-[10px] text-zinc-500">
                <span>Security: Enterprise Audit Guard</span>
                <span>Verification: 200 OK</span>
              </div>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
};