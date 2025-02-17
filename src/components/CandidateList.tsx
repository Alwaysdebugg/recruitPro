import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { FileText, Calendar, Star, X } from 'lucide-react';
import { Candidate } from '../types';
import ScheduleInterviewDrawer from './ScheduleInterviewDrawer';
import { addCandidate, getCandidateList } from '../api/candidate/candidate';

const statusColors: { [key: string]: string } = {
  NEW: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  INTERVIEW: 'bg-purple-100 text-purple-800',
  OFFER: 'bg-green-100 text-green-800',
  HIRED: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-red-100 text-red-800'
};

const CandidateList: React.FC = () => {
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
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
  // 获取候选人列表
  useEffect(() => {
    const fetchCandidates = async () => {
      const data = await getCandidateList();
      console.log("candidatesListcomponent",data);
      setCandidatesList(data.candidates);
    };
    fetchCandidates();
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 添加候选人
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
      const updatedData = await getCandidateList();
      setCandidatesList(updatedData.candidates);
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

  return (
    <div className="p-6 bg-gray-50">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Candidates</h2>
        <button 
          onClick={() => setIsAddDrawerOpen(true)}
          className="h-6 w-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
         +
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 p-6">
          {candidatesList.map((candidate) => (
            <div key={candidate.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
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
      {(isAddDrawerOpen || isScheduleDrawerOpen) && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-20"
          onClick={() => {
            setIsAddDrawerOpen(false);
            setIsScheduleDrawerOpen(false);
            setSelectedCandidate(null);
          }}
        />
      )}
    </div>
  );
};

export default CandidateList;