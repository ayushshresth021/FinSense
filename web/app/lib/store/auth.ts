import { create } from 'zustand';
import { User } from '@/types';
import { getCurrentUser, signIn, signUp, signOut } from '../supabase';


interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  /**
   * Initialize auth state from Supabase session
   */
  initialize: async () => {
    try {
      const user = await getCurrentUser();
      set({
        user: user ? { id: user.id, email: user.email! } : null,
        isAuthenticated: !!user,
        isLoading: false,
      });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  /**
   * Login with email and password
   */
  login: async (email: string, password: string) => {
    const data = await signIn(email, password);
    set({
      user: data.user ? { id: data.user.id, email: data.user.email! } : null,
      isAuthenticated: !!data.user,
    });
  },

  /**
   * Sign up with email and password
   */
  signup: async (email: string, password: string) => {
    const data = await signUp(email, password);
    set({
      user: data.user ? { id: data.user.id, email: data.user.email! } : null,
      isAuthenticated: !!data.user,
    });
  },

  /**
   * Logout
   */
  logout: async () => {
    await signOut();
    set({ user: null, isAuthenticated: false });
  },
}));