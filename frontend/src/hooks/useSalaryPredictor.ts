import { useState, useEffect, useCallback, useRef } from 'react';
import { PredictionRequest, PredictionResponse } from '../types';
import { salaryService } from '../services/salaryService';
import { supabaseService } from '../services/supabase';

const DEFAULT_STATE: PredictionRequest = {
  experience: 4.5,
  rating: 4.2,
  role: 'SDE',
  roles: ['SDE', 'Backend'],
  skills: ['TypeScript', 'React', 'Node.js'],
  salary: 1200000,
  location: 'Bangalore',
  status: 'Full Time',
};

export function useSalaryPredictor() {
  const [params, setParams] = useState<PredictionRequest>(DEFAULT_STATE);
  const [prediction, setPrediction] = useState<PredictionResponse>(() => 
    salaryService.localSimulate(DEFAULT_STATE)
  );
  const [loading, setLoading] = useState(false);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const checkBackendHealth = useCallback(async () => {
    try {
      const health = await salaryService.checkHealth();
      const isOnline = Boolean(
        health.all_models_ready ??
        health.ready ??
        (health.status === 'healthy' && (typeof health.models_loaded === 'number' ? health.models_loaded > 0 : true))
      );
      setIsBackendOnline(isOnline);
    } catch {
      setIsBackendOnline(false);
    }
  }, []);

  // Check backend health on mount
  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 10000);
    return () => {
      clearInterval(interval);
    };
  }, [checkBackendHealth]);

  // Compute prediction whenever params change
  const executePrediction = useCallback(async (currentParams: PredictionRequest) => {
    setLoading(true);
    try {
      const res = await salaryService.predict(currentParams);
      setPrediction(res);
    } catch {
      setPrediction(salaryService.localSimulate(currentParams));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      executePrediction(params);
    }, 180);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [params, executePrediction]);

  // Settle & save simulation to global Supabase database (after 2.5s idle)
  const syncDbTimer = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (syncDbTimer.current) clearTimeout(syncDbTimer.current);
    syncDbTimer.current = setTimeout(() => {
      if (prediction && params) {
        supabaseService.recordPrediction({
          role: params.role,
          experience: params.experience,
          rating: params.rating,
          current_salary: params.salary || 1200000,
          location: params.location || 'Bangalore',
          status: params.status || 'Full Time',
          predicted_hike: prediction.recommended_hike_pct,
          predicted_salary: prediction.projected_new_salary || Math.round((params.salary || 1200000) * (1 + prediction.recommended_hike_pct / 100)),
          model_used: prediction.model_used || 'Gradient Boosting Ensemble'
        });
      }
    }, 2500);
    return () => {
      if (syncDbTimer.current) clearTimeout(syncDbTimer.current);
    };
  }, [prediction, params]);

  const updateParam = useCallback(<K extends keyof PredictionRequest>(key: K, value: PredictionRequest[K]) => {
    setParams(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetParams = useCallback(() => {
    setParams(DEFAULT_STATE);
  }, []);

  return {
    params,
    prediction,
    loading,
    isBackendOnline,
    updateParam,
    resetParams,
    checkBackendHealth,
  };
}
