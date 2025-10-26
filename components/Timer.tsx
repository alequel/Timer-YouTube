import React, { useState, useEffect, useMemo } from 'react';

interface TimerProps {
  initialMinutes: number;
  backgroundUrl: string | null;
  backgroundType: 'image' | 'video' | 'greenscreen';
  theme: string;
  onBack: () => void;
}

const Metronome: React.FC = () => (
    <div className="mt-8 h-24 w-1.5 relative mx-auto">
        <div 
            className="w-full h-full bg-gray-400 rounded-full animate-metronome-arm" 
            style={{ transformOrigin: 'top center' }}
        >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-gray-200 rounded-full shadow-md"></div>
        </div>
    </div>
);

const RelaxSilhouette: React.FC = () => (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg
            className="w-2/3 h-2/3 max-w-sm max-h-sm text-white animate-breathing"
            viewBox="0 0 100 100"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="50" cy="25" r="10" />
            <path d="M35 40 C 30 50, 30 60, 40 65 L 60 65 C 70 60, 70 50, 65 40 Z" />
            <path d="M25 70 C 35 60, 65 60, 75 70 C 65 80, 35 80, 25 70 Z" />
        </svg>
    </div>
);

const Timer: React.FC<TimerProps> = ({ initialMinutes, backgroundUrl, backgroundType, theme, onBack }) => {
  const [timeRemaining, setTimeRemaining] = useState(initialMinutes * 60);
  const isTimeUp = timeRemaining <= 0;

  useEffect(() => {
    if (isTimeUp) return;

    const timerId = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [isTimeUp]);
  
  const totalDuration = useMemo(() => initialMinutes * 60, [initialMinutes]);
  const progressPercentage = useMemo(() => {
    if (totalDuration <= 0) return 0;
    const percentage = (timeRemaining / totalDuration) * 100;
    return Math.max(0, percentage);
  }, [timeRemaining, totalDuration]);

  const formattedTime = useMemo(() => {
    if (timeRemaining < 0) return '00:00';
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, [timeRemaining]);
  
  const handleReset = () => {
    setTimeRemaining(initialMinutes * 60);
  }

  const renderTimerContent = () => {
    if (isTimeUp) {
       const resetButton = (
         <button
            onClick={handleReset}
            className="px-8 py-4 bg-white text-orange-800 font-bold rounded-lg shadow-lg hover:bg-orange-100 transition-transform transform hover:scale-105"
          >
            Reset Timer
        </button>
      );

      switch (theme) {
        case 'office':
          return (
            <div className="flex flex-col items-center space-y-8">
              <div className="bg-black/70 p-4 md:p-6 rounded-lg border-2 border-gray-600 shadow-2xl">
                <h1 className="font-office-timer text-red-500 animate-pulse" style={{ fontSize: 'clamp(3rem, 15vw, 8rem)', lineHeight: 1, textShadow: '0 0 10px rgba(255, 50, 50, 0.7)' }}>
                  TIME'S UP!
                </h1>
              </div>
              {resetButton}
            </div>
          );
        case 'relax':
          return (
            <div className="flex flex-col items-center space-y-8">
                <h1 className="font-timer text-white/90 text-shadow text-5xl md:text-7xl tracking-wider">
                    Session Complete
                </h1>
              {resetButton}
            </div>
          );
        case 'glass2':
           return (
            <div className="flex flex-col items-center space-y-8">
                <h1 className="font-timer text-white/80 text-shadow text-7xl md:text-9xl tracking-wider animate-pulse">
                    Time's Up!
                </h1>
              {resetButton}
            </div>
          );
        case 'glass':
        default:
          return (
            <div className="flex flex-col items-center space-y-8">
              <div className="bg-white/10 backdrop-blur-md py-4 px-8 rounded-3xl border border-white/20 shadow-lg animate-liquid-morph">
                  <h1 className="font-timer text-white/90 text-shadow text-7xl md:text-9xl tracking-wider animate-pulse">
                      Time's Up!
                  </h1>
              </div>
              {resetButton}
            </div>
          );
      }
    }

    switch (theme) {
      case 'office':
        return (
          <div className="flex flex-col items-center">
            <div className="bg-black/70 p-4 md:p-6 rounded-lg border-2 border-gray-600 shadow-2xl">
              <h1 className="font-office-timer text-green-400" style={{ fontSize: 'clamp(4rem, 20vw, 12rem)', lineHeight: 1, textShadow: '0 0 10px rgba(50, 255, 50, 0.7)' }}>
                {formattedTime}
              </h1>
            </div>
            <Metronome />
          </div>
        );
      case 'relax':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
             <RelaxSilhouette />
            <h1 className="font-timer text-shadow text-white/90 relative" style={{ fontSize: 'clamp(5rem, 25vw, 15rem)', lineHeight: 1 }}>
              {formattedTime}
            </h1>
          </div>
        );
      case 'glass2':
        return (
          <h1 className="font-timer text-shadow text-white/80" style={{ fontSize: 'clamp(5rem, 25vw, 15rem)', lineHeight: 1 }}>
            {formattedTime}
          </h1>
        );
      case 'glass':
      default:
        return (
          <div className="bg-white/10 backdrop-blur-md p-4 md:p-8 rounded-3xl border border-white/20 shadow-lg animate-liquid-morph">
            <h1 className="font-timer text-shadow text-white/90" style={{ fontSize: 'clamp(5rem, 25vw, 15rem)', lineHeight: 1 }}>
              {formattedTime}
            </h1>
          </div>
        );
    }
  };


  return (
    <div
      className="h-screen w-screen bg-black flex flex-col items-center justify-center relative p-4 overflow-hidden"
    >
      {backgroundType === 'greenscreen' ? (
        <div 
            className="absolute top-0 left-0 w-full h-full z-0" 
            style={{ backgroundColor: '#00ff00' }}
        />
      ) : backgroundType === 'video' ? (
        <video
          key={backgroundUrl}
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-1/2 left-1/2 w-auto min-w-full min-h-full max-w-none transform -translate-x-1/2 -translate-y-1/2 z-0"
        >
          <source src={backgroundUrl!} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${backgroundUrl})` }}
        />
      )}
      
      {backgroundType !== 'greenscreen' && (
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
      )}
      
      {!isTimeUp && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 w-11/12 max-w-2xl">
            <div
              className="h-4 bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-inner overflow-hidden"
              role="progressbar"
              aria-label="Time remaining"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressPercentage}
            >
              <div
                className="h-full bg-gradient-to-r from-white/80 to-white rounded-full transition-all duration-1000 ease-linear animate-pulse-glow"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
        </div>
      )}

      <div className="relative z-10 text-center flex items-center justify-center w-full h-full">
        {renderTimerContent()}
      </div>
      
      <button
        onClick={onBack}
        className="absolute bottom-5 left-5 z-10 bg-white/70 backdrop-blur-sm text-gray-800 font-semibold py-2 px-4 rounded-full shadow-md hover:bg-white transition-all"
      >
        &larr; Change Settings
      </button>
    </div>
  );
};

export default Timer;