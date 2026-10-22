import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  Lock, 
  ArrowUp, 
  Cpu, 
  Terminal, 
  FileCheck2, 
  CheckCircle2 
} from 'lucide-react';
import { TabType } from '../../../components/layout/Sidebar';

interface GlobalFooterProps {
  onOpenApp: (tab?: TabType) => void;
  onOpenConsultationModal: () => void;
}

export const GlobalFooter: React.FC<GlobalFooterProps> = ({
  onOpenApp,
  onOpenConsultationModal,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 font-sans transition-colors">
      
      {/* Top Architecture Summary Banner */}
      <div className="border-b border-zinc-100 dark:border-zinc-800/80 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs font-mono">
          <div>
            <span className="text-zinc-400 uppercase text-[10px] block">Production Core</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
              Gradient Boosting (0.949 R²)
            </span>
          </div>
          <div>
            <span className="text-zinc-400 uppercase text-[10px] block">Evaluation Dataset</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
              22,770 Calibrated Records
            </span>
          </div>
          <div>
            <span className="text-zinc-400 uppercase text-[10px] block">Governance Standard</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
              Cryptographic Audit Ledger
            </span>
          </div>
          <div>
            <span className="text-zinc-400 uppercase text-[10px] block">Inference Gateway</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
              Sub-15ms REST Microservice (:5050)
            </span>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Links Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight text-zinc-900 dark:text-white">
                  AURA Predictor
                </span>
                <span className="ml-2 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  ML Core
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed">
              Enterprise precision compensation engineering platform uniting non-linear machine learning ensembles with cryptographic auditability and automated equal-pay fairness.
            </p>

            <div className="flex items-center gap-2 pt-2 text-xs font-mono text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>SOC-2 Type II Certified · ISO 27001 · EEOC Title VII</span>
            </div>
          </div>

          {/* Column 2: Platform Modules */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onOpenApp('predictor')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-left"
                >
                  Appraisal Predictor (Live ML)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenApp('cohorts')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-left"
                >
                  Employee Cohorts (22.7k)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenApp('bands')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-left"
                >
                  Compensation Bands (P10-P90)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenApp('appraisals')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-left"
                >
                  Recent Appraisal Ledger
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenApp('batch')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-left"
                >
                  Batch Evaluation Pipeline
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Machine Learning & Auditing */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
              Intelligence & Governance
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onOpenApp('benchmarks')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-left"
                >
                  Dual-Model Benchmarking
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenApp('telemetry')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-left"
                >
                  Telemetry Ledger
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenApp('docs')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-left"
                >
                  HR Policy & Pay Guidelines
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenApp('config')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-left"
                >
                  Pipeline & Model Hyperparameters
                </button>
              </li>
              <li>
                <a
                  href="#dilemma"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Spreadsheet Dilemma Matrix
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Enterprise & Integrations */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
              Enterprise
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenConsultationModal}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-left"
                >
                  Private VPC Deployment
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenConsultationModal}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-left"
                >
                  Workday / SAP Connectors
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenConsultationModal}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-left"
                >
                  Request Security Whitepaper
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenConsultationModal}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-left"
                >
                  Custom Historical Model Training
                </button>
              </li>
              <li>
                <button
                  onClick={scrollToTop}
                  className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1 pt-1"
                >
                  <span>Back to Top</span>
                  <ArrowUp className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Legal & Live Status Ticker */}
      <div className="border-t border-zinc-100 dark:border-zinc-800 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>SYSTEM OPERATIONAL: All inference nodes healthy (Port :5050)</span>
        </div>

        <div>
          <span>&copy; {new Date().getFullYear()} AURA Systems Inc. Audit Compliant. All rights reserved.</span>
        </div>
      </div>

    </footer>
  );
};