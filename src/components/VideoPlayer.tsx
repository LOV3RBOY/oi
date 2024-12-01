'use client';

import { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  onClose: () => void;
}

export default function VideoPlayer({ onClose }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const iframe = document.createElement('iframe');
    iframe.src = 'https://drive.google.com/file/d/1Q2Oo53dZNa7aRnHn9ycYauqsnAxCqXJ1/preview';
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.allow = 'autoplay; fullscreen';
    iframe.allowFullscreen = true;
    iframe.style.opacity = '0';
    iframe.style.transition = 'opacity 0.3s ease-in-out';

    iframe.onload = () => {
      setIsLoaded(true);
      iframe.style.opacity = '1';
    };

    containerRef.current.appendChild(iframe);
    iframeRef.current = iframe;

    return () => {
      if (containerRef.current && iframeRef.current) {
        containerRef.current.removeChild(iframeRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-50 p-4 md:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-center w-full h-full">
        <div 
          ref={containerRef}
          className="relative w-full h-full max-w-6xl max-h-[80vh] shadow-2xl"
        >
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 md:top-4 md:right-4 z-10 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors touch-manipulation"
            aria-label="Close video"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 md:h-6 md:w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="text-white text-xl">Loading video...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

