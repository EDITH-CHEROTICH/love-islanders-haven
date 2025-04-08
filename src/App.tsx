
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/auth';
import { SettingsProvider } from './context/SettingsContext';
import { Toaster } from '@/components/ui/sonner';
import Feedback from './pages/Feedback';
import Settings from './pages/Settings';
import AICompanionChat from './pages/AICompanionChat';
import ProtectedRoute from './components/ProtectedRoute';
import Verify from './pages/Verify';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import Matches from './pages/Matches';
import Discover from './pages/Discover';
import Messages from './pages/Messages';
import Login from './pages/Login';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/discover" replace />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/login" element={<Login />} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/ai-companion" element={<AICompanionChat />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
            <Route path="/discover" element={<ProtectedRoute><Discover /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/messages/:matchId" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Navbar />
          <Toaster />
        </Router>
      </SettingsProvider>
    </AuthProvider>
  );
};

export default App;
