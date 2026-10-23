import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Zap, 
  Cpu, 
  ArrowUpRight, 
  ShieldCheck, 
  Star, 
  MapPin, 
  Briefcase, 
  CheckCircle2 
} from 'lucide-react';
import { salaryService } from '../../../services/salaryService';
import { PredictionRequest, VALID_ROLES, VALID_LOCATIONS } from '../../../types';
import { TabType } from '../../../components/layout/Sidebar';

interface MiniSimulatorWidgetProps {
  onOpenAppWithParams: (params: PredictionRequest, targetTab?: TabType) => void;
}

const SALARY_PRESETS = [
  { label: '₹8L', value: 800000 },
  { label: '₹14L', value: 1400000 },
  { label: '₹22L', value: 2200000 },
  { label: '₹36L', value: 3600000 },
  { label: '₹50L', value: 5000000 },
];

export const MiniSimulatorWidget: React.FC<MiniSimulatorWidgetProps> = ({ onOpenAppWithParams }) => {
  const [role, setRole] = useState<string>('SDE');
  const [experience, setExperience] = useState<number>(4.5);
  const [rating, setRating] = useState<number>(4.2);
  const [salary, setSalary] = useState<number>(1400000);
  const [location, setLocation] = useState<string>('Bangalore');

  // Compute live prediction reactively
  const prediction = useMemo(() => {
    return salaryService.localSimulate({
      role,
      experience,
      rating,
      salary,
      location,
      status: 'Full Time',
    });
  }, [role, experience, rating, salary, location]);

  const formatCurrency = (val?: number | null) => {
    if (val === undefined || val === null) return '—';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleLaunchForecaster = () => {
    onOpenAppWithParams(
      {
        role,
        experience,
        rating,
        salary,
        location,
        status: 'Full Time',
      },
      'predictor'
    );
  };

  return (
    <div className="relative rounded-3xl p-1 bg-gradient-to-b from-emerald-500/30 via-teal-500/20 to-transparent shadow-2xl shadow-emerald-950/20">
      
      {/* Glow highlight */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="glass-card-ios relative rounded-[22px] p-5 sm:p-6 lg:p-7 space-y-5">
        
        {/* Widget Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Zap className="w-4 h-4" />
            </span>
            <div>
              <span className="text-xs font-mono font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                Interactive Mini-Simulator
              </span>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Live Reactive Appraisal Preview
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            GBM 94.9% R²
          </div>
        </div>

        {/* Sliders & Controls */}
        <div className="space-y-4">
          
          {/* Role & Location Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mb-1.5">
                <Briefcase className="w-3 h-3 text-zinc-400" /> Track & Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full text-xs font-semibold px-2.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {VALID_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r} Engineer
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mb-1.5">
                <MapPin className="w-3 h-3 text-zinc-400" /> Geography
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs font-semibold px-2.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {VALID_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Experience Slider */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-zinc-600 dark:text-zinc-400">Relevant Experience</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                {experience.toFixed(1)} Years
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="15.0"
              step="0.5"
              value={experience}
              onChange={(e) => setExperience(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-zinc-600 dark:text-zinc-400 font-mono mt-1 font-medium">
              <span>Junior (0.5y)</span>
              <span>Mid (5y)</span>
              <span>Staff / Lead (15y)</span>
            </div>
          </div>

          {/* Performance Rating Slider */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                Annual Appraisal Rating
                <span className="flex text-amber-400 ml-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3 h-3 ${rating >= star ? 'fill-amber-400' : 'text-zinc-300 dark:text-zinc-700'}`}
                    />
                  ))}
                </span>
              </span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                {rating.toFixed(1)} / 5.0
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="5.0"
              step="0.1"
              value={rating}
              onChange={(e) => setRating(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Base CTC Presets */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">Current Base CTC</span>
              <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                {formatCurrency(salary)}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {SALARY_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setSalary(preset.value)}
                  className={`py-1 text-xs font-mono font-semibold rounded-lg border transition-all ${
                    salary === preset.value
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/30'
                      : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-emerald-500/40'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Live Reactive Output Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 dark:from-emerald-950/40 dark:via-zinc-900/60 dark:to-teal-950/40 border border-emerald-500/30 dark:border-emerald-500/20 space-y-3">
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold block">
                Algorithmic Recommendation
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  +{prediction.recommended_hike_pct}%
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Optimal Appraisal Band
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 block">
                Model Confidence
              </span>
              <span className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {(prediction.confidence_score * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-500/20 text-xs">
            <div>
              <span className="text-zinc-500 dark:text-zinc-400 text-[11px] block">Projected New CTC</span>
              <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                {formatCurrency(prediction.projected_new_salary)}
              </span>
            </div>
            <div>
              <span className="text-zinc-500 dark:text-zinc-400 text-[11px] block">Calculated Delta</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                +{formatCurrency(prediction.salary_increment)}
              </span>
            </div>
          </div>

          {/* Model benchmarking dual badges */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-200/50 dark:border-zinc-800 text-[10px] font-mono">
            <span className="text-zinc-500">Dual-Inference:</span>
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                GBM: {prediction.gradient_boosting_pct}%
              </span>
              <span className="text-zinc-400">|</span>
              <span className="text-zinc-500 font-semibold">
                OLS Baseline: {prediction.linear_regression_pct}%
              </span>
            </div>
          </div>

        </div>

        {/* CTA Launch in Full Forecaster */}
        <button
          onClick={handleLaunchForecaster}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 transition-all shadow-md active:scale-98 group cursor-pointer"
        >
          <span>Open Full Enterprise Forecaster with SHAP</span>
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>

        {/* Trust micro-footer */}
        <div className="flex items-center justify-between text-[10px] text-zinc-600 dark:text-zinc-400 font-mono pt-1 font-medium">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Audit-Ready Compliance
          </span>
          <span>Latency: ~12ms</span>
        </div>

      </div>
    </div>
  );
};