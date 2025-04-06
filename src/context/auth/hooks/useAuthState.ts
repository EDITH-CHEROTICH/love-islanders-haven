
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLocalAuth, setIsLocalAuth] = useState(false);

  useEffect(() => {
    console.log("AuthProvider initialization");
    
    // Set up auth state listener FIRST to ensure we don't miss any auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          console.log("User signed in or token refreshed, setting session");
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          // If signed in, store local backup
          if (currentSession?.user) {
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('authMethod', 'supabase');
            localStorage.setItem('authContact', currentSession.user.email || '');
            setIsLocalAuth(true);
          }
        }
        
        // If signed out, clear local backup
        if (event === 'SIGNED_OUT') {
          console.log("User signed out - clearing state and localStorage");
          setSession(null);
          setUser(null);
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('authMethod');
          localStorage.removeItem('authContact');
          setIsLocalAuth(false);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      console.log("Existing session check:", existingSession ? "Found" : "Not found");
      
      if (existingSession) {
        console.log("Valid session found - updating state");
        setSession(existingSession);
        setUser(existingSession.user);
        
        // If there's a valid session, update local storage backup
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authMethod', 'supabase');
        localStorage.setItem('authContact', existingSession.user.email || '');
        setIsLocalAuth(true);
        setLoading(false);
      } else {
        // No valid session, check for token refresh
        supabase.auth.refreshSession().then(({ data, error }) => {
          if (data?.session) {
            console.log("Session refreshed successfully");
            setSession(data.session);
            setUser(data.session.user);
            setIsLocalAuth(true);
          } else if (error) {
            console.error("Error refreshing session:", error);
            // Check for local auth as fallback
            const localAuth = localStorage.getItem('isAuthenticated');
            setIsLocalAuth(localAuth === 'true');
          }
          setLoading(false);
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    user,
    loading,
    isAuthenticated: !!user || isLocalAuth
  };
};
