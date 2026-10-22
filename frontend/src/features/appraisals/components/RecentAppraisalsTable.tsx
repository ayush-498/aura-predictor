import React, { useState, useMemo, useRef } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Eye,
  ArrowUpRight,
  Sparkles,
  Download,
  Plus,
  X,
  Upload,
  FileSpreadsheet,
  Trash2,
  RotateCcw,
  FileText,
  Check,
  Briefcase,
  TrendingUp,
} from 'lucide-react';
import { Card, CardHeaderTitle } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { EmployeeProfile, VALID_ROLES, VALID_LOCATIONS } from '../../../types';
import { formatINR, formatPercent } from '../../../lib/utils';
import { useAppraisalLedger } from '../../../context/AppraisalLedgerContext';
import { salaryService } from '../../../services/salaryService';

interface RecentAppraisalsTableProps {
  onSelectEmployee?: (emp: EmployeeProfile) => void;
  onNavigateToSimulator?: () => void;
  onNavigateToResumeScanner?: () => void;
}

export const RecentAppraisalsTable: React.FC<RecentAppraisalsTableProps> = ({ 
  onSelectEmployee,
  onNavigateToSimulator,
  onNavigateToResumeScanner,
}) => {
  const {
    ledger,
    updateStatus,
    removeCandidate,
    addCandidate,
    addBatch,
    clearLedger,
    resetToBaseline,
  } = useAppraisalLedger();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('All');
  const [selectedEmp, setSelectedEmp] = useState<EmployeeProfile | null>(null);
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [csvSuccessToast, setCsvSuccessToast] = useState<string | null>(null);

  // Manual Add Form state
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('SDE');
  const [newExp, setNewExp] = useState(4.0);
  const [newRating, setNewRating] = useState(4.2);
  const [newSalary, setNewSalary] = useState(1200000);
  const [newLoc, setNewLoc] = useState('Bangalore');

  // CSV Drag-and-drop state
  const [isDraggingCsv, setIsDraggingCsv] = useState(false);
  const [isParsingCsv, setIsParsingCsv] = useState(false);
  const [csvError, setCsvError] = useState<string | null>(null);
  const csvFileInputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    return ledger.filter(emp => {
      const matchSearch =
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.id.toLowerCase().includes(search.toLowerCase()) ||
        emp.role.toLowerCase().includes(search.toLowerCase()) ||
        (emp.location && emp.location.toLowerCase().includes(search.toLowerCase()));

      const matchStatus = statusFilter === 'All' || emp.status === statusFilter;
      const matchSource = sourceFilter === 'All' || (emp.source || 'Dataset Baseline') === sourceFilter;

      return matchSearch && matchStatus && matchSource;
    });
  }, [ledger, search, statusFilter, sourceFilter]);

  const handleRowClick = (emp: EmployeeProfile) => {
    setSelectedEmp(emp);
    if (onSelectEmployee) onSelectEmployee(emp);
  };

  const handleStatusToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const emp = ledger.find(item => item.id === id);
    if (!emp) return;
    const nextStatus = emp.status === 'Approved' ? 'Review' : (emp.status === 'Review' ? 'Flagged' : 'Approved');
    updateStatus(id, nextStatus);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    // Run ML prediction for new candidate
    const sim = salaryService.localSimulate({
      experience: newExp,
      rating: newRating,
      role: newRole,
      salary: newSalary,
      location: newLoc,
      status: 'Full Time',
    });

    const newProfile: EmployeeProfile = {
      id: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newName.trim(),
      role: newRole,
      experience: newExp,
      rating: newRating,
      currentSalary: newSalary,
      location: newLoc,
      hikePct: sim.recommended_hike_pct,
      newSalary: sim.projected_new_salary || Math.round(newSalary * (1 + sim.recommended_hike_pct / 100)),
      status: newRating >= 4.0 ? 'Approved' : 'Review',
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 10000)}?w=100&h=100&fit=crop&crop=faces`,
      department: `${newRole} Engineering`,
      source: 'Simulator',
    };

    addCandidate(newProfile);
    setIsAddModalOpen(false);
    setNewName('');
  };

  // CSV Ingestion Handler
  const processCsvFile = async (file: File) => {
    setCsvError(null);
    setIsParsingCsv(true);

    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) {
        throw new Error('CSV file must contain a header row and at least one candidate row.');
      }

      // Parse header row
      const delimiter = lines[0].includes(';') ? ';' : (lines[0].includes('\t') ? '\t' : ',');
      const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase().replace(/["']/g, ''));

      // Locate column indices
      const findIdx = (keywords: string[]) => 
        headers.findIndex(h => keywords.some(k => h.includes(k)));

      const nameIdx = findIdx(['name', 'employee', 'candidate', 'company']);
      const roleIdx = findIdx(['role', 'title', 'domain']);
      const expIdx = findIdx(['exp', 'experience', 'tenure', 'years']);
      const ratingIdx = findIdx(['rating', 'score', 'perf', 'appraisal']);
      const salaryIdx = findIdx(['salary', 'ctc', 'pay', 'base']);
      const locIdx = findIdx(['location', 'city', 'hub']);

      const parsedCandidates: EmployeeProfile[] = [];

      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(delimiter).map(c => c.trim().replace(/^["']|["']$/g, ''));
        if (row.length === 0 || row.every(val => !val)) continue;

        const name = nameIdx !== -1 && row[nameIdx] ? row[nameIdx] : `Candidate ${i}`;
        const rawRole = roleIdx !== -1 && row[roleIdx] ? row[roleIdx] : 'SDE';
        
        // Match rawRole against valid roles
        const matchedRole = VALID_ROLES.find(r => 
          rawRole.toLowerCase().includes(r.toLowerCase())
        ) || 'SDE';

        const expVal = expIdx !== -1 && !isNaN(parseFloat(row[expIdx])) ? parseFloat(row[expIdx]) : 4.0;
        const ratingVal = ratingIdx !== -1 && !isNaN(parseFloat(row[ratingIdx])) ? parseFloat(row[ratingIdx]) : 4.2;
        
        let salaryVal = 1200000;
        if (salaryIdx !== -1 && row[salaryIdx]) {
          const num = parseFloat(row[salaryIdx].replace(/[^0-9.]/g, ''));
          if (!isNaN(num)) {
            salaryVal = num < 100 ? num * 100000 : num; // Handle LPA vs full INR
          }
        }

        const loc = locIdx !== -1 && row[locIdx] ? row[locIdx] : 'Bangalore';

        // Calculate ML hike
        const sim = salaryService.localSimulate({
          experience: expVal,
          rating: ratingVal,
          role: matchedRole,
          salary: salaryVal,
          location: loc,
          status: 'Full Time',
        });

        const id = `CSV-${Math.floor(10000 + Math.random() * 90000)}`;
        parsedCandidates.push({
          id,
          name,
          role: matchedRole,
          experience: Math.round(expVal * 10) / 10,
          rating: Math.min(5.0, Math.max(1.0, Math.round(ratingVal * 10) / 10)),
          currentSalary: Math.round(salaryVal),
          location: loc,
          hikePct: sim.recommended_hike_pct,
          newSalary: sim.projected_new_salary || Math.round(salaryVal * (1 + sim.recommended_hike_pct / 100)),
          status: ratingVal >= 4.0 ? 'Approved' : 'Review',
          avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 10000)}?w=100&h=100&fit=crop&crop=faces`,
          department: `${matchedRole} Engineering`,
          source: 'CSV Ingestion',
        });
      }

      if (parsedCandidates.length === 0) {
        throw new Error('No valid candidate rows could be parsed from the file.');
      }

      addBatch(parsedCandidates);
      setIsCsvModalOpen(false);
      setCsvSuccessToast(`Successfully ingested and predicted ${parsedCandidates.length} candidate profiles from "${file.name}"!`);
      setTimeout(() => setCsvSuccessToast(null), 5000);

    } catch (err: any) {
      console.error('CSV Parsing failed:', err);
      setCsvError(err.message || 'Failed to parse CSV file. Ensure valid headers and structure.');
    } finally {
      setIsParsingCsv(false);
      if (csvFileInputRef.current) csvFileInputRef.current.value = '';
    }
  };

  const handleDownloadTemplate = () => {
    const templateContent = `Name,Role,Experience,Rating,Salary_INR,Location\n"Aarav Sharma",SDE,5.5,4.6,1400000,Bangalore\n"Priya Iyer",Python,3.5,4.8,950000,Hyderabad\n"Vikram Malhotra",Backend,7.0,3.9,1800000,Pune\n"Sneha Rao",Frontend,4.0,4.2,1100000,Bangalore\n"Rohan Verma",Android,2.5,3.6,650000,Chennai`;
    const blob = new Blob([templateContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'aura_appraisal_candidate_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportCsv = () => {
    const headers = [
      "Employee_ID", "Name", "Role", "Experience_Yrs", "Rating",
      "Current_Salary_INR", "Recommended_Hike_Pct", "Projected_Salary_INR", "Status", "Location", "Source"
    ];
    const rows = ledger.map(e => [
      e.id,
      `"${e.name}"`,
      e.role,
      e.experience,
      e.rating,
      e.currentSalary,
      e.hikePct,
      e.newSalary,
      e.status,
      `"${e.location}"`,
      `"${e.source || 'Dataset Baseline'}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `appraisal_decisions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="p-6 space-y-5">
      <CardHeaderTitle
        icon={Users}
        title="Active Appraisal Cohort & Ledger"
        subtitle="Dynamic decision ledger populated via ML Simulator runs, CV document parsing, or CSV batch feeds"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCsvModalOpen(true)}
              className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 font-semibold"
            >
              <Upload className="w-3.5 h-3.5 mr-1 text-blue-400" /> Feed CSV
            </Button>
            <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Candidate
            </Button>
            <Button variant="secondary" size="sm" onClick={exportCsv} title="Export current ledger to CSV">
              <Download className="w-3.5 h-3.5 mr-1" /> Export CSV
            </Button>
            <Button variant="ghost" size="sm" onClick={resetToBaseline} title="Reset ledger to real dataset records">
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Baseline
            </Button>
            {ledger.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearLedger} title="Clear ledger entries">
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              </Button>
            )}
          </div>
        }
      />

      {/* Success Notification */}
      {csvSuccessToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-xs font-semibold text-emerald-200 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{csvSuccessToast}</span>
          </div>
          <button onClick={() => setCsvSuccessToast(null)} className="text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search candidate, role, hub, or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 focus:outline-none"
          >
            <option value="All">All Ingestion Sources ({ledger.length})</option>
            <option value="Simulator">Simulator Live</option>
            <option value="Resume Upload">Resume Auto-Read</option>
            <option value="CSV Ingestion">CSV Ingested</option>
            <option value="Dataset Baseline">salary_data.csv Baseline</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Review">In Review</option>
            <option value="Flagged">Flagged</option>
          </select>
        </div>
      </div>

      {/* Table or Empty State */}
      {filtered.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-3 pl-1">Candidate Profile</th>
                <th className="pb-3">Source & Role</th>
                <th className="pb-3">Tenure / Rating</th>
                <th className="pb-3">Current Base CTC</th>
                <th className="pb-3">Predicted Hike</th>
                <th className="pb-3">Projected CTC</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-1">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-medium">
              {filtered.map(emp => {
                const source = emp.source || 'Dataset Baseline';
                return (
                  <tr
                    key={emp.id}
                    onClick={() => handleRowClick(emp)}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3 pl-1">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-8 h-8 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                        />
                        <div>
                          <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                            {emp.name}
                          </div>
                          <div className="text-[10px] text-zinc-400 font-mono flex items-center gap-1.5">
                            <span>{emp.id}</span>
                            <span>•</span>
                            <span>{emp.location || 'Bangalore'}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">{emp.role}</span>
                        {source === 'Simulator' && (
                          <Badge variant="success">Simulated</Badge>
                        )}
                        {source === 'Resume Upload' && (
                          <Badge variant="info">CV Auto-Read</Badge>
                        )}
                        {source === 'CSV Ingestion' && (
                          <Badge variant="outline">CSV</Badge>
                        )}
                        {source === 'Dataset Baseline' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/5 font-mono">
                            Dataset
                          </span>
                        )}
                      </div>
                      <span className="block text-[10px] text-zinc-400">{emp.department || `${emp.role} Team`}</span>
                    </td>

                    <td className="py-3">
                      <span className="text-zinc-800 dark:text-zinc-200">{emp.experience} yrs</span>
                      <span className="block text-[10px] text-amber-500 font-bold">★ {emp.rating}</span>
                    </td>

                    <td className="py-3 font-mono text-zinc-700 dark:text-zinc-300">
                      {formatINR(emp.currentSalary)}
                    </td>

                    <td className="py-3">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 font-mono">
                        +{formatPercent(emp.hikePct)}
                      </span>
                    </td>

                    <td className="py-3 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                      {formatINR(emp.newSalary)}
                    </td>

                    <td className="py-3">
                      <button 
                        onClick={(e) => handleStatusToggle(emp.id, e)}
                        className="focus:outline-none"
                        title="Click to toggle status"
                      >
                        {emp.status === 'Approved' && <Badge variant="success">Approved</Badge>}
                        {emp.status === 'Review' && <Badge variant="warning">In Review</Badge>}
                        {emp.status === 'Flagged' && <Badge variant="danger">Flagged</Badge>}
                      </button>
                    </td>

                    <td className="py-3 text-right pr-1">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleRowClick(emp);
                          }}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          title="Simulate in Predictor"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            removeCandidate(emp.id);
                          }}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-950/20"
                          title="Delete candidate from ledger"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Empty State */
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 border border-dashed border-white/10 rounded-2xl bg-white/[0.02] p-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Users className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-md">
            <h3 className="text-base font-bold text-zinc-100">No Candidate Records in Appraisal Ledger</h3>
            <p className="text-xs text-zinc-400">
              The ledger is currently clear. Populate it by feeding a candidate CSV, uploading a resume document, running the appraisal simulator directly, or restoring the real dataset baseline.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <Button size="sm" onClick={() => setIsCsvModalOpen(true)}>
              <Upload className="w-3.5 h-3.5 mr-1" /> Feed CSV File
            </Button>
            {onNavigateToSimulator && (
              <Button variant="secondary" size="sm" onClick={onNavigateToSimulator}>
                <Sparkles className="w-3.5 h-3.5 mr-1" /> Run Simulator
              </Button>
            )}
            {onNavigateToResumeScanner && (
              <Button variant="outline" size="sm" onClick={onNavigateToResumeScanner}>
                <FileText className="w-3.5 h-3.5 mr-1" /> Upload Resume CV
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={resetToBaseline}>
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Load Baseline Records
            </Button>
          </div>
        </div>
      )}

      {/* Drill-down modal if employee is selected */}
      {selectedEmp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedEmp.avatar}
                  alt={selectedEmp.name}
                  className="w-10 h-10 rounded-full object-cover border border-white/10"
                />
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100">
                    {selectedEmp.name}
                  </h3>
                  <span className="text-xs text-zinc-400 font-mono">
                    {selectedEmp.id} • {selectedEmp.role}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmp(null)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
                <span className="text-zinc-400 block">Performance</span>
                <span className="text-sm font-bold text-amber-500">★ {selectedEmp.rating} / 5.0</span>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
                <span className="text-zinc-400 block">Tenure</span>
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{selectedEmp.experience} Years</span>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
                <span className="text-zinc-400 block">Current Base CTC</span>
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 font-mono">{formatINR(selectedEmp.currentSalary)}</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <span className="text-emerald-700 dark:text-emerald-400 block">Proposed CTC (+{selectedEmp.hikePct}%)</span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-300 font-mono">{formatINR(selectedEmp.newSalary)}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 text-xs text-zinc-400 flex items-center justify-between">
              <span>Location: <strong className="text-zinc-200">{selectedEmp.location}</strong></span>
              <span>Source: <strong className="text-emerald-400">{selectedEmp.source || 'Dataset Baseline'}</strong></span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setSelectedEmp(null)}>
                Close
              </Button>
              <Button size="sm" onClick={() => {
                if (onSelectEmployee) onSelectEmployee(selectedEmp);
                setSelectedEmp(null);
              }}>
                Load in Predictor
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Feed CSV Ingestion Modal */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-zinc-900 border border-white/15 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-zinc-100 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Feed CSV Candidate File</h3>
                  <p className="text-[11px] text-zinc-400">Batch-feed candidate rows to auto-predict and record into the ledger</p>
                </div>
              </div>
              <button onClick={() => setIsCsvModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              ref={csvFileInputRef}
              type="file"
              accept=".csv,.tsv,.txt"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  processCsvFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            {/* Dropzone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDraggingCsv(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsDraggingCsv(false); }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingCsv(false);
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  processCsvFile(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => !isParsingCsv && csvFileInputRef.current?.click()}
              className={`p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDraggingCsv
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
              }`}
            >
              {isParsingCsv ? (
                <div className="space-y-3 py-4">
                  <div className="w-10 h-10 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin mx-auto" />
                  <p className="text-xs text-blue-400 font-mono">Parsing rows & computing ML hike predictions...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-blue-400 mx-auto" />
                  <h4 className="text-xs font-bold text-zinc-200">
                    Click to select CSV file, or drag and drop here
                  </h4>
                  <p className="text-[11px] text-zinc-400 max-w-xs mx-auto">
                    Supports <strong className="text-zinc-300">Name, Role, Experience, Rating, Salary, Location</strong> columns.
                  </p>
                </div>
              )}
            </div>

            {csvError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{csvError}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={handleDownloadTemplate}
                className="text-zinc-400 hover:text-white"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                Download CSV Template
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsCsvModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Candidate Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-zinc-900 border border-white/15 rounded-3xl max-w-md w-full p-6 shadow-2xl text-zinc-100">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white">
                Add Candidate Directly to Appraisal Ledger
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Candidate Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tarun Mathur"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-white/10 bg-zinc-950 font-medium text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Role</label>
                  <select
                    value={newRole}
                    onChange={e => setNewRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-zinc-950 font-medium text-white"
                  >
                    {VALID_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Location</label>
                  <select
                    value={newLoc}
                    onChange={e => setNewLoc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-zinc-950 font-medium text-white"
                  >
                    {VALID_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Rating (1.0 - 5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    value={newRating}
                    onChange={e => setNewRating(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-zinc-950 font-medium text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Experience (Yrs)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="20"
                    value={newExp}
                    onChange={e => setNewExp(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-zinc-950 font-medium text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Current Salary (INR)</label>
                <input
                  type="number"
                  step="50000"
                  value={newSalary}
                  onChange={e => setNewSalary(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-white/10 bg-zinc-950 font-medium text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <Button type="button" variant="secondary" size="sm" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Add & Predict
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Card>
  );
};
