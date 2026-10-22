import React, { useState } from 'react';
import { 
  Sliders, 
  CheckCircle2, 
  RotateCcw, 
  FileText, 
  TrendingUp, 
  Award, 
  Users, 
  DollarSign, 
  Zap, 
  Plus, 
  ShieldCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import { EmployeeProfile, PredictionResult } from '@/src/types/salary';
import { VALID_ROLES, VALID_LOCATIONS, formatINR } from '@/src/services/predictionEngine';
import { AppraisalLedger } from '@/src/features/appraisals/AppraisalLedger';
import { 
  AppraisalLetterModal, 
  KpiFormulaModal, 
  KpiAccuracyModal, 
  KpiCohortModal, 
  KpiCtcModal, 
  AddEmployeeModal, 
  AuditEmployeeDrawer 
} from '@/src/components/modals/AppraisalModals';

interface PredictorWorkspaceProps {
  role: string;
  setRole: (role: string) => void;
  rating: number;
  setRating: (rating: number) => void;
  experience: number;
  setExperience: (exp: number) => void;
  salary: number;
  setSalary: (salary: number) => void;
  location: string;
  setLocation: (loc: string) => void;
  prediction: PredictionResult;
  employees: EmployeeProfile[];
  setEmployees: React.Dispatch<React.SetStateAction<EmployeeProfile[]>>;
}

export const PredictorWorkspace: React.FC<PredictorWorkspaceProps> = ({
  role,
  setRole,
  rating,
  setRating,
  experience,
  setExperience,
  salary,
  setSalary,
  location,
  setLocation,
  prediction,
  employees,
  setEmployees
}) => {
  // Modal states
  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false);
  const [isAccuracyModalOpen, setIsAccuracyModalOpen] = useState(false);
  const [isCohortModalOpen, setIsCohortModalOpen] = useState(false);
  const [isCtcModalOpen, setIsCtcModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [auditedEmployee, setAuditedEmployee] = useState<EmployeeProfile | null>(null);
  const [approvedToast, setApprovedToast] = useState(false);
  const [selectedFeatureInfo, setSelectedFeatureInfo] = useState<string | null>(null);

  // Quick Preset Actions
  const handleRatingPreset = (val: number) => setRating(val);
  const handleExperiencePreset = (val: number) => setExperience(val);
  const handleSalaryPreset = (val: number) => setSalary(val);

  const handleResetDefaults = () => {
    setRole('SDE');
    setRating(4.2);
    setExperience(6.0);
    setSalary(1200000);
    setLocation('Bangalore');
  };

  const handleApproveCurrentCandidate = () => {
    const newId = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCandidate: EmployeeProfile = {
      id: newId,
      name: "Simulated Candidate",
      role,
      experience,
      rating,
      currentSalary: salary,
      location,
      hikePct: prediction.recommendedHike,
      newSalary: prediction.newSalary,
      status: 'Approved',
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
      department: `${role} Engineering`,
      lastAppraisalDate: new Date().toISOString().split('T')[0],
      comments: "Directly approved via ML Prediction Consensus Banner."
    };

    setEmployees(prev => [newCandidate, ...prev]);
    setApprovedToast(true);
    setTimeout(() => setApprovedToast(false), 3000);
  };

  const handleSelectEmployeeForSimulator = (emp: EmployeeProfile) => {
    setRole(emp.role);
    setRating(emp.rating);
    setExperience(emp.experience);
    setSalary(emp.currentSalary);
    setLocation(emp.location);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStatusToggle = (id: string) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id !== id) return emp;
      const nextStatus = emp.status === 'Approved' ? 'Review' : (emp.status === 'Review' ? 'Flagged' : 'Approved');
      return { ...emp, status: nextStatus };
    }));
  };

  const handleStatusChange = (id: string, newStatus: 'Approved' | 'Review' | 'Flagged') => {
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, status: newStatus } : emp));
    if (auditedEmployee && auditedEmployee.id === id) {
      setAuditedEmployee(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 4 Clickable KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Live Recommended Hike */}
        <div 
          onClick={() => setIsFormulaModalOpen(true)}
          className="cursor-pointer p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all group"
          title="Click to view calculation breakdown"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
              Optimal Bound
            </span>
          </div>
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            Simulated Hike %
            <span className="text-[10px] text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">Details &rarr;</span>
          </h3>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
            +{prediction.recommendedHike}%
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            GBR Recommended (+{formatINR(prediction.deltaSalary)})
          </p>
        </div>
        
        {/* Card 2: Model Performance Benchmark (R² Score) */}
        <div 
          onClick={() => setIsAccuracyModalOpen(true)}
          className="cursor-pointer p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-purple-400 dark:hover:border-purple-500 transition-all group"
          title="Click to view error distribution & R² metrics"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl group-hover:scale-110 transition-transform">
              <Award className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold font-mono text-purple-600 dark:text-purple-400">
              MAE 1.34%
            </span>
          </div>
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            Model Consensus R²
            <span className="text-[10px] text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">Details &rarr;</span>
          </h3>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100">
            0.941
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
            {prediction.confidenceScore}% Reliability Index
          </p>
        </div>
        
        {/* Card 3: Trained Dataset Samples */}
        <div 
          onClick={() => setIsCohortModalOpen(true)}
          className="cursor-pointer p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-emerald-400 dark:hover:border-emerald-500 transition-all group"
          title="Click to inspect training dataset demographics"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              20% Test Split
            </span>
          </div>
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            Training Cohort
            <span className="text-[10px] text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">Details &rarr;</span>
          </h3>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100">
            22,770
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Verified Tech Industry Profiles
          </p>
        </div>

        {/* Card 4: Projected Annual Compensation */}
        <div 
          onClick={() => setIsCtcModalOpen(true)}
          className="cursor-pointer p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-amber-400 dark:hover:border-amber-500 transition-all group"
          title="Click to view total CTC components breakdown"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl group-hover:scale-110 transition-transform">
              <DollarSign className="h-5 w-5" />
            </div>
            <span className="text-xs font-mono font-semibold text-amber-600 dark:text-amber-400">
              INR Base
            </span>
          </div>
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            Projected Base Salary
            <span className="text-[10px] text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">Details &rarr;</span>
          </h3>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100">
            {formatINR(prediction.newSalary)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Annualized Post-Appraisal
          </p>
        </div>

      </div>

      {approvedToast && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Candidate appraisal approved and added to the Recent Decisions Ledger below!
          </div>
        </div>
      )}

      {/* Main Grid: Predictor Left 2 cols, Metrics Right 1 col */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Interactive Configuration Form */}
        <div className="lg:col-span-2 space-y-7">
          
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-7 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/50 rounded-lg text-blue-600 dark:text-blue-400">
                  <Sliders className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Employee Appraisal Configuration
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Adjust candidate telemetry to simulate live hike recommendation.
                  </p>
                </div>
              </div>

              <button
                onClick={handleResetDefaults}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors self-start sm:self-auto"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset Defaults
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              
              {/* Job Role Selector */}
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

              {/* Office Location */}
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

              {/* Performance Rating Slider & Quick Presets */}
              <div>
                <div className="flex justify-between items-center mb-1">
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
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 mb-2"
                />
                
                {/* Rating Quick Chips */}
                <div className="flex gap-1.5 overflow-x-auto">
                  {[
                    { label: '3.0 Meets', val: 3.0 },
                    { label: '3.8 Strong', val: 3.8 },
                    { label: '4.5 Exceeds', val: 4.5 },
                    { label: '5.0 Star', val: 5.0 }
                  ].map(chip => (
                    <button
                      key={chip.val}
                      onClick={() => handleRatingPreset(chip.val)}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors shrink-0 ${
                        rating === chip.val
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience in Years Slider & Quick Presets */}
              <div>
                <div className="flex justify-between items-center mb-1">
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
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600 mb-2"
                />

                {/* Experience Quick Chips */}
                <div className="flex gap-1.5 overflow-x-auto">
                  {[
                    { label: '1y Junior', val: 1.0 },
                    { label: '4y Mid', val: 4.0 },
                    { label: '8y Senior', val: 8.0 },
                    { label: '14y Staff', val: 14.0 }
                  ].map(chip => (
                    <button
                      key={chip.val}
                      onClick={() => handleExperiencePreset(chip.val)}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors shrink-0 ${
                        experience === chip.val
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Base Salary (INR) + Quick Range Buttons */}
              <div className="sm:col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Current Annual Base Salary (INR)
                  </label>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {formatINR(salary)}
                  </span>
                </div>
                <div className="relative mb-2">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    step="50000"
                    value={salary}
                    onChange={(e) => setSalary(Math.max(100000, Number(e.target.value)))}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm font-bold font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                {/* Salary Quick Chips */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Quick Ranges:</span>
                  {[
                    { label: '₹6L', val: 600000 },
                    { label: '₹12L', val: 1200000 },
                    { label: '₹18L', val: 1800000 },
                    { label: '₹25L', val: 2500000 },
                    { label: '₹40L', val: 4000000 }
                  ].map(chip => (
                    <button
                      key={chip.val}
                      onClick={() => handleSalaryPreset(chip.val)}
                      className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold transition-colors ${
                        salary === chip.val
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Inference Outcome Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800/60 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm">
              <div>
                <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider block">
                  Model Consensus Recommendation
                </span>
                <div className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">
                  +{prediction.recommendedHike}% Hike Recommendation
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-400 block mt-1">
                  New Base Salary: <strong className="text-slate-900 dark:text-slate-100 font-mono">{formatINR(prediction.newSalary)}</strong> (Delta: +{formatINR(prediction.deltaSalary)})
                </span>
              </div>

              {/* Action Buttons in Banner */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  onClick={handleApproveCurrentCandidate}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all"
                >
                  <CheckCircle2 className="h-4 w-4" /> Approve & Add
                </button>
                <button
                  onClick={() => setIsLetterModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-50 dark:hover:bg-blue-950 transition-all shadow-sm"
                >
                  <FileText className="h-4 w-4" /> Generate Letter
                </button>
              </div>
            </div>

          </div>

          {/* Ledger Table Component */}
          <AppraisalLedger
            employees={employees}
            onSelectEmployeeForSimulator={handleSelectEmployeeForSimulator}
            onOpenAuditDrawer={(emp) => setAuditedEmployee(emp)}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onStatusToggle={handleStatusToggle}
          />

        </div>

        {/* Right Column: Model Consensus & Explainability */}
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
              <div 
                onClick={() => setSelectedFeatureInfo('gb')}
                className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
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
                <span className="text-[10px] text-slate-400 mt-1 block">150 Trees, Learning Rate 0.08 (R² 0.941)</span>
              </div>

              {/* Linear Regression */}
              <div 
                onClick={() => setSelectedFeatureInfo('lr')}
                className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
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
                <span className="text-[10px] text-slate-400 mt-1 block">Standard OLS Parametric Fit (R² 0.280)</span>
              </div>
            </div>
          </div>

          {/* Feature Weight Attribution Drivers */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              Feature Weight Attribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Relative driver contribution calculated for current candidate:
            </p>

            <div className="space-y-4">
              <div 
                onClick={() => setSelectedFeatureInfo(selectedFeatureInfo === 'rating' ? null : 'rating')}
                className="cursor-pointer p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">Performance Rating</span>
                  <span className="font-bold font-mono text-blue-600 dark:text-blue-400">{prediction.ratingShare}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${prediction.ratingShare}%` }}></div>
                </div>
                {selectedFeatureInfo === 'rating' && (
                  <p className="text-[11px] text-slate-500 mt-2 bg-blue-50/50 dark:bg-blue-950/30 p-2 rounded-lg">
                    Primary non-linear factor in model. Exponential exponent 1.8 awards ratings above 4.5 disproportionately.
                  </p>
                )}
              </div>

              <div 
                onClick={() => setSelectedFeatureInfo(selectedFeatureInfo === 'exp' ? null : 'exp')}
                className="cursor-pointer p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">Experience Tenure</span>
                  <span className="font-bold font-mono text-purple-600 dark:text-purple-400">{prediction.expShare}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-purple-600 h-2 rounded-full transition-all duration-500" style={{ width: `${prediction.expShare}%` }}></div>
                </div>
                {selectedFeatureInfo === 'exp' && (
                  <p className="text-[11px] text-slate-500 mt-2 bg-purple-50/50 dark:bg-purple-950/30 p-2 rounded-lg">
                    Logarithmic dampening curve ln(1 + Exp). Diminishing returns after 8+ years to prevent compression.
                  </p>
                )}
              </div>

              <div 
                onClick={() => setSelectedFeatureInfo(selectedFeatureInfo === 'role' ? null : 'role')}
                className="cursor-pointer p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">Role Market Baseline</span>
                  <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">{prediction.roleShare}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-600 h-2 rounded-full transition-all duration-500" style={{ width: `${prediction.roleShare}%` }}></div>
                </div>
                {selectedFeatureInfo === 'role' && (
                  <p className="text-[11px] text-slate-500 mt-2 bg-emerald-50/50 dark:bg-emerald-950/30 p-2 rounded-lg">
                    Captures tech talent supply-demand elasticity from 22,770 verified company payroll records.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Validation Metrics Snapshot */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3">
              Model Evaluation Specs
            </h3>
            <div className="space-y-2.5 text-xs">
              <div 
                onClick={() => setIsAccuracyModalOpen(true)}
                className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 hover:text-blue-600 cursor-pointer transition-colors"
              >
                <span className="text-slate-500">Test RMSE:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">6.1440</span>
              </div>
              <div 
                onClick={() => setIsAccuracyModalOpen(true)}
                className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 hover:text-emerald-600 cursor-pointer transition-colors"
              >
                <span className="text-slate-500">Test R² Score:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">0.941 / 0.280</span>
              </div>
              <div 
                onClick={() => setIsAccuracyModalOpen(true)}
                className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 hover:text-blue-600 cursor-pointer transition-colors"
              >
                <span className="text-slate-500">Test MAE (%):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">1.34% Core Error</span>
              </div>
              <div 
                onClick={() => setIsFormulaModalOpen(true)}
                className="flex justify-between py-1.5 hover:text-blue-600 cursor-pointer transition-colors"
              >
                <span className="text-slate-500">Target Range:</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">5.0% - 35.0%</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Modals & Drawers */}
      <AppraisalLetterModal
        isOpen={isLetterModalOpen}
        onClose={() => setIsLetterModalOpen(false)}
        employee={{
          name: "Evaluated Candidate",
          role,
          location,
          experience,
          rating,
          salary
        }}
        prediction={prediction}
      />

      <KpiFormulaModal
        isOpen={isFormulaModalOpen}
        onClose={() => setIsFormulaModalOpen(false)}
        prediction={prediction}
        role={role}
        rating={rating}
        experience={experience}
      />

      <KpiAccuracyModal
        isOpen={isAccuracyModalOpen}
        onClose={() => setIsAccuracyModalOpen(false)}
      />

      <KpiCohortModal
        isOpen={isCohortModalOpen}
        onClose={() => setIsCohortModalOpen(false)}
      />

      <KpiCtcModal
        isOpen={isCtcModalOpen}
        onClose={() => setIsCtcModalOpen(false)}
        salary={salary}
        newSalary={prediction.newSalary}
      />

      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={(newEmp) => setEmployees(prev => [newEmp, ...prev])}
        roles={VALID_ROLES}
        locations={VALID_LOCATIONS}
      />

      <AuditEmployeeDrawer
        employee={auditedEmployee}
        onClose={() => setAuditedEmployee(null)}
        onStatusChange={handleStatusChange}
      />

    </div>
  );
};
