import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LeadsPage from './pages/LeadsPage';
import ActivitiesPage from './pages/ActivitiesPage';
import AnalyticsPage from './pages/AnalyticsPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/leads" replace />} />
      <Route path="/leads" element={<LeadsPage />} />
      <Route path="/activities" element={<ActivitiesPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
    </Routes>
  );
};

export default App;
