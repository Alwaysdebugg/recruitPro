import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Candidate } from '../types';

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
  }
];

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  screening: 'bg-yellow-100 text-yellow-800',
  interview: 'bg-purple-100 text-purple-800',
  offer: 'bg-green-100 text-green-800',
  hired: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800'
};

const HiringProgress: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-50">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate('/')}
          className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Hiring Progress</h1>
      </div>

      <div className="space-y-6">
        {Object.keys(statusColors).map((status) => {
          const candidatesInStatus = mockCandidates.filter(c => c.status === status);
          if (candidatesInStatus.length === 0) return null;

          return (
            <div key={status} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  <span className="ml-2 text-sm font-medium text-gray-500">
                    ({candidatesInStatus.length})
                  </span>
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {candidatesInStatus.map((candidate) => (
                  <div key={candidate.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {candidate.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{candidate.role}</p>
                        <p className="text-sm text-gray-500">{candidate.email}</p>
                      </div>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColors[candidate.status]}`}>
                        {candidate.matchScore}% Match
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HiringProgress;