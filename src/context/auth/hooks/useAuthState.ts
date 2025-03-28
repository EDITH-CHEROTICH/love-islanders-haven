
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLocalAuth, setIsLocalAuth] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log("AuthProvider initialization");
    
    // Check for localStorage authentication first
    const localAuth = localStorage.getItem('isAuthenticated');
    
    if (localAuth === 'true') {
      console.log("Local authentication found");
      setIsLocalAuth(true);
      
      // Get additional user info if available
      const authMethod = localStorage.getItem('authMethod');
      const authContact = localStorage.getItem('authContact');
      console.log(`Local auth details - Method: ${authMethod}, Contact: ${authContact}`);
    }

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log("User signed in or token refreshed, setting session");
          setSession(session);
          setUser(session?.user ?? null);
          
          // If signed in, store local backup
          if (session?.user) {
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('authMethod', 'supabase');
            localStorage.setItem('authContact', session.user.email || '');
            setIsLocalAuth(true);
            console.log("User signed in - setting localStorage backup");
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
          
          const url = new URL(window.location.href);
          const error = url.searchParams.get('error');
          const errorDescription = url.searchParams.get('error_description');
          
          if (error) {
            toast({
              title: "Authentication Error",
              description: errorDescription || "There was a problem with authentication",
              variant: "destructive",
            });
            
            // Clean the URL of error parameters
            url.searchParams.delete('error');
            url.searchParams.delete('error_code');
            url.searchParams.delete('error_description');
            window.history.replaceState({}, document.title, url.toString());
          }
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Existing session check:", session ? "Found" : "Not found");
      
      if (session) {
        console.log("Valid session found - updating state and localStorage backup");
        setSession(session);
        setUser(session.user);
        
        // If there's a valid session, update local storage backup
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authMethod', 'supabase');
        localStorage.setItem('authContact', session.user.email || '');
        setIsLocalAuth(true);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return {
    session,
    user,
    loading,
    isAuthenticated: !!user || isLocalAuth
  };
};
