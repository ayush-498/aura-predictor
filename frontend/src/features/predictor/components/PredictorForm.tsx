import React, { useState } from 'react';
import {
  Sliders,
  DollarSign,
  Briefcase,
  MapPin,
  Sparkles,
  RotateCcw,
  Star,
  FileUp,
  Layers,
  Check,
  Zap,
  TrendingUp,
  Building2,
  Clock,
  Code2,
  ShieldAlert,
} from 'lucide-react';
import { Card, CardHeaderTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  PredictionRequest,
  VALID_ROLES,
  VALID_LOCATIONS,
  EXTENDED_TECHNICAL_SKILLS,
  ARCHETYPE_PRESETS,
  ArchetypePreset,
} from '../../../types';
import { formatINR, getRatingLabel } from '../../../lib/utils';

interface PredictorFormProps {
  params: PredictionRequest;
  onUpdate: <K extends keyof PredictionRequest>(key: K, value: PredictionRequest[K]) => void;
  onReset: () => void;
  loading: boolean;
  onOpenResumeScanner?: () => void;
}

const SALARY_PRESETS = [
  { label: '₹6L', val: 600000 },
  { label: '₹12L', val: 1200000 },
  { label: '₹18L', val: 1800000 },
  { label: '₹25L', val: 2500000 },
  { label: '₹35L', val: 3500000 },
  { label: '₹50L', val: 5000000 },
];

