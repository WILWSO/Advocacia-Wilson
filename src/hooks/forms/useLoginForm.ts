/**
 * Hook para gestión de formulario de Login
 * Centraliza toda la lógica de autenticación, validación, estados y manejo de errores
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthLogin } from '../../components/auth/useAuthLogin';
import { ERROR_MESSAGES } from '../../config/messages';

interface UseLoginFormReturn {
  // Estados del formulario
  email: string;
  password: string;
  showPassword: boolean;
  error: string;
  isSubmitting: boolean;
  
  // Handlers
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  toggleShowPassword: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  
  // Estados de autenticación
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Navegación
  navigate: ReturnType<typeof useNavigate>;
}

/**
 * Hook personalizado para el formulario de login
 * Encapsula toda la lógica de autenticación siguiendo el patrón SSoT
 */
export const useLoginForm = (): UseLoginFormReturn => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading } = useAuthLogin();
  
  // Estados del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ruta a la que se intentó acceder antes de login
  const from = (location.state as { from?: string })?.from || '/admin';

  // Redirigir automáticamente si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, from]);

  /**
   * Toggle para mostrar/ocultar contraseña
   */
  const toggleShowPassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  /**
   * Manejador del submit del formulario
   * Realiza login y maneja errores con mensajes específicos
   */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      // La redirección se maneja automáticamente en el useEffect
    } catch (err: unknown) {
      const error = err as Error;
      // Log solo errores inesperados, no credenciales incorrectas
      if (!error.message?.includes('Invalid login credentials')) {
        console.error('Login error:', error);
      }
      
      // Mensajes de error específicos según el tipo de error
      if (error.message?.includes('Invalid login credentials')) {
        setError('Email ou senha incorretos');
      } else if (error.message?.includes('Email not confirmed')) {
        setError('Email não confirmado. Verifique sua caixa de entrada.');
      } else if (error.message?.includes('Too many requests')) {
        setError('Muitas tentativas. Aguarde alguns minutos e tente novamente.');
      } else if (error.message?.includes('Network')) {
        setError(ERROR_MESSAGES.auth.CONNECTION_ERROR);
      } else {
        setError(ERROR_MESSAGES.auth.LOGIN_ERROR);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [email, password, login]);

  return {
    // Estados
    email,
    password,
    showPassword,
    error,
    isSubmitting,
    
    // Handlers
    setEmail,
    setPassword,
    toggleShowPassword,
    handleSubmit,
    
    // Estados de autenticación
    isAuthenticated,
    isLoading,
    
    // Navigation
    navigate
  };
};
