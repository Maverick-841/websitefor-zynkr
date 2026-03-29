import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { PremiumPage } from './pages/PremiumPage';
import { ProfilePage } from './pages/ProfilePage';
import { TestDashboard } from './pages/TestDashboard';
import { TestPage } from './pages/TestPage';
import { LeaderboardPage } from './pages/LeaderboardPage';

// Scroll to top or specific hash logic for React Router
const ScrollToAnchor = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return null;
};

function App() {
  return (
    <Router>
      <ScrollToAnchor />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/tests" element={<TestDashboard />} />
        <Route path="/test" element={<Navigate to="/tests" replace />} />
        <Route path="/test/:roundId" element={<TestPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
