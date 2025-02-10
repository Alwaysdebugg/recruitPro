import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CandidateList from './components/CandidateList';
import ActiveInterviews from './pages/ActiveInterviews';
import HiringProgress from './pages/HiringProgress';
import HiredCandidates from './pages/HiredCandidates';
import { User, LogOut, Settings, CreditCard, ChevronDown } from 'lucide-react';

export function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = () => {
    // Handle sign out logic here
    console.log('Signing out...');
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <span className="text-xl font-bold text-gray-900">RecruitPro</span>
              </div>

              {/* User Menu */}
              <div className="flex items-center">
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-indigo-600" />
                    </div>
                    <span className="font-medium">John Doe</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {isMenuOpen && (
                    <>
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50">
                        <a
                          href="#profile"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </a>
                        <a
                          href="#settings"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </a>
                        <a
                          href="#pricing"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <CreditCard className="w-4 h-4" />
                          Pricing
                        </a>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsMenuOpen(false)}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<><Dashboard /><CandidateList /></>} />
            <Route path="/active-interviews" element={<ActiveInterviews />} />
            <Route path="/hiring-progress" element={<HiringProgress />} />
            <Route path="/hired-candidates" element={<HiredCandidates />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}