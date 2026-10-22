import React, { useState } from 'react';
import { Activity, ShieldCheck, Zap, RefreshCw, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { TelemetryLog } from '@/src/types/salary';

const INITIAL_LOGS: TelemetryLog[] = [
  { id: "LOG-9021", timestamp: "19:28:44", candidateRole: "SDE", experience: 5.5, rating: 4.5, predictedHike: 19.8, latencyMs: 14, status: '200 OK', engine: 'Gradient Boosting (Full)' },
  { id: "LOG-9020", timestamp: "19:27:12", candidateRole: "Backend", experience: 7.0, rating: 4.8, predictedHike: 22.4, latencyMs: 12, status: '200 OK', engine: 'Gradient Boosting (Full)' },
  { id: "LOG-9019", timestamp: "19:25:05", candidateRole: "Frontend", experience: 4.0, rating: 3.9, predictedHike: 15.6, latencyMs: 16, status: '200 OK', engine: 'Gradient Boosting (Full)' },
  { id: "LOG-9018", timestamp: "19:22:40", candidateRole: "Python", experience: 3.5, rating: 4.2, predictedHike: 17.5, latencyMs: 11, status: '200 OK', engine: 'Gradient Boosting (Full)' },
  { id: "LOG-9017", timestamp: "19:19:15", candidateRole: "Testing", experience: 6.0, rating: 3.4, predictedHike: 12.8, latencyMs: 15, status: '200 OK', engine: 'Gradient Boosting (Core)' },
  { id: "LOG-9016", timestamp: "19:15:02", candidateRole: "Android", experience: 8.5, rating: 4.9, predictedHike: 24.5, latencyMs: 18, status: '200 OK', engine: 'Gradient Boosting (Full)' }
];

export const TelemetryLogsView: React.FC = () => {
  const [logs, setLogs] = useState<TelemetryLog[]>(INITIAL_LOGS);
  const [isSimulating, setIsSimulating] = useState(false);

  const simulateRequestSpike = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const roles = ['SDE', 'Backend', 'Python', 'Mobile', 'Frontend'];
      const newEntries: TelemetryLog[] = Array.from({ length: 4 }).map((_, i) => {
        const role = roles[Math.floor(Math.random() * roles.length)];
        const rating = Number((3.5 + Math.random() * 1.5).toFixed(1));
        const exp = Number((1.5 + Math.random() * 8.5).toFixed(1));
        const hike = Number((12.0 + rating * 2.1 + exp * 0.4).toFixed(1));
        const now = new Date();
        return {
          id: `LOG-${Math.floor(9100 + Math.random() * 800)}`,
          timestamp: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${(now.getSeconds() + i).toString().padStart(2, '0')}`,
          candidateRole: role,
          experience: exp,
          rating: rating,
          predictedHike: hike,
          latencyMs: Math.floor(9 + Math.random() * 14),
          status: '200 OK',
          engine: 'Gradient Boosting (Production)'
        };
      });

      setLogs(prev => [...newEntries, ...prev]);
      setIsSimulating(false);
    }, 400);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              Observability
            </span>
            <span className="text-xs text-slate-500 font-mono">Live Inferences & Audit Trail</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            Telemetry & Serving Logs
          </h2>
          <p className="text-xs text-slate-500">
            Real-time inference latency, request volume, data drift index, and model serving health.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={simulateRequestSpike}
            disabled={isSimulating}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all"
          >
            <Zap className="h-4 w-4" /> Simulate Traffic
          </button>
          <button
            onClick={clearLogs}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all"
          >
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        </div>
      </div>

      {/* KPI Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-xs text-slate-400 block">Avg Inference Latency</span>
          <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 block">14.2 ms</span>
          <span className="text-[11px] text-slate-500">In-memory CPU evaluation</span>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-xs text-slate-400 block">Inference Throughput</span>
          <span className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100 mt-0.5 block">1,420 req/m</span>
          <span className="text-[11px] text-slate-500">Concurrency: 32 workers</span>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-xs text-slate-400 block">Population Stability Index (PSI)</span>
          <span className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400 mt-0.5 block">0.038</span>
          <span className="text-[11px] text-emerald-600 font-semibold">Zero detected data drift</span>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-xs text-slate-400 block">API Success Rate</span>
          <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 block">99.98%</span>
          <span className="text-[11px] text-slate-500">Zero 5xx fatal errors</span>
        </div>
      </div>

      {/* Real-time Logs Feed */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-500 animate-pulse" /> Live Inference Event Stream
          </h3>
          <span className="text-xs font-mono text-slate-400">{logs.length} Logged Events</span>
        </div>

        {logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Telemetry buffer cleared. Click "Simulate Traffic" or trigger predictions in the Appraisal Predictor tab.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-sans">
                  <th className="pb-3">Log ID</th>
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3">Candidate Role</th>
                  <th className="pb-3">Inputs</th>
                  <th className="pb-3">Hike Result</th>
                  <th className="pb-3">Latency</th>
                  <th className="pb-3">Engine</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 text-slate-500">{log.id}</td>
                    <td className="py-3 text-slate-600 dark:text-slate-300 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" /> {log.timestamp}
                    </td>
                    <td className="py-3 font-sans font-bold text-slate-900 dark:text-slate-100">{log.candidateRole}</td>
                    <td className="py-3 text-slate-500">Exp: {log.experience}y, ★{log.rating}</td>
                    <td className="py-3 font-bold text-blue-600 dark:text-blue-400">+{log.predictedHike}%</td>
                    <td className="py-3 text-emerald-600">{log.latencyMs}ms</td>
                    <td className="py-3 font-sans text-slate-600 dark:text-slate-400">{log.engine}</td>
                    <td className="py-3 text-right">
                      <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 font-bold">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