export const PredictorForm: React.FC<PredictorFormProps> = ({
  params,
  onUpdate,
  onReset,
  loading,
  onOpenResumeScanner,
}) => {
  const [activeTab, setActiveTab] = useState<'skills' | 'archetypes'>('skills');

  const ratingInfo = getRatingLabel(params.rating);

  // Active multi-roles and skills
  const selectedRoles: string[] = (params.roles && params.roles.length > 0)
    ? params.roles
    : (params.role ? [params.role] : ['SDE']);

  const selectedSkills: string[] = params.skills || [];

  // Career Seniority Tier helper
  const getSeniorityTier = (exp: number) => {
    if (exp < 2.0) return { title: 'Associate / Junior', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
    if (exp < 5.0) return { title: 'Mid-Level Specialist', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' };
    if (exp < 9.0) return { title: 'Senior Professional', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
    if (exp < 14.0) return { title: 'Staff / Tech Lead', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' };
    return { title: 'Principal / Architect', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
  };

  const seniority = getSeniorityTier(params.experience);

  // Live Skill Synergy Calculation
  const roleSynergy = Math.max(0, selectedRoles.length - 1) * 0.55;
  const skillSynergy = Math.min(2.0, selectedSkills.length * 0.3);
  const synergyBonus = Math.min(3.8, Math.round((roleSynergy + skillSynergy) * 10) / 10);

  // Multi-Role toggle handler
  const handleToggleRole = (roleItem: string) => {
    let nextRoles: string[];
    if (selectedRoles.includes(roleItem)) {
      if (selectedRoles.length === 1) {
        return; // Retain at least 1 primary role
      }
      nextRoles = selectedRoles.filter(r => r !== roleItem);
    } else {
      nextRoles = [...selectedRoles, roleItem];
    }
    onUpdate('roles', nextRoles);
    // Designate first selected as base pipeline role
    if (!nextRoles.includes(params.role)) {
      onUpdate('role', nextRoles[0]);
    }
  };

  // Skill toggle handler
  const handleToggleSkill = (skillItem: string) => {
    let nextSkills: string[];
    if (selectedSkills.includes(skillItem)) {
      nextSkills = selectedSkills.filter(s => s !== skillItem);
    } else {
      nextSkills = [...selectedSkills, skillItem];
    }
    onUpdate('skills', nextSkills);
  };

  // Apply archetype preset
  const handleApplyPreset = (preset: ArchetypePreset) => {
    onUpdate('role', preset.role);
    onUpdate('roles', preset.roles);
    onUpdate('skills', preset.skills);
    onUpdate('experience', preset.experience);
    onUpdate('rating', preset.rating);
    onUpdate('salary', preset.salary);
  };

  return (
    <Card className="p-5 md:p-6 space-y-5 bg-gradient-to-b from-zinc-900/90 via-zinc-900/70 to-zinc-950/90 border border-white/10 shadow-2xl backdrop-blur-xl">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-1 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              Appraisal Parameter Studio
              <Badge variant="success" className="text-[10px] py-0 px-1.5">
                Multi-Skill Engine
              </Badge>
            </h2>
            <p className="text-[11px] text-zinc-400">
              Calibrated dual-model simulation with composite skill stacks
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          title="Reset to default baseline"
          className="text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06] text-xs h-8 px-2.5"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset
        </Button>
      </div>

      {/* Auto-Read Resume Action Banner */}
      {onOpenResumeScanner && (
        <div
          onClick={onOpenResumeScanner}
          className="relative overflow-hidden flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-teal-950/30 to-zinc-900/90 border border-emerald-500/30 hover:border-emerald-400/60 cursor-pointer transition-all group shadow-lg hover:shadow-emerald-500/10"
        >
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 group-hover:scale-110 transition-transform">
              <FileUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-2">
                Auto-Read Candidate CV / Resume
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  PDF / DOCX
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Extract candidate parameters & auto-populate the multi-skill stack
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            type="button"
            className="border-emerald-500/40 text-emerald-300 bg-emerald-950/40 group-hover:bg-emerald-500/20 text-xs font-semibold pointer-events-none relative z-10 shadow-sm"
          >
            Open Scanner
          </Button>
        </div>
      )}

      {/* Archetype Quick Selectors Strip */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Candidate Archetype Presets
          </span>
          <span className="text-[10px] text-zinc-400">1-click composite configurations</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5">
          {ARCHETYPE_PRESETS.map(preset => {
            const isMatch = params.role === preset.role && params.experience === preset.experience;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`px-2.5 py-2 rounded-xl text-left border transition-all text-xs ${
                  isMatch
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-white shadow-sm ring-1 ring-emerald-500/30'
                    : 'bg-white/[0.03] border-white/5 text-zinc-300 hover:bg-white/[0.07] hover:border-white/10'
                }`}
              >
                <div className="font-bold text-[11px] truncate text-zinc-100 flex items-center justify-between">
                  <span>{preset.label}</span>
                  {isMatch && <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />}
                </div>
                <div className="text-[10px] text-zinc-400 truncate mt-0.5">
                  {preset.experience}y • {preset.rating}★
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: Performance & Experience Calibration (Modular Pods) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 p-3.5 rounded-2xl bg-zinc-950/60 border border-white/5">
        {/* Rating Pod */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Annual Performance
            </label>
            <span className="text-xs font-bold text-amber-300 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 font-mono">
              {params.rating.toFixed(1)} / 5.0
            </span>
          </div>

          <input
            type="range"
            min="1.0"
            max="5.0"
            step="0.1"
            value={params.rating}
            onChange={e => onUpdate('rating', parseFloat(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />

          <div className="flex items-center justify-between">
            <span className={`text-[10px] px-2 py-0.5 rounded-md border font-medium ${ratingInfo.color}`}>
              {ratingInfo.label}
            </span>
            <div className="flex gap-1 text-[10px]">
              {[3.0, 3.8, 4.2, 4.8].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => onUpdate('rating', r)}
                  className={`px-1.5 py-0.5 rounded border ${
                    params.rating === r
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                      : 'bg-white/[0.02] text-zinc-400 border-white/5 hover:bg-white/[0.05]'
                  }`}
                >
                  {r}★
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Experience Pod */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              Industry Experience
            </label>
            <span className="text-xs font-bold text-emerald-300 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 font-mono">
              {params.experience.toFixed(1)} Yrs
            </span>
          </div>

          <input
            type="range"
            min="0.5"
            max="25.0"
            step="0.5"
            value={params.experience}
            onChange={e => onUpdate('experience', parseFloat(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />

          <div className="flex items-center justify-between">
            <span className={`text-[10px] px-2 py-0.5 rounded-md border font-medium ${seniority.color}`}>
              {seniority.title}
            </span>
            <div className="flex gap-1 text-[10px]">
              {[2, 5, 10, 15].map(y => (
                <button
                  key={y}
                  type="button"
                  onClick={() => onUpdate('experience', y)}
                  className={`px-1.5 py-0.5 rounded border ${
                    params.experience === y
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                      : 'bg-white/[0.02] text-zinc-400 border-white/5 hover:bg-white/[0.05]'
                  }`}
                >
                  {y}y
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Technical Domains & Multi-Skill Stack (CORE UPGRADE) */}
      <div className="space-y-3.5 p-4 rounded-2xl bg-zinc-950/70 border border-emerald-500/20 shadow-inner">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-xs font-bold text-white block">
                Technical Domains & Multi-Skill Stack
              </span>
              <span className="text-[10px] text-zinc-400">
                Select multiple roles or skills to model realistic cross-domain compensation
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="text-[10px] text-emerald-300 border-emerald-500/30 bg-emerald-950/30">
              {selectedRoles.length} Roles • {selectedSkills.length} Skills
            </Badge>
          </div>
        </div>

        {/* Tier 1: Functional Roles / Domains (Multi-Select) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-300">
            <span>Primary & Secondary Job Roles:</span>
            <span className="text-[10px] text-zinc-400">★ designates ML baseline role</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {VALID_ROLES.map(role => {
              const isSelected = selectedRoles.includes(role);
              const isPrimary = params.role === role;

              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleToggleRole(role)}
                  className={`text-xs px-2.5 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-900/40 font-semibold ring-1 ring-emerald-400/50 scale-[1.02]'
                      : 'bg-white/[0.04] border border-white/5 text-zinc-300 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-emerald-200" />}
                  <span>{role}</span>
                  {isPrimary && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-black/40 text-amber-300 font-bold ml-0.5">
                      ★ Primary
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tier 2: Extended Technical Competencies */}
        <div className="space-y-1.5 pt-1 border-t border-white/5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-300">
            <span className="flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5 text-teal-400" />
              Specialized Skills & Technologies:
            </span>
            {selectedSkills.length > 0 && (
              <button
                type="button"
                onClick={() => onUpdate('skills', [])}
                className="text-[10px] text-zinc-400 hover:text-rose-400 underline transition-colors"
              >
                Clear all skills
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
            {EXTENDED_TECHNICAL_SKILLS.map(skill => {
              const isSelected = selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleToggleSkill(skill)}
                  className={`text-[11px] px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
                    isSelected
                      ? 'bg-teal-500/20 text-teal-200 border border-teal-500/40 font-semibold shadow-sm'
                      : 'bg-white/[0.02] border border-white/5 text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-200'
                  }`}
                >
                  {isSelected && <Check className="w-2.5 h-2.5 text-teal-300" />}
                  <span>{skill}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Multi-Skill Synergy Banner */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-zinc-900 border border-emerald-500/30 text-xs">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400 flex-shrink-0 animate-pulse" />
            <div>
              <span className="font-bold text-emerald-300 block">
                {synergyBonus > 0
                  ? `+${synergyBonus}% Skill Synergy Premium Active`
                  : 'Single Domain Baseline'}
              </span>
              <p className="text-[10px] text-zinc-400">
                {selectedRoles.length > 1 || selectedSkills.length > 0
                  ? `${selectedRoles.length} complementary domains & ${selectedSkills.length} skills amplify candidate market value`
                  : 'Add complementary roles or technical skills to unlock synergy hike premiums'}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Bonus Hike</span>
            <span className="font-mono font-bold text-emerald-400 text-xs">
              +{synergyBonus.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 3: Compensation & Base CTC */}
      <div className="space-y-2 p-3.5 rounded-2xl bg-zinc-950/60 border border-white/5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            Current Base Compensation (Annual INR)
          </label>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-emerald-300 font-mono font-bold">
              {formatINR(params.salary)}
            </span>
            {params.salary && (
              <span className="text-[10px] text-zinc-400">
                ({(params.salary / 100000).toFixed(1)} LPA)
              </span>
            )}
          </div>
        </div>

        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-zinc-400 font-bold font-mono">
            ₹
          </span>
          <input
            type="number"
            step="50000"
            value={params.salary || ''}
            placeholder="e.g. 1400000"
            onChange={e => onUpdate('salary', e.target.value ? parseFloat(e.target.value) : undefined)}
            className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-white/10 bg-zinc-900/90 text-sm font-medium text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/80 shadow-inner font-mono"
          />
        </div>

        {/* Quick CTC Chips */}
        <div className="grid grid-cols-6 gap-1.5 pt-0.5">
          {SALARY_PRESETS.map(preset => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onUpdate('salary', preset.val)}
              className={`text-[11px] py-1.5 rounded-lg border font-mono font-medium transition-all ${
                params.salary === preset.val
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50 font-bold shadow-sm'
                  : 'bg-white/[0.03] text-zinc-400 border-white/5 hover:bg-white/[0.07] hover:text-zinc-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 4: Workplace Context (Office Hub & Contract) */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
            Deployment Office Hub
          </label>
          <select
            value={params.location}
            onChange={e => onUpdate('location', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-white/10 bg-zinc-950/80 text-xs font-medium text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          >
            {VALID_LOCATIONS.map(loc => (
              <option key={loc} value={loc} className="bg-zinc-900 text-zinc-100">
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-zinc-400" />
            Engagement Contract
          </label>
          <select
            value={params.status}
            onChange={e => onUpdate('status', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-white/10 bg-zinc-950/80 text-xs font-medium text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          >
            <option value="Full Time" className="bg-zinc-900 text-zinc-100">Full Time Employee (FTE)</option>
            <option value="Contract" className="bg-zinc-900 text-zinc-100">Specialist Consultant / Contract</option>
          </select>
        </div>
      </div>
    </Card>
  );
};
