// 上传文件类型
export enum UploadFileType {
  RESUME = 'resume',
  COVER_LETTER = 'cover-letter',
  OTHER = 'other',
}


// 上传文件类型
export interface UploadFile {
  id: string;
  name: string;
  type: UploadFileType;
  size: number;
  url: string;
  createdAt: string;
  updatedAt: string;
}