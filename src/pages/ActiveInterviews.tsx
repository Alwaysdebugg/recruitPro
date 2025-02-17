import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Interview } from '../types';
import { getActiveInterviews } from '../api/candidate/candidate';

const ActiveInterviews: React.FC = () => {
  const navigate = useNavigate();
  const [activeInterviews, setActiveInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  // 获取schedule面试列表
  useEffect(() => {
    const fetchActiveInterviews = async () => {
      try {
        setLoading(true);
        const data = await getActiveInterviews();
        setActiveInterviews(data.interviews);
        console.log("activeInterviews",data.interviews);
      } catch (error) {
        console.error('Error fetching active interviews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActiveInterviews();
  }, []);

  return (
    <div className="p-6 bg-gray-50">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
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
        {activeInterviews.map((interview) => (
          <div key={interview.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {interview.candidateName}
                </h3>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(interview.scheduledTime).toLocaleDateString()} at 
                  {new Date(interview.scheduledTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Type:</span>{' '}
                      <span className="text-xs bg-purple-300 text-gray-900 px-2 py-1 rounded-md">
                      {interview.type.charAt(0).toUpperCase() + interview.type.slice(1)}
                      </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Interviewers:</span>{' '}
                    <span className='font-bold'>{interview.interviewer}</span>
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
      </>
      )}
    </div>
  );
};

export default ActiveInterviews;