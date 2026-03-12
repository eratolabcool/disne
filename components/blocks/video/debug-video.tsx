'use client';

import React, { useState, useEffect } from 'react';

export default function DebugVideo() {
  const [visibleVideo, setVisibleVideo] = useState(0);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

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
    console.log('DebugVideo component mounted');
    console.log('Available video sources:', videoSources);

    // 简单的加载状态
    const timer = setTimeout(() => {
      setStatus('loaded');
    }, 2000);

    return () => {
      clearTimeout(timer);
      console.log('DebugVideo component unmounted');
    };
  }, []);

  const handleVideoLoad = () => {
    console.log('Video loaded successfully');
    setStatus('loaded');
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLIFrameElement, Event>) => {
    console.error(`Video ${visibleVideo} failed:`, e);
    setError(`Failed to load video: ${e}`);

    if (visibleVideo < videoSources.length - 1) {
      setVisibleVideo(visibleVideo + 1);
    }
  };

  const currentVideo = videoSources[visibleVideo];

  return (
    <div className="w-full px-4 py-8 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* 调试信息 */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-bold mb-2">Debug Info:</h3>
          <ul className="text-sm space-y-1">
            <li>Current video index: {visibleVideo}</li>
            <li>Status: {status}</li>
            <li>Error: {error || 'None'}</li>
            <li>Total sources: {videoSources.length}</li>
            <li>Current type: {currentVideo.type}</li>
            <li>Current src: {currentVideo.src}</li>
          </ul>
        </div>

        {/* 视频标题 */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Disney Solitaire</h2>
          <p className="text-lg text-gray-600">
            Watch the magic happen!
          </p>
        </div>

        {/* 视频/图片显示 */}
        <div className="relative">
          {currentVideo.type === 'image' ? (
            <div>
              <img
                src={currentVideo.src}
                alt={currentVideo.title}
                className="w-full rounded-lg shadow-md"
                onLoad={() => setStatus('loaded')}
              />
              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    window.location.href = '/play';
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                  Play Game
                </button>
              </div>
            </div>
          ) : (
            <div className="relative" style={{ paddingBottom: '56.25%' }}>
              {status === 'loading' && (
                <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Loading video...</p>
                  </div>
                </div>
              )}

              <iframe
                src={currentVideo.src}
                title={currentVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className={`absolute top-0 left-0 w-full h-full rounded-lg transition-opacity duration-500 ${
                  status === 'loaded' ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={handleVideoLoad}
                onError={handleVideoError}
              />
            </div>
          )}

          {/* 错误显示 */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
              <p className="text-red-600 text-sm">{error}</p>
              <button
                onClick={() => {
                  setVisibleVideo(0);
                  setError('');
                  setStatus('loading');
                }}
                className="mt-2 text-blue-600 underline text-sm"
              >
                Retry
              </button>
            </div>
          )}
        </div>

        {/* 手动测试按钮 */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              console.log('Manual video test');
              alert('Video component is working! Check console for details.');
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
          >
            Test Video Component
          </button>
        </div>
      </div>
    </div>
  );
}