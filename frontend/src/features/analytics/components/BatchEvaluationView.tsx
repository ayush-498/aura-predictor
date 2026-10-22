import React, { useState } from 'react';
import { FileSpreadsheet, Play, CheckCircle2, Download, RefreshCw, Cpu, ShieldCheck } from 'lucide-react';
import { Card, CardHeaderTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { formatINR } from '../../../lib/utils';
import { salaryService } from '../../../services/salaryService';
import { useAppraisalLedger } from '../../../context/AppraisalLedgerContext';
import { EmployeeProfile } from '../../../types';

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
  const [commitToast, setCommitToast] = useState<string | null>(null);
  const { addBatch } = useAppraisalLedger();

  const handleCommitToLedger = () => {
    const toCommit = candidates.filter(c => c.status === 'Approved');
    if (toCommit.length === 0) return;
    const profiles: EmployeeProfile[] = toCommit.map(c => ({
      id: c.id,
      name: c.name,
      role: c.role,
      experience: c.experience,
      rating: c.rating,
      currentSalary: c.currentSalary,
      location: 'Bangalore',
      hikePct: c.predictedHike,
      newSalary: c.newSalary,
      status: 'Approved',
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 10000)}?w=100&h=100&fit=crop&crop=faces`,
      department: `${c.role} Engineering`,
      source: 'CSV Ingestion'
    }));
    addBatch(profiles);
    setCommitToast(`Committed ${profiles.length} approved candidate(s) to the active Appraisal Ledger!`);
    setTimeout(() => setCommitToast(null), 4000);
  };

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

  const runBatchInference = async () => {
    setIsProcessing(true);
    try {
      const res = await salaryService.batchPredict(candidates);
      if (res && res.results && res.results.length > 0) {
        const resultMap = new Map(res.results.map(r => [r.id, r]));
        setCandidates(prev => prev.map(c => {
          const pred = resultMap.get(c.id);
          if (pred) {
            return {
              ...c,
              predictedHike: pred.predictedHike,
              newSalary: pred.newSalary || c.newSalary,
              status: pred.predictedHike < 9.0 ? 'Flagged' : (c.status === 'Approved' ? 'Approved' : 'Pending')
            };
          }
          return c;
        }));
      }
    } catch (err) {
      console.warn('Batch inference failed, falling back to local simulation:', err);
      setCandidates(prev => prev.map(c => {
        const hike = Number((8.5 + Math.pow(c.rating / 5, 1.8) * 11.2 + Math.log1p(c.experience) * 3.4).toFixed(1));
        const boundedHike = Math.max(5.0, Math.min(35.0, hike));
        const newSal = Math.round(c.currentSalary * (1 + boundedHike / 100));
        return {
          ...c,
          predictedHike: boundedHike,
          newSalary: newSal,
          status: boundedHike < 9.0 ? 'Flagged' : (c.status === 'Approved' ? 'Approved' : 'Pending')
        };
      }));
    } finally {
      setIsProcessing(false);
    }
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

  const filtered = candidates.filter(c => {
    if (filterMode === 'high') return c.predictedHike >= 20.0;
    if (filterMode === 'standard') return c.predictedHike >= 12.0 && c.predictedHike < 20.0;
    if (filterMode === 'flagged') return c.predictedHike < 12.0 || c.status === 'Flagged';
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <CardHeaderTitle
        icon={FileSpreadsheet}
        title="Batch Appraisal Evaluation Engine"
        subtitle="Simultaneous inference for departmental compensation rounds"
        action={
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={runBatchInference} disabled={isProcessing}>
              {isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />}
              {isProcessing ? 'Computing...' : 'Run Batch Inference'}
            </Button>
            <Button variant="secondary" size="sm" onClick={handleCommitToLedger}>
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> Commit to Ledger
            </Button>
            <Button variant="secondary" size="sm" onClick={exportBatchCsv}>
              <Download className="w-3.5 h-3.5 mr-1.5" /> Export CSV
            </Button>
          </div>
        }
      />

      {commitToast && (
        <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-xs font-semibold text-emerald-200 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{commitToast}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex gap-1.5">
          {['all', 'high', 'standard', 'flagged'].map(m => (
            <button
              key={m}
              onClick={() => setFilterMode(m)}
              className={`px-3 py-1 rounded-lg font-bold capitalize transition-colors ${
                filterMode === m
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
              }`}
            >
              {m === 'high' ? 'High (>20%)' : (m === 'standard' ? 'Standard' : (m === 'flagged' ? 'Flagged (<12%)' : 'All Candidates'))}
            </button>
          ))}
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="font-mono text-zinc-500">{selectedIds.length} Selected</span>
            <Button size="sm" onClick={handleBulkApprove}>
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Bulk Approve
            </Button>
          </div>
        )}
      </div>

      <Card className="p-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-semibold uppercase text-[10px]">
                <th className="pb-3 pl-1">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === candidates.length && candidates.length > 0}
                    onChange={handleSelectAll}
                    className="accent-emerald-600 cursor-pointer"
                  />
                </th>
                <th className="pb-3">Candidate</th>
                <th className="pb-3">Role & Exp</th>
                <th className="pb-3">Rating</th>
                <th className="pb-3">Current CTC</th>
                <th className="pb-3">Predicted Hike</th>
                <th className="pb-3">Projected CTC</th>
                <th className="pb-3 pr-1 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                  <td className="py-3 pl-1">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(c.id)}
                      onChange={() => handleToggleSelect(c.id)}
                      className="accent-emerald-600 cursor-pointer"
                    />
                  </td>
                  <td className="py-3">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 block">{c.name}</span>
                    <span className="font-mono text-zinc-400 text-[10px]">{c.id}</span>
                  </td>
                  <td className="py-3">
                    <span className="font-semibold">{c.role}</span>
                    <span className="block text-zinc-400 text-[10px]">{c.experience} yrs</span>
                  </td>
                  <td className="py-3 font-mono font-bold">★ {c.rating}</td>
                  <td className="py-3 font-mono text-zinc-500">{formatINR(c.currentSalary)}</td>
                  <td className="py-3 font-mono font-extrabold text-emerald-600">+{c.predictedHike}%</td>
                  <td className="py-3 font-mono font-bold">{formatINR(c.newSalary)}</td>
                  <td className="py-3 pr-1 text-right">
                    {c.status === 'Approved' && <Badge variant="success">Approved</Badge>}
                    {c.status === 'Pending' && <Badge variant="warning">Pending</Badge>}
                    {c.status === 'Flagged' && <Badge variant="danger">Flagged</Badge>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
