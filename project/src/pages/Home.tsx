import React from 'react';
import Hero from '../components/home/Hero';
import About from '../components/home/About';
import PracticeAreas from '../components/home/PracticeAreas';
import Team from '../components/home/Team';
import Testimonials from '../components/home/Testimonials';
import Contact from '../components/home/Contact';

const Home = () => {
  return (
    <>
      <Hero />
      <Team />
      <About />
      <PracticeAreas />      
      <Testimonials />
      <Contact />
    </>
  );
};

export default Home;