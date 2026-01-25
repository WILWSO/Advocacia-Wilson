import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { NotificationProvider } from './components/shared/notifications/NotificationContext';
import { OfflineNotification } from './components/shared/notifications/OfflineNotification';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import PracticeAreasPage from './pages/PracticeAreasPage';
import TeamPage from './pages/TeamPage';
import ContactPage from './pages/ContactPage';
import SocialPublicPage from './pages/SocialPublicPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import WhatsAppButton from './components/shared/buttons/WhatsAppButton';
import SkipLinks from './components/layout/SkipLinks';
import { cn } from './utils/cn';

// Lazy load admin pages para reducir bundle inicial
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ProcessosPage = lazy(() => import('./pages/ProcessosPage'));
const ClientesPage = lazy(() => import('./pages/ClientesPage'));
const UsuariosPage = lazy(() => import('./pages/UsuariosPage'));
const AdminSocialPage = lazy(() => import('./pages/SocialPage'));

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isSocialRoute = location.pathname === '/social';

  useEffect(() => {
    if (!location.hash) {
      // Si no hay hash, scroll al tope
      window.scrollTo(0, 0);
    } else if (location.pathname === '/') {
      // Si hay hash y estamos en Home, hacer scroll a la sección
      // Usar requestAnimationFrame para asegurar que el DOM está completamente renderizado
      requestAnimationFrame(() => {
        setTimeout(() => {
          const element = document.querySelector(location.hash);
          if (element instanceof HTMLElement) {
            const headerOffset = 100;
            const elementPosition = element.offsetTop;

            window.scrollTo({
              top: elementPosition - headerOffset,
              behavior: 'smooth'
            });
          }
        }, 600); // Delay mayor para permitir carga completa de SocialFeed desde Supabase
      });
    }
  }, [location.pathname, location.hash]);

  return (
    <NotificationProvider>
      <div className="font-sans text-neutral-800 flex flex-col min-h-screen">
        <SkipLinks />
        <OfflineNotification />
        {!isAdminRoute && <Header />}
        <main id="main-content" className={cn("flex-grow", isSocialRoute && "pt-20")} role="main" tabIndex={-1}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/nossa-historia" element={<AboutPage />} />
          <Route path="/areas-de-atuacao" element={<PracticeAreasPage />} />
          <Route path="/equipe" element={<TeamPage />} />
          <Route path="/contato" element={<ContactPage />} />
          <Route path="/social" element={<SocialPublicPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Rutas protegidas - Admin Area con navegación anidada */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-lg">Cargando...</div></div>}>
                  <AdminDashboard />
                </Suspense>
              </ProtectedRoute>
            }
          >
            {/* Redirigir /admin a /admin/processos */}
            <Route index element={<Navigate to="/admin/processos" replace />} />
            
            {/* Subrutas del área administrativa */}
            <Route path="processos" element={<Suspense fallback={<div>Cargando...</div>}><ProcessosPage /></Suspense>} />
            <Route path="clientes" element={<Suspense fallback={<div>Cargando...</div>}><ClientesPage /></Suspense>} />
            <Route path="usuarios" element={<Suspense fallback={<div>Cargando...</div>}><UsuariosPage /></Suspense>} />
            <Route 
              path="social" 
              element={
                <ProtectedRoute requiredRoles={['admin', 'advogado']}>
                  <Suspense fallback={<div>Cargando...</div>}>
                    <AdminSocialPage />
                  </Suspense>
                </ProtectedRoute>
              } 
            />
          </Route>
          
          {/* Ruta legacy /admin-social redirige a /admin/social */}
          <Route 
            path="/admin-social" 
            element={<Navigate to="/admin/social" replace />}
          />
          
          {/* Ruta catch-all para 404 - debe ser la última */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <WhatsAppButton />}
      </div>
    </NotificationProvider>
  );
}

export default App;