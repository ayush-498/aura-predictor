import { useState, useEffect, useCallback, useRef } from 'react';
import { PredictionRequest, PredictionResponse } from '../types';
import { salaryService } from '../services/salaryService';

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
      setIsBackendOnline(health.all_models_ready);
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
