import { create } from 'zustand';
import { supabase } from '../../lib/supabase';
import { Usuario } from '../../types/usuario';
import { DB_TABLES } from '../../config/database';

interface AuthState {
  isAuthenticated: boolean;
  user: Usuario | null;
  isLoading: boolean;
  loading: boolean; // Alias para compatibilidad
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>; // Alias para compatibilidad
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signUp: (email: string, password: string) => Promise<{ data: any; error: any }>;
  resetPassword: (email: string) => Promise<{ data: any; error: any }>;
  checkAuth: () => Promise<void>;
}

export const useAuthLogin = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  get loading() { return get().isLoading; }, // Alias para compatibilidad
  
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
          .from(DB_TABLES.USUARIOS)
          .select('*')
          .eq('email', data.user.email)
          .single();
          
        const user: Usuario = {
          id: data.user.id,
          nome: userData?.nome || data.user.email || '',
          email: data.user.email!,
          role: userData?.role || 'assistente',
          foto_perfil_url: userData?.foto_perfil_url || data.user.user_metadata?.avatar_url,
          ativo: userData?.ativo ?? true,
          ...userData
        };
        
        set({ isAuthenticated: true, user, isLoading: false });
      }
    } catch (error) {
      console.error('Login error:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  
  signIn: async (email: string, password: string) => {
    // Alias para compatibilidad con useAuth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },
  
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    return { data, error };
  },
  
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error };
  },
  
  logout: async () => {
    try {
      await supabase.auth.signOut();
      set({ isAuthenticated: false, user: null, isLoading: false });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
  
  signOut: async () => {
    // Alias para compatibilidad con useAuth
    await get().logout();
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
          .from(DB_TABLES.USUARIOS)
          .select('*')
          .eq('id', user.id)
          .single();
          
        const userInfo: Usuario = {
          id: user.id,
          nome: userData?.nome || user.email || '',
          email: user.email!,
          role: userData?.role || 'assistente',
          foto_perfil_url: userData?.foto_perfil_url || user.user_metadata?.avatar_url,
          ativo: userData?.ativo ?? true,
          ...userData
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
useAuthLogin.getState().checkAuth();

// Escuchar cambios de autenticación
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    useAuthLogin.setState({ isAuthenticated: false, user: null, isLoading: false });
  } else if (event === 'SIGNED_IN' && session?.user) {
    useAuthLogin.getState().checkAuth();
  }
});