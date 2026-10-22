import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Users, 
  ShieldCheck, 
  Calculator, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2 
} from 'lucide-react';
import { LandingGlowCard } from '../../../components/ui/Card';

interface BusinessImpactROIProps {
  onOpenConsultationModal: () => void;
}

export const BusinessImpactROI: React.FC<BusinessImpactROIProps> = ({ onOpenConsultationModal }) => {
  const [headcount, setHeadcount] = useState<number>(1200);
  const [avgSalaryLakhs, setAvgSalaryLakhs] = useState<number>(18); // In Lakhs INR

  const calculation = useMemo(() => {
    const totalPayroll = headcount * (avgSalaryLakhs * 100000);
    // 14.2% average budget leakage in uncalibrated compensation cycles
    const leakagePrevented = totalPayroll * 0.142 * 0.12; // 12% average hike pool * 14.2% leakage saved
    // Manager hours saved: ~0.4 hours per employee spent in calibration meetings
    const hoursSaved = Math.round(headcount * 0.38);
    // Cycle days: reduced from 42 days (6 weeks) down to 2 days
    const daysReduced = 40;

    const formatINR = (val: number) => {
      if (val >= 10000000) {
        return `₹${(val / 10000000).toFixed(2)} Cr`;
      }
      return `₹${(val / 100000).toFixed(1)} Lakhs`;
    };

    return {
      formattedLeakage: formatINR(leakagePrevented),
      hoursSaved,
      daysReduced,
      totalPayrollFormatted: formatINR(totalPayroll),
    };
  }, [headcount, avgSalaryLakhs]);

  return (
    <section id="roi" className="relative py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider border border-emerald-500/30">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          Quantified Business Impact
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Measurable ROI & Cycle Acceleration
        </h2>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          See the tangible financial impact of replacing manual spreadsheet negotiations with algorithmic compensation calibration.
        </p>
      </div>

      {/* Top 4 KPI Proof Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
        <LandingGlowCard accent="emerald" className="p-6">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--card-accent-text)] block mb-1">
            Velocity
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white">
            88%
          </div>
          <p className="text-xs text-white mt-1 font-semibold">
            Cycle Acceleration
          </p>
          <span className="text-[11px] text-zinc-300 dark:text-zinc-300 block mt-0.5">8.4 weeks reduced to 48 hours</span>
        </LandingGlowCard>

        <LandingGlowCard accent="amber" className="p-6">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--card-accent-text)] block mb-1">
            Fiscal Efficiency
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white">
            14.2%
          </div>
          <p className="text-xs text-white mt-1 font-semibold">
            Budget Waste Eliminated
          </p>
          <span className="text-[11px] text-zinc-300 dark:text-zinc-300 block mt-0.5">Zero uncalibrated manager drift</span>
        </LandingGlowCard>

        <LandingGlowCard accent="blue" className="p-6">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--card-accent-text)] block mb-1">
            Compliance
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white">
            0.00%
          </div>
          <p className="text-xs text-white mt-1 font-semibold">
            Unexplained Pay Disparity
          </p>
          <span className="text-[11px] text-zinc-300 dark:text-zinc-300 block mt-0.5">Mathematical EEOC compliance</span>
        </LandingGlowCard>

        <LandingGlowCard accent="emerald" className="p-6">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--card-accent-text)] block mb-1">
            Net Value
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white">
            4.9x
          </div>
          <p className="text-xs text-white mt-1 font-semibold">
            First-Year Enterprise ROI
          </p>
          <span className="text-[11px] text-zinc-300 dark:text-zinc-300 block mt-0.5">Benchmarked across client cohorts</span>
        </LandingGlowCard>
      </div>

      {/* Interactive ROI Calculator */}
      <div className="rounded-3xl p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-emerald-500/10 via-white/50 to-teal-500/10 dark:from-emerald-950/30 dark:via-zinc-950/45 dark:to-teal-950/30 backdrop-blur-2xl border border-emerald-500/30 dark:border-emerald-500/20 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Sliders Side */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Calculator className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">
                  Interactive Business Model
                </span>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                  Estimate Your Organization&apos;s Savings
                </h3>
              </div>
            </div>

            {/* Headcount Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">Engineering & Tech Headcount</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  {headcount.toLocaleString()} Employees
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={headcount}
                onChange={(e) => setHeadcount(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                <span>100 ICs</span>
                <span>2,500</span>
                <span>10,000+ Enterprise</span>
              </div>
            </div>

            {/* Average Base Salary Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">Average Base CTC per Engineer</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  ₹{avgSalaryLakhs} Lakhs / year
                </span>
              </div>
              <input
                type="range"
                min="8"
                max="60"
                step="2"
                value={avgSalaryLakhs}
                onChange={(e) => setAvgSalaryLakhs(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                <span>₹8L</span>
                <span>₹25L</span>
                <span>₹60L (Staff/Lead)</span>
              </div>
            </div>

          </div>

          {/* Results Projection Box */}
          <div className="glass-card-ios lg:col-span-6 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                Projected Annual Impact
              </span>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                Guaranteed Fiscal Defense
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 block">Budget Leakage Saved</span>
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 block mt-0.5">
                  {calculation.formattedLeakage}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">from 14.2% uncalibrated drift</span>
              </div>

              <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 block">Manager Hours Reclaimed</span>
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-zinc-900 dark:text-white block mt-0.5">
                  {calculation.hoursSaved.toLocaleString()} hrs
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">saved across calibration loops</span>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-zinc-500 font-mono">
                Total Covered Payroll: <span className="font-bold text-zinc-800 dark:text-zinc-200">{calculation.totalPayrollFormatted}</span>
              </div>
              <button
                onClick={onOpenConsultationModal}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                <span>Request Custom Enterprise Model</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};