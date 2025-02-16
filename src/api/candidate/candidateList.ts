import axios from 'axios';

interface CandidateResponse {
  candidates: Candidate[];
  totalItems: number;
}

interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  status: string;
  experience: string;
  skills: string[];
  resumeUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface InterviewResponse {
  interviews: Interview[];
  totalItems: number;
}

interface Interview {
  id: number;
  candidateId: number;
  interviewerId: number;
  scheduleTime: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const API_URL = 'http://localhost:3000/candidate';
// 获取候选人列表
export const getCandidateList = async () => {
  const response = await axios.get<CandidateResponse>(`${API_URL}/candidates`);
  return response.data;
};

// 获取已录用的候选人
export const getHiredCandidates = async () => {
  const response = await axios.get<CandidateResponse>(`${API_URL}/candidates/hired`);
  return response.data;
};

// 获取schedule面试列表
export const getActiveInterviews = async () => {
  const response = await axios.get<InterviewResponse>(`${API_URL}/interviews/active`);
  return response.data;
};

// 获取招聘进度中的候选人列表
export const getCandidatesInProgress = async () => {
  const response = await axios.get<CandidateResponse>(`${API_URL}/candidates/in-progress`);
  return response.data;
};







