import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, Shield, AlertTriangle } from 'lucide-react';
import { Card, CardHeaderTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export const PipelineConfigView: React.FC = () => {
  const [minFloor, setMinFloor] = useState<number>(5.0);
  const [maxCeiling, setMaxCeiling] = useState<number>(35.0);
  const [criticalCutoff, setCriticalCutoff] = useState<number>(3.0);
  const [highPerformerBonus, setHighPerformerBonus] = useState<number>(1.25);
  const [saved, setSaved] = useState<boolean>(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      <CardHeaderTitle
        icon={Settings}
        title="Statutory Appraisal Policy & Bounds Configuration"
        subtitle="Define corporate boundaries, high-performer multipliers, and review gates"
        action={
          <Button size="sm" onClick={handleSave}>
            {saved ? <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> : <Save className="w-3.5 h-3.5 mr-1" />}
            {saved ? 'Saved!' : 'Save Config'}
          </Button>
        }
      />

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Production compensation boundaries saved and active across inference models.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <CardHeaderTitle
            icon={Shield}
            title="Statutory Increment Bounds"
            subtitle="Hard floor and ceiling limits"
          />

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Minimum Floor (%)</span>
              <span className="font-mono font-bold text-emerald-600">{minFloor.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="10.0"
              step="0.5"
              value={minFloor}
              onChange={(e) => setMinFloor(parseFloat(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <span className="text-[10px] text-zinc-400 mt-1 block">Protects against inflation attrition</span>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Maximum Ceiling (%)</span>
              <span className="font-mono font-bold text-rose-500">{maxCeiling.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="25.0"
              max="50.0"
              step="1.0"
              value={maxCeiling}
              onChange={(e) => setMaxCeiling(parseFloat(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <span className="text-[10px] text-zinc-400 mt-1 block">Maximum organizational budget limit</span>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <CardHeaderTitle
            icon={AlertTriangle}
            title="Merit Multipliers & Review Gates"
            subtitle="Performance thresholds and bonuses"
          />

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Critical Review Cutoff Rating</span>
              <span className="font-mono font-bold text-amber-500">{criticalCutoff.toFixed(1)} / 5.0</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="3.5"
              step="0.1"
              value={criticalCutoff}
              onChange={(e) => setCriticalCutoff(parseFloat(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <span className="text-[10px] text-zinc-400 mt-1 block">Ratings below this trigger PIP review</span>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Top Star Booster (Rating &ge; 4.5)</span>
              <span className="font-mono font-bold text-emerald-600">{highPerformerBonus.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="1.5"
              step="0.05"
              value={highPerformerBonus}
              onChange={(e) => setHighPerformerBonus(parseFloat(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <span className="text-[10px] text-zinc-400 mt-1 block">Multiplier applied to high-performer merit hikes</span>
          </div>
        </Card>
      </div>
    </div>
  );
};
