import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  name?: string;
  email: string;
  role: 'admin' | 'advogado' | 'assistente';
  avatar?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  
  login: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        // Buscar información adicional del usuario en la tabla usuarios
        const { data: userData } = await supabase
          .from('usuarios')
          .select('*')
          .eq('email', data.user.email)
          .single();
          
        const user: User = {
          id: data.user.id,
          name: userData?.nome || data.user.email,
          email: data.user.email!,
          role: userData?.role || 'assistente',
          avatar: userData?.avatar_url || data.user.user_metadata?.avatar_url
        };
        
        set({ isAuthenticated: true, user, isLoading: false });
      }
    } catch (error) {
      console.error('Login error:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  
  logout: async () => {
    try {
      await supabase.auth.signOut();
      set({ isAuthenticated: false, user: null, isLoading: false });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
  
  checkAuth: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        throw error;
      }
      
      if (user) {
        // Buscar información adicional del usuario
        const { data: userData } = await supabase
          .from('usuarios')
          .select('*')
          .eq('email', user.email)
          .single();
          
        const userInfo: User = {
          id: user.id,
          name: userData?.nome || user.email,
          email: user.email!,
          role: userData?.role || 'assistente',
          avatar: userData?.avatar_url || user.user_metadata?.avatar_url
        };
        
        set({ isAuthenticated: true, user: userInfo, isLoading: false });
      } else {
        set({ isAuthenticated: false, user: null, isLoading: false });
      }
    } catch (error: unknown) {
      // Silenciar error de sesión faltante (comportamiento esperado sin login)
      if (error && typeof error === 'object' && 'message' in error && error.message !== 'Auth session missing!') {
        console.error('Auth check error:', error);
      }
      set({ isAuthenticated: false, user: null, isLoading: false });
    }
  }
}));

// Verificar autenticação ao inicializar
useAuthStore.getState().checkAuth();

// Escuchar cambios de autenticación
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ isAuthenticated: false, user: null, isLoading: false });
  } else if (event === 'SIGNED_IN' && session?.user) {
    useAuthStore.getState().checkAuth();
  }
});