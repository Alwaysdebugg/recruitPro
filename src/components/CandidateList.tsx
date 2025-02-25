import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { FileText, Calendar, Star, X } from 'lucide-react';
import { Candidate } from '../types';
import ScheduleInterviewDrawer from './ScheduleInterviewDrawer';
import { addCandidate, editCandidate, getCandidateList } from '../api/candidate/candidate';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import OpenForm from './openForm';
import AddIcon from '@mui/icons-material/Add';
import { Tab, Tabs, Box } from '@mui/material';

const statusColors: { [key: string]: string } = {
  NEW: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  INTERVIEW: 'bg-purple-100 text-purple-800',
  OFFER: 'bg-green-100 text-green-800',
  HIRED: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-red-100 text-red-800',
  SCREENING: 'bg-orange-100 text-orange-800'
};

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const CandidateList: React.FC = () => {
  const [value, setValue] = useState(0);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isOpenEditForm, setIsOpenEditForm] = useState(false);
  const [isScheduleDrawerOpen, setIsScheduleDrawerOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    appliedRole: '',
    resumeUrl: '',
    experience: ''
  });

  const [candidatesList, setCandidatesList] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  
  // 获取候选人列表
  useEffect(() => {
    getList();
  }, []);
  
  // 根据选中的 tab 过滤候选人
  useEffect(() => {
    if (value === 0) {
      // "All" tab
      setFilteredCandidates(candidatesList);
    } else {
      // tab 分类
      const statusMap: { [key: number]: string } = {
        1: 'NEW',
        2: 'INTERVIEW',
        3: 'OFFER',
        4: 'HIRED',
        5: 'REJECTED',
        6: 'SCREENING',
        7: 'IN_PROGRESS'
      };
      
      const selectedStatus = statusMap[value];
      const filtered = candidatesList.filter(
        candidate => candidate.status === selectedStatus
      );
      setFilteredCandidates(filtered);
    }
  }, [value, candidatesList]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 添加候选人
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const candidate: Candidate = {
      name: formData.name,
      email: formData.email,
      appliedRole: formData.appliedRole,
      resumeUrl: formData.resumeUrl,
      experience: formData.experience,
      id: 0, // 你可能需要在这里设置一个默认值
      status: 'NEW', // 你可能需要在这里设置一个默认值
      createdAt: '', // 你可能需要在这里设置一个默认值
      updatedAt: '' // 你可能需要在这里设置一个默认值
    };
    try {
      const data = await addCandidate(candidate);
      console.log('添加候选人', data);

      // 刷新候选人列表
      getList();
    } catch (error) {
      console.error('error', error);
    }
    setFormData({ name: '', email: '', appliedRole: '', resumeUrl: '', experience: '' });
    setIsAddDrawerOpen(false);
  };

  const handleScheduleInterview = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsScheduleDrawerOpen(true);
  };

  // openForm 编辑候选人信息
  const handleEditCandidate = async (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsOpenEditForm(true);
  };

  // 更新候选人信息
  const handleUpdateCandidate = async (candidate: Candidate) => {
    const data = await editCandidate(candidate);
    console.log('更新候选人', data);
    getList();
  };
 
  // 获取候选人列表
  const getList = async () => {
    const data = await getCandidateList();
    setCandidatesList(data.candidates);
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="flex flex-row justify-between items-center gap-4 mb-4">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold text-gray-900">Candidates</h2>
        <button 
          onClick={() => setIsAddDrawerOpen(true)}
          className="h-6 w-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <AddIcon />
        </button>
      </div>

      {/* tab分类栏 */}
      <Box>
        <Tabs value={value} onChange={handleTabChange} textColor="primary" aria-label="candidate status">
          <Tab label="All" {...a11yProps(0)} />
          <Tab label="New" {...a11yProps(1)} />
          <Tab label="Interview" {...a11yProps(2)} />
          <Tab label="Offer" {...a11yProps(3)} />
          <Tab label="Hired" {...a11yProps(4)} />
          <Tab label="Rejected" {...a11yProps(5)} />
          <Tab label="Screening" {...a11yProps(6)} />
          <Tab label="In Progress" {...a11yProps(7)} />
        </Tabs>
      </Box>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden min-h-[calc(100vh-10rem)]">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 p-6">
          {filteredCandidates.map((candidate) => (
            <div key={candidate.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                  <button className="ml-2 hover:text-gray-500 cursor-pointer" onClick={() => handleEditCandidate(candidate)}>
                    <EditNoteOutlinedIcon className="w-4 h-4" />
                  </button>
                  <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium ${statusColors[candidate.status]}`}>
                    {candidate.status}
                  </span>
                </div>
                <div className="flex items-center text-sm mb-2 text-gray-500">
                <span className="mr-2">Applied Role:</span>
                <p className="text-gray-600">{candidate.appliedRole}</p>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {format(new Date(candidate.createdAt), 'MMM d, yyyy')}
                  <Star className="w-4 h-4 ml-4 mr-1" />
                  Match Score: 50%
                </div>
              </div>
              
              <div className="flex items-center mt-4 sm:mt-0">
                <button className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg mr-2">
                  <FileText className="w-4 h-4 mr-1" />
                  Resume
                </button>
                <button 
                  onClick={() => handleScheduleInterview(candidate)}
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Schedule Interview
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Candidate Drawer */}
      <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform ${isAddDrawerOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-30`}>
        <div className="h-full flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Add New Candidate</h3>
            <button 
              onClick={() => setIsAddDrawerOpen(false)}
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

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Add Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* 更新候选人信息 */}
      <OpenForm
        isOpen={isOpenEditForm}
        onClose={() => {
          setIsOpenEditForm(false)
          setSelectedCandidate(null)
        }}
        onSubmit={(candidate: Candidate) => {handleUpdateCandidate(candidate)}}
        candidate={selectedCandidate || undefined}
      />

      {/* Schedule Interview Drawer */}
      {selectedCandidate && (
        <ScheduleInterviewDrawer
          isOpen={isScheduleDrawerOpen}
          onClose={() => {
            setIsScheduleDrawerOpen(false);
            setSelectedCandidate(null);
          }}
          candidate={selectedCandidate}
        />
      )}

      {/* Overlay */}
      {(isAddDrawerOpen || isScheduleDrawerOpen || isOpenEditForm) && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-20"
          onClick={() => {
            setIsAddDrawerOpen(false);
            setIsScheduleDrawerOpen(false);
            setIsOpenEditForm(false);
            setSelectedCandidate(null);
          }}
        />
      )}
    </div>
  );
};

export default CandidateList;