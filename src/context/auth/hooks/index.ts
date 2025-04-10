
import { useAuthState } from './useAuthState';
import { useAuthActions } from './useAuthActions';

export const useAuthHooks = () => {
  const { session, user, loading, isAuthenticated, networkError } = useAuthState();
  const { 
    loading: actionLoading, 
    signIn, 
    signInWithGoogle, 
    signUp, 
    resetPassword, 
    signOut,
    updatePassword
  } = useAuthActions();
  
  return {
    // State
    session,
    user,
    loading: loading || actionLoading,
    isAuthenticated,
    networkError,
    
    // Actions
    signIn,
    signInWithGoogle,
    signUp,
    resetPassword,
    signOut,
    updatePassword,
  };
};
