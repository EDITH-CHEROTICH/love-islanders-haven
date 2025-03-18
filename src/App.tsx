
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { Toaster } from '@/components/ui/sonner';
import Feedback from './pages/Feedback';
import Settings from './pages/Settings';
import AICompanionChat from './pages/AICompanionChat';
import Streaks from './pages/Streaks';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/ai" element={<ProtectedRoute><AICompanionChat /></ProtectedRoute>} />
            <Route path="/streaks" element={<ProtectedRoute><Streaks /></ProtectedRoute>} />
            <Route path="/feedback" element={<Feedback />} />
          </Routes>
          <Toaster />
        </Router>
      </SettingsProvider>
    </AuthProvider>
  );
};

export default App;
