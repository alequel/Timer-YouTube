import React, { useState, useEffect } from 'react';
import Settings from './components/Settings';
import Timer from './components/Timer';

interface TimerConfig {
  duration: number;
  backgroundUrl: string | null;
  backgroundType: 'image' | 'video' | 'greenscreen';
  theme: string;
}

const App: React.FC = () => {
  const [timerConfig, setTimerConfig] = useState<TimerConfig | null>(null);

  // Этот эффект будет запускать свою функцию очистки всякий раз, когда timerConfig изменяется,
  // или когда компонент App размонтируется. Очистка отзовет URL-адрес
  // из *предыдущего* рендера, предотвращая утечки памяти.
  useEffect(() => {
    return () => {
      if (timerConfig?.backgroundUrl) {
        URL.revokeObjectURL(timerConfig.backgroundUrl);
      }
    };
  }, [timerConfig]);


  const handleStartTimer = (duration: number, media: File | 'greenscreen', theme: string) => {
    if (media === 'greenscreen') {
        setTimerConfig({ duration, backgroundUrl: null, backgroundType: 'greenscreen', theme });
    } else {
        const newMediaUrl = URL.createObjectURL(media);
        const backgroundType = media.type.startsWith('video/') ? 'video' : 'image';
        setTimerConfig({ duration, backgroundUrl: newMediaUrl, backgroundType, theme });
    }
  };

  const handleGoBack = () => {
    setTimerConfig(null);
  };

  return (
    <main className="bg-gray-100 min-h-screen">
      {timerConfig ? (
        <Timer
          initialMinutes={timerConfig.duration}
          backgroundUrl={timerConfig.backgroundUrl}
          backgroundType={timerConfig.backgroundType}
          theme={timerConfig.theme}
          onBack={handleGoBack}
        />
      ) : (
        <Settings onStart={handleStartTimer} />
      )}
    </main>
  );
};

export default App;