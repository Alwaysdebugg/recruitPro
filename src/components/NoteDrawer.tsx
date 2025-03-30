import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';

interface NoteDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialNote?: string;
  onSave?: (note: string) => void;
}

const NoteDrawer: React.FC<NoteDrawerProps> = ({
  isOpen,
  onClose,
  initialNote = '',
  onSave
}) => {
  const [note, setNote] = useState(initialNote);

  const handleSave = () => {
    if (onSave) {
      onSave(note);
    }
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: {
            xs: '100%',
            sm: 400
          },
          boxSizing: 'border-box',
          backgroundColor: '#ffffff'
        }
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
          }}
        >
          <Typography variant="h6" component="div">
            Notes
          </Typography>
          <IconButton
            edge="end"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ p: 2, flexGrow: 1 }}>
          <TextField
            fullWidth
            multiline
            rows={20}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write your notes here..."
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f5f5f7',
                '& fieldset': {
                  borderColor: 'transparent'
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(0, 0, 0, 0.23)'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1976d2'
                }
              }
            }}
          />
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid rgba(0, 0, 0, 0.12)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2
          }}
        >
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              borderRadius: '8px',
              textTransform: 'none'
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            startIcon={<SaveIcon />}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default NoteDrawer; 