
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
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<ProtectedRoute><AICompanionChat /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/ai" element={<ProtectedRoute><AICompanionChat /></ProtectedRoute>} />
            <Route path="/ai-companion" element={<ProtectedRoute><AICompanionChat /></ProtectedRoute>} />
            <Route path="/streaks" element={<ProtectedRoute><Streaks /></ProtectedRoute>} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/matches" element={<ProtectedRoute><div className="min-h-screen flex items-center justify-center bg-island-dark p-4"><h1 className="text-2xl font-bold text-white">Matches Page</h1><p className="text-white">This page is coming soon!</p></div></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><div className="min-h-screen flex items-center justify-center bg-island-dark p-4"><h1 className="text-2xl font-bold text-white">Profile Page</h1><p className="text-white">This page is coming soon!</p></div></ProtectedRoute>} />
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
