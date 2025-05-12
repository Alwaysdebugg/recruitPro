import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import { Users, Calendar, FileText, PieChart } from 'lucide-react';
import { getCandidateList, getHiredCandidates, getActiveInterviews, getCandidatesInProgress } from '../../api/candidate/candidate';
import { useState, useEffect } from 'react';
import { Interview } from '../../types';

interface Candidate {
  id: number;
  name: string;
  email: string;
  appliedRole: string;
  status: string;
  experience: string;
  resumeUrl: string;
  createdAt: string;
  updatedAt: string;
}

// const mockStats: DashboardStats = {
//   totalCandidates: 156,
//   activeInterviews: 12,
//   hiringProgress: 68,
//   candidatesByStage: {
//     new: 45,
//     screening: 32,
//     interview: 28,
//     offer: 15,
//     hired: 24,
//     rejected: 12
//   }
// };

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [candidateList, setCandidateList] = useState<Candidate[]>([]);
  const [hiredCandidates, setHiredCandidates] = useState<Candidate[]>([]);
  const [activeInterviews, setActiveInterviews] = useState<Interview[]>([]);
  const [candidatesInProgress, setCandidatesInProgress] = useState<Candidate[]>([]);
  const [stageProgressOption, setStageProgressOption] = useState<any>({});
  // 添加类型定义
  type StageCountsType = {
    [key in 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected']: number;
  };

  useEffect(() => {
    // 获取候选人列表
    const fetchCandidateList = async () => {
      const data = await getCandidateList();
      // console.log("getCandidateList",data);
      setCandidateList(data.candidates);
      const option = updateChartOption(data.candidates);
      setStageProgressOption(option);
    };
    fetchCandidateList();

    // 获取已录用的候选人
    const fetchHiredCandidates = async () => {
      const data = await getHiredCandidates();
      setHiredCandidates(data.candidates);
    };
    fetchHiredCandidates();

    // 获取schedule面试列表
    const fetchActiveInterviews = async () => {
      const data = await getActiveInterviews();
      setActiveInterviews(data.interviews);
      console.log("activeInterviews",data);
    };
    fetchActiveInterviews();

    // 获取招聘进度中的候选人列表
    const fetchCandidatesInProgress = async () => {
      const data = await getCandidatesInProgress();
      // console.log("candidatesInProgress",data);
      setCandidatesInProgress(data.candidates);
    };
    fetchCandidatesInProgress();
  }, []);

    // 处理图标数据
    const processChartData = (candidates: Candidate[]) => {
      const stageCounts: StageCountsType = {
        new: 0,
        screening: 0,
        interview: 0,
        offer: 0,
        hired: 0,
        rejected: 0
      };
  
      candidates.forEach(candidate => {
        const status = candidate.status.toLowerCase() as keyof StageCountsType;
        if (status in stageCounts) {
          stageCounts[status]++;
        }
      });
  
      return {
        xAxisData: Object.keys(stageCounts).map(
          (key) => key.charAt(0).toUpperCase() + key.slice(1)
        ),
        seriesData: Object.values(stageCounts),
      };
    }

  const updateChartOption = (candidates: Candidate[]) => { 
    const { xAxisData, seriesData } = processChartData(candidates);
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['Number of Candidates'],
        bottom: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: xAxisData
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: seriesData,
        type: 'bar',
        barWidth: '60%',
        itemStyle: {
          color: '#4F46E5'
        }
      }]
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Candidates</p>
              <p className="text-2xl font-semibold text-gray-900">{candidateList.length}</p>
            </div>
          </div>
        </div>

        <div 
          className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/active-interviews')}
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Interviews</p>
              <p className="text-2xl font-semibold text-gray-900">{activeInterviews.length}</p>
            </div>
          </div>
        </div>

        <div 
          className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/hiring-progress')}
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hiring Progress</p>
              <p className="text-2xl font-semibold text-gray-900">{candidatesInProgress.length}</p>
            </div>
          </div>
        </div>

        <div 
          className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/hired-candidates')}
        >
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <PieChart className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hired This Month</p>
              <p className="text-2xl font-semibold text-gray-900">{hiredCandidates.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Candidates by Stage</h2>
        <ReactECharts 
          option={stageProgressOption} 
          style={{ height: '400px' }} 
          notMerge={true}
          lazyUpdate={true}
        />
      </div>
    </div>
  );
};

export default Dashboard;