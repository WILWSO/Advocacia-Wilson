import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import OptimizedImage from '../shared/OptimizedImage';
import useResponsive from '../../hooks/ui/useResponsive';
import { ResponsiveContainer, ResponsiveStack } from '../shared/ResponsiveGrid';
import { cn } from '../../utils/cn';
import { PostCard } from '../shared/cards/PostCard';
import { usePostsCarousel } from '../../hooks/features/usePostsCarousel';
import { useVideoPlayer } from '../../hooks/ui/useVideoPlayer';
import { HOME_SECTIONS } from '../../config/messages';

const Hero = () => {
  const { isMobile, isTablet } = useResponsive();
  
  // Carousel de posts para o card social
  const {
    posts,
    currentPost,
    currentPostIndex,
    isLoading,
    direction,
    setDirection,
    setCurrentPostIndex,
    nextPost,
    prevPost,
  } = usePostsCarousel(5000);

  const { playingVideo, setPlayingVideo, stopVideo } = useVideoPlayer();

  const handleNextPost = () => {
    nextPost();
    stopVideo();
  };

  const handlePrevPost = () => {
    prevPost();
    stopVideo();
  };

  const handleSetIndex = (index: number) => {
    setCurrentPostIndex(index);
    stopVideo();
  };
  
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
      {/* Background: Solid color en móvil, imagen en desktop */}
      <div className="absolute inset-0 z-0 w-full min-h-full">
        {/* Móvil: Color sólido con gradiente */}
        <div className={cn(
          "w-full h-full",
          isMobile 
            ? "bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700"
            : "hidden"
        )} aria-hidden="true" />
        
        {/* Desktop: Imagen con overlay */}
        {!isMobile && (
          <>
            <OptimizedImage
              src="/Images/Banner_Wilson.jpg"
              alt="Imagem profissional dos advogados Wilson Santos e Lucas Nascimento em frente ao escritório Santos & Nascimento Advogados Associados em Palmas, Tocantins"
              className="w-full h-full object-cover object-center-top"
              priority={true}
              sizes="100vw"
            />
            <div 
              className="absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-800/80 to-primary-700/60"
              aria-hidden="true"
            />
          </>
        )}
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
                    <span>{HOME_SECTIONS.HERO.CTA_CONSULTATION}</span>
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
                    aria-label={HOME_SECTIONS.HERO.CTA_AREAS_ARIA}
                  >
                    <span>{HOME_SECTIONS.HERO.CTA_AREAS}</span>
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

          {/* Card Social - Carousel de Posts */}
          {!isMobile && !isLoading && posts.length > 0 && currentPost && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="hidden md:block md:col-span-12 lg:col-span-4 md:mt-8 lg:mt-0"
            >
              <PostCard
                post={currentPost}
                direction={direction}
                currentPostIndex={currentPostIndex}
                postsLength={posts.length}
                playingVideo={playingVideo}
                onPlayVideo={() => setPlayingVideo(true)}
                onPrevPost={handlePrevPost}
                onNextPost={handleNextPost}
                onSetIndex={handleSetIndex}
                onSetDirection={setDirection}
              />
            </motion.div>
          )}
        </div>
      </ResponsiveContainer>
    </section>
  );
};

export default Hero;