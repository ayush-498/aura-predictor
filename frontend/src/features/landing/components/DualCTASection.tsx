import React from 'react';
import { 
  Calculator, 
  Cpu, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Lock 
} from 'lucide-react';
import { TabType } from '../../../components/layout/Sidebar';
import { LandingGlowCard, LandingIconTile } from '../../../components/ui/Card';

interface DualCTASectionProps {
  onOpenApp: (tab?: TabType) => void;
  onOpenConsultationModal: () => void;
}

export const DualCTASection: React.FC<DualCTASectionProps> = ({
  onOpenApp,
  onOpenConsultationModal,
}) => {
  return (
    <section className="relative py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-64 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Grid of Dual CTAs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        
        {/* Card 1: Immediate Test Drive (Practitioners / HR Analysts) */}
        <LandingGlowCard accent="emerald" className="p-8 sm:p-10 flex flex-col justify-between group">
          <div className="space-y-6">
            
            <div className="flex items-center justify-between">
              <LandingIconTile accent="emerald">
                <Calculator className="w-6 h-6 text-white" />
              </LandingIconTile>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[var(--card-accent-badge-bg)] text-[var(--card-accent-badge-text)] border border-[var(--card-accent-badge-border)]">
                Instant Sandbox
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Test Drive the Live Simulator
              </h3>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                Experience sub-15ms Gradient Boosting predictions with live SHAP attribution, candidate cohort modeling, and cryptographic audit signing.
              </p>
            </div>

            <ul className="space-y-3 pt-2">
              <li className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-[var(--card-accent-text)] shrink-0" />
                <span>Zero registration required · 100% Client-Side Sandbox</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-[var(--card-accent-text)] shrink-0" />
                <span>Dual inference comparing Gradient Boosting vs OLS</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-[var(--card-accent-text)] shrink-0" />
                <span>Access all 4 pillars and telemetry log stream</span>
              </li>
            </ul>

          </div>

          <div className="pt-8">
            <button
              onClick={() => onOpenApp('predictor')}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/30 transition-all duration-200 active:scale-98 cursor-pointer"
            >
              <span>Launch Live Simulator & Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="block text-center text-[11px] font-mono text-zinc-400 mt-2">
              Instant access to active development environment
            </span>
          </div>
        </LandingGlowCard>

        {/* Card 2: Enterprise Deployment (Leadership / Security / Comp VP) */}
        <LandingGlowCard accent="blue" className="p-8 sm:p-10 text-white flex flex-col justify-between group">
          <div className="space-y-6">
            
            <div className="flex items-center justify-between">
              <LandingIconTile accent="blue">
                <Building2 className="w-6 h-6 text-white" />
              </LandingIconTile>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[var(--card-accent-badge-bg)] text-[var(--card-accent-badge-text)] border border-[var(--card-accent-badge-border)]">
                Enterprise Dedicated
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Enterprise Deployment & Briefing
              </h3>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                Deploy AURA in your dedicated private cloud tenant (AWS, GCP, Azure). Fine-tune algorithms on your historical compensation records with custom HRIS webhooks.
              </p>
            </div>

            <ul className="space-y-3 pt-2">
              <li className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-[var(--card-accent-text)] shrink-0" />
                <span>Private VPC / On-Premise Single-Tenant Isolated Cluster</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-[var(--card-accent-text)] shrink-0" />
                <span>SAML 2.0 / Okta SSO & Custom Role Sign-off Policies</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-[var(--card-accent-text)] shrink-0" />
                <span>Custom Machine Learning Tuning on 3-5 Year Internal Data</span>
              </li>
            </ul>

          </div>

          <div className="pt-8">
            <button
              onClick={onOpenConsultationModal}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl text-sm font-bold text-zinc-950 bg-white hover:bg-zinc-100 shadow-lg shadow-white/10 transition-all duration-200 active:scale-98 cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-emerald-600" />
              <span>Schedule Architecture Briefing</span>
            </button>
            <span className="block text-center text-[11px] font-mono text-zinc-400 mt-2">
              Includes SOC-2 security packet and legal compliance memo
            </span>
          </div>
        </LandingGlowCard>

      </div>

    </section>
  );
};