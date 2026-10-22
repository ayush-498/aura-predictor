import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  TrendingDown, 
  TrendingUp, 
  Clock, 
  Scale, 
  ShieldAlert, 
  FileSpreadsheet, 
  Cpu, 
  ArrowRight 
} from 'lucide-react';
import { LandingGlowCard, LandingIconTile, LandingGlowAccent } from '../../../components/ui/Card';

interface DilemmaVector {
  id: string;
  title: string;
  icon: any;
  glowAccent: LandingGlowAccent;
  metricChaos: string;
  metricFair: string;
  chaosTitle: string;
  chaosPoints: string[];
  fairTitle: string;
  fairPoints: string[];
}

const DILEMMA_VECTORS: DilemmaVector[] = [
  {
    id: 'velocity',
    title: 'Cycle Velocity & Latency',
    icon: Clock,
    glowAccent: 'amber',
    metricChaos: '8.4 Weeks Average',
    metricFair: '48 Hours End-to-End',
    chaosTitle: 'The Spreadsheet Quagmire',
    chaosPoints: [
      'Hundreds of disconnected .xlsx files emailed across department leads',
      'Corrupted macro formulas, broken cell linkages, and missing row references',
      'Endless subjective calibration meetings draining 400+ manager hours',
    ],
    fairTitle: 'AURA Algorithmic Velocity',
    fairPoints: [
      'High-throughput parallel inference across 5,000+ candidates in <10 seconds',
      'Unified single source of truth connected via secure bi-directional HRIS APIs',
      'Instant consensus recommendations reducing cycle overhead by 88%',
    ],
  },
  {
    id: 'budget',
    title: 'Budget Allocation & Leakage',
    icon: TrendingDown,
    glowAccent: 'blue',
    metricChaos: '14.2% Budget Leakage',
    metricFair: '0% Uncontrolled Drift',
    chaosTitle: 'Uncontrolled Budget Slippage',
    chaosPoints: [
      'Loudest managers secure disproportionate allocation for favored reports',
      'High-performing quiet talent under-compensated, leading to top-quartile attrition',
      'Uncalibrated mid-cycle corrections causing severe fiscal overrun',
    ],
    fairTitle: 'Optimal Budget Frontier',
    fairPoints: [
      'Mathematical cohort optimization balancing retention value with fiscal cap',
      'Dynamic compression curve adjustment based on market benchmark percentiles',
      'Guaranteed adherence to overall compensation envelopes without manual overrides',
    ],
  },
  {
    id: 'parity',
    title: 'Pay Parity & Bias Mitigation',
    icon: Scale,
    glowAccent: 'emerald',
    metricChaos: 'Unmonitored Disparity Risk',
    metricFair: 'Zero Disparate Impact (4/5ths Rule)',
    chaosTitle: 'Subjective Cognitive Bias',
    chaosPoints: [
      'Implicit bias in subjective peer appraisals and historical compensation anchors',
      'Undetected gender and demographic compensation gaps widening year-over-year',
      'Lack of quantifiable explainability when justifying appraisal numbers to teams',
    ],
    fairTitle: 'Mathematically Audited Equity',
    fairPoints: [
      'Models trained strictly on scrubbed merit factors (rating, experience, role scarcity)',
      'Automated EEOC disparate impact monitoring flagging any cohort deviation >4%',
      'Shapley feature attribution explaining every increment with mathematical proof',
    ],
  },
  {
    id: 'audit',
    title: 'Governance & Audit Readiness',
    icon: ShieldAlert,
    glowAccent: 'amber',
    metricChaos: 'Zero Tamper Evidence',
    metricFair: 'Cryptographic Audit Ledger',
    chaosTitle: 'Vulnerable Paper Trails',
    chaosPoints: [
      'Untracked manual changes in spreadsheet cells with no audit log',
      'Severe regulatory risk under modern EU Pay Transparency and US Pay Equity laws',
      'Impossible to reconstruct why an employee was granted or denied an appraisal',
    ],
    fairTitle: 'Cryptographic Provenance',
    fairPoints: [
      'Immutable telemetry logging each decision with a timestamp and hash',
      'Role-based sign-off workflow with cryptographically sealed analyst approvals',
      '1-click export of compliance-grade documentation for external labor auditors',
    ],
  },
];

