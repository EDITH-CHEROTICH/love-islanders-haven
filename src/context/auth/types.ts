
import { User, Session } from '@supabase/supabase-js';

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any; data: any }>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, options?: any) => Promise<{ error: any; data: any }>;
  resetPassword: (email: string) => Promise<{ error: any; data: any }>;
  updatePassword: (password: string) => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
}
