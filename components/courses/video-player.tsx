"use client";

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useProgress } from '@/hooks/useProgress';
import { EntityType } from '@/types/progress';

interface VideoPlayerProps {
  url: string;
  lessonId: string;
  initialPosition?: number;
  onComplete?: () => void;
  trackProgress?: boolean;
  onProgressUpdate?: (position: number) => void;
}

export function VideoPlayer({ url, lessonId, initialPosition = 0, onComplete, trackProgress = true, onProgressUpdate }: VideoPlayerProps) {
  const { updateProgress } = useProgress();
  const [videoPosition, setVideoPosition] = useState(initialPosition);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const startTimeRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Set initial position when component mounts
  useEffect(() => {
    if (videoRef.current && initialPosition > 0) {
      videoRef.current.currentTime = initialPosition;
    }
  }, [initialPosition]);
  
  // Track time spent when video is playing
  useEffect(() => {
    if (isPlaying && trackProgress) {
      startTimeRef.current = Date.now();
      progressIntervalRef.current = setInterval(() => {
        setTimeSpent(prev => prev + 1);
        
        // Update progress every 30 seconds to avoid too many API calls
        if (timeSpent > 0 && timeSpent % 30 === 0) {
          updateVideoProgress();
        }
      }, 1000);
    } else if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      if (startTimeRef.current && trackProgress) {
        const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
        if (elapsedSeconds > 5) { // Only update if meaningful time has passed
          updateVideoProgress();
        }
      }
    }
    
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying]);

  const updateVideoPosition = async (position: number) => {
    try {
      setVideoPosition(position);
      if (trackProgress) {
        // Update position via useProgress hook
        if (onProgressUpdate) {
          onProgressUpdate(position);
        } else {
          await updateProgress({
            entityId: lessonId,
            entityType: EntityType.LESSON,
            lastPosition: position
          });
        }
      }
    } catch (error) {
      console.error('Error updating video position:', error);
    }
  };
  
  const updateVideoProgress = async () => {
    try {
      if (!trackProgress) return;
      
      // Get current video position
      const position = videoRef.current ? Math.floor(videoRef.current.currentTime) : videoPosition;
      
      // Update both position and time spent
      if (onProgressUpdate) {
        onProgressUpdate(position);
      } else {
        await updateProgress({
          entityId: lessonId,
          entityType: EntityType.LESSON,
          lastPosition: position,
          timeSpent: timeSpent
        });
      }
      
      // Reset start time reference
      startTimeRef.current = Date.now();
    } catch (error) {
      console.error('Error updating lesson progress:', error);
    }
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = Math.floor(videoRef.current.currentTime);
      // Only update every 10 seconds to avoid too many API calls
      if (currentTime % 10 === 0 && currentTime !== videoPosition) {
        updateVideoPosition(currentTime);
      }
    }
  };

  const handleVideoEnded = async () => {
    // Update final progress
    try {
      if (trackProgress) {
        await updateVideoProgress();
        
        // Mark as completed when video ends
        if (!onComplete) {
          await updateProgress({
            entityId: lessonId,
            entityType: EntityType.LESSON,
            isCompleted: true,
            lastPosition: videoRef.current ? Math.floor(videoRef.current.currentTime) : videoPosition,
            timeSpent: timeSpent
          });
          toast.success("Video completed and progress saved");
        }
      }
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error completing video:', error);
    }
  };
  
  const handlePlay = () => {
    setIsPlaying(true);
  };
  
  const handlePause = () => {
    setIsPlaying(false);
  };

  return (
    <div className="aspect-video bg-black rounded-md overflow-hidden">
      <video
        ref={videoRef}
        src={url}
        controls
        className="w-full h-full"
        onTimeUpdate={handleVideoTimeUpdate}
        onEnded={handleVideoEnded}
        onPlay={handlePlay}
        onPause={handlePause}
        autoPlay={false}
        preload="metadata"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