export const CompensationDilemma: React.FC = () => {
  const [activeVector, setActiveVector] = useState<string>('velocity');

  const selected = DILEMMA_VECTORS.find((v) => v.id === activeVector) || DILEMMA_VECTORS[0];

  return (
    <section id="dilemma" className="relative py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-mono font-bold uppercase tracking-wider border border-amber-500/30">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          The Compensation Dilemma
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Spreadsheet Chaos vs. Algorithmic Fair-Pay
        </h2>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Traditional compensation reviews rely on static spreadsheets, subjective manager bargaining, and hidden bias. AURA replaces manual friction with auditable algorithmic precision.
        </p>
      </div>

      {/* Vector Navigation Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {DILEMMA_VECTORS.map((vector) => {
          const Icon = vector.icon;
          const isActive = activeVector === vector.id;
          return (
            <LandingGlowCard
              key={vector.id}
              accent={vector.glowAccent}
              selected={isActive}
              interactive
              onClick={() => setActiveVector(vector.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveVector(vector.id);
                }
              }}
              aria-pressed={isActive}
              className="p-4 sm:p-5 text-left flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-3">
                <LandingIconTile accent={vector.glowAccent}>
                  <Icon className="w-4 h-4 text-white" />
                </LandingIconTile>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--card-accent-badge-bg)] text-[var(--card-accent-badge-text)] border border-[var(--card-accent-badge-border)]">
                  {vector.id}
                </span>
              </div>
              <span className="block text-xs sm:text-sm font-bold text-white truncate">
                {vector.title}
              </span>
            </LandingGlowCard>
          );
        })}
      </div>

      {/* Side-by-Side Detailed Dilemma Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* Left Card: Spreadsheet Chaos (The Old Way) */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-red-500/10 via-white/50 to-amber-500/10 dark:from-red-950/25 dark:via-zinc-950/45 dark:to-zinc-950/45 backdrop-blur-2xl border border-red-500/30 dark:border-red-900/40 shadow-xl flex flex-col justify-between">
          <div className="space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-red-200/60 dark:border-red-900/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                    Legacy Model
                  </span>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                    {selected.chaosTitle}
                  </h3>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-zinc-400 block uppercase">Exposure</span>
                <span className="text-sm font-mono font-bold text-red-600 dark:text-red-400">
                  {selected.metricChaos}
                </span>
              </div>
            </div>

            <ul className="space-y-4">
              {selected.chaosPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span className="leading-snug">{point}</span>
                </li>
              ))}
            </ul>

          </div>

          <div className="mt-8 pt-4 border-t border-red-200/40 dark:border-red-950/60 flex items-center justify-between text-xs font-mono text-red-700 dark:text-red-400 bg-red-50/50 dark:bg-red-950/30 p-3 rounded-xl">
            <span className="flex items-center gap-1.5 font-bold">
              <AlertTriangle className="w-4 h-4 text-red-500" /> Vulnerability Assessment: High Risk
            </span>
            <span>Fragile Architecture</span>
          </div>
        </div>

        {/* Right Card: AURA Algorithmic Fairness (The Modern Way) */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-500/10 via-white/50 to-teal-500/10 dark:from-emerald-950/30 dark:via-zinc-950/45 dark:to-teal-950/30 backdrop-blur-2xl border border-emerald-500/40 dark:border-emerald-500/30 shadow-xl flex flex-col justify-between">
          <div className="space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-emerald-200/60 dark:border-emerald-900/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    AURA Engine
                  </span>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                    {selected.fairTitle}
                  </h3>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-zinc-400 block uppercase">Benchmark</span>
                <span className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {selected.metricFair}
                </span>
              </div>
            </div>

            <ul className="space-y-4">
              {selected.fairPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-snug">{point}</span>
                </li>
              ))}
            </ul>

          </div>

          <div className="mt-8 pt-4 border-t border-emerald-200/40 dark:border-emerald-950/60 flex items-center justify-between text-xs font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/40 p-3 rounded-xl">
            <span className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Calibrated & Audited: Enterprise Standard
            </span>
            <span>Sub-15ms Latency</span>
          </div>
        </div>

      </div>

    </section>
  );
};