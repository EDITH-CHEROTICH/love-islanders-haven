
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Matches from "./pages/Matches";
import UserProfile from "./pages/UserProfile";
import SignUp from "./pages/SignUp";
import Verify from "./pages/Verify";
import NotFound from "./pages/NotFound";
import AICompanionChat from "./pages/AICompanionChat";
import AuthGuard from "./components/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" theme="dark" closeButton />
      <BrowserRouter>
        <Routes>
          {/* Auth routes - accessible without authentication */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<SignUp />} />
          <Route path="/verify" element={<Verify />} />
          
          {/* Protected routes - require authentication */}
          <Route path="/" element={<AuthGuard><Index /></AuthGuard>} />
          <Route path="/matches" element={<AuthGuard><Matches /></AuthGuard>} />
          <Route path="/profile" element={<AuthGuard><UserProfile /></AuthGuard>} />
          <Route path="/ai-companion" element={<AuthGuard><AICompanionChat /></AuthGuard>} />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
