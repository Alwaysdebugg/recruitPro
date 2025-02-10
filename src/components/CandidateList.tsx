import React, { useState } from 'react';
import { format } from 'date-fns';
import { FileText, Calendar, Star, X } from 'lucide-react';
import { Candidate } from '../types';
import ScheduleInterviewDrawer from './ScheduleInterviewDrawer';

const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    role: 'Senior Frontend Developer',
    status: 'interview',
    matchScore: 92,
    resumeUrl: '#',
    appliedDate: '2024-03-10'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.c@example.com',
    role: 'Backend Engineer',
    status: 'screening',
    matchScore: 85,
    resumeUrl: '#',
    appliedDate: '2024-03-09'
  },
];

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  screening: 'bg-yellow-100 text-yellow-800',
  interview: 'bg-purple-100 text-purple-800',
  offer: 'bg-green-100 text-green-800',
  hired: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800'
};

const CandidateList: React.FC = () => {
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isScheduleDrawerOpen, setIsScheduleDrawerOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    resumeUrl: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', role: '', resumeUrl: '' });
    setIsAddDrawerOpen(false);
  };

  const handleScheduleInterview = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsScheduleDrawerOpen(true);
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Candidates</h2>
        <button 
          onClick={() => setIsAddDrawerOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Add Candidate
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 p-6">
          {mockCandidates.map((candidate) => (
            <div key={candidate.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                  <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium ${statusColors[candidate.status]}`}>
                    {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{candidate.role}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {format(new Date(candidate.appliedDate), 'MMM d, yyyy')}
                  <Star className="w-4 h-4 ml-4 mr-1" />
                  Match Score: {candidate.matchScore}%
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
                  Full Name
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
                  Email
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
                  Applied Role
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="resumeUrl" className="block text-sm font-medium text-gray-700">
                  Resume URL
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