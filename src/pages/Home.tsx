import Hero from '../components/home/Hero';
import About from '../components/home/About';
import PracticeAreas from '../components/home/PracticeAreas';
import Team from '../components/home/Team';
import Testimonials from '../components/home/Testimonials';
import Contact from '../components/home/Contact';
import SocialFeed from '../components/shared/SocialFeed';
import { useSEO } from '../hooks/seo/useSEO';
import { useFeaturedPosts } from '../hooks/features/useFeaturedPosts';

const Home = () => {
  const { hasFeaturedPosts } = useFeaturedPosts();
  
  // SEO centralizado (SSoT para eliminação de configuração dispersa)
  const seo = useSEO('home')

  return (
    <>
      {seo.component}
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
