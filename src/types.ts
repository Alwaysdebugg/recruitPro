export interface Candidate {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  matchScore: number;
  resumeUrl: string;
  appliedDate: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  date: string;
  time: string;
  interviewers: string[];
  status: 'scheduled' | 'completed' | 'cancelled';
  type: 'technical' | 'behavioral' | 'final';
}

export interface DashboardStats {
  totalCandidates: number;
  activeInterviews: number;
  hiringProgress: number;
  candidatesByStage: {
    new: number;
    screening: number;
    interview: number;
    offer: number;
    hired: number;
    rejected: number;
  };
}