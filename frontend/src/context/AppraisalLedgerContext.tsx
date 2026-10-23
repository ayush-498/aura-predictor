import React, { createContext, useContext, useState, useEffect } from 'react';
import { EmployeeProfile, PredictionRequest, PredictionResponse, ResumeParsedProfile } from '../types';
import { supabaseService } from '../services/supabase';

// Real historical enterprise records extracted directly from backend/data/salary_data.csv (22,770 rows)
export const DATASET_BASELINE_RECORDS: EmployeeProfile[] = [
  {
    id: 'DS-1001',
    name: 'Sasken Android Engineer',
    role: 'Android',
    experience: 8.0,
    rating: 3.8,
    currentSalary: 400000,
    location: 'Bangalore',
    hikePct: 21.0,
    newSalary: 484000,
    status: 'Approved',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    department: 'Mobile Engineering',
    source: 'Dataset Baseline'
  },
  {
    id: 'DS-1002',
    name: 'Zibtek SDE Lead',
    role: 'SDE',
    experience: 8.0,
    rating: 3.9,
    currentSalary: 1200000,
    location: 'Bangalore',
    hikePct: 25.1,
    newSalary: 1501200,
    status: 'Approved',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    department: 'Core Platform',
    source: 'Dataset Baseline'
  },
  {
    id: 'DS-1003',
    name: 'Thoughtworks Mobile Specialist',
    role: 'Mobile',
    experience: 12.0,
    rating: 4.4,
    currentSalary: 1800000,
    location: 'Pune',
    hikePct: 12.4,
    newSalary: 2023200,
    status: 'Approved',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
    department: 'Mobile Systems',
    source: 'Dataset Baseline'
  },
  {
    id: 'DS-1004',
    name: 'TCS Python Data Engineer',
    role: 'Python',
    experience: 3.0,
    rating: 3.9,
    currentSalary: 650000,
    location: 'Hyderabad',
    hikePct: 24.9,
    newSalary: 811850,
    status: 'Approved',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces',
    department: 'Data Engineering',
    source: 'Dataset Baseline'
  },
  {
    id: 'DS-1005',
    name: 'Shaw Academy Backend Dev',
    role: 'Backend',
    experience: 7.0,
    rating: 3.2,
    currentSalary: 950000,
    location: 'Bangalore',
    hikePct: 7.5,
    newSalary: 1021250,
    status: 'Review',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
    department: 'Backend Services',
    source: 'Dataset Baseline'
  },
  {
    id: 'DS-1006',
    name: 'Siemens UI Engineer',
    role: 'Frontend',
    experience: 8.0,
    rating: 4.1,
    currentSalary: 1100000,
    location: 'Bangalore',
    hikePct: 12.9,
    newSalary: 1241900,
    status: 'Approved',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces',
    department: 'Design & UI Platform',
    source: 'Dataset Baseline'
  }
];

interface AppraisalLedgerContextType {
  ledger: EmployeeProfile[];
  addCandidate: (profile: EmployeeProfile) => void;
  addFromSimulator: (params: PredictionRequest, prediction: PredictionResponse, candidateName?: string) => EmployeeProfile;
  addFromResume: (profile: ResumeParsedProfile, prediction: PredictionResponse) => EmployeeProfile;
  addBatch: (profiles: EmployeeProfile[]) => void;
  updateStatus: (id: string, status: 'Approved' | 'Review' | 'Flagged') => void;
  removeCandidate: (id: string) => void;
  clearLedger: () => void;
  resetToBaseline: () => void;
}

const STORAGE_KEY = 'aura_appraisal_ledger_v2';

const AppraisalLedgerContext = createContext<AppraisalLedgerContextType | undefined>(undefined);

