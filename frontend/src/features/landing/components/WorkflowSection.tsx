import React, { useState } from 'react';
import { 
  Database, 
  Cpu, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Terminal, 
  FileCheck2, 
  GitBranch, 
  Layers, 
  Sparkles, 
  Check 
} from 'lucide-react';
import { TabType } from '../../../components/layout/Sidebar';
import { LandingGlowCard, LandingIconTile, LandingGlowAccent } from '../../../components/ui/Card';

interface WorkflowSectionProps {
  onOpenApp: (tab: TabType) => void;
}

interface WorkflowStep {
  stepNumber: string;
  title: string;
  tagline: string;
  icon: any;
  targetTab: TabType;
  description: string;
  substeps: string[];
  consoleTitle: string;
  consoleLines: { text: string; status?: 'info' | 'success' | 'warn' }[];
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    stepNumber: '01',
    title: 'Ingest & Normalize',
    tagline: 'Automated HRIS Roster Synchronization & Scrubbing',
    icon: Database,
    targetTab: 'batch',
    description: 'Seamlessly pull candidate records via native HRIS webhooks (Workday, ADP, BambooHR) or drop bulk CSV/XLSX rosters. Sensitive PII is securely tokenized, and performance attributes are standardized.',
    substeps: [
      'Tokenize personal PII, retaining only merit-based features',
      'Normalize performance ratings across differing 1-5, 1-7, and percent scales',
      'Map job family taxonomies to 11 standardized engineering disciplines',
      'Validate dataset integrity against historical compensation bands',
    ],
    consoleTitle: 'pipeline/stage-1-ingest.log',
    consoleLines: [
      { text: '[INGEST] Connected to Workday API v41.0 endpoint /workers', status: 'info' },
      { text: '[SANITIZE] Tokenized 1,480 employee records; PII hashed SHA-256', status: 'success' },
      { text: '[MAPPER] Role family normalized: 100% matched to valid taxonomy', status: 'success' },
      { text: '[READY] 1,480 candidate tensors staged for inference pool', status: 'info' },
    ],
  },
  {
    stepNumber: '02',
    title: 'Infer & Calibrate',
    tagline: 'High-Throughput Ensemble Scoring & Budget Optimization',
    icon: Cpu,
    targetTab: 'predictor',
    description: 'The Gradient Boosting engine executes sub-15ms inference against each candidate profile. Macro budget optimization curves ensure the total appraisal envelope remains mathematically capped without manual guesswork.',
    substeps: [
      'Dual inference: Gradient Boosting Regressor + OLS baseline cross-check',
      'Compute Shapley attribution vectors for every proposed increment',
      'Apply macro budget optimization frontier to enforce department fiscal limits',
      'Detect compression anomalies and flag outliers for human review',
    ],
    consoleTitle: 'pipeline/stage-2-inference.log',
    consoleLines: [
      { text: '[INFER] Executing GradientBoostingRegressor batch (1,480 records)', status: 'info' },
      { text: '[BENCH] Mean inference latency: 11.2ms | R² confidence: 0.949', status: 'success' },
      { text: '[BUDGET] Optimization frontier aligned: total hike variance 0.00%', status: 'success' },
      { text: '[SHAP] Feature attribution vectors computed for 1,480 candidates', status: 'info' },
    ],
  },
  {
    stepNumber: '03',
    title: 'Audit & Disburse',
    tagline: 'Cryptographic Ledger Sign-Off & Payroll Export',
    icon: ShieldCheck,
    targetTab: 'telemetry',
    description: 'The proposed cycle is validated against EEOC Four-Fifths pay equity standards. Once approved by the authorized Comp Analyst, the cycle is cryptographically sealed into the cryptographic ledger and exported to ERP.',
    substeps: [
      'Automated Four-Fifths Adverse Impact verification (<0.04% cohort variance)',
      'Lead Analyst cryptographic sign-off with audit auth stamp',
      'Append permanent tamper-evident block into SHA-256 ledger chain',
      'Export HRIS-ready payloads directly into payroll disbursement queues',
    ],
    consoleTitle: 'pipeline/stage-3-audit-ledger.log',
    consoleLines: [
      { text: '[AUDIT] EEOC Four-Fifths test PASSED (Disparate Impact Ratio: 0.982)', status: 'success' },
      { text: '[SIGN-OFF] Operator "HR Lead Analyst" signed approval token #AUDIT-9921', status: 'info' },
      { text: '[LEDGER] Block #2026-Q4 committed: Hash 8f3b...e791 verified', status: 'success' },
      { text: '[DISBURSE] Payroll payload dispatched to ADP / SAP SuccessFactors', status: 'success' },
    ],
  },
];

