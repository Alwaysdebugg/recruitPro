import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Interview } from '../types';

const mockInterviews: Interview[] = [
  {
    id: '1',
    candidateId: '1',
    candidateName: 'Sarah Johnson',
    date: '2024-03-15',
    time: '10:00',
    interviewers: ['John Smith', 'Emma Wilson'],
    status: 'scheduled',
    type: 'technical'
  },
  {
    id: '2',
    candidateId: '2',
    candidateName: 'Michael Chen',
    date: '2024-03-16',
    time: '14:00',
    interviewers: ['David Brown', 'Lisa Anderson'],
    status: 'scheduled',
    type: 'behavioral'
  }
];

const ActiveInterviews: React.FC = () => {
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
        <h1 className="text-3xl font-bold text-gray-900">Active Interviews</h1>
      </div>

      <div className="grid gap-6">
        {mockInterviews.map((interview) => (
          <div key={interview.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {interview.candidateName}
                </h3>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(interview.date).toLocaleDateString()} at {interview.time}
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Type:</span>{' '}
                    {interview.type.charAt(0).toUpperCase() + interview.type.slice(1)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Interviewers:</span>{' '}
                    {interview.interviewers.join(', ')}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveInterviews;