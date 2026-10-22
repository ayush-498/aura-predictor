import React, { useState } from 'react';
import { FileSpreadsheet, Play, CheckCircle2, Download, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import { formatINR, ROLE_MULTIPLIERS } from '@/src/services/predictionEngine';

interface BatchCandidate {
  id: string;
  name: string;
  role: string;
  experience: number;
  rating: number;
  currentSalary: number;
  predictedHike: number;
  newSalary: number;
  status: 'Pending' | 'Approved' | 'Flagged';
}

const INITIAL_BATCH: BatchCandidate[] = [
  { id: "BAT-101", name: "Kunal Mehra", role: "SDE", experience: 4.5, rating: 4.6, currentSalary: 1350000, predictedHike: 20.4, newSalary: 1625400, status: 'Pending' },
  { id: "BAT-102", name: "Neha Roy", role: "Backend", experience: 6.0, rating: 4.2, currentSalary: 1700000, predictedHike: 18.2, newSalary: 2009400, status: 'Pending' },
  { id: "BAT-103", name: "Siddharth Jain", role: "Frontend", experience: 3.0, rating: 3.8, currentSalary: 950000, predictedHike: 14.8, newSalary: 1090600, status: 'Pending' },
  { id: "BAT-104", name: "Divya Nambiar", role: "Python", experience: 5.0, rating: 4.9, currentSalary: 1550000, predictedHike: 24.1, newSalary: 1923550, status: 'Pending' },
  { id: "BAT-105", name: "Arjun Reddy", role: "Mobile", experience: 7.5, rating: 4.1, currentSalary: 1900000, predictedHike: 17.5, newSalary: 2232500, status: 'Pending' },
  { id: "BAT-106", name: "Tanya Sen", role: "Testing", experience: 4.0, rating: 3.1, currentSalary: 750000, predictedHike: 11.2, newSalary: 834000, status: 'Pending' },
  { id: "BAT-107", name: "Manish Chawla", role: "Java", experience: 8.0, rating: 4.4, currentSalary: 2200000, predictedHike: 19.3, newSalary: 2624600, status: 'Pending' },
  { id: "BAT-108", name: "Ritika Ghosh", role: "Database", experience: 2.5, rating: 2.8, currentSalary: 600000, predictedHike: 7.2, newSalary: 643200, status: 'Flagged' }
];

export const BatchEvaluationView: React.FC = () => {
  const [candidates, setCandidates] = useState<BatchCandidate[]>(INITIAL_BATCH);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [filterMode, setFilterMode] = useState<string>('all');

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(candidates.map(c => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const runBatchInference = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setCandidates(prev => prev.map(c => {
        const offset = ROLE_MULTIPLIERS[c.role] || 0.0;
        const hike = Number((8.5 + Math.pow(c.rating / 5, 1.8) * 11.2 + Math.log1p(c.experience) * 3.4 + offset).toFixed(1));
        const boundedHike = Math.max(5.0, Math.min(35.0, hike));
        const newSal = Math.round(c.currentSalary * (1 + boundedHike / 100));
        return {
          ...c,
          predictedHike: boundedHike,
          newSalary: newSal,
          status: boundedHike < 9.0 ? 'Flagged' : (c.status === 'Approved' ? 'Approved' : 'Pending')
        };
      }));
      setIsProcessing(false);
    }, 600);
  };

  const handleBulkApprove = () => {
    setCandidates(prev => prev.map(c => 
      selectedIds.includes(c.id) ? { ...c, status: 'Approved' } : c
    ));
    setSelectedIds([]);
  };

  const exportBatchCsv = () => {
    const headers = ["Batch_ID", "Candidate_Name", "Role", "Experience_Yrs", "Rating", "Current_Salary_INR", "Recommended_Hike_Pct", "Projected_Salary_INR", "Status"];
    const rows = candidates.map(c => [
      c.id,
      `"${c.name}"`,
      c.role,
      c.experience,
      c.rating,
      c.currentSalary,
      c.predictedHike,
      c.newSalary,
      c.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `batch_salary_hikes_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredCandidates = candidates.filter(c => {
    if (filterMode === 'high') return c.predictedHike >= 20.0;
    if (filterMode === 'standard') return c.predictedHike >= 12.0 && c.predictedHike < 20.0;
    if (filterMode === 'flagged') return c.predictedHike < 12.0 || c.status === 'Flagged';
    return true;
  });

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
              Bulk Processing
            </span>
            <span className="text-xs text-slate-500 font-mono">Simultaneous Cohort Inference</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            Department Batch Appraisal Evaluation
          </h2>
          <p className="text-xs text-slate-500">
            Execute machine learning inference across multiple engineering candidates and bulk approve compensation revisions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={runBatchInference}
            disabled={isProcessing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
          >
            {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-white" />}
            {isProcessing ? 'Computing Inferences...' : 'Run Batch Inference'}
          </button>
          <button
            onClick={exportBatchCsv}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Control Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-500">Filter View:</span>
          <div className="flex gap-1.5">
            {['all', 'high', 'standard', 'flagged'].map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterMode(mode)}
                className={`px-3 py-1 rounded-lg font-bold capitalize transition-colors ${
                  filterMode === mode
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {mode === 'high' ? 'High (>20%)' : (mode === 'standard' ? 'Standard (12-20%)' : (mode === 'flagged' ? 'Flagged (<12%)' : 'All Candidates'))}
              </button>
            ))}
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="font-mono text-slate-500">{selectedIds.length} Selected</span>
            <button
              onClick={handleBulkApprove}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors"
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> Bulk Approve Selected
            </button>
          </div>
        )}
      </div>

      {/* Candidates Table */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 font-semibold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pl-1">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedIds.length === candidates.length && candidates.length > 0}
                    className="rounded border-slate-300 accent-blue-600 cursor-pointer"
                  />
                </th>
                <th className="pb-3">Candidate</th>
                <th className="pb-3">Role & Tenure</th>
                <th className="pb-3">Performance</th>
                <th className="pb-3">Current CTC</th>
                <th className="pb-3">Predicted Hike</th>
                <th className="pb-3">Projected CTC</th>
                <th className="pb-3 pr-1 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredCandidates.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 pl-1">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(c.id)}
                      onChange={() => handleToggleSelect(c.id)}
                      className="rounded border-slate-300 accent-blue-600 cursor-pointer"
                    />
                  </td>
                  <td className="py-3.5">
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">{c.name}</span>
                    <span className="font-mono text-slate-400 text-[11px]">{c.id}</span>
                  </td>
                  <td className="py-3.5">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{c.role}</span>
                    <span className="block text-slate-400 text-[11px]">{c.experience} yrs</span>
                  </td>
                  <td className="py-3.5 font-mono font-bold text-slate-900 dark:text-slate-100">
                    ★ {c.rating}
                  </td>
                  <td className="py-3.5 font-mono text-slate-600 dark:text-slate-400">
                    {formatINR(c.currentSalary)}
                  </td>
                  <td className="py-3.5 font-mono font-extrabold text-blue-600 dark:text-blue-400">
                    +{c.predictedHike}%
                  </td>
                  <td className="py-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {formatINR(c.newSalary)}
                  </td>
                  <td className="py-3.5 pr-1 text-right">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                      c.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                        : (c.status === 'Flagged'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400')
                    }`}>
                      {c.status}
                    </span>
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