export const AppraisalLedgerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ledger, setLedger] = useState<EmployeeProfile[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn('Failed to parse saved appraisal ledger:', e);
      }
    }
    return DATASET_BASELINE_RECORDS;
  });

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ledger));
      } catch (e) {
        console.warn('Failed to save appraisal ledger to localStorage:', e);
      }
    }
  }, [ledger]);

  // Global cross-user sync via Supabase
  useEffect(() => {
    let active = true;
    const syncFromSupabase = async () => {
      try {
        const records = await supabaseService.getGlobalLedger();
        if (active && records && records.length > 0) {
          const mapped: EmployeeProfile[] = records.map((r, i) => ({
            id: r.id || `SUPA-${i}`,
            name: r.candidate_name,
            role: r.role,
            experience: Number(r.experience),
            rating: Number(r.rating),
            currentSalary: Number(r.current_salary),
            location: 'Bangalore',
            hikePct: Number(r.approved_hike),
            newSalary: Number(r.final_salary),
            status: (r.status as 'Approved' | 'Review' | 'Flagged') || 'Approved',
            avatar: `https://images.unsplash.com/photo-${1534528741775 + (i % 30)}?w=100&h=100&fit=crop&crop=faces`,
            department: `${r.role} Engineering`,
            source: (r.source as any) || 'Simulator'
          }));
          setLedger(prev => {
            const remoteIds = new Set(mapped.map(m => m.id));
            const remoteNames = new Set(mapped.map(m => m.name.toLowerCase().trim()));
            
            // Keep baseline records and local pending records that haven't synced yet
            const localOnly = prev.filter(p => {
              if (remoteIds.has(p.id)) return false;
              // Check if already represented in remote by name and salary
              if (p.source !== 'Dataset Baseline' && remoteNames.has(p.name.toLowerCase().trim())) {
                return false;
              }
              return true;
            });
            return [...mapped, ...localOnly];
          });
        }
      } catch (err) {
        console.warn('Supabase sync warning:', err);
      }
    };
    syncFromSupabase();
    const interval = setInterval(syncFromSupabase, 12000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const addCandidate = (profile: EmployeeProfile) => {
    setLedger(prev => [profile, ...prev.filter(p => p.id !== profile.id)]);
    // Persist globally to Supabase regardless of input data format
    supabaseService.addLedgerCandidate(profile).then(saved => {
      if (saved?.id && saved.id !== profile.id) {
        setLedger(prev => prev.map(p => p.id === profile.id ? { ...p, id: saved.id! } : p));
      }
    }).catch(e => console.warn('Supabase candidate save skip:', e));
  };

  const addFromSimulator = (
    params: PredictionRequest,
    prediction: PredictionResponse,
    candidateName?: string
  ): EmployeeProfile => {
    const id = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `SIM-${Date.now().toString().slice(-5)}`;
    const currentSal = params.salary || 1200000;
    const hike = prediction.recommended_hike_pct;
    const newSal = prediction.projected_new_salary || Math.round(currentSal * (1 + hike / 100));

    const newRecord: EmployeeProfile = {
      id,
      name: candidateName?.trim() || `${params.role} Candidate (${id.slice(0, 8)})`,
      role: params.role,
      experience: params.experience,
      rating: params.rating,
      currentSalary: currentSal,
      location: params.location || 'Bangalore',
      hikePct: hike,
      newSalary: newSal,
      status: params.rating >= 4.0 ? 'Approved' : 'Review',
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 10000)}?w=100&h=100&fit=crop&crop=faces`,
      department: `${params.role} Engineering`,
      source: 'Simulator'
    };

    setLedger(prev => [newRecord, ...prev]);
    supabaseService.addLedgerCandidate(newRecord).then(saved => {
      if (saved?.id && saved.id !== id) {
        setLedger(prev => prev.map(p => p.id === id ? { ...p, id: saved.id! } : p));
      }
    }).catch(e => console.warn('Supabase candidate save skip:', e));
    return newRecord;
  };

  const addFromResume = (
    profile: ResumeParsedProfile,
    prediction: PredictionResponse
  ): EmployeeProfile => {
    const id = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `CV-${Date.now().toString().slice(-5)}`;
    const currentSal = profile.salary || 1200000;
    const hike = prediction.recommended_hike_pct;
    const newSal = prediction.projected_new_salary || Math.round(currentSal * (1 + hike / 100));

    const newRecord: EmployeeProfile = {
      id,
      name: profile.candidate_name,
      role: profile.role,
      experience: profile.experience,
      rating: profile.rating,
      currentSalary: currentSal,
      location: profile.location || 'Bangalore',
      hikePct: hike,
      newSalary: newSal,
      status: profile.rating >= 4.0 ? 'Approved' : 'Review',
      avatar: `https://images.unsplash.com/photo-${1507003211169 + Math.floor(Math.random() * 10000)}?w=100&h=100&fit=crop&crop=faces`,
      department: `${profile.role} Engineering`,
      source: 'Resume Upload'
    };

    setLedger(prev => [newRecord, ...prev]);
    supabaseService.addLedgerCandidate(newRecord).then(saved => {
      if (saved?.id && saved.id !== id) {
        setLedger(prev => prev.map(p => p.id === id ? { ...p, id: saved.id! } : p));
      }
    }).catch(e => console.warn('Supabase candidate save skip:', e));
    return newRecord;
  };

  const addBatch = (profiles: EmployeeProfile[]) => {
    if (!profiles || profiles.length === 0) return;
    setLedger(prev => [...profiles, ...prev]);
    
    // Universal batch sync across all formats
    supabaseService.addLedgerCandidatesBatch(profiles).then(savedList => {
      if (savedList && savedList.length > 0) {
        setLedger(prev => {
          const updated = [...prev];
          savedList.forEach((saved, idx) => {
            const original = profiles[idx];
            if (original && saved.id) {
              const targetIdx = updated.findIndex(u => u.id === original.id || (u.name === original.name && u.currentSalary === original.currentSalary));
              if (targetIdx !== -1) {
                updated[targetIdx] = { ...updated[targetIdx], id: saved.id };
              }
            }
          });
          return updated;
        });
      }
    }).catch(e => console.warn('Supabase batch save skip:', e));
  };

  const updateStatus = (id: string, status: 'Approved' | 'Review' | 'Flagged') => {
    let targetProfile: EmployeeProfile | undefined;
    setLedger(prev => {
      targetProfile = prev.find(emp => emp.id === id);
      return prev.map(emp => emp.id === id ? { ...emp, status } : emp);
    });

    if (targetProfile) {
      supabaseService.updateLedgerCandidate(id, { ...targetProfile, status }).catch(e => {
        console.warn('Supabase status update skip:', e);
      });
    }
  };

  const removeCandidate = (id: string) => {
    const target = ledger.find(emp => emp.id === id);
    setLedger(prev => prev.filter(emp => emp.id !== id));
    supabaseService.deleteLedgerCandidate(id, target?.name).catch(e => {
      console.warn('Supabase candidate delete skip:', e);
    });
  };

  const clearLedger = () => {
    setLedger([]);
  };

  const resetToBaseline = () => {
    setLedger(DATASET_BASELINE_RECORDS);
  };

  return (
    <AppraisalLedgerContext.Provider
      value={{
        ledger,
        addCandidate,
        addFromSimulator,
        addFromResume,
        addBatch,
        updateStatus,
        removeCandidate,
        clearLedger,
        resetToBaseline,
      }}
    >
      {children}
    </AppraisalLedgerContext.Provider>
  );
};

export function useAppraisalLedger() {
  const context = useContext(AppraisalLedgerContext);
  if (!context) {
    throw new Error('useAppraisalLedger must be used within an AppraisalLedgerProvider');
  }
  return context;
}
