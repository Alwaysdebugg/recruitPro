// 简历上传抽屉
import { useState, useCallback, useEffect } from "react";
import { 
  Drawer, 
  Button, 
  styled, 
  Typography, 
  Box,
  IconButton,
  LinearProgress,
  Alert,
  Tabs,
  Tab
} from "@mui/material";
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { getPresignedUrl, uploadFile } from "../../api/s3/index"
import { useUser } from "../../contexts/userContext"
import { analyzeResume } from "../../api/resumeUpload/resumeService";

// 样式组件
const DropzoneContainer = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const FilePreview = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));

interface ResumeUploadDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (resumeUrl: string) => void;
}

interface UploadFile extends File {
  preview?: string;
  progress?: number;
  error?: string;
  fileUrl?: string;
}

interface PresignedUrlResponse {
  presignedUrl: string;
  fileKey: string;
}

interface ResumeAnalysisResponse {
  matchScore: number;
  skillsMatch: number;
  experienceMatch: boolean;
  keywordMatches: number;
  missingSkills: number;
  recommendations: string[];
  status: 'success' | 'failed';
}

const ResumeUploadDrawer = ({
  isOpen,
  onClose,
  onUpload,
}: ResumeUploadDrawerProps) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const { user } = useUser();
  const [tabValue, setTabValue] = useState(0);
  // const [refreshHistory, setRefreshHistory] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResponse | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file),
      progress: 0
    }));
    setFiles(prev => [...prev, ...newFiles]);
    setUploadError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 5,
    maxSize: 5242880, // 5MB
    onDropRejected: (rejectedFiles) => {
      setUploadError('文件格式不正确或超出大小限制（5MB）');
    }
  });

  // 实现上传功能
  const handleUpload = async () => {
    try {
      const resumeUrls: string[] = [];
      for (let file of files) {
        // 1. 首先获取预签名URL
        const formData = {
          fileName: file.name,
          fileType: "application/pdf",
          userId: user?.id?.toString() || "",
        };
        console.log("formData", formData);        
        const response = await getPresignedUrl(formData) as PresignedUrlResponse;
        const { presignedUrl, fileKey } = response;

        // 2. 使用预签名URL上传文件
        await uploadFile(presignedUrl, file)
          .then((res)=> {
            resumeUrls.push(presignedUrl);
            console.log("upload_success", res);
            file.progress = 100;
            file.fileUrl = fileKey;
          })
          .catch((err) => {
            console.error("Upload error details:", err);
            setUploadError("Upload Failed: " + err.message);
          });
      }
      if (resumeUrls.length > 0) {
        onUpload(resumeUrls[0]);
        setUploadSuccess("Upload Success");
        setFiles([]);
        setTabValue(1); // 切换到分析选项卡
      }
    } catch (err) {
      console.log('err', err);
      setUploadError("Upload Failed, Please Try Again");
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setUploadSuccess(null);
    setFiles(prev => {
      const removedFile = prev.find(f => f.name === fileName);
      if (removedFile?.preview) {
        URL.revokeObjectURL(removedFile.preview);
      }
      return prev.filter(file => file.name !== fileName);
    });
  };

  const handleCancel = () => {
    setFiles([]); // 清空文件列表
    setUploadError(null); // 清空错误信息
    setUploadSuccess(null); // 清空成功信息
    onClose(); // 关闭抽屉
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // 简历分析请求
  const handleAnalyzeResume = async () => {
    try {
      const params = {
        candidateId: 12,
        jobRequirements: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
        requiredSkills: ['JavaScript', 'React'],
        experienceLevel: 3,
        jobTitle: '前端开发工程师',
        jobDescription: '负责公司前端项目的开发和维护'
      }
      console.log("params", params);
      const result = await analyzeResume(params);
      console.log("analysisResult", result);
      setAnalysisResult(result);
    } catch (error) {
      console.error("Error analyzing resume:", error);
    }
  }

  useEffect(() => {
    if(tabValue === 1) {
      handleAnalyzeResume();
    }
  }, [tabValue]);


  // 组件卸载时清理预览URL
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, []);

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: {
            xs: "100%",
            sm: 400,
          },
          p: 0,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h6" component="h2">
          Resume
        </Typography>
      </Box>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="resume tabs"
      >
        <Tab label="Upload" />
        <Tab label="Analysis" />
      </Tabs>

      <Box
        sx={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {tabValue === 0 ? (
          <Box
            sx={{
              p: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <DropzoneContainer {...getRootProps()}>
              <input {...getInputProps()} />
              <CloudUploadIcon
                sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
              />
              <Typography variant="body1" gutterBottom>
                {isDragActive
                  ? "Drop the files here..."
                  : "Drag & drop resume files here, or click to select files"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Supported formats: PDF, DOC, DOCX (Max 5MB)
              </Typography>
            </DropzoneContainer>

            <Box sx={{ flex: 1, overflowY: "auto" }}>
              {files.map((file) => (
                <FilePreview key={file.name}>
                  <InsertDriveFileIcon sx={{ mr: 2 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" noWrap>
                      {file.name}
                    </Typography>
                    {file.progress !== undefined && file.progress < 100 && (
                      <LinearProgress
                        variant="determinate"
                        value={file.progress}
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveFile(file.name)}
                    aria-label="remove file"
                  >
                    <DeleteIcon />
                  </IconButton>
                </FilePreview>
              ))}
            </Box>

            {uploadError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {uploadError}
              </Alert>
            )}
            {uploadSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {uploadSuccess}
              </Alert>
            )}

            <Box sx={{ display: "flex", gap: 2, mt: "auto" }}>
              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={files.length === 0 || uploadSuccess !== null}
                startIcon={<CloudUploadIcon />}
                fullWidth
              >
                Upload
              </Button>
              <Button variant="outlined" onClick={handleCancel} fullWidth>
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              p: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="body2" color="textSecondary">
              Match Score: {analysisResult?.matchScore}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Skills Match: {analysisResult?.skillsMatch}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Missing Skills: {analysisResult?.missingSkills}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Keyword Matches: {analysisResult?.keywordMatches}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Experience Match: {analysisResult?.experienceMatch}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Recommendations: {analysisResult?.recommendations}
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default ResumeUploadDrawer;
