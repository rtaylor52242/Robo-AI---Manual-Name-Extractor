
import React, { useState, useEffect, useRef } from 'react';
import { PlayIcon, PauseIcon, StepBackwardIcon, StepForwardIcon } from './icons';

interface VideoPlayerProps {
  videoSrc: string | null;
  videoRef: React.RefObject<HTMLVideoElement>;
}

const formatTime = (time: number) => {
  if (isNaN(time)) return '00:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoSrc, videoRef }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    
    // load new src
    if (videoSrc) {
        video.load();
    }

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [videoRef, videoSrc]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = Number(e.target.value);
    }
  };

  const handlePlaybackRateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const rate = Number(e.target.value);
    setPlaybackRate(rate);
    const video = videoRef.current;
    if (video) {
      video.playbackRate = rate;
    }
  };
  
  const stepFrame = (direction: 'forward' | 'backward') => {
    const video = videoRef.current;
    if (!video) return;
    const frameTime = 1 / 30; // Assuming 30fps
    video.currentTime += direction === 'forward' ? frameTime : -frameTime;
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col gap-4">
      <div className="bg-black aspect-video rounded-md overflow-hidden flex items-center justify-center">
        {videoSrc ? (
          <video ref={videoRef} className="w-full h-full object-contain">
            <source src={videoSrc} />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="text-gray-500">Upload a video to begin</div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <button onClick={() => stepFrame('backward')} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors disabled:opacity-50" disabled={!videoSrc}>
            <StepBackwardIcon className="w-6 h-6"/>
        </button>
        <button onClick={togglePlayPause} className="p-3 rounded-full bg-cyan-600 hover:bg-cyan-500 transition-colors text-white disabled:opacity-50" disabled={!videoSrc}>
          {isPlaying ? <PauseIcon className="w-8 h-8"/> : <PlayIcon className="w-8 h-8"/>}
        </button>
        <button onClick={() => stepFrame('forward')} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors disabled:opacity-50" disabled={!videoSrc}>
            <StepForwardIcon className="w-6 h-6"/>
        </button>
        <select
          value={playbackRate}
          onChange={handlePlaybackRateChange}
          className="ml-auto bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 p-2"
          disabled={!videoSrc}
        >
          <option value="0.25">0.25x</option>
          <option value="0.5">0.5x</option>
          <option value="0.75">0.75x</option>
          <option value="1">1x</option>
          <option value="1.5">1.5x</option>
          <option value="2">2x</option>
        </select>
      </div>
    </div>
  );
};

export default VideoPlayer;
