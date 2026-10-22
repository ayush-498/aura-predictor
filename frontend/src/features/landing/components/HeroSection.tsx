import React from 'react';
import { 
  ArrowRight, 
  Play, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Cpu, 
  TrendingUp, 
  Layers, 
  FileCheck2 
} from 'lucide-react';
import { MiniSimulatorWidget } from './MiniSimulatorWidget';
import { PredictionRequest } from '../../../types';
import { TabType } from '../../../components/layout/Sidebar';

interface HeroSectionProps {
  onOpenAppWithParams: (params: PredictionRequest, targetTab?: TabType) => void;
  onOpenConsultationModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenAppWithParams,
  onOpenConsultationModal,
}) => {
  return (
    <section id="simulator" className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 overflow-hidden">
      
      {/* Decorative ambient background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] overflow-hidden -z-10 pointer-events-none opacity-40 dark:opacity-30">
        <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] rounded-full bg-emerald-500/25 blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-teal-500/25 blur-[110px]" />
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-cyan-500/20 blur-[130px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Split Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Value Prop, Headline, Subtitle, CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
            
            {/* Version & Compliance Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold backdrop-blur-sm animate-fadeIn">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>AURA 2.4 Enterprise Release</span>
              <span className="w-1 h-1 rounded-full bg-emerald-500/40"></span>
              <span className="font-mono text-[11px] font-bold">Audit-Ready Compliant</span>
            </div>

            {/* Main Value Prop Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
                Precision{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500">
                  Compensation
                </span>{' '}
                Engineering.
              </h1>
              <p className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-700 dark:text-zinc-300">
                Replace spreadsheet chaos with explainable AI fairness.
              </p>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
              AURA unites high-throughput Gradient Boosting ensembles, market percentile compression curves, and immutable audit telemetry to engineer mathematically sound, bias-audited appraisal cycles in hours—not months.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => {
                  const element = document.getElementById('simulator');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/35 transition-all duration-200 active:scale-95"
              >
                <span>Test Drive Simulator</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenConsultationModal}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm text-zinc-800 dark:text-zinc-200 bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-800/80 dark:hover:bg-zinc-700/80 border border-zinc-200 dark:border-zinc-700 transition-all duration-200 active:scale-95"
              >
                <Cpu className="w-4 h-4 text-emerald-500" />
                <span>Enterprise Architecture Briefing</span>
              </button>
            </div>

            {/* Trust Micro-Indicators */}
            <div className="pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 grid grid-cols-3 gap-4 max-w-xl">
              <div>
                <span className="block text-xl sm:text-2xl font-mono font-extrabold text-zinc-900 dark:text-zinc-100">
                  22,700+
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Records Calibrated
                </span>
              </div>

              <div>
                <span className="block text-xl sm:text-2xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                  &lt;15ms
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Inference Latency
                </span>
              </div>

              <div>
                <span className="block text-xl sm:text-2xl font-mono font-extrabold text-zinc-900 dark:text-zinc-100">
                  94.9%
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Model R² Accuracy
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Mini-Simulator Widget */}
          <div className="lg:col-span-5">
            <MiniSimulatorWidget onOpenAppWithParams={onOpenAppWithParams} />
          </div>

        </div>

      </div>
    </section>
  );
};