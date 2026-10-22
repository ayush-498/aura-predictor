export interface PredictionRequest {
  experience: number;
  rating: number;
  role: string;
  roles?: string[];
  skills?: string[];
  salary?: number;
  location?: string;
  status?: string;
}

export interface PredictionResponse {
  recommended_hike_pct: number;
  gradient_boosting_pct: number;
  linear_regression_pct: number;
  current_salary?: number | null;
  projected_new_salary?: number | null;
  salary_increment?: number | null;
  model_used: string;
  confidence_score: number;
  confidence_pct?: number;
  status: string;
  error?: string;
  is_live_prediction?: boolean;
  latency_ms?: number;
  roles?: string[];
  skills?: string[];
  synergy_bonus_pct?: number;
}

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
  department?: string;
  source?: 'Simulator' | 'Resume Upload' | 'CSV Ingestion' | 'Dataset Baseline';
}

export interface ModelMetric {
  Experiment: string;
  Model: string;
  'Test RMSE': number;
  'Test R2': number;
  'Test MAE (%)': number;
}

export interface BackendHealth {
  status: string;
  service?: string;
  server?: string;
  ready?: boolean;
  all_models_ready?: boolean;
  models_loaded?: number | Record<string, boolean>;
  models?: Record<string, boolean>;
  models_status?: Record<string, boolean>;
  timestamp?: string;
}

export const VALID_ROLES = [
  'SDE', 'Backend', 'Frontend', 'Python', 'Mobile',
  'Android', 'IOS', 'Java', 'Database', 'Testing', 'Web'
] as const;

export const EXTENDED_TECHNICAL_SKILLS = [
  'TypeScript', 'React', 'Node.js', 'Next.js', 'FastAPI', 'Spring Boot',
  'Docker', 'Kubernetes', 'AWS', 'GCP', 'PostgreSQL', 'MongoDB',
  'Redis', 'Kafka', 'GraphQL', 'Microservices', 'System Design', 'AI / ML'
] as const;

export interface ArchetypePreset {
  id: string;
  label: string;
  iconName: string;
  role: string;
  roles: string[];
  skills: string[];
  experience: number;
  rating: number;
  salary: number;
  description: string;
}

export const ARCHETYPE_PRESETS: ArchetypePreset[] = [
  {
    id: 'fullstack-senior',
    label: 'Full-Stack SDE',
    iconName: 'Code',
    role: 'SDE',
    roles: ['SDE', 'Backend', 'Frontend'],
    skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'System Design'],
    experience: 5.5,
    rating: 4.4,
    salary: 1600000,
    description: 'High mobility multi-tier developer (React + Node + DB)'
  },
  {
    id: 'cloud-backend',
    label: 'Backend & Cloud',
    iconName: 'Server',
    role: 'Backend',
    roles: ['Backend', 'Python', 'Database'],
    skills: ['FastAPI', 'Docker', 'Kubernetes', 'AWS', 'PostgreSQL', 'Microservices'],
    experience: 7.0,
    rating: 4.3,
    salary: 2200000,
    description: 'Distributed services & containerized infrastructure'
  },
  {
    id: 'ai-ml-specialist',
    label: 'AI / ML Engineer',
    iconName: 'Cpu',
    role: 'Python',
    roles: ['Python', 'SDE', 'Database'],
    skills: ['AI / ML', 'FastAPI', 'PostgreSQL', 'Docker', 'System Design'],
    experience: 4.0,
    rating: 4.6,
    salary: 2000000,
    description: 'Machine learning inference & high-throughput data pipelines'
  },
  {
    id: 'mobile-lead',
    label: 'Mobile Architect',
    iconName: 'Smartphone',
    role: 'Mobile',
    roles: ['Mobile', 'Android', 'IOS'],
    skills: ['TypeScript', 'GraphQL', 'System Design'],
    experience: 8.5,
    rating: 4.2,
    salary: 2400000,
    description: 'Cross-platform native and hybrid mobile ecosystem'
  },
  {
    id: 'qa-automation',
    label: 'QA & Reliability',
    iconName: 'CheckCircle',
    role: 'Testing',
    roles: ['Testing', 'Python', 'Web'],
    skills: ['Docker', 'AWS', 'Microservices'],
    experience: 3.5,
    rating: 4.1,
    salary: 950000,
    description: 'Automated CI/CD test frameworks & quality engineering'
  }
];

export const VALID_LOCATIONS = [
  'Bangalore', 'Hyderabad', 'Pune', 'Mumbai',
  'New Delhi', 'Chennai', 'Kolkata', 'Kerala'
] as const;

export interface ResumeParsedProfile {
  candidate_name: string;
  email?: string | null;
  phone?: string | null;
  experience: number;
  rating: number;
  role: string;
  salary: number;
  location: string;
  skills: string[];
  detected_role_confidence?: string;
}

export interface ResumeUploadResponse {
  status: 'success' | 'error';
  filename: string;
  extracted_profile: ResumeParsedProfile;
  prediction: PredictionResponse;
  text_preview?: string;
  error?: string;
}

