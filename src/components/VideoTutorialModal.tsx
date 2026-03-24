import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface VideoTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  title?: string;
  videoType?: 'mp4' | 'youtube' | 'vimeo' | 'auto';
}

export const VideoTutorialModal: React.FC<VideoTutorialModalProps> = ({
  isOpen,
  onClose,
  videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  title = 'Getting Started with Aces AI',
  videoType = 'auto'
}) => {
  console.log('🎬 VideoTutorialModal RENDER - isOpen:', isOpen);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Auto-detect video type
  const detectVideoType = (): 'mp4' | 'iframe' => {
    if (videoType !== 'auto') {
      return videoType === 'mp4' ? 'mp4' : 'iframe';
    }
    
    if (videoUrl.endsWith('.mp4') || videoUrl.endsWith('.webm') || videoUrl.includes('figma:asset')) {
      return 'mp4';
    }
    return 'iframe';
  };

  const actualVideoType = detectVideoType();

  // Stop video when modal closes
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isOpen]);

  // Video control functions
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      videoRef.current.currentTime = percentage * duration;
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) {
    console.log('🎬 Modal not open, returning null');
    return null;
  }

  console.log('🎬 Modal IS OPEN, rendering content');

  const modalContent = (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 99999998
        }}
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90vw',
          maxWidth: '896px',
          zIndex: 99999999,
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Video Container */}
        <div className="relative w-full bg-black" style={{ paddingBottom: '56.25%' }}>
          {actualVideoType === 'iframe' ? (
            <iframe
              src={videoUrl}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: 'none' }}
            />
          ) : (
            <div className="absolute inset-0 w-full h-full group">
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                onClick={togglePlay}
                style={{
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                }}
                onContextMenu={(e) => e.preventDefault()}
              />

              {/* Custom Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Progress Bar */}
                <div
                  className="w-full h-1 bg-gray-600 rounded-full mb-3 cursor-pointer"
                  onClick={handleProgressClick}
                >
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Play/Pause */}
                    <button
                      onClick={togglePlay}
                      className="text-white hover:text-blue-400 transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6" />
                      )}
                    </button>

                    {/* Volume */}
                    <button
                      onClick={toggleMute}
                      className="text-white hover:text-blue-400 transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>

                    {/* Time Display */}
                    <span className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  {/* Fullscreen */}
                  <button
                    onClick={handleFullscreen}
                    className="text-white hover:text-blue-400 transition-colors"
                  >
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  // Render in portal to ensure it's at the top of the DOM
  console.log('🎬 Creating portal to document.body');
  return typeof window !== 'undefined' ? createPortal(modalContent, document.body) : null;
};
