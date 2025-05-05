import axios from 'axios';

const API_URL = 'http://localhost:3000/resume'; 

export interface ResumeRecord {
  id: string;
  fileName: string;
  fileKey: string;
  uploadDate: string;
  fileSize: number;
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