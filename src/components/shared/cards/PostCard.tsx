/**
 * PostCard - Carousel card component for home page
 * Fusionado según principio KISS: VideoPost, ImagePost y CarouselControls
 * eran componentes privados usados solo aquí (no reutilizados)
 */
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Heart, 
  MessageCircle, 
  Newspaper, 
  ArrowRight,
  ChevronLeft,
  ChevronRight 
} from 'lucide-react';
import { Post } from '../../../types/post';
import { isNewPost, getBackgroundImage } from '../../../utils/postUtils';
import { useResponsive } from '../../../hooks/ui/useResponsive';
import { cn } from '../../../utils/cn';
import { EXTERNAL_COMPONENT_CLASSES } from '../../../config/theme';

interface PostCardProps {
  post: Post;
  direction: number;
  currentPostIndex: number;
  postsLength: number;
  playingVideo: boolean;
  onPlayVideo: () => void;
  onPrevPost: () => void;
  onNextPost: () => void;
  onSetIndex: (index: number) => void;
  onSetDirection: (dir: number) => void;
}

// ==================== COMPONENTE INTERNO: VideoPost ====================
interface VideoPostProps {
  post: Post;
  playingVideo: boolean;
  onPlayClick: () => void;
  isNew: boolean;
}

const VideoPost = ({ post, playingVideo, onPlayClick, isNew }: VideoPostProps) => {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Video container */}
      <div className="aspect-video bg-neutral-900 overflow-hidden relative">
        {!playingVideo ? (
          <div 
            className="relative w-full h-full cursor-pointer group"
            onClick={(e) => {
              e.preventDefault();
              onPlayClick();
            }}
          >
            <img 
              src={`https://img.youtube.com/vi/${post.youtube_id}/maxresdefault.jpg`}
              alt={post.titulo}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://img.youtube.com/vi/${post.youtube_id}/hqdefault.jpg`;
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
              <div className={cn("w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all group-hover:scale-110", EXTERNAL_COMPONENT_CLASSES.youtubeButton)}>
                <Play size={28} className="text-white ml-1" fill="white" />
              </div>
            </div>
          </div>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${post.youtube_id}?autoplay=1`}
            title={post.titulo}
            className="w-full h-full border-0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        )}
      </div>
      
      {/* Content container */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 overflow-hidden">
        {/* Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
            <Play size={10} className="sm:hidden" />
            <Play size={12} className="hidden sm:inline" />
            <span className="hidden sm:inline">Vídeo</span>
          </span>
          {isNew && (
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-red-500 text-white text-xs font-bold rounded-full">
              NOVO
            </span>
          )}
        </div>

        {/* Título */}
        <h3 className="text-sm sm:text-base md:text-lg font-bold text-neutral-800 mb-2 line-clamp-2">
          {post.titulo}
        </h3>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2 sm:mb-3">
            {post.tags.slice(0, 2).map((tag: string, idx: number) => (
              <span 
                key={idx}
                className="px-1.5 sm:px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-neutral-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-neutral-500">
              <span className="flex items-center gap-1">
                <Heart size={14} />
                {post.likes || 0}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle size={14} />
                {post.comentarios || 0}
              </span>
            </div>
            <span className="text-xs text-neutral-500">
              {post.data_criacao ? new Date(post.data_criacao).toLocaleDateString('pt-BR', { 
                day: '2-digit', 
                month: 'short' 
              }) : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== COMPONENTE INTERNO: ImagePost ====================
interface ImagePostProps {
  post: Post;
  backgroundImage: string | null;
  isNew: boolean;
  onReadMore: (e: React.MouseEvent) => void;
}

const ImagePost = ({ post, backgroundImage, isNew, onReadMore }: ImagePostProps) => {
  return (
    <>
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: backgroundImage
            ? `url(${backgroundImage})`
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />

        {!backgroundImage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Newspaper size={80} className="text-white/30" />
          </div>
        )}
      </div>

      {/* Badge NOVO */}
      {isNew && (
        <div className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg z-20">
          NOVO
        </div>
      )}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-3 sm:p-4 z-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/90 font-medium backdrop-blur-sm bg-black/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
            <span className="hidden sm:inline">Advocacia Integral</span>
            <span className="sm:hidden">S&N</span>
          </span>
          <span className="text-xs text-white/80 backdrop-blur-sm bg-black/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
            {post.data_criacao ? new Date(post.data_criacao).toLocaleDateString('pt-BR', { 
              day: '2-digit', 
              month: 'short' 
            }) : 'N/A'}
          </span>
        </div>

        {/* Content inferior */}
        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-white leading-tight line-clamp-2 drop-shadow-lg">
            {post.titulo}
          </h3>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {post.tags.slice(0, 2).map((tag: string, idx: number) => (
                <span 
                  key={idx}
                  className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white/20 backdrop-blur-sm text-white rounded text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Action row */}
          <div className="flex items-center justify-between pt-2 border-t border-white/20">
            <div className="flex items-center gap-2 sm:gap-3 text-xs text-white/90">
              <span className="flex items-center gap-0.5 sm:gap-1">
                <Heart size={12} className="sm:hidden" />
                <Heart size={14} className="hidden sm:inline" />
                <span className="hidden xs:inline">{post.likes}</span>
              </span>
              <span className="flex items-center gap-0.5 sm:gap-1">
                <MessageCircle size={12} className="sm:hidden" />
                <MessageCircle size={14} className="hidden sm:inline" />
                <span className="hidden xs:inline">{post.comentarios}</span>
              </span>
            </div>
            
            <button 
              onClick={onReadMore}
              className="text-xs text-white font-semibold flex items-center gap-1 hover:gap-2 transition-all backdrop-blur-sm bg-white/10 px-3 py-1.5 rounded-full cursor-pointer hover:bg-white/20"
            >
              Ler mais
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Brillo hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </>
  );
};

// ==================== COMPONENTE INTERNO: CarouselControls ====================
interface CarouselControlsProps {
  postsCount: number;
  currentIndex: number;
  onPrev: (e: React.MouseEvent) => void;
  onNext: (e: React.MouseEvent) => void;
  onDotClick: (e: React.MouseEvent, index: number) => void;
  showArrows?: boolean;
}

const CarouselControls = ({ 
  postsCount, 
  currentIndex, 
  onPrev, 
  onNext, 
  onDotClick,
  showArrows = true
}: CarouselControlsProps) => {
  if (postsCount <= 1) return null;

  return (
    <>
      {/* Flechas de navegación - solo en desktop */}
      {showArrows && (
        <>
          <button
            onClick={onPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-16 bg-neutral-600/80 hover:bg-neutral-700/90 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center transition-all duration-300 z-30 opacity-90 hover:opacity-100 hover:scale-105"
            aria-label="Notícia anterior"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
          
          <button
            onClick={onNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-16 bg-neutral-600/80 hover:bg-neutral-700/90 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center transition-all duration-300 z-30 opacity-90 hover:opacity-100 hover:scale-105"
            aria-label="Próxima notícia"
          >
            <ChevronRight size={24} className="text-white" />
          </button>
        </>
      )}

      {/* Indicadores */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg z-30">
        {Array.from({ length: postsCount }).map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => onDotClick(e, idx)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              idx === currentIndex 
                ? "w-6 bg-white" 
                : "w-1.5 bg-white/50 hover:bg-white/70"
            )}
            aria-label={`Ir para notícia ${idx + 1}`}
          />
        ))}
      </div>
    </>
  );
};

// ==================== COMPONENTE PRINCIPAL: PostCard ====================
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

export const PostCard = ({
  post,
  direction,
  currentPostIndex,
  postsLength,
  playingVideo,
  onPlayVideo,
  onPrevPost,
  onNextPost,
  onSetIndex,
  onSetDirection,
}: PostCardProps) => {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  const isVideo = post?.tipo === 'video' && post?.youtube_id;
  const isNew = post ? isNewPost(post?.data_criacao) : false;
  const backgroundImage = getBackgroundImage(post);

  const handleCardClick = () => {
    if (post?.id) {
      navigate(`/social?postId=${post.id}`);
    }
  };

  const handlePrevClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onPrevPost();
  };

  const handleNextClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onNextPost();
  };

  const handleDotClick = (e: React.MouseEvent, idx: number) => {
    e.preventDefault();
    e.stopPropagation();
    onSetDirection(idx > currentPostIndex ? 1 : -1);
    onSetIndex(idx);
  };

  const handleReadMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (post?.id) {
      navigate(`/social?postId=${post.id}`);
    }
  };

  return (
    <div onClick={handleCardClick} className="block cursor-pointer">
      <div className="relative h-[320px] sm:h-[380px] rounded-xl shadow-lg overflow-hidden border border-neutral-200 hover:shadow-2xl transition-shadow duration-300">
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
            {isVideo ? (
              <VideoPost 
                post={post}
                playingVideo={playingVideo}
                onPlayClick={onPlayVideo}
                isNew={isNew}
              />
            ) : (
              <ImagePost 
                post={post}
                backgroundImage={backgroundImage}
                isNew={isNew}
                onReadMore={handleReadMore}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <CarouselControls
          postsCount={postsLength}
          currentIndex={currentPostIndex}
          onPrev={handlePrevClick}
          onNext={handleNextClick}
          onDotClick={handleDotClick}
          showArrows={!isMobile}
        />
      </div>
    </div>
  );
};
