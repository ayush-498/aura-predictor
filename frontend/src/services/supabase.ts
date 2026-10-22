/**
 * Supabase Cloud Database Client
 * Uses native PostgREST HTTP fetch — zero external dependencies, ultra-fast.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://vosqxczrsqhghiyasfnt.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvc3F4Y3pyc3FoZ2hpeWFzZm50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2OTA2MjcsImV4cCI6MjEwODI2NjYyN30.LI3N3BX8K4tQDV6ez-Cb2TCfjoGvENJ8B1YPsnMYwvA';

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
};

async function postgrest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${SUPABASE_URL}/rest/v1${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.warn(`Supabase query warning [${response.status}]:`, errorText);
    throw new Error(`Supabase Error ${response.status}: ${errorText}`);
  }

  // 204 No Content
  if (response.status === 204) {
    return [] as unknown as T;
  }

  return response.json();
}

export interface GlobalPredictionRecord {
  id?: string;
  created_at?: string;
  role: string;
  experience: number;
  rating: number;
  current_salary: number;
  location: string;
  status: string;
  predicted_hike: number;
  predicted_salary: number;
  model_used?: string;
}

export interface GlobalCVRecord {
  id?: string;
  created_at?: string;
  filename: string;
  candidate_name?: string;
  role?: string;
  experience?: number;
  rating?: number;
  current_salary?: number;
  predicted_hike?: number;
  skills?: string[];
}

export interface GlobalLedgerRecord {
  id?: string;
  created_at?: string;
  candidate_name: string;
  role: string;
  experience: number;
  rating: number;
  current_salary: number;
  approved_hike: number;
  final_salary: number;
  status?: string;
  source?: string;
}

export const supabaseService = {
  isConfigured(): boolean {
    return Boolean(SUPABASE_URL && SUPABASE_KEY);
  },

  /**
   * Save a simulator run so any user across the globe can view it
   */
  async recordPrediction(data: GlobalPredictionRecord): Promise<void> {
    try {
      await postgrest('/global_predictions', {
        method: 'POST',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.warn('Silent Supabase prediction sync skip:', e);
    }
  },

  /**
   * Save an uploaded CV / Resume profile
   */
  async recordCVUpload(data: GlobalCVRecord): Promise<void> {
    try {
      await postgrest('/global_cv_uploads', {
        method: 'POST',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.warn('Silent Supabase CV sync skip:', e);
    }
  },

  /**
   * Fetch recent simulations from all visitors worldwide
   */
  async getRecentPredictions(limit = 25): Promise<GlobalPredictionRecord[]> {
    try {
      return await postgrest<GlobalPredictionRecord[]>(
        `/global_predictions?select=*&order=created_at.desc&limit=${limit}`
      );
    } catch {
      return [];
    }
  },

  /**
   * Fetch recent CV uploads from all visitors
   */
  async getRecentCVUploads(limit = 25): Promise<GlobalCVRecord[]> {
    try {
      return await postgrest<GlobalCVRecord[]>(
        `/global_cv_uploads?select=*&order=created_at.desc&limit=${limit}`
      );
    } catch {
      return [];
    }
  },

  /**
   * Save an approved candidate to the shared enterprise ledger
   */
  async addLedgerCandidate(candidate: GlobalLedgerRecord): Promise<GlobalLedgerRecord | null> {
    try {
      const rows = await postgrest<GlobalLedgerRecord[]>('/global_appraisal_ledger', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify(candidate),
      });
      return rows?.[0] || null;
    } catch (e) {
      console.warn('Failed to save to Supabase ledger:', e);
      return null;
    }
  },

  /**
   * Fetch all globally approved candidates for the ledger
   */
  async getGlobalLedger(): Promise<GlobalLedgerRecord[]> {
    try {
      return await postgrest<GlobalLedgerRecord[]>(
        '/global_appraisal_ledger?select=*&order=created_at.desc'
      );
    } catch {
      return [];
    }
  },

  /**
   * Remove a candidate from the shared ledger
   */
  async deleteLedgerCandidate(id: string): Promise<boolean> {
    try {
      await postgrest(`/global_appraisal_ledger?id=eq.${id}`, {
        method: 'DELETE',
      });
      return true;
    } catch {
      return false;
    }
  },
};
