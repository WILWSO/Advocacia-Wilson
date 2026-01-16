import React from 'react';
import OptimizedImage from './OptimizedImage';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
  placeholder?: 'blur' | 'empty';
  containerClassName?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  sizes = '100vw',
  aspectRatio,
  objectFit = 'cover',
  placeholder = 'blur',
  containerClassName = ''
}) => {
  // Generar blur data URL simple para placeholder
  const generateBlurDataURL = (w: number = 10, h: number = 10) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = w;
    canvas.height = h;
    
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, '#f3f4f6');
      gradient.addColorStop(1, '#e5e7eb');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    }
    
    return canvas.toDataURL('image/jpeg', 0.1);
  };

  const containerStyle = aspectRatio ? { aspectRatio } : {};

  return (
    <div 
      className={`relative overflow-hidden ${containerClassName}`}
      style={containerStyle}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        className={`w-full h-full ${className}`}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        objectFit={objectFit}
        placeholder={placeholder}
        blurDataURL={generateBlurDataURL()}
      />
    </div>
  );
};

export default LazyImage;