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
  Alert
} from "@mui/material";
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { Candidate } from "../../types";

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
  onUpload: (candidate: Candidate) => void;
}

interface UploadFile extends File {
  preview?: string;
  progress?: number;
  error?: string;
}

const ResumeUploadDrawer = ({
  isOpen,
  onClose,
  onUpload,
}: ResumeUploadDrawerProps) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

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

  const handleUpload = async () => {
    try {
      // 模拟上传进度
      for (let file of files) {
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setFiles(prev => 
            prev.map(f => 
              f.name === file.name ? { ...f, progress } : f
            )
          );
        }
      }

      // 上传成功后调用回调
      if (files.length > 0) {
        console.log('files', files);
      }
      
      onClose();
    } catch (error) {
      setUploadError('上传失败，请重试');
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setFiles(prev => {
      const removedFile = prev.find(f => f.name === fileName);
      if (removedFile?.preview) {
        URL.revokeObjectURL(removedFile.preview);
      }
      return prev.filter(file => file.name !== fileName);
    });
  };

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
          p: 3
        }
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Upload Resume
        </Typography>

        <DropzoneContainer {...getRootProps()}>
          <input {...getInputProps()} />
          <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="body1" gutterBottom>
            {isDragActive
              ? 'Drop the files here...'
              : 'Drag & drop resume files here, or click to select files'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Supported formats: PDF, DOC, DOCX (Max 5MB)
          </Typography>
        </DropzoneContainer>

        <Box sx={{ flex: 1, overflowY: 'auto', my: 2 }}>
          {files.map((file) => (
            <FilePreview key={file.name}>
              <InsertDriveFileIcon sx={{ mr: 2 }} />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" noWrap>{file.name}</Typography>
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

        <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={files.length === 0}
            startIcon={<CloudUploadIcon />}
            fullWidth
          >
            Upload
          </Button>
          <Button variant="outlined" onClick={onClose} fullWidth>
            Cancel
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ResumeUploadDrawer;
