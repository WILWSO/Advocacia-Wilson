import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  sizes = '100vw',
  objectFit = 'cover',
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer para lazy loading
  useEffect(() => {
    if (priority || typeof window === 'undefined') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Generar diferentes formatos y tamaños de imagen
  const getImageSources = (baseSrc: string) => {
    if (!baseSrc || typeof baseSrc !== 'string') {
      console.error('Invalid src provided to OptimizedImage:', baseSrc);
      return {
        webp: '',
        avif: '',
        original: ''
      };
    }
    
    // Para URLs externas, usar tal como están
    if (baseSrc.startsWith('http')) {
      return {
        webp: baseSrc,
        avif: baseSrc,
        original: baseSrc
      };
    }

    // Para archivos locales, usar solo el archivo original por ahora
    // En una implementación futura, aquí podrías verificar si existen formatos alternativos
    return {
      avif: baseSrc, // usar original como fallback
      webp: baseSrc, // usar original como fallback  
      original: baseSrc
    };
  };

  // Generar srcSet para responsive images
  const generateSrcSet = (baseSrc: string, format: string) => {
    if (!baseSrc || typeof baseSrc !== 'string') return '';
    
    // Para URLs externas o archivos locales, usar la imagen tal como está
    // En una implementación futura, aquí podrías generar múltiples tamaños
    return baseSrc;
  };

  // Validación temprana del src
  if (!src) {
    console.error('OptimizedImage: src prop is required');
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">No image source</span>
      </div>
    );
  }

  const sources = getImageSources(src);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setIsError(true);
    onError?.();
  };

  // Placeholder blur data URL
  const defaultBlurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";

  // Componente de placeholder loading
  const LoadingPlaceholder = () => (
    <div 
      className={`bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 animate-pulse ${className}`}
      style={{ 
        width: width || '100%', 
        height: height || '100%',
        aspectRatio: width && height ? `${width}/${height}` : undefined
      }}
    />
  );

  // Componente de error
  const ErrorPlaceholder = () => (
    <div 
      className={`bg-neutral-100 flex items-center justify-center text-neutral-400 ${className}`}
      style={{ 
        width: width || '100%', 
        height: height || '100%',
        aspectRatio: width && height ? `${width}/${height}` : undefined
      }}
    >
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
  );

  if (isError) {
    return <ErrorPlaceholder />;
  }

  return (
    <div ref={imgRef} className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        {!isLoaded && placeholder === 'blur' && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-10"
          >
            {blurDataURL ? (
              <img
                src={blurDataURL}
                alt=""
                className={`${className} blur-sm scale-110`}
                style={{ objectFit }}
                aria-hidden="true"
              />
            ) : (
              <LoadingPlaceholder />
            )}
          </motion.div>
        )}

        {!isLoaded && placeholder === 'empty' && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-10"
          >
            <LoadingPlaceholder />
          </motion.div>
        )}
      </AnimatePresence>

      {isInView && (
        <picture>
          {/* AVIF format for modern browsers */}
          <source
            type="image/avif"
            srcSet={generateSrcSet(src, 'avif')}
            sizes={sizes}
          />
          
          {/* WebP format for most browsers */}
          <source
            type="image/webp"
            srcSet={generateSrcSet(src, 'webp')}
            sizes={sizes}
          />
          
          {/* Fallback to original format */}
          <motion.img
            src={sources.original}
            alt={alt}
            className={`transition-opacity duration-300 ${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            width={width}
            height={height}
            sizes={sizes}
            srcSet={generateSrcSet(src, 'original')}
            style={{ objectFit }}
            onLoad={handleLoad}
            onError={handleError}
            fetchpriority={priority ? 'high' : 'auto'}
          />
        </picture>
      )}
    </div>
  );
};

export default OptimizedImage;