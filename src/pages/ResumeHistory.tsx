import { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Chip,
  CircularProgress,
  Alert
} from "@mui/material";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { formatDistanceToNow } from 'date-fns';
import { getUserResumes, getAccessibleResumeUrl, deleteResume, ResumeRecord } from "../api/resumeUpload/resumeService";
import { useUser } from "../contexts/userContext";

interface ResumeHistoryProps {
  onSelect?: (resume: ResumeRecord) => void;
  refreshTrigger?: number;
}

const ResumeHistory = ({ onSelect, refreshTrigger = 0 }: ResumeHistoryProps) => {
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchResumes = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      setError(null);
      try {
        const data = await getUserResumes(user.id.toString());
        setResumes(data);
      } catch (err) {
        console.error("Failed to fetch resume history:", err);
        setError("Failed to load resume history");
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [user?.id, refreshTrigger]);

  const handleDelete = async (resume: ResumeRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this resume?")) return;

    try {
      const success = await deleteResume(resume.fileKey);
      if (success) {
        setResumes(prev => prev.filter(r => r.id !== resume.id));
      } else {
        setError("Failed to delete resume");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete resume");
    }
  };

  const handleOpenResume = async (resume: ResumeRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const url = await getAccessibleResumeUrl(resume.fileKey);
      window.open(url, '_blank');
    } catch (err) {
      console.error("Failed to get resume URL:", err);
      setError("Failed to open resume");
    }
  };

  const handleSelect = (resume: ResumeRecord) => {
    if (onSelect) {
      onSelect(resume);
    }
  };

  // 将文件大小转换为可读格式
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading && resumes.length === 0) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (resumes.length === 0) {
    return (
      <Box textAlign="center" p={3}>
        <Typography color="textSecondary">No resume history found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Resume History ({resumes.length})
      </Typography>
      <List sx={{ width: '100%' }}>
        {resumes.map((resume, index) => (
          <Box key={resume.id}>
            <ListItem 
              component="button"
              onClick={() => handleSelect(resume)}
              sx={{ 
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'action.hover' },
                borderRadius: 1,
                mb: 1
              }}
            >
              <ListItemIcon>
                <InsertDriveFileIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary={resume.fileName}
                secondary={
                  <Box>
                    <Typography component="span" variant="body2" color="textSecondary">
                      {formatDistanceToNow(new Date(resume.uploadDate), { addSuffix: true })}
                    </Typography>
                    <Chip 
                      label={formatFileSize(resume.fileSize)}
                      size="small"
                      variant="outlined"
                      sx={{ ml: 1, fontSize: '0.7rem' }}
                    />
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton 
                  edge="end" 
                  aria-label="open"
                  onClick={(e) => handleOpenResume(resume, e)}
                  sx={{ mr: 1 }}
                >
                  <OpenInNewIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  edge="end" 
                  aria-label="delete"
                  onClick={(e) => handleDelete(resume, e)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            {index < resumes.length - 1 && <Divider component="li" />}
          </Box>
        ))}
      </List>
    </Box>
  );
};

export default ResumeHistory;