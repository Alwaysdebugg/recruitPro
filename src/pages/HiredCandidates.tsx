import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Star } from 'lucide-react';
import { format } from 'date-fns';
import { Candidate } from '../types';

const mockHiredCandidates: Candidate[] = [
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    role: 'Product Designer',
    status: 'hired',
    matchScore: 95,
    resumeUrl: '#',
    appliedDate: '2024-03-01'
  },
  {
    id: '4',
    name: 'James Wilson',
    email: 'james.w@example.com',
    role: 'Senior Backend Engineer',
    status: 'hired',
    matchScore: 88,
    resumeUrl: '#',
    appliedDate: '2024-03-05'
  }
];

const HiredCandidates: React.FC = () => {
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
        <h1 className="text-3xl font-bold text-gray-900">Hired This Month</h1>
      </div>

      <div className="grid gap-6">
        {mockHiredCandidates.map((candidate) => (
          <div key={candidate.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {candidate.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{candidate.role}</p>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {format(new Date(candidate.appliedDate), 'MMM d, yyyy')}
                  </span>
                  <span className="flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Match Score: {candidate.matchScore}%
                  </span>
                </div>
              </div>
              <span className="px-3 py-1 text-sm font-medium bg-emerald-100 text-emerald-800 rounded-full">
                Hired
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HiredCandidates;