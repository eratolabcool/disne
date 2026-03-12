'use client';

import React, { useState, useRef, useEffect } from 'react';

export default function SimpleVideo() {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 检查容器是否在视口中
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // 当容器进入视口时，我们就可以认为它应该被看到
          console.log('Video container is visible');
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="relative">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Experience Disney Solitaire</h2>
          <p className="text-lg text-muted-foreground">
            Watch the magic unfold with our enchanting card game
          </p>
        </div>

        {/* 视频容器 */}
        <div className="relative w-full aspect-video bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl overflow-hidden shadow-2xl border border-gray-200">

          {/* YouTube iframe */}
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/JfVOs4VSpmA" // Rick Astley - Never Gonna Give You Up
            title="Disney Solitaire Gameplay Demo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => {
              console.log('Video iframe loaded');
              setIsLoaded(true);
            }}
            onError={(e) => {
              console.error('Video iframe error:', e);
              setHasError(true);
            }}
            style={{
              border: 'none',
              borderRadius: '1rem'
            }}
          />

          {/* 加载状态 */}
          {!isLoaded && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-700 font-medium">Loading Disney Magic...</p>
              </div>
            </div>
          )}

          {/* 错误状态 */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
              <div className="text-center p-8 max-w-md">
                <div className="mb-6">
                  <img
                    src="/imgs/disney/Image-01.jpg"
                    alt="Disney Solitaire Game"
                    className="w-full rounded-lg shadow-lg object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">Disney Solitaire</h3>
                <p className="text-gray-600 mb-6">
                  Experience the magic of Disney in this enchanting solitaire card game!
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Play Game Now
                </button>
                <p className="text-xs text-gray-500 mt-4">
                  Video temporarily unavailable
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 底部信息 */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Join thousands of players enjoying Disney Solitaire worldwide
          </p>
        </div>
      </div>
    </div>
  );
}