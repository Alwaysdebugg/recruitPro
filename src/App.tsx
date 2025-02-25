import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CandidateList from './components/CandidateList';
import ActiveInterviews from './pages/ActiveInterviews';
import HiringProgress from './pages/HiringProgress';
import HiredCandidates from './pages/HiredCandidates';
import NavBar from './components/NavBar';

export function App() {

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <NavBar />
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