'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface VideoSectionProps {
  videoUrl?: string;
  fallbackVideoUrl?: string;
}

export default function VideoSection({
  videoUrl = "https://www.youtube.com/embed/GT6l9vMRewo",
  fallbackVideoUrl = "/imgs/disney/demo-video.mp4"
}: VideoSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [error, setError] = useState(false);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const videoRef = useRef<HTMLDivElement>(null);

  // 多个视频源的优先级
  const videoSources = [
    videoUrl, // 主要视频
    "https://www.youtube.com/embed/dQw4w9WgXcQ", // 备用YouTube
    "https://www.youtube.com/embed/ScMzIvxBSi4", // Disney Solitaire gameplay
    "https://player.vimeo.com/video/76979871", // Vimeo备用
    fallbackVideoUrl, // 本地备用
  ];

  const currentVideoUrl = videoSources[currentSourceIndex];
  const isDirectFile = currentVideoUrl.match(/\.(mp4|webm|ogg)$/i);

  // 使用 Intersection Observer 实现懒加载
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // 延迟 200ms 加载，避免快速滚动时误加载
          const timer = setTimeout(() => {
            setShouldLoad(true);
          }, 200);
          observer.disconnect();

          return () => clearTimeout(timer);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px' // 提前 50px 开始加载
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    setError(false);
  };

  const handleError = () => {
    console.error('[Video] Loading failed for:', currentVideoUrl);

    if (currentSourceIndex < videoSources.length - 1) {
      // 尝试下一个视频源
      const nextIndex = currentSourceIndex + 1;
      setCurrentSourceIndex(nextIndex);
      setIsLoaded(false);
      setShouldLoad(false);
      setTimeout(() => setShouldLoad(true), 500);
    } else {
      setError(true);
      setIsLoaded(true);
    }
  };

  const handleRetry = () => {
    setError(false);
    setCurrentSourceIndex(0); // 重置到第一个视频源
    setIsLoaded(false);
    setShouldLoad(false);
    setTimeout(() => setShouldLoad(true), 300);
  };

  return (
    <div ref={videoRef} className="w-full max-w-6xl mx-auto px-4 py-8">
      <Card className="overflow-hidden border-2 border-primary/20 rounded-xl shadow-2xl bg-gradient-to-br from-background to-background/80">
        <CardContent className="p-0">
          <div className="aspect-video w-full relative bg-muted/10">
            {/* 加载状态 */}
            {!shouldLoad && (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center z-20 backdrop-blur-sm">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground font-medium">Loading Disney Solitaire Demo...</p>
                  <p className="text-muted-foreground/70 text-sm mt-1">Experience the magic of Disney cards</p>
                </div>
              </div>
            )}

            {/* 错误状态 - 最终备用方案 */}
            {error && (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center z-20 backdrop-blur-sm">
                <div className="text-center max-w-lg mx-auto p-8">
                  <div className="mb-6">
                    <img
                      src="/imgs/disney/Image-01.jpg"
                      alt="Disney Solitaire Game"
                      className="w-full max-w-md mx-auto rounded-lg shadow-lg object-cover"
                      style={{ maxHeight: '300px' }}
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Disney Solitaire
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Experience the magic of Disney in this enchanting solitaire card game!
                    Play with beautifully designed cards featuring your favorite Disney characters.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={handleRetry} variant="default">
                      Try Loading Video Again
                    </Button>
                    <Button variant="outline" onClick={() => window.open('https://www.superplay.co/games/disney-solitaire', '_blank')}>
                      Play Game Now
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Video loading issue detected. You can still enjoy the game!
                  </p>
                </div>
              </div>
            )}

            {/* 视频内容 */}
            {shouldLoad && !error && (
              <div className="relative w-full h-full">
                {isDirectFile ? (
                  <video
                    className="w-full h-full object-cover transition-all duration-500 rounded-xl"
                    style={{
                      opacity: isLoaded ? 1 : 0,
                      transform: isLoaded ? 'scale(1)' : 'scale(0.95)'
                    }}
                    src={currentVideoUrl}
                    controls
                    playsInline
                    autoPlay={false}
                    muted={false}
                    onLoadedData={handleLoad}
                    onError={handleError}
                    preload="metadata"
                  >
                    <source src={currentVideoUrl} type="video/mp4" />
                    <source src={currentVideoUrl.replace('.mp4', '.webm')} type="video/webm" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <iframe
                    className="w-full h-full transition-all duration-500 rounded-xl"
                    style={{
                      opacity: isLoaded ? 1 : 0,
                      transform: isLoaded ? 'scale(1)' : 'scale(0.95)'
                    }}
                    src={currentVideoUrl}
                    title="Disney Solitaire - Magical Card Game Gameplay"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    onLoad={handleLoad}
                    onError={handleError}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  />
                )}

                {/* 加载指示器 */}
                {!isLoaded && shouldLoad && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
                    <div className="text-center">
                      <div className="animate-pulse">
                        <div className="w-3 h-3 bg-primary rounded-full mx-auto mb-2"></div>
                      </div>
                      <p className="text-xs text-muted-foreground">Loading video...</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 视频覆盖层信息 */}
            {isLoaded && !error && (
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm">
                  <p className="font-medium">Disney Solitaire</p>
                  <p className="text-xs opacity-80">Experience the enchanting world of Disney cards</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
