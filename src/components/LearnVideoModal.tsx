import React, { useState, useRef, useEffect } from 'react';
import { X, Maximize2, Minimize2, Play, Pause, CheckCircle2, Circle, Clock, Award, RotateCcw, RotateCw, Volume2, VolumeX, Settings, MessageCircle, ThumbsUp, User, Maximize } from 'lucide-react';
import { Resizable } from 're-resizable';
import LucideGraduationCap from '../imports/LucideGraduationCap';
import LucidePictureInPicture from '../imports/LucidePictureInPicture';
import LucideMessageCircleQuestionMark from '../imports/LucideMessageCircleQuestionMark';
import image_e45e3ee4eba71949f29d76d45845399fdf3cc9ec from 'figma:asset/e45e3ee4eba71949f29d76d45845399fdf3cc9ec.png';

interface LearnVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  startTime: number;
  endTime: number;
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Question {
  id: string;
  user: string;
  avatar: string;
  time: string;
  timestamp: number;
  question: string;
  answer?: string;
  likes: number;
}

const courseSections: Section[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    lessons: [
      { id: '1', title: 'Welcome to Aces AI', duration: '00:40', startTime: 0, endTime: 40 },
      { id: '2', title: 'Dashboard Overview', duration: '00:50', startTime: 40, endTime: 90 },
      { id: '3', title: 'Navigation Basics', duration: '00:45', startTime: 90, endTime: 135 },
    ],
  },
  {
    id: 'whatsapp-setup',
    title: 'WhatsApp Integration',
    lessons: [
      { id: '4', title: 'Connecting Your Number', duration: '00:55', startTime: 135, endTime: 190 },
      { id: '5', title: 'Message Templates', duration: '00:50', startTime: 190, endTime: 240 },
      { id: '6', title: 'Auto-Reply Setup', duration: '00:45', startTime: 240, endTime: 285 },
    ],
  },
  {
    id: 'ai-configuration',
    title: 'AI Configuration',
    lessons: [
      { id: '7', title: 'Training Your AI', duration: '00:50', startTime: 285, endTime: 335 },
      { id: '8', title: 'Response Settings', duration: '00:45', startTime: 335, endTime: 380 },
      { id: '9', title: 'Tone & Personality', duration: '00:40', startTime: 380, endTime: 420 },
    ],
  },
  {
    id: 'business-settings',
    title: 'Business Settings',
    lessons: [
      { id: '10', title: 'Business Hours Setup', duration: '00:40', startTime: 420, endTime: 460 },
      { id: '11', title: 'Timezone Configuration', duration: '00:35', startTime: 460, endTime: 495 },
      { id: '12', title: 'Contact Information', duration: '00:40', startTime: 495, endTime: 535 },
    ],
  },
  {
    id: 'customer-management',
    title: 'Customer Management',
    lessons: [
      { id: '13', title: 'Customer Profiles', duration: '00:45', startTime: 535, endTime: 580 },
      { id: '14', title: 'Location Services', duration: '00:40', startTime: 580, endTime: 620 },
      { id: '15', title: 'Custom Tags', duration: '00:35', startTime: 620, endTime: 655 },
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics & Insights',
    lessons: [
      { id: '16', title: 'Performance Metrics', duration: '00:40', startTime: 655, endTime: 695 },
      { id: '17', title: 'Response Times', duration: '00:35', startTime: 695, endTime: 730 },
      { id: '18', title: 'Customer Insights', duration: '00:30', startTime: 730, endTime: 760 },
    ],
  },
  {
    id: 'advanced',
    title: 'Advanced Features',
    lessons: [
      { id: '19', title: 'API Integration', duration: '00:05', startTime: 760, endTime: 765 },
      { id: '20', title: 'Custom Workflows', duration: '00:05', startTime: 765, endTime: 770 },
      { id: '21', title: 'Team Management', duration: '00:10', startTime: 770, endTime: 780 },
    ],
  },
];

const mockQuestions: Question[] = [
  {
    id: '1',
    user: 'Sarah Johnson',
    avatar: 'SJ',
    time: '2 days ago',
    timestamp: 95,
    question: 'How do I access the advanced analytics dashboard?',
    answer: 'Great question! You can access it from the left sidebar under Analytics > Advanced.',
    likes: 12,
  },
  {
    id: '2',
    user: 'Mike Chen',
    avatar: 'MC',
    time: '1 week ago',
    timestamp: 210,
    question: 'Can I connect multiple WhatsApp numbers to one account?',
    answer: 'Yes, with a Pro plan you can connect up to 5 WhatsApp numbers.',
    likes: 8,
  },
  {
    id: '3',
    user: 'Emily Rodriguez',
    avatar: 'ER',
    time: '3 days ago',
    timestamp: 390,
    question: 'Is there a way to customize the AI response tone for different customer segments?',
    likes: 5,
  },
];

