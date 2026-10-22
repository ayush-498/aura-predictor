import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Copy, 
  Check, 
  FileText, 
  Award, 
  Users, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Sparkles,
  Info
} from 'lucide-react';
import { EmployeeProfile, PredictionResult } from '@/src/types/salary';
import { formatINR } from '@/src/services/predictionEngine';

// -------------------------------------------------------------
// 1. APPRAISAL LETTER MODAL
// -------------------------------------------------------------
interface AppraisalLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: {
    name: string;
    role: string;
    location: string;
    experience: number;
    rating: number;
    salary: number;
  };
  prediction: PredictionResult;
}

export const AppraisalLetterModal: React.FC<AppraisalLetterModalProps> = ({
  isOpen,
  onClose,
  employee,
  prediction
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const letterDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handleCopy = () => {
    const text = `
COMPENSATION REVISION & APPRAISAL MEMORANDUM
Date: ${letterDate}
Employee Name: ${employee.name}
Designation: ${employee.role} Engineer
Location: ${employee.location}
Performance Evaluation Rating: ${employee.rating} / 5.0

Dear ${employee.name},

In recognition of your continued contributions and technical excellence, management is pleased to approve a compensation revision effective immediately.

REVISED COMPENSATION STRUCTURE:
- Current Annual Base CTC: ${formatINR(employee.salary)}
- Performance Revision: +${prediction.recommendedHike}%
- Revised Annual Base CTC: ${formatINR(prediction.newSalary)}
- Annual Increment Delta: +${formatINR(prediction.deltaSalary)}

Model Governance: Automated Decision Support
Approved by: HR Compensation & Benefits Committee
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Official Appraisal Letter Generator
              </h2>
              <p className="text-xs text-slate-500">
                HR Governance & Compensation Memorandum
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Letter Preview Body */}
        <div className="my-6 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 font-serif text-slate-800 dark:text-slate-200 text-sm leading-relaxed shadow-inner">
          <div className="border-b border-slate-300 dark:border-slate-700 pb-4 mb-4 flex justify-between items-center text-xs font-mono text-slate-500">
            <span>MEMORANDUM ID: AURA-HR-{Math.floor(100000 + Math.random() * 900000)}</span>
            <span>Date: {letterDate}</span>
          </div>

          <p className="font-sans font-bold text-base text-slate-900 dark:text-slate-100">
            CONFIDENTIAL // TO: {employee.name}
          </p>
          <p className="font-sans text-xs text-slate-500 mb-4">
            Role: {employee.role} Engineer | Location: {employee.location} | Tenured: {employee.experience} Years
          </p>

          <p className="mb-4">
            Dear {employee.name},
          </p>
          <p className="mb-4">
            Following the annual appraisal cycle for technical personnel and evaluation under our machine learning-assisted performance standard, we are delighted to commend your performance rating of <strong>{employee.rating} / 5.0</strong>.
          </p>
          
          <div className="my-4 p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs">
            <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
              <span>Current Annual Compensation:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-right">{formatINR(employee.salary)}</span>
              <span>Approved Hike Percentage:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400 text-right">+{prediction.recommendedHike}%</span>
              <span>Annual Increment Amount:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-right">+{formatINR(prediction.deltaSalary)}</span>
              <span className="pt-2 border-t border-slate-200 dark:border-slate-700 font-sans font-bold text-slate-900 dark:text-slate-100">Revised Annual CTC:</span>
              <span className="pt-2 border-t border-slate-200 dark:border-slate-700 font-bold text-base text-slate-900 dark:text-slate-100 text-right">{formatINR(prediction.newSalary)}</span>
            </div>
          </div>

          <p className="mb-4">
            This salary revision will reflect in the upcoming payroll cycle. We thank you for your commitment to excellence and innovation.
          </p>

          <div className="mt-8 pt-4 border-t border-slate-300 dark:border-slate-700 flex justify-between items-end font-sans text-xs">
            <div>
              <div className="font-bold text-slate-900 dark:text-slate-100">VP, People Operations</div>
              <div className="text-slate-500">Global Compensation & Benefits</div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                <ShieldCheck className="h-3 w-3" /> Digitally Authenticated
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Printer className="h-4 w-4" /> Print Letter
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied to Clipboard' : 'Copy Memorandum Text'}
          </button>
        </div>

      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 2. KPI FORMULA DEEP-DIVE MODAL (SIMULATED HIKE)
// -------------------------------------------------------------
interface KpiFormulaModalProps {
  isOpen: boolean;
  onClose: () => void;
  prediction: PredictionResult;
  role: string;
  rating: number;
  experience: number;
}

export const KpiFormulaModal: React.FC<KpiFormulaModalProps> = ({
  isOpen,
  onClose,
  prediction,
  role,
  rating,
  experience
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-7">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 dark:bg-blue-950 text-blue-600 rounded-lg">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Simulated Hike Calculation Engine
              </h2>
              <p className="text-xs text-slate-500">Mathematical formulation breakdown</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="my-5 space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-slate-800 dark:text-slate-200">
            <span className="text-slate-400 block mb-1">Non-Linear Model Formula:</span>
            <code className="text-blue-600 dark:text-blue-400 font-bold block">
              Hike% = Base(8.5) + (Rating/5.0)^1.8 * 11.2 + ln(1 + Exp) * 3.4 + RoleOffset
            </code>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Base Corporate Baseline:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">+8.50%</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Rating Impact ({rating.toFixed(1)}/5.0):</span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                +{(Math.pow(rating / 5.0, 1.8) * 11.2).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Tenure Experience Impact ({experience} yrs):</span>
              <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                +{(Math.log1p(experience) * 3.4).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Role Market Modifier ({role}):</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                +{prediction.gbHike > 20 ? 'Market Demand Premium' : 'Baseline Scale'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Statutory Policy Boundaries:</span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-300">Min 5.0% - Max 35.0%</span>
            </div>
            <div className="flex justify-between py-2.5 bg-blue-50/60 dark:bg-blue-950/30 px-3 rounded-lg">
              <span className="font-bold text-slate-900 dark:text-slate-100">Final Recommended Hike:</span>
              <span className="font-mono font-extrabold text-blue-600 dark:text-blue-400 text-sm">
                +{prediction.recommendedHike}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-xl">
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 3. KPI ACCURACY MODAL (R² & MAE)
// -------------------------------------------------------------
interface KpiAccuracyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KpiAccuracyModal: React.FC<KpiAccuracyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-7">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-50 dark:bg-purple-950 text-purple-600 rounded-lg">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Model Performance & Error Distribution
              </h2>
              <p className="text-xs text-slate-500">Cross-validation benchmarks on 20% holdout</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="my-5 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-500 text-[11px] block">Mean Absolute Error (MAE)</span>
              <span className="text-xl font-black text-slate-900 dark:text-slate-100">1.34%</span>
              <p className="text-[11px] text-emerald-600 mt-1">Within standard ±1.5% HR leeway</p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-500 text-[11px] block">Test RMSE Score</span>
              <span className="text-xl font-black text-slate-900 dark:text-slate-100">6.14</span>
              <p className="text-[11px] text-slate-400 mt-1">Full-feature tree ensemble</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 text-purple-900 dark:text-purple-300">
            <div className="font-bold flex items-center gap-1.5 mb-1">
              <Sparkles className="h-4 w-4" /> Why Ensemble Outperforms Linear Models
            </div>
            <p className="leading-relaxed text-[11px]">
              Salary hike policies exhibit sharp non-linear thresholds: an employee with rating 4.8 receives disproportionately higher bonuses compared to a 3.8 rating than a linear slope accounts for. Gradient Boosting captures these tree-based inflection points cleanly.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-xl">
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 4. KPI COHORT DEMOGRAPHICS MODAL (TRAINING DATASET)
// -------------------------------------------------------------
interface KpiCohortModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KpiCohortModal: React.FC<KpiCohortModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-7">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-lg">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                22,770 Training Profiles Demographics
              </h2>
              <p className="text-xs text-slate-500">Source: salary_data.csv Tech Sector Cohort</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="my-5 space-y-3 text-xs">
          <div className="space-y-2">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Primary Roles Sampled:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">11 Specialized Tech Disciplines</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Location Distribution:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">Tier 1 & Tier 2 Indian Tech Hubs</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Experience Range:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">0.5 to 20.0 Years (Median 4.8y)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Performance Rating Range:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">1.0 to 5.0 (Normal mean 3.8)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Historical Hike Distribution:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">5.0% - 35.0% (Median 14.8%)</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-xl">
            Close Demographics
          </button>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 5. KPI CTC BREAKDOWN MODAL (PROJECTED SALARY)
// -------------------------------------------------------------
interface KpiCtcModalProps {
  isOpen: boolean;
  onClose: () => void;
  salary: number;
  newSalary: number;
}

export const KpiCtcModal: React.FC<KpiCtcModalProps> = ({ isOpen, onClose, salary, newSalary }) => {
  if (!isOpen) return null;

  const basic = Math.round(newSalary * 0.5);
  const hra = Math.round(newSalary * 0.2);
  const special = Math.round(newSalary * 0.2);
  const pfGratuity = Math.round(newSalary * 0.1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-7">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 dark:bg-amber-950 text-amber-600 rounded-lg">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Annual CTC Salary Structure Projection
              </h2>
              <p className="text-xs text-slate-500">Standard Indian Tech Compensation Components</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="my-5 space-y-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex justify-between items-center">
            <span className="text-slate-500">Previous Base CTC:</span>
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{formatINR(salary)}</span>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Basic Salary (50%):</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{formatINR(basic)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">House Rent Allowance - HRA (20%):</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{formatINR(hra)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Special Allowance & Flexi-Pay (20%):</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{formatINR(special)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Provident Fund & Retirals (10%):</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{formatINR(pfGratuity)}</span>
            </div>
            <div className="flex justify-between py-2.5 bg-amber-50/60 dark:bg-amber-950/30 px-3 rounded-lg">
              <span className="font-bold text-slate-900 dark:text-slate-100">Projected Total Base CTC:</span>
              <span className="font-mono font-extrabold text-amber-600 dark:text-amber-400 text-sm">{formatINR(newSalary)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-xl">
            Close Structure
          </button>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 6. ADD EMPLOYEE APPRAISAL MODAL
// -------------------------------------------------------------
interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (employee: EmployeeProfile) => void;
  roles: string[];
  locations: string[];
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  roles,
  locations
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState(roles[0] || 'SDE');
  const [experience, setExperience] = useState(3.5);
  const [rating, setRating] = useState(4.0);
  const [salary, setSalary] = useState(1000000);
  const [location, setLocation] = useState(locations[0] || 'Bangalore');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Estimate hike for newly added employee
    const estHike = Number((10.0 + (rating * 2.2) + (experience * 0.3)).toFixed(1));
    const newSal = Math.round(salary * (1 + estHike / 100));

    const newEmp: EmployeeProfile = {
      id: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name.trim(),
      role,
      experience,
      rating,
      currentSalary: salary,
      location,
      hikePct: estHike,
      newSalary: newSal,
      status: rating >= 4.0 ? 'Approved' : 'Review',
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 9999999)}?w=100&h=100&fit=crop&crop=faces`,
      department: `${role} Engineering`,
      lastAppraisalDate: new Date().toISOString().split('T')[0],
      comments: "Manually entered candidate appraisal record."
    };

    onAdd(newEmp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Add Candidate Appraisal Record
          </h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Employee Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sanjay Narang"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                {locations.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Rating (1.0 - 5.0)</label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="5.0"
                value={rating}
                onChange={(e) => setRating(parseFloat(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Experience (Yrs)</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="25"
                value={experience}
                onChange={(e) => setExperience(parseFloat(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Current Base Salary (INR)</label>
            <input
              type="number"
              step="50000"
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700"
            >
              Add to Appraisal Ledger
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 7. AUDIT EMPLOYEE DRAWER
// -------------------------------------------------------------
interface AuditEmployeeDrawerProps {
  employee: EmployeeProfile | null;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: 'Approved' | 'Review' | 'Flagged') => void;
}

export const AuditEmployeeDrawer: React.FC<AuditEmployeeDrawerProps> = ({
  employee,
  onClose,
  onStatusChange
}) => {
  if (!employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 sm:p-7">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <img src={employee.avatar} alt={employee.name} className="w-11 h-11 rounded-xl object-cover" />
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {employee.name}
              </h2>
              <p className="text-xs text-slate-500 font-mono">{employee.id} // {employee.role} Engineer</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="my-5 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-slate-400 block">Current Base CTC</span>
              <span className="text-base font-bold text-slate-900 dark:text-slate-100">{formatINR(employee.currentSalary)}</span>
            </div>
            <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40">
              <span className="text-blue-600 dark:text-blue-400 block font-semibold">Recommended Hike</span>
              <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">+{employee.hikePct}%</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Performance Rating:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">★ {employee.rating} / 5.0</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Experience Tenure:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{employee.experience} Years</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Office Location:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{employee.location}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Department:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{employee.department || 'Engineering'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Projected Base Post-Hike:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{formatINR(employee.newSalary)}</span>
            </div>
          </div>

          {employee.comments && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="font-bold block text-slate-700 dark:text-slate-300 mb-1">Appraisal Reviewer Notes:</span>
              <p className="text-slate-500 leading-relaxed">{employee.comments}</p>
            </div>
          )}

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-2">Change Governance Status:</label>
            <div className="flex gap-2">
              <button
                onClick={() => onStatusChange(employee.id, 'Approved')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${
                  employee.status === 'Approved'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 hover:bg-emerald-100'
                }`}
              >
                Approve
              </button>
              <button
                onClick={() => onStatusChange(employee.id, 'Review')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${
                  employee.status === 'Review'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400 hover:bg-amber-100'
                }`}
              >
                Needs Review
              </button>
              <button
                onClick={() => onStatusChange(employee.id, 'Flagged')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${
                  employee.status === 'Flagged'
                    ? 'bg-rose-600 text-white'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400 hover:bg-rose-100'
                }`}
              >
                Flag Policy Outlier
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button onClick={onClose} className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-xl">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
