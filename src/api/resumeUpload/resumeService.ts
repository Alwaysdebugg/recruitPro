import axios from 'axios';

const API_URL = 'http://localhost:3000/resume'; 

export interface ResumeRecord {
  id: string;
  fileName: string;
  fileKey: string;
  uploadDate: string;
  fileSize: number;
}

export interface ResumeAnalysisResult {
  candidateId: number;
  jobRequirements: string[];
  requiredSkills: string[];
  experienceLevel: number;
  jobTitle: string;
  jobDescription: string;
}

// 定义响应数据接口
interface ResumeAnalysisResponse {
  matchScore: number;
  skillsMatch: number;
  experienceMatch: boolean;
  keywordMatches: number;
  missingSkills: number;
  recommendations: string[];
  status: 'success' | 'failed';
}

// 错误类型定义
class ResumeAnalysisError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'ResumeAnalysisError';
  }
}

// 获取用户上传的简历历史
export const getUserResumes = async (userId: string): Promise<ResumeRecord[]> => {
  const response = await axios.get<ResumeRecord[]>(`${API_URL}/resumes-by-user/${userId}`);
  return response.data;
};

// 获取可访问的简历URL
export const getAccessibleResumeUrl = async (fileKey: string): Promise<string> => {
  const response = await axios.get<{ url: string }>(`${API_URL}/access-url/${fileKey}`);
  return response.data.url;
};

// 删除已上传的简历
export const deleteResume = async (fileKey: string): Promise<boolean> => {
  const response = await axios.delete<{ success: boolean }>(`${API_URL}/delete/${fileKey}`);
  return response.data.success;
};

// 简历分析
export const analyzeResume = async (params: ResumeAnalysisResult): Promise<ResumeAnalysisResponse> => {
  const response = await axios.post<ResumeAnalysisResponse>(`${API_URL}/calculate-match`, 
    params,
    {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      }
    }
  );

  if(!response.data) {
    throw new ResumeAnalysisError('No data returned from server');
  }
  return response.data;
};