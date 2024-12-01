'use client';

import dynamic from 'next/dynamic';
import { Suspense, useState, useEffect } from 'react';
import { Archivo_Black } from 'next/font/google';
import InteractiveButton from '../components/InteractiveButton';

const archivo = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
});

const Scene = dynamic(() => import('../components/Scene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-[#ffc0eb] flex items-center justify-center">
      <div className="text-white text-2xl">Loading...</div>
    </div>
  )
});

const VideoPlayer = dynamic(() => import('../components/VideoPlayer'), {
  ssr: false,
  loading: () => null
});

export default function Home() {
  const [showVideo, setShowVideo] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleVideoClose = () => {
    setShowVideo(false);
  };

  const handleButtonClick = () => {
    setShowVideo(true);
  };

  if (!isClient) {
    return (
      <div className="w-full h-screen bg-[#ffc0eb] flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-[#ffc0eb] overflow-hidden">
      <Suspense fallback={
        <div className="w-full h-screen bg-[#ffc0eb] flex items-center justify-center">
          <div className="text-white text-2xl">Loading...</div>
        </div>
      }>
        <Scene />
      </Suspense>
      
      <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none px-4 pt-4 sm:pt-6 md:pt-8 lg:pt-10 xl:pt-12 flex flex-col items-center justify-start h-full">
        <h1 
          className={`
            flex 
            items-center 
            justify-center 
            text-[2rem] 
            sm:text-[3rem] 
            md:text-[4rem] 
            lg:text-[6rem] 
            xl:text-[8rem] 
            font-black
            tracking-[0.15em] 
            text-white
            text-center 
            uppercase 
            select-none
            [text-shadow:_0_0_40px_rgba(255,255,255,0.4),_4px_4px_2px_rgba(0,0,0,0.15)]
            transition-all
            duration-300
            hover:tracking-[0.2em]
            hover:[text-shadow:_0_0_60px_rgba(255,255,255,0.6),_4px_4px_2px_rgba(0,0,0,0.2)]
            ${archivo.className}
            mt-0 sm:mt-2 md:mt-4 lg:mt-[-1rem] xl:mt-[-2rem]
          `}
          style={{
            fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
            fontVariantCaps: 'all-small-caps',
          }}
        >
          <span className="mr-1 md:mr-2 relative">
            LVRB
            <span className="absolute -inset-2 bg-white/10 blur-xl rounded-lg"></span>
          </span>
          <InteractiveButton onClick={handleButtonClick} />
          <span className="ml-1 md:mr-2 relative">
            Y
            <span className="absolute -inset-2 bg-white/10 blur-xl rounded-lg"></span>
          </span>
        </h1>
      </div>

      {showVideo && (
        <Suspense fallback={<div>Loading...</div>}>
          <VideoPlayer onClose={handleVideoClose} />
        </Suspense>
      )}
    </div>
  );
}

