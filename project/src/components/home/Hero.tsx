import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ 
          backgroundImage: 'url("https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=1920")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-primary-800/60"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight">
              Mais que fazer justiça, amar pessoas
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="mt-6 text-lg text-neutral-200 max-w-2xl">
              Advocacia Integral: comprometidos em oferecer soluções jurídicas personalizadas 
              com ética, dedicação e um olhar humano para cada caso.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link
              to="/contato"
              className="px-6 py-3 bg-gold-600 hover:bg-gold-700 text-white rounded text-sm font-medium transition-colors flex items-center"
            >
              Agende uma Consulta
              <ArrowRight size={16} className="ml-2" />
            </Link>
            
            <Link
              to="/areas-de-atuacao"
              className="px-6 py-3 bg-transparent hover:bg-white/10 border border-white text-white rounded text-sm font-medium transition-colors"
            >
              Áreas de Atuação
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;