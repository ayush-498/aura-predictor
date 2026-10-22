import React, { useState } from 'react';
import { Search, Filter, Download, Plus, CheckCircle, AlertTriangle, Eye, ArrowUpRight } from 'lucide-react';
import { EmployeeProfile } from '@/src/types/salary';
import { formatINR } from '@/src/services/predictionEngine';

interface AppraisalLedgerProps {
  employees: EmployeeProfile[];
  onSelectEmployeeForSimulator: (emp: EmployeeProfile) => void;
  onOpenAuditDrawer: (emp: EmployeeProfile) => void;
  onOpenAddModal: () => void;
  onStatusToggle: (id: string) => void;
}

export const AppraisalLedger: React.FC<AppraisalLedgerProps> = ({
  employees,
  onSelectEmployeeForSimulator,
  onOpenAuditDrawer,
  onOpenAddModal,
  onStatusToggle
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Approved' | 'Review' | 'Flagged'>('All');

  const filtered = employees.filter(emp => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportCsv = () => {
    const headers = ["Employee_ID", "Name", "Role", "Experience_Yrs", "Rating", "Current_Salary_INR", "Recommended_Hike_Pct", "Projected_Salary_INR", "Status", "Location"];
    const rows = employees.map(e => [
      e.id,
      `"${e.name}"`,
      e.role,
      e.experience,
      e.rating,
      e.currentSalary,
      e.hikePct,
      e.newSalary,
      e.status,
      e.location
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `appraisal_decisions_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Recent Appraisal Decisions & Ledger
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click any candidate row to load their telemetry into the simulator or inspect audit history.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" /> Add Candidate
          </button>
          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, ID, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['All', 'Approved', 'Review', 'Flagged'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <th className="pb-3 pl-1">Employee</th>
              <th className="pb-3">Role & Exp</th>
              <th className="pb-3">Rating</th>
              <th className="pb-3">Current Base</th>
              <th className="pb-3">Hike %</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 pr-1 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-xs text-slate-400">
                  No employee appraisal records match "{searchTerm}".
                </td>
              </tr>
            ) : (
              filtered.map((emp) => (
                <tr 
                  key={emp.id} 
                  onClick={() => onSelectEmployeeForSimulator(emp)}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 pl-1">
                    <div className="flex items-center gap-3">
                      <img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700" />
                      <div>
                        <span className="block font-semibold text-slate-900 dark:text-slate-100 text-xs group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {emp.name}
                        </span>
                        <span className="block text-[11px] text-slate-400 font-mono">
                          {emp.id} • {emp.location}
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
                  <td className="py-3.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusToggle(emp.id);
                      }}
                      title="Click to toggle status"
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                        emp.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 hover:bg-emerald-100'
                          : (emp.status === 'Flagged'
                            ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 hover:bg-rose-100'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 hover:bg-amber-100')
                      }`}
                    >
                      {emp.status}
                    </button>
                  </td>
                  <td className="py-3.5 pr-1 text-right">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectEmployeeForSimulator(emp)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-colors"
                        title="Load into Simulator"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onOpenAuditDrawer(emp)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Audit Profile"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
