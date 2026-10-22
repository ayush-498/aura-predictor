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
  LucideIcon,
  ShieldCheck,
  Check,
  X,
  Menu
} from "lucide-react";

import { EmployeeProfile, PredictionResult } from "@/src/types/salary";
import { 
  VALID_ROLES, 
  VALID_LOCATIONS, 
  INITIAL_RECENT_APPRAISALS, 
  computeLocalPrediction 
} from "@/src/services/predictionEngine";

import { PredictorWorkspace } from "@/src/features/predictor/PredictorWorkspace";
import { ModelBenchmarksView } from "@/src/features/analytics/ModelBenchmarksView";
import { EmployeeCohortsView } from "@/src/features/analytics/EmployeeCohortsView";
import { CompensationBandsView } from "@/src/features/analytics/CompensationBandsView";
import { BatchEvaluationView } from "@/src/features/analytics/BatchEvaluationView";
import { TelemetryLogsView } from "@/src/features/analytics/TelemetryLogsView";
import { PipelineConfigView } from "@/src/features/analytics/PipelineConfigView";
import { DocumentationView } from "@/src/features/analytics/DocumentationView";

export { VALID_ROLES, VALID_LOCATIONS };

export const Example: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState<string>("Appraisal Predictor");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Global State for Predictor & Ledger
  const [role, setRole] = useState<string>("SDE");
  const [rating, setRating] = useState<number>(4.2);
  const [experience, setExperience] = useState<number>(6.0);
  const [salary, setSalary] = useState<number>(1200000);
  const [location, setLocation] = useState<string>("Bangalore");
  const [employees, setEmployees] = useState<EmployeeProfile[]>(INITIAL_RECENT_APPRAISALS);

  // Policy bounds
  const [minFloor, setMinFloor] = useState<number>(5.0);
  const [maxCeiling, setMaxCeiling] = useState<number>(35.0);
  const [activeStrategy, setActiveStrategy] = useState<string>('gb');

  // Interactive Header & System Modals
  const [isVersionModalOpen, setIsVersionModalOpen] = useState<boolean>(false);
  const [isProfilePopoverOpen, setIsProfilePopoverOpen] = useState<boolean>(false);
  const [analystRole, setAnalystRole] = useState<string>("HR Lead Analyst");
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'offline'>('checking');

  // Probe backend API health
  useEffect(() => {
    let isMounted = true;
    fetch('http://localhost:5050/api/health')
      .then(res => res.json())
      .then(data => {
        if (isMounted) {
          if (data && data.status === 'healthy') setBackendStatus('connected');
          else setBackendStatus('offline');
        }
      })
      .catch(() => {
        if (isMounted) setBackendStatus('offline');
      });
    return () => { isMounted = false; };
  }, []);

  // Sync dark class on document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Compute live prediction
  const prediction = useMemo(() => {
    return computeLocalPrediction(
      { role, rating, experience, salary, location, status: 'Full Time' },
      { minFloor, maxCeiling, modelStrategy: activeStrategy }
    );
  }, [role, rating, experience, salary, location, minFloor, maxCeiling, activeStrategy]);

  const handleRoleSelectFromCohort = (selectedRole: string) => {
    setRole(selectedRole);
    setSelectedTab("Appraisal Predictor");
  };

  return (
    <div className={`flex min-h-screen w-full ${isDark ? 'dark' : ''}`}>
      <div className="flex w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar
            open={isSidebarOpen}
            setOpen={setIsSidebarOpen}
            selected={selectedTab}
            setSelected={setSelectedTab}
            onOpenVersionModal={() => setIsVersionModalOpen(true)}
          />
        </div>

        {/* Mobile Slide-Over Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div 
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative flex flex-col w-72 bg-white dark:bg-slate-900 h-full p-4 shadow-2xl z-10">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
                <TitleSection open={true} onOpenModal={() => { setIsVersionModalOpen(true); setIsMobileMenuOpen(false); }} />
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-1 overflow-y-auto flex-1">
                <SidebarOptions
                  selected={selectedTab}
                  setSelected={(tab) => { setSelectedTab(tab); setIsMobileMenuOpen(false); }}
                  open={true}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
          
          {/* Header Bar */}
          <header className="sticky top-0 z-30 flex items-center justify-between p-4 md:px-8 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
            
            {/* Left: Mobile hamburger & Title */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 text-slate-600 dark:text-slate-300 md:hidden hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    ML Production Engine
                  </span>
                  <button 
                    onClick={() => setIsVersionModalOpen(true)}
                    className="text-xs text-slate-500 font-mono hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                  >
                    v2.4 Core
                  </button>
                </div>
                <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  Employee Salary Hike Predictor
                </h1>
              </div>
            </div>

            {/* Right: API Badge, Dark/Light, and Profile */}
            <div className="flex items-center gap-3">
              
              {/* Backend API status pill */}
              <button 
                onClick={() => {
                  setBackendStatus('checking');
                  fetch('http://localhost:5050/api/health')
                    .then(res => res.json())
                    .then(data => setBackendStatus(data?.status === 'healthy' ? 'connected' : 'offline'))
                    .catch(() => setBackendStatus('offline'));
                }}
                className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                  backendStatus === 'connected'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
                title="Click to refresh connection to Python REST API (Port 5050)"
              >
                <span className={`w-2 h-2 rounded-full ${backendStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                {backendStatus === 'connected' ? 'Backend Live (5050)' : 'Neural Engine Active'}
              </button>

              {/* Theme Toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
                title="Toggle Theme"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              {/* Profile Avatar & Interactive Popover */}
              <div className="relative">
                <button
                  onClick={() => setIsProfilePopoverOpen(!isProfilePopoverOpen)}
                  className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
                    alt="Appraisal Lead"
                    className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                  />
                  <div className="hidden sm:block text-left">
                    <span className="block text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                      {analystRole}
                    </span>
                    <span className="block text-[10px] text-slate-500 font-mono">
                      Decision Support Auth
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
                </button>

                {/* Profile Popover Modal */}
                {isProfilePopoverOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 z-40 text-xs animate-fadeIn">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                      <img 
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
                        alt="Profile"
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100">Dr. Maya Sen</div>
                        <div className="text-[11px] text-slate-400 font-mono">ID: HR-LEAD-882</div>
                      </div>
                    </div>

                    <div className="space-y-1 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Switch Governance Role:
                      </span>
                      {['HR Lead Analyst', 'Comp & Benefits VP', 'Engineering Director'].map((r) => (
                        <button
                          key={r}
                          onClick={() => { setAnalystRole(r); setIsProfilePopoverOpen(false); }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                            analystRole === r 
                              ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 font-bold' 
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                      <span>Audit Session Active</span>
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    </div>
                  </div>
                )}

              </div>

            </div>

          </header>

          {/* Tab Content Router */}
          <main className="flex-1 p-6 md:p-8">
            {selectedTab === "Appraisal Predictor" && (
              <PredictorWorkspace
                role={role}
                setRole={setRole}
                rating={rating}
                setRating={setRating}
                experience={experience}
                setExperience={setExperience}
                salary={salary}
                setSalary={setSalary}
                location={location}
                setLocation={setLocation}
                prediction={prediction}
                employees={employees}
                setEmployees={setEmployees}
              />
            )}

            {selectedTab === "Model Benchmarks" && (
              <ModelBenchmarksView
                activeStrategy={activeStrategy}
                setActiveStrategy={setActiveStrategy}
              />
            )}

            {selectedTab === "Employee Cohorts" && (
              <EmployeeCohortsView
                onSelectRoleForSimulator={handleRoleSelectFromCohort}
              />
            )}

            {selectedTab === "Compensation Bands" && (
              <CompensationBandsView />
            )}

            {selectedTab === "Batch Evaluation" && (
              <BatchEvaluationView />
            )}

            {selectedTab === "Telemetry & Logs" && (
              <TelemetryLogsView />
            )}

            {selectedTab === "Pipeline Config" && (
              <PipelineConfigView
                minFloor={minFloor}
                setMinFloor={setMinFloor}
                maxCeiling={maxCeiling}
                setMaxCeiling={setMaxCeiling}
                activeStrategy={activeStrategy}
                setActiveStrategy={setActiveStrategy}
              />
            )}

            {selectedTab === "Documentation" && (
              <DocumentationView />
            )}
          </main>

        </div>

      </div>

      {/* Model Checkpoint Version Modal */}
      {isVersionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 dark:bg-blue-950 text-blue-600 rounded-lg">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    AURA Model Version 2.4.1 Production Checkpoint
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">SHA256: 8f9b4a1c098e7d23</p>
                </div>
              </div>
              <button onClick={() => setIsVersionModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs font-mono my-4">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 font-sans">Serialized Pipeline:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">gradient_boosting_full.joblib</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 font-sans">Training Corpus:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">22,770 Tech Payroll Records</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 font-sans">Model Consensus R²:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">0.941</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 font-sans">Serving Microservice:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">REST Port 5050 / HTTP 2.0</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500 font-sans">Policy Compliance:</span>
                <span className="font-bold text-emerald-600">Enterprise Certified</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsVersionModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs"
              >
                Close Spec
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// --------------------------------------------------------------------------
// SIDEBAR SHELL COMPONENT
// --------------------------------------------------------------------------
interface SidebarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selected: string;
  setSelected: (tab: string) => void;
  onOpenVersionModal: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen, selected, setSelected, onOpenVersionModal }) => {
  return (
    <nav
      className={`sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out ${
        open ? 'w-64' : 'w-16'
      } border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-sm flex flex-col justify-between`}
    >
      <div>
        <TitleSection open={open} onOpenModal={onOpenVersionModal} />
        <SidebarOptions selected={selected} setSelected={setSelected} open={open} />
      </div>

      <ToggleClose open={open} setOpen={setOpen} />
    </nav>
  );
};

interface SidebarOptionsProps {
  selected: string;
  setSelected: (tab: string) => void;
  open: boolean;
}

const SidebarOptions: React.FC<SidebarOptionsProps> = ({ selected, setSelected, open }) => {
  return (
    <>
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
    </>
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
      className={`nav-pill-btn group relative flex h-10 w-full items-center rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isSelected ? "nav-pill-active" : ""
      } ${open ? "px-2.5 gap-2.5" : "justify-center p-0"}`}
      title={open ? undefined : title}
    >
      {/* Circular Icon Container with Rotating Ring */}
      <div className="relative flex items-center justify-center shrink-0 w-7 h-7 rounded-full">
        <div className="nav-pill-ring" aria-hidden="true" />
        <div className="relative z-10 flex items-center justify-center w-full h-full rounded-full bg-gradient-to-b from-[#181920] to-[#0a0a0d] border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.18)]">
          <Icon className="h-3.5 w-3.5 text-zinc-200 group-hover:text-white transition-colors drop-shadow-[0_1px_1px_rgba(255,255,255,0.35)] shrink-0" />
        </div>
      </div>
      
      {open && (
        <span
          className={`text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors truncate ${
            isSelected ? 'text-white' : ''
          }`}
        >
          {title}
        </span>
      )}

      {notifs && open && (
        <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-zinc-800 text-[10px] text-zinc-300 border border-zinc-700/60 px-1 font-bold">
          {notifs}
        </span>
      )}
    </button>
  );
};

interface TitleSectionProps {
  open: boolean;
  onOpenModal?: () => void;
}

const TitleSection: React.FC<TitleSectionProps> = ({ open, onOpenModal }) => {
  return (
    <div className="mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
      <div 
        onClick={onOpenModal}
        className="flex cursor-pointer items-center justify-between rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 group"
        title="Click to view model checkpoint details"
      >
        <div className="flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-content-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
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
          <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
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

export default Example;
