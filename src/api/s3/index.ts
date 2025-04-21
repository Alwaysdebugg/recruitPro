import axios from 'axios';

const API_URL = 'http://localhost:3000/s3';

// s3 预签名URL @post
export const getPresignedUrl = async (body: { fileName: string, fileType: string, userId: string }) => {
    const response = await axios.post(`${API_URL}/presigned-url`, body);
    return response.data;
  };
  
  // s3 上传文件 @fetch
  export const uploadFile = async (presignedUrl: string, file: File) => {
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': 'application/pdf',
      },
    });
    return response.ok ||  null;
  };
