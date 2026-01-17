import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Newspaper, Heart, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import LazyImage from '../shared/LazyImage';
import { supabase } from '../../lib/supabase';
import useResponsive from '../../hooks/useResponsive';
import { ResponsiveContainer, ResponsiveStack } from '../shared/ResponsiveGrid';
import { cn } from '../../utils/cn';

interface Post {
  id: string;
  titulo: string;
  conteudo: string;
  tipo_midia: string;
  url_midia?: string;
  likes: number;
  comentarios: number;
  data_publicacao: string;
  status: string;
}

const Hero = () => {
  const { isMobile, isTablet } = useResponsive();
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [direction, setDirection] = useState(0); // 1 para siguiente, -1 para anterior
  const [playingVideo, setPlayingVideo] = useState(false); // Estado para controlar si se reproduce el video

  // Obtener los últimos posts publicados
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts_sociais')
          .select('id, titulo, conteudo, tipo, image_url, youtube_id, tags, data_criacao, likes, comentarios')
          .eq('publicado', true)
          .order('data_criacao', { ascending: false })
          .limit(5);

        if (error) throw error;
        if (data && data.length > 0) {
          setPosts(data);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Rotar posts automáticamente cada 5 segundos
  useEffect(() => {
    if (posts.length <= 1) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentPostIndex((prev) => (prev + 1) % posts.length);
      setPlayingVideo(false); // Detener video al rotar automáticamente
    }, 5000);

    return () => clearInterval(interval);
  }, [posts.length]);

  const currentPost = posts[currentPostIndex];

  // Obtener imagen de fondo (image_url o thumbnail de YouTube)
  const getBackgroundImage = (post: { image_url?: string; youtube_id?: string }) => {
    if (post?.image_url) {
      return post.image_url;
    }
    if (post?.youtube_id) {
      return `https://img.youtube.com/vi/${post.youtube_id}/maxresdefault.jpg`;
    }
    return null;
  };

  // Funciones de navegación manual
  const nextPost = () => {
    setDirection(1);
    setCurrentPostIndex((prev) => (prev + 1) % posts.length);
    setPlayingVideo(false); // Detener video al cambiar de post
  };

  const prevPost = () => {
    setDirection(-1);
    setCurrentPostIndex((prev) => (prev - 1 + posts.length) % posts.length);
    setPlayingVideo(false); // Detener video al cambiar de post
  };

  // Variantes de animación para el slide
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 400 : -400,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -400 : 400,
      opacity: 0
    })
  };
  
  // Altura adaptativa basada en el dispositivo
  const getHeightClasses = () => {
    if (isMobile) return 'min-h-[100svh] sm:min-h-[600px]';
    if (isTablet) return 'min-h-[700px]';
    return 'min-h-screen';
  };
  return (
    <section 
      className={cn(
        "relative flex items-center justify-center",
        getHeightClasses()
      )} 
      role="banner" 
      aria-label="Seção principal de apresentação"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <LazyImage
          src="/Banner_Wilson.jpg"
          alt="Imagem profissional dos advogados Wilson Santos e Lucas Nascimento em frente ao escritório Santos & Nascimento Advogados Associados em Palmas, Tocantins"
          className={cn(
            "object-cover",
            isMobile ? "object-center" : "object-center-top"
          )}
          priority={true}
          sizes={isMobile ? "100vw" : "(max-width: 768px) 100vw, 100vw"}
          containerClassName="w-full h-full"
        />
        {/* Gradient overlay adaptativo */}
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Contenido principal */}
          <div className={cn(
            "flex items-center",
            isMobile ? "min-h-[80vh] text-center" : "min-h-[60vh] text-left",
            isMobile ? "col-span-1" : "lg:col-span-8",
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

        {/* Card Social - Estilo MSN/Bing con noticias dinámicas */}
        {!isMobile && !isLoading && posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="hidden lg:block lg:col-span-4"
          >
            <Link to="/social" className="block">
              <div className="relative h-[380px] rounded-xl shadow-lg overflow-hidden border border-neutral-200 hover:shadow-2xl transition-shadow duration-300">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={currentPostIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "tween", duration: 0.4, ease: "easeInOut" },
                      opacity: { duration: 0.3 }
                    }}
                    whileHover={{ 
                      y: -8,
                      scale: 1.02,
                      transition: { duration: 0.3 }
                    }}
                    className="absolute inset-0 group"
                  >
                    {/* Video de YouTube incrustado si es un video */}
                    {currentPost?.tipo === 'video' && currentPost?.youtube_id ? (
                      <div className="h-full flex flex-col bg-white">
                        {/* Video container con thumbnail */}
                        <div className="aspect-video bg-neutral-900 overflow-hidden relative">
                          {!playingVideo ? (
                            /* Thumbnail del video de YouTube */
                            <div 
                              className="relative w-full h-full cursor-pointer group"
                              onClick={(e) => {
                                e.preventDefault();
                                setPlayingVideo(true);
                              }}
                            >
                              <img 
                                src={`https://img.youtube.com/vi/${currentPost.youtube_id}/maxresdefault.jpg`}
                                alt={currentPost.titulo}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Fallback a thumbnail de menor calidad si maxres no existe
                                  e.currentTarget.src = `https://img.youtube.com/vi/${currentPost.youtube_id}/hqdefault.jpg`;
                                }}
                              />
                              {/* Botón play superpuesto */}
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                                <div className="w-16 h-16 rounded-full bg-red-600 group-hover:bg-red-700 flex items-center justify-center shadow-2xl transition-all group-hover:scale-110">
                                  <Play size={28} className="text-white ml-1" fill="white" />
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* Iframe cuando se hace click en play */
                            <iframe
                              src={`https://www.youtube.com/embed/${currentPost.youtube_id}?autoplay=1`}
                              title={currentPost.titulo}
                              className="w-full h-full border-0"
                              allowFullScreen
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            />
                          )}
                        </div>
                        
                        {/* Content container */}
                        <div className="p-4 flex flex-col flex-1 overflow-hidden">
                          {/* Badge de tipo */}
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                              <Play size={12} />
                              Vídeo
                            </span>
                            {currentPost && new Date(currentPost.data_criacao).getTime() > Date.now() - 48 * 60 * 60 * 1000 && (
                              <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                                NOVO
                              </span>
                            )}
                          </div>

                          {/* Título */}
                          <h3 className="text-base font-bold text-neutral-800 mb-2 line-clamp-2">
                            {currentPost?.titulo}
                          </h3>

                          {/* Tags */}
                          {currentPost?.tags && currentPost.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {currentPost.tags.slice(0, 2).map((tag: string, idx: number) => (
                                <span 
                                  key={idx}
                                  className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-xs"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Footer con stats */}
                          <div className="mt-auto pt-3 border-t border-neutral-100">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-xs text-neutral-500">
                                <span className="flex items-center gap-1">
                                  <Heart size={14} />
                                  {currentPost?.likes || 0}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageCircle size={14} />
                                  {currentPost?.comentarios || 0}
                                </span>
                              </div>
                              <span className="text-xs text-neutral-500">
                                {new Date(currentPost?.data_criacao).toLocaleDateString('pt-BR', { 
                                  day: '2-digit', 
                                  month: 'short' 
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Imagen de fondo para otros tipos de contenido */
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: getBackgroundImage(currentPost)
                            ? `url(${getBackgroundImage(currentPost)})`
                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        {/* Overlay oscuro para legibilidad */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />

                        {/* Icono fallback si no hay imagen */}
                        {!getBackgroundImage(currentPost) && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Newspaper size={80} className="text-white/30" />
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Badge "NOVO" si es reciente */}
                    {currentPost && new Date(currentPost.data_criacao).getTime() > Date.now() - 48 * 60 * 60 * 1000 && (
                      <div className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg z-20">
                        NOVO
                      </div>
                    )}

                    {/* Contenido del card - superpuesto sobre la imagen (solo si NO es video) */}
                    {!(currentPost?.tipo === 'video' && currentPost?.youtube_id) && (
                      <div className="absolute inset-0 flex flex-col justify-between p-4 z-10">
                        {/* Header superior */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-white/90 font-medium backdrop-blur-sm bg-black/20 px-2 py-1 rounded">
                            Advocacia Integral
                          </span>
                          <span className="text-xs text-white/80 backdrop-blur-sm bg-black/20 px-2 py-1 rounded">
                            {new Date(currentPost?.data_criacao).toLocaleDateString('pt-BR', { 
                              day: '2-digit', 
                              month: 'short' 
                            })}
                          </span>
                        </div>

                        {/* Contenido inferior */}
                        <div className="space-y-3">
                          {/* Título - estilo MSN */}
                          <h3 className="text-lg font-bold text-white leading-tight line-clamp-2 drop-shadow-lg">
                            {currentPost?.titulo || 'Carregando...'}
                          </h3>

                          {/* Tags minimalistas */}
                          {currentPost?.tags && currentPost.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {currentPost.tags.slice(0, 2).map((tag: string, idx: number) => (
                                <span 
                                  key={idx}
                                  className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white rounded text-xs font-medium"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Action row - estilo MSN */}
                          <div className="flex items-center justify-between pt-2 border-t border-white/20">
                            <div className="flex items-center gap-3 text-xs text-white/90">
                              <span className="flex items-center gap-1">
                                <Heart size={14} />
                                {currentPost?.likes || 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle size={14} />
                                {currentPost?.comentarios || 0}
                              </span>
                            </div>
                            
                            <span className="text-xs text-white font-semibold flex items-center gap-1 hover:gap-2 transition-all backdrop-blur-sm bg-white/10 px-3 py-1.5 rounded-full">
                              Ler mais
                              <ArrowRight size={14} />
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Título e info para videos de YouTube */}
                    {currentPost?.tipo === 'video' && currentPost?.youtube_id && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 z-10">
                        <h3 className="text-base font-bold text-white leading-tight line-clamp-2 drop-shadow-lg mb-2">
                          {currentPost?.titulo || 'Carregando...'}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-white/90">
                            <span className="flex items-center gap-1">
                              <Heart size={14} />
                              {currentPost?.likes || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <Play size={14} />
                              Vídeo
                            </span>
                          </div>
                          <span className="text-xs text-white/80">
                            {new Date(currentPost?.data_criacao).toLocaleDateString('pt-BR', { 
                              day: '2-digit', 
                              month: 'short' 
                            })}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Título e info para videos de YouTube */}
                    {currentPost?.tipo === 'video' && currentPost?.youtube_id && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 z-10">
                        <h3 className="text-base font-bold text-white leading-tight line-clamp-2 drop-shadow-lg mb-2">
                          {currentPost?.titulo || 'Carregando...'}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-white/90">
                            <span className="flex items-center gap-1">
                              <Heart size={14} />
                              {currentPost?.likes || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <Play size={14} />
                              Vídeo
                            </span>
                          </div>
                          <span className="text-xs text-white/80">
                            {new Date(currentPost?.data_criacao).toLocaleDateString('pt-BR', { 
                              day: '2-digit', 
                              month: 'short' 
                            })}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Efecto de brillo sutil */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </motion.div>
                </AnimatePresence>

                {/* Navegación lateral - Flechas (fuera de AnimatePresence) */}
                {posts.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        prevPost();
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 z-30 group-hover:opacity-100"
                      aria-label="Notícia anterior"
                    >
                      <ChevronLeft size={20} className="text-neutral-800" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        nextPost();
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 z-30 group-hover:opacity-100"
                      aria-label="Próxima notícia"
                    >
                      <ChevronRight size={20} className="text-neutral-800" />
                    </button>
                  </>
                )}

                {/* Indicadores de carrusel - minimalistas (fuera de AnimatePresence) */}
                {posts.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg z-30">
                    {posts.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDirection(idx > currentPostIndex ? 1 : -1);
                          setCurrentPostIndex(idx);
                        }}
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-300",
                          idx === currentPostIndex 
                            ? "w-6 bg-white" 
                            : "w-1.5 bg-white/50 hover:bg-white/70"
                        )}
                        aria-label={`Ir para notícia ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </motion.div>
        )}
      </div>
      </ResponsiveContainer>
    </section>
  );
};

export default Hero;