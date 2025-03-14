export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface HealthData {
  id: string;
  user_id: string;
  date: string;
  weight: number;
  height: number;
  steps: number;
  sleep_hours: number;
  heart_rate?: number;
  blood_pressure?: string;
  notes?: string;
  created_at: string;
}

export interface HealthInsight {
  bmi: number;
  bmiCategory: string;
  healthRisk: string;
  recommendation: string;
}