export interface Candidate {
  id: number;
  name: string;
  email: string;
  appliedRole: string;
  status: string;
  experience: string;
  resumeUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Interview {
  id: number;
  candidateId: number;
  candidateName: string;
  scheduledTime: string;
  interviewer: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  type: 'technical' | 'behavioral' | 'final' | 'screening';
  createdAt: string;
  updatedAt: string;
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