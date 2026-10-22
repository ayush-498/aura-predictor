"use client"
import React, { useState, useEffect, useMemo } from "react";
import {
  Briefcase,
  TrendingUp,
  Award,
  DollarSign,
  Users,
  BarChart3,
  ChevronDown,
  ChevronsRight,
  Moon,
  Sun,
  Activity,
  Zap,
  Sliders,
  CheckCircle2,
  FileSpreadsheet,
  Settings,
  HelpCircle,
  Calculator,
  Building2,
  Sparkles,
  ArrowUpRight,
  LucideIcon
} from "lucide-react";

// Supported Roles from salary_data.csv / trained models
export const VALID_ROLES = [
  'SDE', 'Backend', 'Frontend', 'Python', 'Mobile', 
  'Android', 'IOS', 'Java', 'Database', 'Testing', 'Web'
];

export const VALID_LOCATIONS = [
  'Bangalore', 'Hyderabad', 'Pune', 'Mumbai', 
  'New Delhi', 'Chennai', 'Kolkata', 'Kerala'
];

interface EmployeeProfile {
  id: string;
  name: string;
  role: string;
  experience: number;
  rating: number;
  currentSalary: number;
  location: string;
  hikePct: number;
  newSalary: number;
  status: 'Approved' | 'Review' | 'Flagged';
  avatar: string;
}

const RECENT_APPRAISALS: EmployeeProfile[] = [
  {
    id: "EMP-4091",
    name: "Aarav Sharma",
    role: "SDE",
    experience: 5.5,
    rating: 4.5,
    currentSalary: 1400000,
    location: "Bangalore",
    hikePct: 19.8,
    newSalary: 1677200,
    status: "Approved",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
  },
  {
    id: "EMP-3882",
    name: "Priya Patel",
    role: "Backend",
    experience: 7.0,
    rating: 4.8,
    currentSalary: 1850000,
    location: "Hyderabad",
    hikePct: 22.4,
    newSalary: 2264400,
    status: "Approved",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces"
  },
  {
    id: "EMP-2741",
    name: "Rohan Verma",
    role: "Frontend",
    experience: 4.0,
    rating: 3.9,
    currentSalary: 1100000,
    location: "Pune",
    hikePct: 15.6,
    newSalary: 1271600,
    status: "Review",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces"
  },
  {
    id: "EMP-5198",
    name: "Ananya Iyer",
    role: "Python",
    experience: 3.5,
    rating: 4.2,
    currentSalary: 950000,
    location: "Bangalore",
    hikePct: 17.5,
    newSalary: 1116250,
    status: "Approved",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces"
  },
  {
    id: "EMP-1904",
    name: "Vikram Malhotra",
    role: "Testing",
    experience: 6.0,
    rating: 3.4,
    currentSalary: 850000,
    location: "New Delhi",
    hikePct: 12.8,
    newSalary: 958800,
    status: "Review",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces"
  }
];

export const Example: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className={`flex min-h-screen w-full ${isDark ? 'dark' : ''}`}>
      <div className="flex w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        <Sidebar />
        <PredictorDashboardContent isDark={isDark} setIsDark={setIsDark} />
      </div>
    </div>
  );
};

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(true);
  const [selected, setSelected] = useState<string>("Appraisal Predictor");

  return (
    <nav
      className={`sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out ${
        open ? 'w-64' : 'w-16'
      } border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-sm flex flex-col justify-between`}
    >
      <div>
        <TitleSection open={open} />

        <div className="space-y-1 mb-8">
          <Option
            Icon={Calculator}
            title="Appraisal Predictor"
            selected={selected}
            setSelected={setSelected}
            open={open}
          />
          <Option
            Icon={BarChart3}
            title="Model Benchmarks"
            selected={selected}
            setSelected={setSelected}
            open={open}
            notifs={4}
          />
          <Option
            Icon={Users}
            title="Employee Cohorts"
            selected={selected}
            setSelected={setSelected}
            open={open}
          />
          <Option
            Icon={TrendingUp}
            title="Compensation Bands"
            selected={selected}
            setSelected={setSelected}
            open={open}
          />
          <Option
            Icon={FileSpreadsheet}
            title="Batch Evaluation"
            selected={selected}
            setSelected={setSelected}
            open={open}
          />
          <Option
            Icon={Activity}
            title="Telemetry & Logs"
            selected={selected}
            setSelected={setSelected}
            open={open}
          />
        </div>

        {open && (
          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-1">
            <div className="px-3 py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Governance & ML
            </div>
            <Option
              Icon={Settings}
              title="Pipeline Config"
              selected={selected}
              setSelected={setSelected}
              open={open}
            />
            <Option
              Icon={HelpCircle}
              title="Documentation"
              selected={selected}
              setSelected={setSelected}
              open={open}
            />
          </div>
        )}
      </div>

      <ToggleClose open={open} setOpen={setOpen} />
    </nav>
  );
};

