export interface EmployeeProfile {
  id: string;
  name: string;
  role: string;
  experience: number;
  rating: number;
  currentSalary: number;
  location: string;
  hikePct: number;
  newSalary: number;
  status: 'Approved' | 'Review' | 'Flagged';
  avatar: string;
  employmentStatus?: string;
  department?: string;
  lastAppraisalDate?: string;
  comments?: string;
}

export interface PredictionParameters {
  role: string;
  rating: number;
  experience: number;
  salary: number;
  location: string;
  status: string;
}

export interface PredictionResult {
  gbHike: number;
  lrHike: number;
  recommendedHike: number;
  newSalary: number;
  deltaSalary: number;
  modelVariance: number;
  ratingShare: number;
  expShare: number;
  roleShare: number;
  confidenceScore: string;
  maeMargin: number;
  modelUsed: string;
  isBackendLive?: boolean;
}

export interface TelemetryLog {
  id: string;
  timestamp: string;
  candidateRole: string;
  experience: number;
  rating: number;
  predictedHike: number;
  latencyMs: number;
  status: '200 OK' | '400 ERR' | '500 ERR';
  engine: string;
}

export interface CompensationBand {
  level: string;
  title: string;
  minSalary: number;
  midSalary: number;
  maxSalary: number;
  typicalHikeMin: number;
  typicalHikeMax: number;
  marketParityIndex: number;
}

export interface ModelMetricSpec {
  experiment: string;
  model: string;
  trainRmse: number;
  testRmse: number;
  trainR2: number;
  testR2: number;
  testMae: number;
}
