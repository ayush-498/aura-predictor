import React, { useState } from 'react';
import { TrendingUp, Calculator, ShieldAlert } from 'lucide-react';
import { Card, CardHeaderTitle } from '../../../components/ui/Card';
import { formatINR } from '../../../lib/utils';

interface BandSpec {
  level: string;
  title: string;
  minSalary: number;
  midSalary: number;
  maxSalary: number;
  typicalHikeMin: number;
  typicalHikeMax: number;
  marketParityIndex: number;
}

const BANDS: BandSpec[] = [
  { level: 'L1', title: 'Associate Engineer', minSalary: 450000, midSalary: 650000, maxSalary: 850000, typicalHikeMin: 10, typicalHikeMax: 16, marketParityIndex: 0.98 },
  { level: 'L2', title: 'Software Engineer', minSalary: 850000, midSalary: 1250000, maxSalary: 1650000, typicalHikeMin: 12, typicalHikeMax: 20, marketParityIndex: 1.02 },
  { level: 'L3', title: 'Senior Engineer', minSalary: 1650000, midSalary: 2200000, maxSalary: 2900000, typicalHikeMin: 15, typicalHikeMax: 24, marketParityIndex: 1.05 },
  { level: 'L4', title: 'Staff / Tech Lead', minSalary: 2900000, midSalary: 3750000, maxSalary: 4600000, typicalHikeMin: 18, typicalHikeMax: 28, marketParityIndex: 1.08 },
  { level: 'L5', title: 'Principal Architect', minSalary: 4600000, midSalary: 5800000, maxSalary: 7200000, typicalHikeMin: 20, typicalHikeMax: 35, marketParityIndex: 1.12 }
];

export const CompensationBandsView: React.FC = () => {
  const [testSalary, setTestSalary] = useState<number>(1400000);
  const [testLevel, setTestLevel] = useState<string>('L2');

  const selectedBand = BANDS.find(b => b.level === testLevel) || BANDS[1];
  const compaRatio = Number((testSalary / selectedBand.midSalary).toFixed(2));

  let compaStatus = 'At Market Parity';
  let compaColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60';
  let recommendedCatchup = 0;

  if (compaRatio < 0.85) {
    compaStatus = 'Underpaid / Flight Risk';
    compaColor = 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60';
    recommendedCatchup = Number((((selectedBand.midSalary - testSalary) / testSalary) * 100).toFixed(1));
  } else if (compaRatio > 1.15) {
    compaStatus = 'Above Band Ceiling';
    compaColor = 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60';
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <CardHeaderTitle
        icon={TrendingUp}
        title="Engineering Compensation Bands & Compa-Ratio Matrix"
        subtitle="Grade salary minimum/maximum limits and market parity audits"
      />

      <Card className="p-6 space-y-5">
        <CardHeaderTitle
          icon={Calculator}
          title="Interactive Compa-Ratio Auditor"
          subtitle="Simulate candidate positioning against current salary grade"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
              Engineering Grade
            </label>
            <select
              value={testLevel}
              onChange={(e) => setTestLevel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-semibold"
            >
              {BANDS.map(b => (
                <option key={b.level} value={b.level}>{b.level} - {b.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
              Candidate Base Salary (INR)
            </label>
            <input
              type="number"
              step="50000"
              value={testSalary}
              onChange={(e) => setTestSalary(Math.max(100000, Number(e.target.value)))}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-mono font-bold"
            />
          </div>

          <div className="flex flex-col justify-end">
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-zinc-400 block font-semibold">Compa-Ratio</span>
                <span className="text-xl font-black font-mono">{compaRatio}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${compaColor}`}>
                {compaStatus}
              </span>
            </div>
          </div>
        </div>

        {recommendedCatchup > 0 && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs flex items-center gap-2 text-rose-800 dark:text-rose-200">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>
              Candidate is below 0.85 floor. Recommend corrective catch-up hike of <strong>+{recommendedCatchup}%</strong> to reach midpoint ({formatINR(selectedBand.midSalary)}).
            </span>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-4">
          Grade Pay Structures (L1 to L5)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-semibold uppercase text-[10px]">
                <th className="pb-3">Level</th>
                <th className="pb-3">Title</th>
                <th className="pb-3">Min Band Base</th>
                <th className="pb-3">Midpoint Base</th>
                <th className="pb-3">Max Band Base</th>
                <th className="pb-3">Typical Hike</th>
                <th className="pb-3 text-right">Parity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {BANDS.map(band => (
                <tr key={band.level} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                  <td className="py-3 font-bold font-mono text-emerald-600 dark:text-emerald-400">{band.level}</td>
                  <td className="py-3 font-semibold">{band.title}</td>
                  <td className="py-3 font-mono text-zinc-500">{formatINR(band.minSalary)}</td>
                  <td className="py-3 font-mono font-bold">{formatINR(band.midSalary)}</td>
                  <td className="py-3 font-mono text-zinc-500">{formatINR(band.maxSalary)}</td>
                  <td className="py-3 font-mono font-bold text-emerald-600">+{band.typicalHikeMin}% - +{band.typicalHikeMax}%</td>
                  <td className="py-3 text-right font-mono font-semibold">{band.marketParityIndex}x</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
