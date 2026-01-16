import React from 'react';
import LazyImage from './LazyImage';

interface AvatarImageProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  priority?: boolean;
}

const AvatarImage: React.FC<AvatarImageProps> = ({
  src,
  alt,
  size = 'md',
  className = '',
  priority = false
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14', 
    lg: 'w-20 h-20',
    xl: 'w-32 h-32'
  };

  const sizePx = {
    sm: '40px',
    md: '56px',
    lg: '80px', 
    xl: '128px'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden ${className}`}>
      <LazyImage
        src={src}
        alt={alt}
        className="object-cover"
        aspectRatio="1/1"
        sizes={sizePx[size]}
        priority={priority}
        placeholder="blur"
      />
    </div>
  );
};

export default AvatarImage;