import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Zap, 
  Database, 
  Lock, 
  Cpu, 
  Activity, 
  Scale 
} from 'lucide-react';
import { LandingGlowCard, LandingIconTile } from '../../../components/ui/Card';

const ECOSYSTEM_PARTNERS = [
  { name: 'Workday Human Capital', category: 'HRIS Integration' },
  { name: 'SAP SuccessFactors', category: 'Enterprise ERP' },
  { name: 'ADP Vantage HCM', category: 'Payroll Sync' },
  { name: 'BambooHR', category: 'Fast API Webhook' },
  { name: 'Oracle Cloud HCM', category: 'Global Core HR' },
  { name: 'Rippling', category: 'Instant Roster Sync' },
  { name: 'Greenhouse', category: 'Offer Benchmarking' },
];

export const TrustValidationStrip: React.FC = () => {
  return (
    <section className="relative py-12 border-y border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/40 backdrop-blur-md overflow-hidden">
      
      {/* Decorative gradient accents */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-teal-500/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Strip Header / Trust Proof Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <LandingGlowCard accent="emerald" className="p-4 sm:p-5 flex items-start gap-3.5 group">
            <LandingIconTile accent="emerald">
              <Database className="w-5 h-5 text-white" />
            </LandingIconTile>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                22,700+
              </div>
              <div className="text-xs font-semibold text-zinc-200">
                Verified Records
              </div>
              <div className="text-[11px] text-zinc-300 dark:text-zinc-300 mt-0.5">
                Multi-cohort training dataset
              </div>
            </div>
          </LandingGlowCard>

          <LandingGlowCard accent="amber" className="p-4 sm:p-5 flex items-start gap-3.5 group">
            <LandingIconTile accent="amber">
              <Zap className="w-5 h-5 text-white" />
            </LandingIconTile>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[var(--card-accent-text)]">
                Sub-15ms
              </div>
              <div className="text-xs font-semibold text-zinc-200">
                Inference Latency
              </div>
              <div className="text-[11px] text-zinc-300 dark:text-zinc-300 mt-0.5">
                Real-time API response SLA
              </div>
            </div>
          </LandingGlowCard>

          <LandingGlowCard accent="blue" className="p-4 sm:p-5 flex items-start gap-3.5 group">
            <LandingIconTile accent="blue">
              <Activity className="w-5 h-5 text-white" />
            </LandingIconTile>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                94.9%
              </div>
              <div className="text-xs font-semibold text-zinc-200">
                Predictive R² Score
              </div>
              <div className="text-[11px] text-zinc-300 dark:text-zinc-300 mt-0.5">
                RMSE 1.42% vs 3.88% OLS
              </div>
            </div>
          </LandingGlowCard>

          <LandingGlowCard accent="emerald" className="p-4 sm:p-5 flex items-start gap-3.5 group">
            <LandingIconTile accent="emerald">
              <Scale className="w-5 h-5 text-white" />
            </LandingIconTile>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                0.00%
              </div>
              <div className="text-xs font-semibold text-zinc-200">
                Adverse Disparity
              </div>
              <div className="text-[11px] text-zinc-300 dark:text-zinc-300 mt-0.5">
                EEOC Four-Fifths compliance
              </div>
            </div>
          </LandingGlowCard>
        </div>

        {/* HRIS Ecosystem Compatibility Strip */}
        <div className="pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 shrink-0">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>Bi-Directional HRIS Adapters:</span>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 sm:gap-3">
            {ECOSYSTEM_PARTNERS.map((partner) => (
              <span
                key={partner.name}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-white dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-300 shadow-2xs hover:border-emerald-500/50 transition-colors"
              >
                {partner.name}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};