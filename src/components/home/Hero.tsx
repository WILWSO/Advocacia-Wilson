import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import OptimizedImage from '../shared/OptimizedImage';
import useResponsive from '../../hooks/useResponsive';
import { ResponsiveContainer, ResponsiveStack } from '../shared/ResponsiveGrid';
import { cn } from '../../utils/cn';
import { SocialCard } from '../shared/cards/SocialCard';

const Hero = () => {
  const { isMobile, isTablet } = useResponsive();
  
  const getHeightClasses = () => {
    if (isMobile) return 'min-h-[100svh] sm:min-h-[600px]';
    if (isTablet) return 'min-h-[700px]';
    return 'min-h-screen';
  };
  
  return (
    <section 
      className={cn(
        "relative flex items-center justify-center overflow-hidden", // Overflow-hidden - evita que elementos internos se desborden
        getHeightClasses()
      )} 
      role="banner" 
      aria-label="Seção principal de apresentação"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 w-full min-h-full"> {/* min-h-full - Asegura que la imagen de fondo cubra al menos altura completa del contenedor, de la section, incluso si el contenido crece */}
        <OptimizedImage
          src="/Images/Banner_Wilson.jpg"
          alt="Imagem profissional dos advogados Wilson Santos e Lucas Nascimento em frente ao escritório Santos & Nascimento Advogados Associados em Palmas, Tocantins"
          className={cn(
            "w-full h-full",
            isMobile ? "object-cover object-center" : "object-cover object-center-top"
          )}
          priority={true}
          sizes={isMobile ? "100vw" : "(max-width: 768px) 100vw, 100vw"}
        />
        {/* Gradient overlay */}
        <div 
          className={cn(
            "absolute inset-0",
            isMobile 
              ? "bg-gradient-to-t from-primary-900/90 via-primary-800/70 to-primary-700/50"
              : "bg-gradient-to-r from-primary-900/95 via-primary-800/80 to-primary-700/60"
          )} 
          aria-hidden="true"
        />
      </div>
      
      <ResponsiveContainer
        maxWidth="7xl"
        padding={{ xs: 4, sm: 6, md: 8, lg: 12 }}
        className="relative z-10 w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-8 items-center">
          {/* Contenido principal */}
          <div className={cn(
            "flex items-center",
            isMobile ? "min-h-[80vh] text-center" : "min-h-[60vh] text-left",
            isMobile ? "col-span-1" : "md:col-span-12 lg:col-span-8",
            isMobile ? "mx-auto" : ""
          )}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full"
            >
              {/* Título Principal */}
              <motion.h1 
                className={cn(
                  "font-serif font-bold text-white leading-tight mb-6",
                  {
                    'text-3xl sm:text-4xl': isMobile,
                    'text-4xl': isTablet,
                    'text-5xl lg:text-6xl xl:text-7xl': !isMobile && !isTablet
                  }
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="block">Mais que fazer justiça,</span>
                <span className="block text-gold-400 mt-2">amar pessoas</span>
              </motion.h1>
              
              {/* Subtítulo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-8"
              >
                <p className={cn(
                  "text-neutral-200 max-w-2xl leading-relaxed",
                  isMobile ? "text-base px-2" : "text-lg xl:text-xl"
                )}>
                  <strong className='text-gold-400 font-semibold'>Advocacia Integral:</strong> comprometidos em oferecer soluções jurídicas personalizadas 
                  com ética, dedicação e um olhar humano para cada caso.
                </p>
              </motion.div>
              
              {/* Botões de Ação */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <ResponsiveStack
                  direction={{ xs: 'col', sm: 'row' }}
                  spacing={isMobile ? 4 : 10}
                  align="center"
                  justify={isMobile ? "center" : "start"}
                  className={isMobile ? "items-stretch" : "gap-8 lg:gap-12"}
                >
                  <Link
                    to="/contato"
                    className={cn(
                      "group flex items-center justify-center gap-2 font-semibold transition-all duration-300",
                      "bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700",
                      "text-white rounded-lg transform hover:scale-105",
                      "focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-primary-900",
                      isMobile 
                        ? "px-6 py-4 text-base w-full shadow-lg hover:shadow-xl" 
                        : "px-8 py-4 text-lg shadow-2xl hover:shadow-3xl border border-gold-400/30 hover:border-gold-300"
                    )}
                    aria-describedby="cta-help"
                  >
                    <span>Agende uma Consulta</span>
                    <ArrowRight 
                      size={isMobile ? 18 : 20} 
                      className="group-hover:translate-x-1 transition-transform" 
                      aria-hidden="true" 
                    />
                  </Link>

                  <Link
                    to="/areas-de-atuacao"
                    className={cn(
                      "group flex items-center justify-center gap-2 font-medium transition-all duration-300",
                      isMobile 
                        ? "bg-transparent hover:bg-white/10 border-2 border-white/80 hover:border-white text-white rounded-lg backdrop-blur-sm px-6 py-4 text-base w-full"
                        : "bg-white/10 hover:bg-white/20 border-2 border-white/90 hover:border-white text-white rounded-lg backdrop-blur-md shadow-xl hover:shadow-2xl px-8 py-4 text-lg hover:backdrop-blur-lg",
                      "focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-900"
                    )}
                    aria-label="Conhecer todas as áreas de atuação jurídica do escritório"
                  >
                    <span>Áreas de Atuação</span>
                    {!isMobile && (
                      <Play 
                        size={16} 
                        className="group-hover:scale-110 transition-transform" 
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                </ResponsiveStack>             
              </motion.div>           
            </motion.div>
          </div>

          {/* Card Social */}
          {!isMobile && <SocialCard />}
        </div>
      </ResponsiveContainer>
    </section>
  );
};

export default Hero;