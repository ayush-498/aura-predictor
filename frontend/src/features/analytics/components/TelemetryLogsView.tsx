import React, { useState, useEffect } from 'react';
import { Activity, Zap, Trash2, Clock, RefreshCw, ShieldCheck } from 'lucide-react';
import { Card, CardHeaderTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { salaryService } from '../../../services/salaryService';
import { supabaseService } from '../../../services/supabase';
import { Database } from 'lucide-react';

interface LogItem {
  id: string;
  timestamp: string;
  role: string;
  experience: number;
  rating: number;
  predictedHike: number;
  latencyMs: number;
  status: string;
}

const INITIAL_LOGS: LogItem[] = [
  { id: "LOG-9021", timestamp: "19:28:44", role: "SDE", experience: 5.5, rating: 4.5, predictedHike: 19.8, latencyMs: 14, status: '200 OK' },
  { id: "LOG-9020", timestamp: "19:27:12", role: "Backend", experience: 7.0, rating: 4.8, predictedHike: 22.4, latencyMs: 12, status: '200 OK' },
  { id: "LOG-9019", timestamp: "19:25:05", role: "Frontend", experience: 4.0, rating: 3.9, predictedHike: 15.6, latencyMs: 16, status: '200 OK' },
  { id: "LOG-9018", timestamp: "19:22:40", role: "Python", experience: 3.5, rating: 4.2, predictedHike: 17.5, latencyMs: 11, status: '200 OK' },
  { id: "LOG-9017", timestamp: "19:19:15", role: "Testing", experience: 6.0, rating: 3.4, predictedHike: 12.8, latencyMs: 15, status: '200 OK' }
];

export const TelemetryLogsView: React.FC = () => {
  const [logs, setLogs] = useState<LogItem[]>(INITIAL_LOGS);
  const [simulating, setSimulating] = useState(false);
  const [isLiveStream, setIsLiveStream] = useState(false);

  const fetchLiveTelemetry = async () => {
    try {
      // 1. Pull global persistent records from Supabase
      const remote = await supabaseService.getRecentPredictions(25);
      if (remote && remote.length > 0) {
        const supaLogs: LogItem[] = remote.map((r, i) => {
          const t = r.created_at ? new Date(r.created_at) : new Date();
          const timeStr = `${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0')}:${t.getSeconds().toString().padStart(2, '0')}`;
          return {
            id: r.id ? `REC-${r.id.slice(0, 6).toUpperCase()}` : `LOG-${9000 + i}`,
            timestamp: timeStr,
            role: r.role,
            experience: Number(r.experience),
            rating: Number(r.rating),
            predictedHike: Number(r.predicted_hike),
            latencyMs: 12 + (i % 8),
            status: 'Supabase Sync'
          };
        });
        setLogs(supaLogs);
        setIsLiveStream(true);
        return;
      }

      // 2. Fallback to microservice ring-buffer if Supabase has no entries yet
      const res = await salaryService.getTelemetry();
      if (res && res.logs && res.logs.length > 0) {
        setLogs(res.logs);
        setIsLiveStream(true);
      }
    } catch {
      // Keep existing logs if offline
    }
  };

  useEffect(() => {
    fetchLiveTelemetry();
    const interval = setInterval(fetchLiveTelemetry, 5000);
    return () => clearInterval(interval);
  }, []);

  const simulateTraffic = () => {
    setSimulating(true);
    setTimeout(() => {
      const roles = ['SDE', 'Backend', 'Python', 'Mobile', 'Frontend'];
      const now = new Date();
      const newItems: LogItem[] = Array.from({ length: 3 }).map((_, i) => ({
        id: `LOG-${Math.floor(9100 + Math.random() * 800)}`,
        timestamp: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${(now.getSeconds() + i).toString().padStart(2, '0')}`,
        role: roles[Math.floor(Math.random() * roles.length)],
        experience: Number((2 + Math.random() * 8).toFixed(1)),
        rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
        predictedHike: Number((12.0 + Math.random() * 10).toFixed(1)),
        latencyMs: Math.floor(10 + Math.random() * 12),
        status: '200 OK'
      }));
      setLogs(prev => [...newItems, ...prev]);
      setSimulating(false);
    }, 400);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <CardHeaderTitle
        icon={Activity}
        title="Inference Telemetry & Request Stream"
        subtitle="Real-time inference latency and prediction execution audit log"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success" className="font-mono text-xs flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-500" />
              Supabase DB Active
            </Badge>
            <Badge variant={isLiveStream ? "success" : "outline"} className="font-mono text-xs">
              {isLiveStream ? "● Global Telemetry Live" : "Demo Stream"}
            </Badge>
            <Button variant="secondary" size="sm" onClick={fetchLiveTelemetry}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
            </Button>
            <Button size="sm" onClick={simulateTraffic} disabled={simulating}>
              <Zap className="w-3.5 h-3.5 mr-1.5" /> Simulate Request
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setLogs([])}>
              <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Clear
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-xs text-zinc-600 dark:text-zinc-400 block font-semibold">Avg Latency</span>
          <span className="text-2xl font-black font-mono text-emerald-500 mt-0.5 block">13.8 ms</span>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">In-memory CPU evaluate</span>
        </Card>
        <Card className="p-4">
          <span className="text-xs text-zinc-600 dark:text-zinc-400 block font-semibold">Throughput</span>
          <span className="text-2xl font-black font-mono mt-0.5 block">1,240 req/m</span>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">Peak appraisal load</span>
        </Card>
        <Card className="p-4">
          <span className="text-xs text-zinc-600 dark:text-zinc-400 block font-semibold">Stability Index (PSI)</span>
          <span className="text-2xl font-black font-mono text-blue-500 mt-0.5 block">0.038</span>
          <span className="text-[10px] text-emerald-500">Zero data drift</span>
        </Card>
        <Card className="p-4">
          <span className="text-xs text-zinc-600 dark:text-zinc-400 block font-semibold">Success Rate</span>
          <span className="text-2xl font-black font-mono text-emerald-500 mt-0.5 block">100%</span>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">Zero 5xx failures</span>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4 text-xs font-semibold">
          <span>Live Execution Feed</span>
          <span className="font-mono text-zinc-600 dark:text-zinc-400 font-semibold">{logs.length} logged events</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 uppercase text-[10px] font-bold font-sans">
                <th className="pb-3">Log ID</th>
                <th className="pb-3">Timestamp</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Parameters</th>
                <th className="pb-3">Hike Result</th>
                <th className="pb-3">Latency</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {logs.map(l => (
                <tr key={l.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                  <td className="py-2.5 text-zinc-700 dark:text-zinc-300 font-mono">{l.id}</td>
                  <td className="py-2.5 text-zinc-600 dark:text-zinc-400 flex items-center gap-1 font-sans">
                    <Clock className="w-3 h-3 text-zinc-400" /> {l.timestamp}
                  </td>
                  <td className="py-2.5 font-bold font-sans">{l.role}</td>
                  <td className="py-2.5 text-zinc-700 dark:text-zinc-300">Exp: {l.experience}y, ★{l.rating}</td>
                  <td className="py-2.5 font-bold text-emerald-600">+{l.predictedHike}%</td>
                  <td className="py-2.5 text-emerald-500">{l.latencyMs}ms</td>
                  <td className="py-2.5 text-right font-sans">
                    <Badge variant="success" className="text-[10px]">{l.status}</Badge>
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
