'use client';

import React, { useState, useEffect } from 'react';

export default function ReliableVideo() {
  const [visibleVideo, setVisibleVideo] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const videoSources = [
    {
      type: 'youtube',
      src: 'https://www.youtube.com/embed/JfVOs4VSpmA',
      title: 'Disney Solitaire Demo - YouTube'
    },
    {
      type: 'youtube',
      src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      title: 'Backup Video - YouTube'
    },
    {
      type: 'image',
      src: '/imgs/disney/Image-01.jpg',
      title: 'Disney Solitaire Game'
    }
  ];

  useEffect(() => {
    // 尝试加载第一个视频
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleVideoError = () => {
    console.log(`Video ${visibleVideo} failed, trying next...`);
    if (visibleVideo < videoSources.length - 1) {
      setVisibleVideo(visibleVideo + 1);
    }
  };

  const currentVideo = videoSources[visibleVideo];

  if (currentVideo.type === 'image') {
    return (
      <div className="w-full px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Disney Solitaire</h2>
            <p className="text-lg text-gray-600">
              Experience the magic of Disney cards
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={currentVideo.src}
              alt={currentVideo.title}
              className="w-full object-cover"
              style={{ maxHeight: '500px' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
              <div className="p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Play Now</h3>
                <p className="mb-4">Join thousands of players!</p>
                <button
                  onClick={() => window.location.href = '/play'}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Start Playing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Watch Disney Solitaire</h2>
          <p className="text-lg text-gray-600">
            Experience the magic of Disney cards
          </p>
        </div>

        <div className="relative">
          {/* Loading state */}
          {!isLoaded && (
            <div className="aspect-video bg-gray-100 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Loading video...</p>
              </div>
            </div>
          )}

          {/* Video iframe */}
          <iframe
            src={currentVideo.src}
            title={currentVideo.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={`w-full aspect-video rounded-2xl shadow-2xl transition-opacity duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsLoaded(true)}
            onError={handleVideoError}
            style={{ border: 'none' }}
          />

          {/* Video info overlay */}
          {isLoaded && (
            <div className="mt-4 text-center text-sm text-gray-500">
              {currentVideo.title}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}