import { useState, useEffect } from 'react';

interface ImageFormatSupport {
  webp: boolean;
  avif: boolean;
  loading: boolean;
}

export const useImageFormatSupport = (): ImageFormatSupport => {
  const [support, setSupport] = useState<ImageFormatSupport>({
    webp: false,
    avif: false,
    loading: true
  });

  useEffect(() => {
    const checkWebPSupport = (): Promise<boolean> => {
      return new Promise((resolve) => {
        const webP = new Image();
        webP.onload = webP.onerror = () => {
          resolve(webP.height === 2);
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
      });
    };

    const checkAVIFSupport = (): Promise<boolean> => {
      return new Promise((resolve) => {
        const avif = new Image();
        avif.onload = avif.onerror = () => {
          resolve(avif.height === 2);
        };
        avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=';
      });
    };

    const detectSupport = async () => {
      try {
        const [webpSupported, avifSupported] = await Promise.all([
          checkWebPSupport(),
          checkAVIFSupport()
        ]);

        setSupport({
          webp: webpSupported,
          avif: avifSupported,
          loading: false
        });
      } catch (error) {
        console.warn('Error detecting image format support:', error);
        setSupport({
          webp: false,
          avif: false,
          loading: false
        });
      }
    };

    detectSupport();
  }, []);

  return support;
};