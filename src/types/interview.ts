export interface CandidateProfile {
  name: string;
  email: string;
  skills: string[];
  experience: number;
  education: string;
  previousRoles: string[];
  resumeText: string;
}

export interface JobRequirement {
  skill: string;
  level: 'junior' | 'mid' | 'senior';
  required: boolean;
}

export interface JobDescription {
  title: string;
  company: string;
  requirements: JobRequirement[];
  description: string;
}

export interface Question {
  id: string;
  type: 'behavioral' | 'technical' | 'coding' | 'system-design';
  difficulty: 'easy' | 'medium' | 'hard';
  content: string;
  followUp?: string;
  expectedDuration: number; // in minutes
  tags: string[];
}

export interface Answer {
  questionId: string;
  content: string;
  timestamp: Date;
  duration: number; // in seconds
  confidence?: number;
}

export interface Score {
  technical: number;
  behavioral: number;
  communication: number;
  problemSolving: number;
  overall: number;
}

export interface InterviewSession {
  id: string;
  candidateProfile: CandidateProfile;
  jobDescription: JobDescription;
  questions: Question[];
  answers: Answer[];
  currentQuestionIndex: number;
  score: Score;
  status: 'setup' | 'in-progress' | 'completed';
  startTime?: Date;
  endTime?: Date;
}

export interface InterviewState {
  session: InterviewSession | null;
  isLoading: boolean;
  error: string | null;
}