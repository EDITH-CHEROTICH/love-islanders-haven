
import { User, Session, AuthTokenResponsePassword } from '@supabase/supabase-js';

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  networkError: boolean;
  emailVerified: boolean | null;
  signIn: (email: string, password: string) => Promise<AuthTokenResponsePassword>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  verifyEmailWithCode: (userId: string, email: string) => Promise<boolean>;
};