export const WorkflowSection: React.FC<WorkflowSectionProps> = ({ onOpenApp }) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const currentStep = WORKFLOW_STEPS[activeStepIndex];
  const StepIcon = currentStep.icon;

  return (
    <section id="workflow" className="relative py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/10 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400 text-xs font-mono font-bold uppercase tracking-wider border border-teal-500/30">
          <GitBranch className="w-3.5 h-3.5 text-teal-500" />
          The 3-Step Production Pipeline
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          How AURA Works: Ingest → Infer → Audit
        </h2>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          From raw HRIS rosters to cryptographically sealed payroll disbursement in 48 hours. Here is the architectural flow powering modern enterprise compensation.
        </p>
      </div>

      {/* 3 Steps Navigation Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {WORKFLOW_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === activeStepIndex;
          const stepAccents: LandingGlowAccent[] = ['amber', 'blue', 'emerald'];
          const accent = stepAccents[idx % stepAccents.length];

          return (
            <LandingGlowCard
              key={step.stepNumber}
              accent={accent}
              selected={isActive}
              interactive
              onClick={() => setActiveStepIndex(idx)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveStepIndex(idx);
                }
              }}
              aria-pressed={isActive}
              className="p-6 text-left flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <LandingIconTile accent={accent}>
                    <Icon className="w-5 h-5 text-white" />
                  </LandingIconTile>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[var(--card-accent-badge-bg)] text-[var(--card-accent-badge-text)] border border-[var(--card-accent-badge-border)]">
                    Step {step.stepNumber}
                  </span>
                </div>
                <h3 className="font-bold text-lg sm:text-xl text-white mb-2 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 dark:text-zinc-300 leading-relaxed line-clamp-3">
                  {step.tagline}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold">
                <span className="text-zinc-400 font-mono text-[11px]">Pipeline Stage {step.stepNumber}/03</span>
                <span className="inline-flex items-center gap-1.5 font-bold text-xs text-[var(--card-accent-text)] group-hover:translate-x-0.5 transition-transform">
                  Inspect <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </LandingGlowCard>
          );
        })}
      </div>

      {/* Selected Step Deep Dive Card */}
      <div className="glass-card-ios rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md">
                <StepIcon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">
                  Step {currentStep.stepNumber} Architectural Specification
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
                  {currentStep.title}
                </h3>
              </div>
            </div>

            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {currentStep.description}
            </p>

            {/* Sub-steps */}
            <div className="space-y-2.5">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 block">
                Execution Steps:
              </span>
              <div className="space-y-2">
                {currentStep.substeps.map((sub, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{sub}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Launch Module CTA */}
            <div className="pt-3">
              <button
                onClick={() => onOpenApp(currentStep.targetTab)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <span>Test Step {currentStep.stepNumber} in Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Right Live Simulated Console Output */}
          <div className="lg:col-span-5 rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden shadow-2xl font-mono text-xs">
            
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 text-zinc-400">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className="text-[11px] text-zinc-300 ml-2 font-bold">{currentStep.consoleTitle}</span>
              </div>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Live Stream
              </span>
            </div>

            {/* Terminal Body */}
            <div className="p-4 space-y-2.5 text-left text-[11px] leading-relaxed">
              {currentStep.consoleLines.map((line, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-zinc-600 select-none">&gt;</span>
                  <span
                    className={
                      line.status === 'success'
                        ? 'text-emerald-400 font-semibold'
                        : line.status === 'warn'
                        ? 'text-amber-400'
                        : 'text-zinc-300'
                    }
                  >
                    {line.text}
                  </span>
                </div>
              ))}
              <div className="pt-2 border-t border-zinc-800 text-zinc-500 text-[10px] flex justify-between">
                <span>Exit code: 0 (SUCCESS)</span>
                <span>Audit Stamp: VALID</span>
              </div>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
};