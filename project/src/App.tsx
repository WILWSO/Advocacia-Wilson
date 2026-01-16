import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import PracticeAreasPage from './pages/PracticeAreasPage';
import TeamPage from './pages/TeamPage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './pages/AdminDashboard';
import ClientesPage from './pages/ClientesPage';
import SocialPublicPage from './pages/SocialPublicPage';
import AdminSocialPage from './pages/SocialPage';
import ScrollToTop from './components/shared/ScrollToTop';
import WhatsAppButton from './components/shared/WhatsAppButton';
import SkipLinks from './components/shared/SkipLinks';
import { cn } from './utils/cn';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isSocialRoute = location.pathname === '/social';
  const isAdminSocialRoute = location.pathname === '/admin-social';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="font-sans text-neutral-800 flex flex-col min-h-screen">
      <SkipLinks />
      <ScrollToTop />
      {!isAdminRoute && !isAdminSocialRoute && <Header />}
      <main id="main-content" className={cn("flex-grow", isSocialRoute && "pt-20")} role="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/areas-de-atuacao" element={<PracticeAreasPage />} />
          <Route path="/equipe" element={<TeamPage />} />
          <Route path="/contato" element={<ContactPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/clientes" element={<ClientesPage />} />
          <Route path="/social" element={<SocialPublicPage />} />
          <Route path="/admin-social" element={<AdminSocialPage />} />
        </Routes>
      </main>
      {!isAdminRoute && !isAdminSocialRoute && <Footer />}
      {!isAdminRoute && !isAdminSocialRoute && <WhatsAppButton />}
    </div>
  );
}

export default App;