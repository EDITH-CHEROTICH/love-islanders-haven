
import { useAuthState } from './useAuthState';
import { useAuthActions } from './useAuthActions';

export const useAuthHooks = () => {
  const { session, user, loading, isAuthenticated, networkError, emailVerified } = useAuthState();
  const { 
    loading: actionLoading, 
    signIn, 
    signInWithGoogle, 
    signUp, 
    resetPassword, 
    signOut,
    updatePassword,
    verifyEmailWithCode 
  } = useAuthActions();
  
  return {
    // State
    session,
    user,
    loading: loading || actionLoading,
    isAuthenticated,
    networkError,
    emailVerified,
    
    // Actions
    signIn,
    signInWithGoogle,
    signUp,
    resetPassword,
    signOut,
    updatePassword,
    verifyEmailWithCode
  };
};