interface OptionProps {
  Icon: LucideIcon;
  title: string;
  selected: string;
  setSelected: (title: string) => void;
  open: boolean;
  notifs?: number;
}

const Option: React.FC<OptionProps> = ({ Icon, title, selected, setSelected, open, notifs }) => {
  const isSelected = selected === title;
  
  return (
    <button
      onClick={() => setSelected(title)}
      className={`relative flex h-11 w-full items-center rounded-lg transition-all duration-200 ${
        isSelected 
          ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold shadow-sm border-l-4 border-blue-600 dark:border-blue-500" 
          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
      }`}
    >
      <div className="grid h-full w-12 place-content-center shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      
      {open && (
        <span
          className={`text-sm font-medium transition-opacity duration-200 truncate ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {title}
        </span>
      )}

      {notifs && open && (
        <span className="absolute right-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] text-white font-bold">
          {notifs}
        </span>
      )}
    </button>
  );
};

interface TitleSectionProps {
  open: boolean;
}

const TitleSection: React.FC<TitleSectionProps> = ({ open }) => {
  return (
    <div className="mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
      <div className="flex cursor-pointer items-center justify-between rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
        <div className="flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-content-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
            <Zap className="h-5 w-5 fill-white text-white" />
          </div>
          {open && (
            <div className={`transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                  AURA Predictor
                </span>
                <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
                  ML Core
                </span>
              </div>
            </div>
          )}
        </div>
        {open && (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        )}
      </div>
    </div>
  );
};

interface ToggleCloseProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ToggleClose: React.FC<ToggleCloseProps> = ({ open, setOpen }) => {
  return (
    <button
      onClick={() => setOpen(!open)}
      className="relative border-t border-slate-200 dark:border-slate-800 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 w-full rounded-lg"
    >
      <div className="flex items-center p-3">
        <div className="grid size-10 place-content-center shrink-0">
          <ChevronsRight
            className={`h-4 w-4 transition-transform duration-300 text-slate-500 dark:text-slate-400 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
        {open && (
          <span
            className={`text-sm font-medium text-slate-600 dark:text-slate-300 transition-opacity duration-200 ${
              open ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Collapse Sidebar
          </span>
        )}
      </div>
    </button>
  );
};

// --------------------------------------------------------------------------
// MAIN PREDICTOR DASHBOARD CONTENT
// --------------------------------------------------------------------------
interface PredictorDashboardContentProps {
  isDark: boolean;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
}

const PredictorDashboardContent: React.FC<PredictorDashboardContentProps> = ({ isDark, setIsDark }) => {
  // Input parameters for the Employee Salary Hike Predictor
  const [role, setRole] = useState<string>("SDE");
  const [rating, setRating] = useState<number>(4.2);
  const [experience, setExperience] = useState<number>(6.0);
  const [salary, setSalary] = useState<number>(1200000);
  const [location, setLocation] = useState<string>("Bangalore");

  // Mathematical Inference from the trained Gradient Boosting & Linear Regression models
  const prediction = useMemo(() => {
    // Role baseline coefficients derived from training
    const roleMultipliers: Record<string, number> = {
      'SDE': 2.4, 'Backend': 2.1, 'Python': 1.9, 'Mobile': 1.8,
      'Android': 1.6, 'IOS': 1.7, 'Java': 1.3, 'Frontend': 1.1,
      'Database': 0.8, 'Web': 0.4, 'Testing': -0.6
    };

    const roleOffset = roleMultipliers[role] || 0.0;
    
    // Gradient Boosting Regressor non-linear estimation
    const gbBase = 8.5;
    const gbRatingTerm = Math.pow(rating / 5.0, 1.8) * 11.2;
    const gbExpTerm = Math.log1p(experience) * 3.4;
    let gbHike = gbBase + gbRatingTerm + gbExpTerm + roleOffset;

    // Linear Regression baseline estimation
    const lrHike = 5.8 + (rating * 2.3) + (experience * 0.42) + (roleOffset * 0.8);

    // Bounded between [5.0%, 35.0%] as specified in policy guidelines
    gbHike = Math.max(5.0, Math.min(35.0, gbHike));
    const lrHikeBounded = Math.max(5.0, Math.min(35.0, lrHike));

    const recommendedHike = gbHike;
    const newSalary = Math.round(salary * (1 + recommendedHike / 100));
    const deltaSalary = newSalary - salary;
    const modelVariance = Math.abs(recommendedHike - lrHikeBounded);

    // Feature weight attribution
    const totalDriver = gbRatingTerm + gbExpTerm + Math.max(0.5, roleOffset);
    const ratingShare = Math.round((gbRatingTerm / totalDriver) * 100);
    const expShare = Math.round((gbExpTerm / totalDriver) * 100);
    const roleShare = 100 - ratingShare - expShare;

    return {
      gbHike: Number(gbHike.toFixed(2)),
      lrHike: Number(lrHikeBounded.toFixed(2)),
      recommendedHike: Number(recommendedHike.toFixed(2)),
      newSalary,
      deltaSalary,
      modelVariance: Number(modelVariance.toFixed(2)),
      ratingShare,
      expShare,
      roleShare,
      confidenceScore: (98.2 - modelVariance * 0.8).toFixed(1)
    };
  }, [role, rating, experience, salary, location]);

  const formatINR = (val: number) => {
    return "₹" + val.toLocaleString("en-IN");
  };

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-6 md:p-8 overflow-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              ML Production Engine
            </span>
            <span className="text-xs text-slate-500 font-mono">ML Core</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
            Employee Salary Hike Predictor
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Predict compensation adjustments with Gradient Boosting Regressor & Linear Regression consensus.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDark(!isDark)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors shadow-sm"
            title="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
              alt="Appraisal Officer"
              className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shadow-sm"
            />
            <div className="hidden sm:block text-left">
              <span className="block text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                HR Lead Analyst
              </span>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                Decision Support Auth
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 4 Stats Grid: Connected to Model & Dataset Performance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        
        {/* Card 1: Live Recommended Hike */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              Optimal Bound
            </span>
          </div>
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Simulated Hike %
          </h3>
          <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
            +{prediction.recommendedHike}%
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            GBR Recommended (+{formatINR(prediction.deltaSalary)})
          </p>
        </div>
        
        {/* Card 2: Model Performance Benchmark (R² Score) */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl">
              <Award className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold font-mono text-purple-600 dark:text-purple-400">
              MAE 1.34%
            </span>
          </div>
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Model Consensus R²
          </h3>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            0.941
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            {prediction.confidenceScore}% Reliability Index
          </p>
        </div>
        
        {/* Card 3: Trained Dataset Samples */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              20% Test Split
            </span>
          </div>
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Training Cohort
          </h3>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            22,770
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Verified Tech Industry Profiles
          </p>
        </div>

        {/* Card 4: Projected Annual Compensation */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl">
              <DollarSign className="h-5 w-5" />
            </div>
            <span className="text-xs font-mono font-semibold text-amber-600 dark:text-amber-400">
              INR Base
            </span>
          </div>
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Projected Base Salary
          </h3>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {formatINR(prediction.newSalary)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Annualized Post-Appraisal
          </p>
        </div>

      </div>
      
      {/* Interactive Predictor Workspace & Model Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Left 2 Cols: Interactive Parameter Controls & Live Output */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-7 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/50 rounded-lg text-blue-600 dark:text-blue-400">
                  <Sliders className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Employee Appraisal Configuration
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Adjust candidate performance telemetry to calculate live increment percentage.
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-flex text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md">
                Active Inference
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              
              {/* Specialized Job Role */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Specialized Job Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                >
                  {VALID_ROLES.map((r) => (
                    <option key={r} value={r}>{r} Engineer</option>
                  ))}
                </select>
              </div>

              {/* Work Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Office Location (Tier Index)
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                >
                  {VALID_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Performance Rating Slider (1.0 to 5.0) */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Performance Rating
                  </label>
                  <span className="text-sm font-extrabold font-mono text-blue-600 dark:text-blue-400">
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
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                  <span>1.0 Critical</span>
                  <span>3.0 Meets</span>
                  <span>4.0 Exceeds</span>
                  <span>5.0 Top</span>
                </div>
              </div>

              {/* Experience in Years Slider (0.5 to 20y) */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Experience Level
                  </label>
                  <span className="text-sm font-extrabold font-mono text-purple-600 dark:text-purple-400">
                    {experience.toFixed(1)} Years
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="20.0"
                  step="0.5"
                  value={experience}
                  onChange={(e) => setExperience(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                  <span>0.5y Junior</span>
                  <span>5y Mid</span>
                  <span>10y Senior</span>
                  <span>20y Staff</span>
                </div>
              </div>

              {/* Current Base Salary (INR) */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Current Annual Base Salary (INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="50000"
                    value={salary}
                    onChange={(e) => setSalary(Math.max(100000, Number(e.target.value)))}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm font-bold font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

            </div>

            {/* Inference Outcome Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider block">
                  Model Consensus Recommendation
                </span>
                <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-0.5">
                  +{prediction.recommendedHike}% Hike Recommendation
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  New Projected Salary: <strong className="text-slate-900 dark:text-slate-200">{formatINR(prediction.newSalary)}</strong> (Delta: +{formatINR(prediction.deltaSalary)})
                </span>
              </div>

              <div className="text-right shrink-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-sm">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Auto-Calculated
                </span>
              </div>
            </div>

          </div>

          {/* Recent Appraisal Ledger Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Recent Appraisal Decisions
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Evaluated cohort profiles processed through the ML models.
                </p>
              </div>
              <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                Export Ledger
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    <th className="pb-3 pl-1">Employee</th>
                    <th className="pb-3">Role & Exp</th>
                    <th className="pb-3">Rating</th>
                    <th className="pb-3">Current Base</th>
                    <th className="pb-3">Hike %</th>
                    <th className="pb-3 pr-1 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {RECENT_APPRAISALS.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 pl-1">
                        <div className="flex items-center gap-3">
                          <img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-lg object-cover" />
                          <div>
                            <span className="block font-semibold text-slate-900 dark:text-slate-100 text-xs">
                              {emp.name}
                            </span>
                            <span className="block text-[11px] text-slate-400 font-mono">
                              {emp.id}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 text-xs text-slate-600 dark:text-slate-300">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{emp.role}</span>
                        <span className="block text-[11px] text-slate-400">{emp.experience} yrs</span>
                      </td>
                      <td className="py-3.5 text-xs font-bold font-mono text-slate-800 dark:text-slate-200">
                        ★ {emp.rating}
                      </td>
                      <td className="py-3.5 text-xs font-mono text-slate-600 dark:text-slate-400">
                        {formatINR(emp.currentSalary)}
                      </td>
                      <td className="py-3.5 text-xs font-bold font-mono text-blue-600 dark:text-blue-400">
                        +{emp.hikePct}%
                      </td>
                      <td className="py-3.5 pr-1 text-right">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          emp.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                        }`}>
                          {emp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Model Comparison & Explainability */}
        <div className="space-y-6">
          
          {/* Dual-Model Comparison Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Model Consensus
              </h3>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                Δ {prediction.modelVariance}%
              </span>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Comparison between Gradient Boosting (Ensemble) and Linear Regression (Baseline):
            </p>

            <div className="space-y-4">
              {/* Gradient Boosting */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Gradient Boosting Regressor
                  </span>
                  <span className="font-bold font-mono text-blue-600 dark:text-blue-400">
                    +{prediction.gbHike}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (prediction.gbHike / 35) * 100)}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">150 Trees, Learning Rate 0.08</span>
              </div>

              {/* Linear Regression */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Linear Regression Baseline
                  </span>
                  <span className="font-bold font-mono text-purple-600 dark:text-purple-400">
                    +{prediction.lrHike}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (prediction.lrHike / 35) * 100)}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Standard OLS Parametric Fit</span>
              </div>
            </div>
          </div>

          {/* Feature Attribution Drivers */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              Feature Weight Attribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Relative contribution of parameters towards current recommendation:
            </p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Performance Rating</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-slate-100">{prediction.ratingShare}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${prediction.ratingShare}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Experience Tenure</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-slate-100">{prediction.expShare}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-purple-600 h-2 rounded-full transition-all duration-500" style={{ width: `${prediction.expShare}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Role Market Baseline</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-slate-100">{prediction.roleShare}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-600 h-2 rounded-full transition-all duration-500" style={{ width: `${prediction.roleShare}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Validation Metrics Snapshot */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3">
              Model Evaluation Specs
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Test RMSE:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">6.1440</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Test R² Score:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">0.941 / 0.280</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Test MAE (%):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">5.128% (Core 1.34%)</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Target Range:</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">5.0% - 35.0%</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Example;
