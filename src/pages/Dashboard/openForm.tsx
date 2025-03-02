// 更新候选人信息
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Candidate } from '../../types';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Theme, useTheme } from '@mui/material/styles';

interface OpenFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (candidate: Candidate) => void;
  candidate?: Candidate;
}
 
const status = ['NEW', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED', 'SCREENING', 'IN_PROGRESS'];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(status: string, candidateStatus: string, theme: Theme) {
  return {
    fontWeight: candidateStatus.includes(status)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

const OpenForm: React.FC<OpenFormProps> = ({ isOpen, onClose, onSubmit, candidate }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState<Candidate>(candidate || {
    id: 0,
    name: '',
    email: '',
    appliedRole: '',
    resumeUrl: '',
    experience: '',
    status: 'NEW',
    createdAt: '',
    updatedAt: ''
  });

  // 同步候选人信息
  useEffect(() => {
    if (candidate) {
      setFormData(candidate);
    }
  }, [candidate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStatusChange = (event: SelectChangeEvent<typeof formData.status>) => {
    const { target } = event;
    setFormData({ ...formData, status: target.value as string });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('formData',formData);
    onSubmit(formData);
    onClose();
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-30`} style={{borderRadius: '10px'}}>
      <div className="h-full flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Edit Candidate</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name{' '}
                <span className="text-xs text-gray-500">(required)</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
  
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email{' '}
                <span className="text-xs text-gray-500">(required)</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
  
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Experience{' '}
                <span className="text-xs text-gray-500">(in years)</span>
              </label>
              <input
                type="text"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
  
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Applied Role{' '}
                <span className="text-xs text-gray-500">(required)</span>
              </label>
              <input
                type="text"
                id="appliedRole"
                name="appliedRole"
                value={formData.appliedRole}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
  
            <div>
              <label htmlFor="resumeUrl" className="block text-sm font-medium text-gray-700">
                Resume URL{' '}
                <span className="text-xs text-gray-500">(required)</span>
              </label>
              <input
                type="url"
                id="resumeUrl"
                name="resumeUrl"
                value={formData.resumeUrl}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            {/* status 下拉框 */}
            <div>
              <FormControl sx={{ m: 0, width: 300 }}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  value={formData.status}
                  onChange={handleStatusChange}
                  input={<OutlinedInput label="Status" />}
                  MenuProps={MenuProps}
                >
                  {status.map((status) => (
                    <MenuItem
                      key={status}
                      value={status}
                      style={getStyles(status, formData.status, theme)}
                    >
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
  
            <div className="pt-4">
              <button
                type="submit"
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Edit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OpenForm;


