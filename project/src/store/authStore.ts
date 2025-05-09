import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: null | { name: string; email: string };
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: async (email: string, password: string) => {
    try {
      // Replace with your actual API call
      const response = await fetch('your-backend-url/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      set({ isAuthenticated: true, user: data.user });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  logout: () => {
    set({ isAuthenticated: false, user: null });
  },
}));