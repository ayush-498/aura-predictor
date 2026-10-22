import React, { useState } from 'react';
import { TrendingUp, Calculator, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';
import { COMPENSATION_BANDS, formatINR } from '@/src/services/predictionEngine';

export const CompensationBandsView: React.FC = () => {
  const [testSalary, setTestSalary] = useState<number>(1400000);
  const [testLevel, setTestLevel] = useState<string>('L2');

  const selectedBand = COMPENSATION_BANDS.find(b => b.level === testLevel) || COMPENSATION_BANDS[1];
  const compaRatio = Number((testSalary / selectedBand.midSalary).toFixed(2));

  let compaStatus = 'At Market Parity';
  let compaColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60';
  let recommendedCatchup = 0;

  if (compaRatio < 0.85) {
    compaStatus = 'Underpaid / Flight Risk';
    compaColor = 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60';
    recommendedCatchup = Number((((selectedBand.midSalary - testSalary) / testSalary) * 100).toFixed(1));
  } else if (compaRatio > 1.15) {
    compaStatus = 'Above Band Ceiling / Promotion Recommended';
    compaColor = 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60';
  }

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              Governance Bands
            </span>
            <span className="text-xs text-slate-500 font-mono">L1 to L5 Grade Matrix</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            Compensation Bands & Compa-Ratio Matrix
          </h2>
          <p className="text-xs text-slate-500">
            Audit pay parity, band minimum/maximum limits, and correctional salary hike thresholds.
          </p>
        </div>
      </div>

      {/* Interactive Compa-Ratio Calculator */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2 bg-blue-50 dark:bg-blue-950 text-blue-600 rounded-lg">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Interactive Compa-Ratio Parity Auditor
            </h3>
            <p className="text-xs text-slate-500">Compa-Ratio = (Current Base Salary / Grade Midpoint Salary)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
              Engineering Grade Level
            </label>
            <select
              value={testLevel}
              onChange={(e) => setTestLevel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-slate-100"
            >
              {COMPENSATION_BANDS.map(b => (
                <option key={b.level} value={b.level}>{b.level} - {b.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
              Candidate Base Salary (INR)
            </label>
            <input
              type="number"
              step="50000"
              value={testSalary}
              onChange={(e) => setTestSalary(Math.max(100000, Number(e.target.value)))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex flex-col justify-end">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-[11px] text-slate-400 block font-semibold">Compa-Ratio Index</span>
                <span className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">{compaRatio}</span>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${compaColor}`}>
                {compaStatus}
              </span>
            </div>
          </div>
        </div>

        {recommendedCatchup > 0 && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-rose-800 dark:text-rose-200">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>
                Employee is below the 0.85 band floor. Recommended corrective hike of <strong>+{recommendedCatchup}%</strong> to reach 1.0 parity midpoint ({formatINR(selectedBand.midSalary)}).
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Official Bands Table */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
          Standard Engineering Compensation Grade Structure
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Annual base salary ranges and typical appraisal increment spreads.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 font-semibold text-slate-400 uppercase tracking-wider">
                <th className="pb-3">Level</th>
                <th className="pb-3">Engineering Title</th>
                <th className="pb-3">Min Band Base</th>
                <th className="pb-3">Midpoint Base</th>
                <th className="pb-3">Max Band Base</th>
                <th className="pb-3">Appraisal Range</th>
                <th className="pb-3 text-right">Market Parity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {COMPENSATION_BANDS.map((band) => (
                <tr key={band.level} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 font-bold font-mono text-blue-600 dark:text-blue-400">{band.level}</td>
                  <td className="py-3.5 font-semibold text-slate-900 dark:text-slate-100">{band.title}</td>
                  <td className="py-3.5 font-mono text-slate-600 dark:text-slate-400">{formatINR(band.minSalary)}</td>
                  <td className="py-3.5 font-mono font-bold text-slate-900 dark:text-slate-100">{formatINR(band.midSalary)}</td>
                  <td className="py-3.5 font-mono text-slate-600 dark:text-slate-400">{formatINR(band.maxSalary)}</td>
                  <td className="py-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    +{band.typicalHikeMin}% - +{band.typicalHikeMax}%
                  </td>
                  <td className="py-3.5 text-right font-mono font-semibold text-slate-700 dark:text-slate-300">
                    {band.marketParityIndex}x
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
