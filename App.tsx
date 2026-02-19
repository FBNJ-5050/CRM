import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LeadsPage from './pages/LeadsPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/leads" replace />} />
      <Route path="/leads" element={<LeadsPage />} />
    </Routes>
  );
};

export default App;
