import axios from 'axios';
import { Interview, Candidate } from '../../types';

interface CandidateResponse {
  candidates: Candidate[];
  totalItems: number;
}

interface InterviewResponse {
  interviews: Interview[];
  totalItems: number;
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

// 添加候选人
export const addCandidate = async (candidate: Candidate) => {
  const response = await axios.post(`${API_URL}/candidates`, candidate);
  return response.data;
};

// 编辑候选人
export const editCandidate = async (candidate: Candidate) => {
  const response = await axios.put(`${API_URL}/candidates/${candidate.id}`, candidate);
  return response.data;
};









