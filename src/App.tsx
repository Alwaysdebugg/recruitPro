import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import CandidateList from './pages/Dashboard/CandidateList';
import ActiveInterviews from './pages/ActiveInterviews';
import HiringProgress from './pages/HiringProgress';
import HiredCandidates from './pages/HiredCandidates';
import NavBar from './components/NavBar';
import { Login } from './pages/user/Login';
import { Register } from './pages/user/Register';
import axios from 'axios';
import { useEffect } from 'react';
import { UserProvider } from './contexts/userContext';
import PrivateRoute from './components/PrivateRoute';

export function App() {
  useEffect(() => {
    // 检查是否有存储的token
    const token = localStorage.getItem('access_token');
    if (token) {
      // 设置axios的默认header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);
  
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <>
                    <NavBar />
                    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                      <Routes>
                      <Route path="/" element={<><Dashboard /><CandidateList /></>} />
                      <Route path="/active-interviews" element={<ActiveInterviews />} />
                      <Route path="/hiring-progress" element={<HiringProgress />} />
                      <Route path="/hired-candidates" element={<HiredCandidates />} />
                    </Routes>
                  </main>
                  </>
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}