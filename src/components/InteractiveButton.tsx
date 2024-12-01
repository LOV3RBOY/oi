'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface InteractiveButtonProps {
  onClick: () => void;
}

export default function InteractiveButton({ onClick }: InteractiveButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setIsAnimating(prev => !prev);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isHovered]);

  return (
    <button
      className={`
        relative
        pointer-events-auto
        transition-all
        duration-300
        transform
        ${isHovered ? 'scale-110' : 'scale-100'}
        ${isAnimating && !isHovered ? 'animate-subtle-pulse' : ''}
        hover:rotate-180
        group
        mx-1
      `}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Show Easter Egg Video"
    >
      <div
        className={`
          absolute
          inset-0
          rounded-full
          transition-opacity
          duration-300
          ${isHovered ? 'opacity-30' : 'opacity-0'}
          bg-white/20
          scale-125
        `}
      />
      
      <div
        className={`
          absolute
          inset-0
          rounded-full
          border-2
          border-white/50
          transition-all
          duration-300
          ${isHovered ? 'scale-125 rotate-180' : 'scale-100 rotate-0'}
        `}
      />

      <Image
        src='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Button3D.PNG-nZKU5P4NktbGo8bRVVjs5Iw3Iv2tsp.png'
        alt="O"
        width={80}
        height={80}
        className={`
          relative
          z-10
          transition-all
          duration-300
          ${isHovered ? 'filter brightness-125' : ''}
          group-hover:shadow-lg
        `}
        priority
        loading="eager"
      />

      <span
        className={`
          absolute
          left-1/2
          -bottom-8
          transform
          -translate-x-1/2
          text-white
          text-xs
          font-light
          tracking-wider
          whitespace-nowrap
          transition-opacity
          duration-300
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}
      >
        Click me!
      </span>
    </button>
  );
}

