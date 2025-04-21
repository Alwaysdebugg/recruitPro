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
// 获取候选人列表 @get
export const getCandidateList = async () => {
  const response = await axios.get<CandidateResponse>(`${API_URL}/candidates`);
  return response.data;
};

// 获取已录用的候选人 @get
export const getHiredCandidates = async () => {
  const response = await axios.get<CandidateResponse>(`${API_URL}/candidates/hired`);
  return response.data;
};

// 获取schedule面试列表 @get
export const getActiveInterviews = async () => {
  const response = await axios.get<InterviewResponse>(`${API_URL}/interviews/active`);
  return response.data;
};

// 获取招聘进度中的候选人列表 @get
export const getCandidatesInProgress = async () => {
  const response = await axios.get<CandidateResponse>(`${API_URL}/candidates/in-progress`);
  return response.data;
};

// 添加候选人 @post
export const addCandidate = async (candidate: Candidate) => {
  const response = await axios.post(`${API_URL}/candidates`, candidate);
  return response.data;
};

// 编辑候选人 @put
export const editCandidate = async (candidate: Candidate) => {
  const response = await axios.put(`${API_URL}/candidates/${candidate.id}`, candidate);
  return response.data;
};

// 更新候选人备注 @post
export const updateCandidateNote = async (candidateId: number, content: string) => {
  // 获取当前user信息
  const user = localStorage.getItem('user');
  const { id } = JSON.parse(user || '{}');
  const response = await axios.post(`${API_URL}/notes/add`, { candidate_id: candidateId, content, created_by: id});
  return response.data;
};

// 获取候选人备注列表 @get
export const getCandidateNoteList = async (candidateId: number) => {
  const response = await axios.get(`${API_URL}/notes/${candidateId}`);
  return response.data;
};

// 上传简历 @post
export const uploadResumeUrl = async (resumeUrl: string, candidateId: number) => {
  const response = await axios.post(`${API_URL}/resumes/upload`, { resumeUrl, candidateId });
  return response.data;
};









