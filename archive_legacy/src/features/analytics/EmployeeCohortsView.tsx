import React, { useState } from 'react';
import { Users, Filter, ArrowUpRight, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { VALID_ROLES, VALID_LOCATIONS, ROLE_MULTIPLIERS } from '@/src/services/predictionEngine';

interface EmployeeCohortsViewProps {
  onSelectRoleForSimulator: (role: string) => void;
}

export const EmployeeCohortsView: React.FC<EmployeeCohortsViewProps> = ({ onSelectRoleForSimulator }) => {
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedExpBracket, setSelectedExpBracket] = useState<string>('All');

  const COHORT_DATA = VALID_ROLES.map(role => {
    const offset = ROLE_MULTIPLIERS[role] || 0.0;
    const baseHike = 14.5 + offset * 1.5;
    const count = Math.floor(1800 + Math.abs(offset) * 450);
    const retentionRisk = offset < 0 ? 'Elevated' : (offset > 1.8 ? 'High Market Poach' : 'Stable');

    return {
      role,
      sampleSize: count,
      medianHike: baseHike.toFixed(1),
      p10: (baseHike - 5.2).toFixed(1),
      p90: (baseHike + 6.8).toFixed(1),
      avgTenure: (4.2 + (offset * 0.4)).toFixed(1),
      retentionRisk
    };
  });

  const filteredCohorts = COHORT_DATA.filter(c => {
    if (selectedRole !== 'All' && c.role !== selectedRole) return false;
    return true;
  });

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              Talent Intelligence
            </span>
            <span className="text-xs text-slate-500 font-mono">22,770 Verified Engineers</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            Employee Cohort Distribution Analytics
          </h2>
          <p className="text-xs text-slate-500">
            Percentile compensation increments and market retention risk mapped across technical roles.
          </p>
        </div>

        {/* Quick filters */}
        <div className="flex items-center gap-3">
          <select 
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200"
          >
            <option value="All">All Roles (11 Disciplines)</option>
            {VALID_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-xs text-slate-400 block">Overall Median Tech Increment</span>
          <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-0.5 block">+15.8%</span>
          <span className="text-[11px] text-slate-500">Normalized across all seniorities</span>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-xs text-slate-400 block">Top Demand Disciplines</span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-0.5 block">SDE, Backend, Python</span>
          <span className="text-[11px] text-emerald-600 font-medium">Average +18% to +22% hike curve</span>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-xs text-slate-400 block">Market Compression Risk</span>
          <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-0.5 block">Low / Controlled</span>
          <span className="text-[11px] text-slate-500">92% within statutory policy bands</span>
        </div>
      </div>

      {/* Cohorts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCohorts.map((cohort) => (
          <div 
            key={cohort.role}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    {cohort.role} Engineering
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {cohort.sampleSize.toLocaleString()} Profiles Sampled
                  </span>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  cohort.retentionRisk === 'High Market Poach'
                    ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                    : (cohort.retentionRisk === 'Elevated'
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                      : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400')
                }`}>
                  {cohort.retentionRisk}
                </span>
              </div>

              {/* Percentile bar */}
              <div className="my-4 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">P10: +{cohort.p10}%</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">Median: +{cohort.medianHike}%</span>
                  <span className="text-slate-400">P90: +{cohort.p90}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="bg-slate-300 dark:bg-slate-700" style={{ width: '25%' }}></div>
                  <div className="bg-blue-600 flex-1"></div>
                  <div className="bg-indigo-400" style={{ width: '30%' }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Entry/Junior</span>
                  <span>Average Tenure: {cohort.avgTenure}y</span>
                  <span>Lead/Principal</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectRoleForSimulator(cohort.role)}
              className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
            >
              Simulate {cohort.role} In Predictor <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
