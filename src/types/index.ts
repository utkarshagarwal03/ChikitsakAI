
export type UserRole = 'patient' | 'doctor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type ConditionSeverity = 'Minimal' | 'Mild' | 'Moderate' | 'Severe';

export interface Patient extends User {
  role: 'patient';
  age?: number;
  contactNumber?: string;
  medicalHistory?: string;
  mentalHealthScore?: number;
  conditionSeverity?: ConditionSeverity;
  lastAssessmentDate?: string;
  medications?: Medication[];
  adrTestResults?: ADRTestResult[];
}

export interface Doctor extends User {
  role: 'doctor';
  specialization?: string;
  availability?: string[];
  experience?: number;
  bio?: string;
  dailyPatientRecords?: DailyPatientRecord[];
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage?: Message;
  updatedAt: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  startDate: string;
  endDate?: string;
}

export interface DailyPatientRecord {
  date: string;
  patientCount: number;
  patients: {
    id: string;
    name: string;
    notes?: string;
  }[];
}

export type ADRSeverity = 'None' | 'Mild' | 'Moderate' | 'Severe' | 'Life-threatening';

export interface ADRTestResult {
  id: string;
  medicationName: string;
  datePerformed: string;
  reactionDescription?: string;
  severity: ADRSeverity;
  recommendations?: string;
}