export const LearnVideoModal: React.FC<LearnVideoModalProps> = ({ isOpen, onClose }) => {
  const [isPoppedOut, setIsPoppedOut] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Find current lesson based on video time
  useEffect(() => {
    for (const section of courseSections) {
      for (const lesson of section.lessons) {
        if (currentTime >= lesson.startTime && currentTime < lesson.endTime) {
          if (currentLesson?.id !== lesson.id) {
            setCurrentLesson(lesson);
          }
          return;
        }
      }
    }
  }, [currentTime]);

  // Mark lesson as completed when watched
  useEffect(() => {
    if (currentLesson) {
      const watchedPercentage = ((currentTime - currentLesson.startTime) / (currentLesson.endTime - currentLesson.startTime)) * 100;
      if (watchedPercentage >= 90 && !completedLessons.has(currentLesson.id)) {
        setCompletedLessons(prev => new Set([...prev, currentLesson.id]));
      }
    }
  }, [currentTime, currentLesson]);

  useEffect(() => {
    if (!isOpen) {
      setIsPoppedOut(false);
      setPosition({ x: 100, y: 100 });
    }
  }, [isOpen]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isPoppedOut) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

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

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const jumpToLesson = (lesson: Lesson) => {
    if (videoRef.current) {
      videoRef.current.currentTime = lesson.startTime;
      videoRef.current.play();
    }
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 15, duration);
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 15, 0);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    
    try {
      if (!document.fullscreenElement) {
        // Request fullscreen on the video element itself
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen().catch(() => {
            // Silently fail if fullscreen is blocked by permissions policy
          });
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {
            // Silently fail
          });
        }
      }
    } catch (err) {
      // Silently fail if fullscreen is not supported or blocked
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && videoRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * duration;
    }
  };

  const jumpToTimestamp = (timestamp: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp;
      videoRef.current.play();
    }
  };

  const markLessonComplete = (lessonId: string) => {
    setCompletedLessons(prev => new Set([...prev, lessonId]));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalDuration = () => {
    let total = 0;
    courseSections.forEach(section => {
      section.lessons.forEach(lesson => {
        const [mins, secs] = lesson.duration.split(':').map(Number);
        total += mins * 60 + secs;
      });
    });
    return formatTime(total);
  };

  const getCompletionPercentage = () => {
    const totalLessons = courseSections.reduce((acc, section) => acc + section.lessons.length, 0);
    return Math.round((completedLessons.size / totalLessons) * 100);
  };

  const getAllLessons = () => {
    return courseSections.flatMap(section => section.lessons);
  };

  if (!isOpen) return null;

  const modalContent = (
    <Resizable
      defaultSize={{
        width: isPoppedOut ? 380 : 950,
        height: isPoppedOut ? 240 : 650,
      }}
      minWidth={isPoppedOut ? 320 : 950}
      minHeight={isPoppedOut ? 200 : 650}
      maxWidth={isPoppedOut ? 700 : 950}
      maxHeight={isPoppedOut ? 500 : 650}
      enable={isPoppedOut ? {
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      } : false}
      style={{
        position: 'fixed',
        top: isPoppedOut ? `${position.y}px` : '50%',
        left: isPoppedOut ? `${position.x}px` : '50%',
        transform: isPoppedOut ? 'none' : 'translate(-50%, -50%)',
        zIndex: 1000000,
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 20px 60px -10px rgba(0, 0, 0, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
      }}
      className="dark:bg-gray-900"
    >
      {/* Header */}
      <div 
        className={`bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 flex items-center justify-between ${isPoppedOut ? 'cursor-move' : ''}`}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <div className="w-4 h-4" style={{ '--stroke-0': 'white' } as React.CSSProperties}>
              <LucideGraduationCap />
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">
              Aces AI Training
            </h2>
            <p className="text-xs text-white/80">
              {getCompletionPercentage()}% Complete • {completedLessons.size}/{courseSections.reduce((acc, s) => acc + s.lessons.length, 0)} lessons
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsPoppedOut(!isPoppedOut)}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
            title={isPoppedOut ? 'Dock to center' : 'Picture-in-Picture'}
          >
            {isPoppedOut ? (
              <Maximize2 className="w-4 h-4 text-white" />
            ) : (
              <div className="w-4 h-4" style={{ '--stroke-0': 'white' } as React.CSSProperties}>
                <LucidePictureInPicture />
              </div>
            )}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Main Content - Split View */}
      <div className="flex flex-1 overflow-hidden bg-white dark:bg-gray-900">
        {/* Video Section */}
        <div className={`${isPoppedOut ? 'w-full' : 'w-[58%]'} flex flex-col bg-black`}>
          {/* Video Player with Overlay Controls */}
          <div ref={videoContainerRef} className={`${isPoppedOut ? 'flex-1' : 'h-[380px]'} relative group flex-shrink-0`}>
            <video
              ref={videoRef}
              controls={false}
              autoPlay
              className="w-full h-full object-contain"
              src="https://raw.githubusercontent.com/mxvrb/acesai-videos/d75af4b267d82f4dca80436aca54ba550cd5a4e5/1013.0-1142.0.mp4"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={handlePlay}
              onPause={handlePause}
              onClick={togglePlayPause}
            >
              Your browser does not support the video tag.
            </video>
            
            {/* Play/Pause Overlay */}
            {!isPlaying && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer z-10"
                onClick={togglePlayPause}
              >
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition-transform shadow-xl">
                  <Play className="w-8 h-8 text-gray-900 ml-1" />
                </div>
              </div>
            )}

            {/* Current Lesson Indicator */}
            {currentLesson && (
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-lg z-20">
                <div className="text-xs text-gray-400">Now Playing</div>
                <div className="text-sm font-medium text-white">{currentLesson.title}</div>
              </div>
            )}

            {/* Video Controls Overlay - Show on Hover */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 pb-4 pt-12">
              {/* Control Buttons - Above Progress Bar */}
              <div className="flex items-center justify-between px-4 mb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlayPause}
                    className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white" />
                    )}
                  </button>
                  
                  <button
                    onClick={skipBackward}
                    className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                    title="Rewind 15s"
                  >
                    <RotateCcw className="w-4 h-4 text-white" />
                  </button>
                  
                  <button
                    onClick={skipForward}
                    className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                    title="Forward 15s"
                  >
                    <RotateCw className="w-4 h-4 text-white" />
                  </button>

                  {/* Volume Control */}
                  <div className="flex items-center gap-2 ml-2">
                    <button
                      onClick={toggleMute}
                      className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-4 h-4 text-white" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-white" />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Playback Speed */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-white/20 transition-colors text-white text-xs"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      {playbackSpeed}x
                    </button>
                    
                    {showSpeedMenu && (
                      <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                          <button
                            key={speed}
                            onClick={() => {
                              setPlaybackSpeed(speed);
                              setShowSpeedMenu(false);
                            }}
                            className={`w-full px-4 py-2 text-xs text-left hover:bg-gray-700 transition-colors ${
                              playbackSpeed === speed ? 'bg-gray-700 text-blue-400' : 'text-white'
                            }`}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Fullscreen Button */}
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                    title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-4 h-4 text-white" />
                    ) : (
                      <Maximize className="w-4 h-4 text-white" />
                    )}
                  </button>
                </div>
              </div>

              {/* Progress Bar with Markers */}
              <div className="px-4">
                <div 
                  ref={progressRef}
                  className="h-2 bg-gray-700 rounded-full overflow-visible cursor-pointer relative mb-1"
                  onClick={handleProgressClick}
                >
                  {/* Lesson Markers */}
                  {getAllLessons().map((lesson) => {
                    const position = (lesson.startTime / duration) * 100;
                    return (
                      <div
                        key={lesson.id}
                        className="absolute top-0 w-0.5 h-2 bg-gray-500 hover:bg-blue-400 transition-colors group/marker"
                        style={{ left: `${position}%` }}
                        title={lesson.title}
                      >
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/marker:opacity-100 transition-opacity pointer-events-none">
                          {lesson.title}
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Progress */}
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-100 rounded-full relative"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-300">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Q&A Section - Hidden when popped out */}
          {!isPoppedOut && (
            <div className="bg-[#0f172a] border-t border-gray-700 flex-1 flex flex-col overflow-hidden">
              <div className="px-4 py-2 border-b border-gray-700/50 bg-[#0f172a] flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4" style={{ '--stroke-0': '#9ca3af' } as React.CSSProperties}>
                    <LucideMessageCircleQuestionMark />
                  </div>
                  <span className="text-xs font-semibold text-gray-300">Questions & Answers</span>
                  <span className="text-xs text-gray-500">({mockQuestions.length})</span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto divide-y divide-gray-700/50">
                {mockQuestions.map((q) => (
                  <div key={q.id} className="px-4 py-3 hover:bg-gray-800/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        {q.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-300">{q.user}</span>
                          <span className="text-[10px] text-gray-500">{q.time}</span>
                          <button
                            onClick={() => jumpToTimestamp(q.timestamp)}
                            className="text-[10px] text-blue-400 hover:text-blue-300 ml-auto"
                          >
                            {formatTime(q.timestamp)}
                          </button>
                        </div>
                        <p className="text-xs text-gray-200 mb-2">{q.question}</p>
                        {q.answer && (
                          <div className="bg-gray-800/50 rounded-lg px-3 py-2 mb-2">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
                                <img 
                                  src={image_e45e3ee4eba71949f29d76d45845399fdf3cc9ec} 
                                  alt="Aces AI" 
                                  className="w-full h-full object-cover"
                                  draggable={false}
                                />
                              </div>
                              <span className="text-[10px] font-medium text-gray-400">Aces AI Team</span>
                            </div>
                            <p className="text-xs text-gray-300">{q.answer}</p>
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <button className="flex items-center gap-1 text-gray-500 hover:text-blue-400 transition-colors">
                            <ThumbsUp className="w-3 h-3" />
                            <span className="text-[10px]">{q.likes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Course Curriculum Sidebar - Hidden when popped out */}
        {!isPoppedOut && (
          <div className="w-[42%] bg-[#1e293b] dark:bg-gray-900 flex flex-col border-l border-gray-700 dark:border-gray-800">
            {/* Progress Header */}
            <div className="p-4 border-b border-gray-700 dark:border-gray-800 bg-[#0f172a] dark:bg-gray-950">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-300 dark:text-gray-300">
                  Course Progress
                </span>
                <span className="text-xs font-bold text-blue-400 dark:text-blue-400">
                  {getCompletionPercentage()}%
                </span>
              </div>
              <div className="h-1.5 bg-gray-700 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 rounded-full"
                  style={{ width: `${getCompletionPercentage()}%` }}
                />
              </div>
            </div>

            {/* Lessons List */}
            <div className="flex-1 overflow-y-auto">
              {courseSections.map((section) => (
                <div key={section.id}>
                  {/* Section Header */}
                  <div className="px-4 py-2.5 bg-[#0f172a] dark:bg-gray-950 sticky top-0 border-b border-gray-700/50 dark:border-gray-800 z-10">
                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-400 uppercase tracking-wider">
                      {section.title}
                    </span>
                  </div>

                  {/* Lessons */}
                  {section.lessons.map((lesson) => {
                    const isCompleted = completedLessons.has(lesson.id);
                    const isCurrent = currentLesson?.id === lesson.id;

                    return (
                      <div
                        key={lesson.id}
                        className={`px-4 py-2.5 transition-all border-l-2 ${
                          isCurrent
                            ? 'bg-[#334155] dark:bg-blue-900/20 border-blue-500'
                            : 'bg-[#1e293b] dark:bg-gray-900 border-transparent hover:bg-[#2d3748] dark:hover:bg-gray-800'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          {/* Completion Icon */}
                          <div className="flex-shrink-0 mt-0.5 cursor-pointer" onClick={() => jumpToLesson(lesson)}>
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            ) : isCurrent ? (
                              <div className="w-4 h-4 rounded-full border-2 border-blue-500 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                              </div>
                            ) : (
                              <Circle className="w-4 h-4 text-gray-600 dark:text-gray-600" />
                            )}
                          </div>

                          {/* Lesson Info */}
                          <div className="flex-1 min-w-0">
                            <div 
                              className={`text-xs font-medium mb-0.5 cursor-pointer ${
                                isCurrent 
                                  ? 'text-white dark:text-white' 
                                  : 'text-gray-200 dark:text-gray-200'
                              }`}
                              onClick={() => jumpToLesson(lesson)}
                            >
                              {lesson.title}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-[10px] text-gray-400 dark:text-gray-500">
                                {lesson.duration}
                              </div>
                              {!isCompleted && (
                                <button
                                  onClick={() => markLessonComplete(lesson.id)}
                                  className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                  Mark as done
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Resizable>
  );

  return (
    <>
      {/* Backdrop - only show when not popped out */}
      {!isPoppedOut && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            zIndex: 999999,
          }}
          onClick={onClose}
        />
      )}

      {modalContent}
    </>
  );
};