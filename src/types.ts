export type IncidentCategory = 
  | 'Online Harassment' 
  | 'Impersonation' 
  | 'Threats or Blackmail' 
  | 'Unsafe Situation' 
  | 'Privacy Breach' 
  | 'Other';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary?: boolean;
  notes?: string;
  createdAt: string;
}

export type JourneyStatus = 'not_started' | 'active' | 'safe' | 'overdue' | 'cancelled';

export interface Journey {
  id: string;
  destination: string;
  startLocation?: string;
  notes?: string;
  arrivalTime: string; // ISO string or datetime-local
  checkInDeadline: string; // ISO string or datetime-local
  status: JourneyStatus;
  startedAt?: string;
  safeAt?: string;
}

export interface IncidentRecord {
  id: string;
  category: IncidentCategory;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  description: string;
  evidenceRef?: string;
  tags?: string[];
  createdAt: string;
}

export interface PrivacyCheckItem {
  id: string;
  title: string;
  description: string;
  category: 'account' | 'device' | 'social' | 'location';
  completed: boolean;
  actionHint?: string;
}

export interface WarningSign {
  id: string;
  title: string;
  category: string;
  severity: 'high' | 'medium';
  explanation: string;
  matchedKeywords: string[];
}

export interface MessageAnalysisResult {
  riskLevel: 'low' | 'medium' | 'high';
  label: 'No Common Warning Signs Detected' | 'Some Warning Signs Detected' | 'Several Warning Signs Detected';
  summary: string;
  detectedSigns: WarningSign[];
  recommendations: string[];
  rawTextLength: number;
  analyzedAt: string;
}

export interface LocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  timestamp: number | null;
  error: string | null;
  loading: boolean;
}

export type ActiveSection = 
  | 'dashboard' 
  | 'circle' 
  | 'journey' 
  | 'analyzer' 
  | 'vault' 
  | 'privacy' 
  | 'resources'
  | 'location';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface StoredUserAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // Hex-encoded SHA-256 with salt
  salt: string;
  securityQuestion?: string;
  securityAnswerHash?: string;
  createdAt: string;
}

export interface AuthSession {
  user: User;
  token: string;
  createdAt: string;
}
