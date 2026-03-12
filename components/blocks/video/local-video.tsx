'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function LocalVideo() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Disney game screenshots for slideshow
  const gameImages = [
    '/imgs/disney/Image-01.jpg',
    '/imgs/disney/Image-02.jpg',
    '/imgs/disney/Image-03.jpg',
    '/imgs/disney/Image-04.jpg',
    '/imgs/disney/Image-05.jpg'
  ];

  // Auto-start slideshow when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsPlaying(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Slideshow interval for automatic progression
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % gameImages.length);
    }, 2500); // Change slide every 2.5 seconds for smoother experience

    return () => clearInterval(interval);
  }, [isPlaying, gameImages.length]);

  // Handle video events
  const handleVideoLoad = () => {
    console.log('Local video loaded successfully');
    setShowVideo(true);
    setIsLoading(false);
  };

  const handleVideoError = () => {
    console.log('Local video not available, using slideshow');
    setShowVideo(false);
    setIsLoading(false);
  };

  const togglePlayPause = () => {
    if (showVideo && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {
          console.log('Video play failed, continuing with slideshow');
        });
      }
    }
    setIsPlaying(!isPlaying);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsPlaying(false);
  };

  return (
    <div className="w-full px-4 py-8 bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
            Disney Solitaire Gameplay
          </h2>
          <p className="text-lg text-black max-w-2xl mx-auto">
            Experience the magical card-matching adventure with your favorite Disney characters!
          </p>
        </div>

        {/* Main Video/Slideshow Container */}
        <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
          {/* Local Video Element */}
          <video
            ref={videoRef}
            className="w-full aspect-video object-cover"
            poster="/imgs/disney/Image-01.jpg"
            onLoadStart={handleVideoLoad}
            onError={handleVideoError}
            controls
            playsInline
            muted
            loop
            preload="metadata"
          >
            <source src="/videos/disney-solitaire-demo.mp4" type="video/mp4" />
            <source src="/videos/disney-solitaire-demo.webm" type="video/webm" />
            {/* Fallback content */}
            Your browser does not support the video tag.
          </video>

          {/* Image Slideshow (shown when video not available) */}
          {!showVideo && !isLoading && (
            <div className="absolute inset-0">
              {gameImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Disney Solitaire Gameplay ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  loading="lazy"
                />
              ))}

              {/* Animated Play Button Overlay */}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <button
                  onClick={togglePlayPause}
                  className="bg-white/90 hover:bg-white text-blue-600 p-6 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-110 hover:rotate-6"
                  aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                >
                  {isPlaying ? (
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Slide Indicators */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
                {gameImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                        ? 'bg-white w-8 shadow-lg'
                        : 'bg-white/60 hover:bg-white/80'
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                <div
                  className="h-full bg-blue-500 transition-all duration-1000"
                  style={{
                    width: `${((currentSlide + 1) / gameImages.length) * 100}%`
                  }}
                />
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-lg font-medium">Loading Disney Magic...</p>
              </div>
            </div>
          )}

          {/* Video/Slideshow Info Badge */}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
            {showVideo ? '🎬 Video' : '🖼️ Gallery'} {gameImages.length} Screenshots
          </div>

          {/* Game Title Overlay */}
          {!showVideo && !isLoading && (
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
              <h3 className="font-bold text-lg">Disney Solitaire</h3>
              <p className="text-sm opacity-90">Screenshot {currentSlide + 1} of {gameImages.length}</p>
            </div>
          )}
        </div>

        {/* Game Controls */}
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <button
            onClick={togglePlayPause}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {isPlaying ? (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Pause Gallery
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Play Gallery
              </>
            )}
          </button>

          {!showVideo && (
            <div className="flex items-center gap-2 text-black">
              <span>Use dots below to navigate screenshots</span>
            </div>
          )}
        </div>

        {/* Game Features Grid */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-3">🏰</div>
            <h3 className="font-bold mb-2 text-lg text-black">Magical Themes</h3>
            <p className="text-black">Classic Disney locations and characters in every card</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-3">🎴</div>
            <h3 className="font-bold mb-2 text-lg text-black">Easy to Play</h3>
            <p className="text-black">Classic solitaire rules with a Disney twist</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-3">⭐</div>
            <h3 className="font-bold mb-2 text-lg text-black">Collect & Win</h3>
            <p className="text-black">Gather special cards and unlock magical rewards</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
          <h3 className="text-2xl font-bold mb-4">Ready to Start Your Adventure?</h3>
          <p className="text-lg mb-6 opacity-90">Join thousands of players in the most magical solitaire experience!</p>
          <button
            onClick={() => {
              window.location.href = 'https://www.superplay.co/games/disney-solitaire';
            }}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg shadow-xl transform transition-all duration-200 hover:scale-105"
          >
            🎮 Play Game Now
          </button>
        </div>

        {/* Additional Info */}
        {!showVideo && !isLoading && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm text-center">
              💡 <strong>Tip:</strong> This interactive gallery showcases gameplay screenshots.
              Click the play button to start the slideshow or use the dots to navigate manually.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
