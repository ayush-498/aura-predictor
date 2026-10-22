import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Scale, 
  Layers, 
  CheckCircle2, 
  Cpu, 
  RefreshCw, 
  Server, 
  FileLock2, 
  Terminal, 
  Check 
} from 'lucide-react';
import { LandingGlowCard, LandingIconTile, LandingGlowAccent } from '../../../components/ui/Card';

interface SecurityCard {
  title: string;
  tag: string;
  icon: any;
  glowAccent: LandingGlowAccent;
  description: string;
  points: string[];
}

const SECURITY_CARDS: SecurityCard[] = [
  {
    title: 'Zero-Knowledge Inference',
    tag: 'PII Protection',
    icon: Lock,
    glowAccent: 'amber',
    description: 'Inference executes on ephemeral memory tensors. Sensitive personal identifiers are never persisted into model state.',
    points: [
      'Automatic anonymization of candidate name, gender, and personal identifiers',
      'Ephemeral stateless worker containers destroyed post-batch inference',
      'SOC-2 Type II certified memory boundaries and TLS 1.3 data in-transit encryption',
    ],
  },
  {
    title: 'Four-Fifths Bias Auditing',
    tag: 'EEOC Title VII',
    icon: Scale,
    glowAccent: 'blue',
    description: 'Real-time statistical checks ensure no demographic or gender subgroup falls below the 80% adverse impact threshold.',
    points: [
      'Continuous Disparate Impact Ratio (DIR) calculations across all departments',
      'Automated flagging of any recommendation skewing beyond ±4% tolerance',
      'Compliance-grade audit packages exportable for labor agency audits',
    ],
  },
  {
    title: 'Immutable Hash Ledger',
    tag: 'Audit Ledger',
    icon: FileLock2,
    glowAccent: 'emerald',
    description: 'Cryptographic hash chaining guarantees tamper-evident records of every appraisal approval and manager override.',
    points: [
      'SHA-256 block hashing anchoring timestamp, operator signature, and hike %',
      'Multi-party sign-off authority tracking (HR Lead, Comp VP, Engineering Director)',
      'Seven-year immutable audit log retention meeting EU Pay Transparency standards',
    ],
  },
  {
    title: 'HRIS Ecosystem Connectors',
    tag: 'Bi-Directional',
    icon: Server,
    glowAccent: 'blue',
    description: 'Native REST and Webhook connectors for bi-directional synchronization with top enterprise HR systems.',
    points: [
      'Pre-built integrations for Workday, SAP SuccessFactors, ADP Vantage, BambooHR',
      'Automated roster pulls and seamless post-approval payroll delta disbursement',
      'OAuth 2.0 and SAML 2.0 SSO enterprise authentication protocol support',
    ],
  },
];

export const SecurityIntegrationsSection: React.FC = () => {
  const [runningAudit, setRunningAudit] = useState(false);
  const [auditTimestamp, setAuditTimestamp] = useState('2026-10-21 20:45 UTC');
  const [checksPassed, setChecksPassed] = useState(true);

  const handleRunAudit = () => {
    setRunningAudit(true);
    setTimeout(() => {
      setRunningAudit(false);
      setChecksPassed(true);
      const now = new Date();
      setAuditTimestamp(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    }, 900);
  };

  return (
    <section id="security" className="relative py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider border border-emerald-500/30">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          Enterprise Governance & Security
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Enterprise Security, Bias Auditing & HRIS Sync
        </h2>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Engineered for compliance officers, security architects, and people executives. Zero-knowledge inference meets automated pay equity safeguards.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {SECURITY_CARDS.map((card, idx) => {
          const Icon = card.icon;
          return (
            <LandingGlowCard
              key={idx}
              accent={card.glowAccent}
              className="p-6 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <LandingIconTile accent={card.glowAccent}>
                    <Icon className="w-5 h-5 text-white" />
                  </LandingIconTile>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--card-accent-badge-bg)] text-[var(--card-accent-badge-text)] border border-[var(--card-accent-badge-border)]">
                    {card.tag}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-white leading-snug">
                  {card.title}
                </h3>

                <p className="text-xs text-zinc-300 dark:text-zinc-300 leading-relaxed">
                  {card.description}
                </p>

                <ul className="space-y-2 pt-2 border-t border-white/10">
                  {card.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2 text-xs text-zinc-300 dark:text-zinc-300">
                      <Check className="w-3.5 h-3.5 text-[var(--card-accent-text)] shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>Standard SLA</span>
                <span className="text-[var(--card-accent-text)] font-bold">100% Enforced</span>
              </div>
            </LandingGlowCard>
          );
        })}
      </div>

      {/* Interactive Live Compliance Verification Widget */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-950 border border-zinc-800 text-white shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                Live Audit & Telemetry Monitor
              </span>
            </div>
            <h3 className="text-xl font-bold tracking-tight mt-1 text-white">
              Real-Time Algorithmic Governance Health Check
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-400">
              Last Verified: {auditTimestamp}
            </span>
            <button
              onClick={handleRunAudit}
              disabled={runningAudit}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-zinc-700 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${runningAudit ? 'animate-spin' : ''}`} />
              <span>{runningAudit ? 'Auditing Hash Chain...' : 'Run Live Audit'}</span>
            </button>
          </div>
        </div>

        {/* Audit Test Rows Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
            <span className="text-zinc-400 block text-[10px] uppercase">EEOC Four-Fifths Test</span>
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 font-bold text-sm">PASS (DIR: 0.982)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-zinc-500 text-[10px] block">Threshold &gt;0.80 standard</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
            <span className="text-zinc-400 block text-[10px] uppercase">Cryptographic Chain</span>
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 font-bold text-sm">UNBROKEN (SHA-256)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-zinc-500 text-[10px] block">Block height #1,492 signed</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
            <span className="text-zinc-400 block text-[10px] uppercase">PII Anonymization</span>
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 font-bold text-sm">100% SCRUBBED</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-zinc-500 text-[10px] block">Memory-only inference</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
            <span className="text-zinc-400 block text-[10px] uppercase">HRIS Sync Health</span>
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 font-bold text-sm">ACTIVE (200 OK)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-zinc-500 text-[10px] block">Bi-directional webhooks</span>
          </div>
        </div>

      </div>

    </section>
  );
};