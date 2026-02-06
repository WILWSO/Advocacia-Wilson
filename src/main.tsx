import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from './components/shared/ErrorBoundary';
import App from './App';
import './index.css';

// Suprimir errores comunes de extensiones del navegador que no afectan la funcionalidad
window.addEventListener('error', (event) => {
  // Errores de extensiones del navegador
  if (event.message.includes('A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received')) {
    event.preventDefault();
    console.warn('Browser extension error suppressed:', event.message);
    return;
  }
  
  // Errores de source maps en desarrollo
  if (event.message.includes('JSON.parse: unexpected character') && event.filename?.includes('installHook.js.map')) {
    event.preventDefault();
    console.warn('Development source map error suppressed - this is normal in dev mode');
    return;
  }
  
  // Errores de cookies de Cloudflare o servicios externos
  if (event.message.includes('cookie') && event.message.includes('rechazada')) {
    event.preventDefault();
    console.warn('External service cookie error suppressed:', event.message);
    return;
  }
});

// Suprimir promesas rechazadas de extensiones del navegador y otros servicios
window.addEventListener('unhandledrejection', (event) => {
  // Extensiones del navegador
  if (event.reason && event.reason.message && event.reason.message.includes('message channel closed')) {
    event.preventDefault();
    console.warn('Browser extension promise rejection suppressed:', event.reason.message);
    return;
  }
  
  // Errores de autenticación esperados (no son errores críticos del sistema)
  if (event.reason && event.reason.message && event.reason.message.includes('Invalid login credentials')) {
    event.preventDefault();
    // No logear - esto es manejado por los componentes de login
    return;
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>
);