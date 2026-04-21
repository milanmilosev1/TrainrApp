export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number; // in minutes
}

export interface Workout {
  id: string;
  date: string; // ISO date string
  name: string;
  type: 'cardio' | 'strength' | 'flexibility' | 'sports' | 'other';
  duration: number; // in minutes
  intensity: 'low' | 'moderate' | 'high';
  exercises: Exercise[];
  notes?: string;
  completed: boolean;
}

export interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  fullName?: string;
}
