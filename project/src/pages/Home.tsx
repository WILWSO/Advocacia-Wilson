import React from 'react';
import Hero from '../components/home/Hero';
import About from '../components/home/About';
import PracticeAreas from '../components/home/PracticeAreas';
import Team from '../components/home/Team';
import Testimonials from '../components/home/Testimonials';
import Contact from '../components/home/Contact';
import SocialFeed from '../components/social/SocialFeed';
import SEOHead from '../components/shared/SEOHead';

const Home = () => {
  return (
    <>
      <SEOHead
        title="Início"
        description="Advocacia Integral em Palmas-TO. Mais que fazer justiça, amar pessoas. Direito Civil, Empresarial, Trabalhista, Tributário e Imobiliário. Atendimento humanizado com excelência."
        keywords="advogado Palmas, advocacia Tocantins, direito civil, direito empresarial, Santos Nascimento advogados, consulta jurídica, advocacia integral"
        canonicalUrl={window.location.origin}
        ogType="website"
      />
      <Hero />
      <Team />
      <About />
      <PracticeAreas />
      <SocialFeed 
        maxPosts={3} 
        showFeaturedOnly={true} 
        showTitle={true}
      />      
      <Testimonials />
      <Contact />
    </>
  );
};

export default Home;