'use client';

import { useState } from 'react';
import { storeImageSrc } from '@/lib/store-image';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  onLoad?: () => void;
  sizes?: string;
}

export default function LazyImage({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  onLoad,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const resolved = storeImageSrc(src);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
    onLoad?.();
  };

  if (!resolved || hasError) {
    return (
      <div className={`relative overflow-hidden bg-gray-200 flex items-center justify-center ${className}`} style={{ width, height }}>
        <span className="text-gray-400 text-xs">No Image</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse z-10"></div>
      )}
      <img
        src={resolved}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}
