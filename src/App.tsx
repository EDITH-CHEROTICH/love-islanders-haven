import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AICompanionChat from './pages/AICompanionChat';
import Match from './pages/Match';
import Chat from './pages/Chat';
import Streaks from './pages/Streaks';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { Toaster } from '@/components/ui/sonner';
import ProtectedRoute from './components/ProtectedRoute';
import Feedback from './pages/Feedback';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/ai" element={<ProtectedRoute><AICompanionChat /></ProtectedRoute>} />
            <Route path="/match" element={<ProtectedRoute><Match /></ProtectedRoute>} />
            <Route path="/chat/:matchId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
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
