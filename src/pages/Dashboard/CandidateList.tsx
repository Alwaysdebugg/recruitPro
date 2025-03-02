import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { FileText, Calendar, Star, X, Search } from 'lucide-react';
import { Candidate } from '../../types';
import ScheduleInterviewDrawer from './ScheduleInterviewDrawer';
import { addCandidate, editCandidate, getCandidateList } from '../../api/candidate/candidate';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import OpenForm from './openForm';
import AddIcon from '@mui/icons-material/Add';
import { Tab, Tabs, Input } from '@mui/material';
import AddForm from './addForm';
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
  const [tabValue, setTabValue] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isOpenEditForm, setIsOpenEditForm] = useState(false);
  const [isScheduleDrawerOpen, setIsScheduleDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [candidatesList, setCandidatesList] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  
  // 获取候选人列表
  useEffect(() => {
    getList();
  }, []);
  
  // 合并 Tab 分类和搜索功能
  useEffect(() => {
    // 根据 Tab 确定状态过滤条件
    let statusesToFilter: string[] = [];
    
    if (tabValue === 0) {
      // "All" tab - 不过滤状态
      statusesToFilter = [];
    } else {
      // 根据 Tab 值获取对应的状态列表
      const statusMap: { [key: number]: string[] } = {
        1: ['INTERVIEW', 'IN_PROGRESS', 'SCREENING', 'NEW'],
        2: ['OFFER'],
        3: ['HIRED'],
        4: ['REJECTED'],
      };
      statusesToFilter = statusMap[tabValue] || [];
    }
    
    // 更新选中的状态列表（用于其他地方可能的引用）
    setSelectedStatus(statusesToFilter);
    
    // 应用过滤条件：状态过滤 + 搜索过滤
    const filtered = candidatesList.filter(candidate => {
      // 状态过滤
      const statusMatch = statusesToFilter.length === 0 || statusesToFilter.includes(candidate.status);
      
      // 搜索过滤
      const searchMatch = searchQuery === '' || 
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.appliedRole.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 同时满足状态和搜索条件
      return statusMatch && searchMatch;
    });
    console.log('filtered', filtered);
    
    setFilteredCandidates(filtered);
  }, [tabValue, searchQuery, candidatesList]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // 添加候选人
  const handleCandidateSubmit = async (candidate: Candidate) => {
    console.log('candidate_info', candidate);
    try {
      const data = await addCandidate(candidate);
      console.log('添加候选人', data);

      // 刷新候选人列表
      getList();
    } catch (error) {
      console.error('error', error);
    }
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
      <div className="flex flex-row justify-between items-center mb-4">
      <div className="flex items-center gap-2 h-full">
        <h2 className="text-2xl font-bold text-gray-900">Candidates</h2>
        <button 
          onClick={() => setIsAddDrawerOpen(true)}
          className="h-6 w-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <AddIcon />
        </button>

        {/* 搜索框 */}
        <div className="relative w-full md:w-64 ml-8">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search Candidate"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* tab分类栏 */}
        <Tabs value={tabValue} onChange={handleTabChange} textColor="primary" aria-label="candidate status">
          <Tab label="All" {...a11yProps(0)} />
          <Tab label="Active" {...a11yProps(1)} />
          <Tab label="Offer" {...a11yProps(2)} />
          <Tab label="Hired" {...a11yProps(3)} />
          <Tab label="Rejected" {...a11yProps(4)} />
        </Tabs>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden min-h-[calc(100vh-10rem)]">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 p-6">
          {filteredCandidates.length > 0 ? (
            filteredCandidates.map((candidate) => (
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
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No candidates found matching your criteria.
            </div>
          )}
        </div>
      </div>
      
      {/* 添加候选人表单 */}
      <AddForm
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        onSubmit={(candidate: Candidate) => {handleCandidateSubmit(candidate)}}
      />
      
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