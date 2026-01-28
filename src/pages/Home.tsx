import Hero from '../components/home/Hero';
import About from '../components/home/About';
import PracticeAreas from '../components/home/PracticeAreas';
import Team from '../components/home/Team';
import Testimonials from '../components/home/Testimonials';
import Contact from '../components/home/Contact';
import SocialFeed from '../components/shared/SocialFeed';
import SEOHead from '../components/shared/SEOHead';
import { useFeaturedPosts } from '../hooks/features/useFeaturedPosts';

const Home = () => {
  const { hasFeaturedPosts } = useFeaturedPosts();

  return (
    <>
      <SEOHead
        title="Início"
        description="Advocacia Integral em Palmas-TO. Mais que fazer justiça, amar pessoas. Direito Civil, Empresarial, Trabalhista, Tributário e Imobiliário. Atendimento humanizado com excelência."
        keywords="advogado Palmas, advocacia Tocantins, direito civil, direito empresarial, Santos Nascimento advogados, consulta jurídica, advocacia integral"
        canonicalUrl={window.location.origin}
        ogType="website"
      />
      <section id="hero">
        <Hero />
      </section>
      <section id="team">
        <Team />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="practice-areas">
        <PracticeAreas />
      </section>
      {hasFeaturedPosts && (
        <section id="social">
          <SocialFeed 
            maxPosts={3} 
            showFeaturedOnly={true} 
            showTitle={true}
          />
        </section>
      )}
      <section id="testimonials">
        <Testimonials />
      </section>
      <section id="contact">
        <Contact />
      </section>
    </>
  );
};

export default Home;
