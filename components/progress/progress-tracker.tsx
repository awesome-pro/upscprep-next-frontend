'use client';

import React, { useEffect, useState } from 'react';
import { useProgress } from '@/hooks/useProgress';
import { useStreak } from '@/hooks/useStreak';
import { EntityType } from '@/types/progress';

interface ProgressTrackerProps {
  entityId: string;
  entityType: EntityType;
  onProgressUpdate?: (progress: any) => void;
  autoTrackTimeSpent?: boolean;
  children?: React.ReactNode;
}

/**
 * ProgressTracker - A component that automatically tracks user progress
 * for a specific entity (lesson, exam, etc.)
 */
export function ProgressTracker({
  entityId,
  entityType,
  onProgressUpdate,
  autoTrackTimeSpent = true,
  children,
}: ProgressTrackerProps) {
  const { updateProgress } = useProgress();
  const { updateStreak } = useStreak();
  const [startTime] = useState<number>(Date.now());
  const [lastSyncTime, setLastSyncTime] = useState<number>(Date.now());
  const [isActive, setIsActive] = useState<boolean>(true);

  // Track when the component is mounted/unmounted to calculate time spent
  useEffect(() => {
    // Record the visit when component mounts
    const recordVisit = async () => {
      await updateProgress({
        entityId,
        entityType,
        // No timeSpent yet, just recording the visit
      });
    };

    recordVisit();

    // Set up interval to sync progress every 30 seconds while active
    let syncInterval: NodeJS.Timeout | null = null;
    
    if (autoTrackTimeSpent) {
      syncInterval = setInterval(() => {
        if (isActive) {
          const now = Date.now();
          const timeSpentSinceLastSync = Math.floor((now - lastSyncTime) / 1000);
          
          if (timeSpentSinceLastSync > 5) { // Only sync if more than 5 seconds passed
            updateProgress({
              entityId,
              entityType,
              timeSpent: timeSpentSinceLastSync,
            }).then((result) => {
              if (onProgressUpdate) {
                onProgressUpdate(result);
              }
            });
            
            // Update streak data based on entity type
            updateStreakData(entityType, timeSpentSinceLastSync);
            
            setLastSyncTime(now);
          }
        }
      }, 30000); // Sync every 30 seconds
    }

    // Track visibility changes to pause tracking when tab is not visible
    const handleVisibilityChange = () => {
      setIsActive(!document.hidden);
      
      if (!document.hidden) {
        // User returned to the tab, update last sync time
        setLastSyncTime(Date.now());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      if (syncInterval) {
        clearInterval(syncInterval);
      }
      
      // Calculate final time spent when component unmounts
      if (autoTrackTimeSpent) {
        const totalTimeSpent = Math.floor((Date.now() - startTime) / 1000);
        const timeSpentSinceLastSync = Math.floor((Date.now() - lastSyncTime) / 1000);
        
        if (timeSpentSinceLastSync > 1) { // Only sync if more than 1 second passed
          updateProgress({
            entityId,
            entityType,
            timeSpent: timeSpentSinceLastSync,
          });
          
          // Update streak data based on entity type
          updateStreakData(entityType, timeSpentSinceLastSync);
        }
      }
    };
  }, [entityId, entityType, autoTrackTimeSpent, startTime, lastSyncTime, isActive]);

  // Update streak data based on entity type
  const updateStreakData = async (entityType: EntityType, timeSpent: number) => {
    const streakData: any = {};
    
    // Add study minutes for all entity types
    if (timeSpent > 0) {
      streakData.studyMinutes = Math.ceil(timeSpent / 60); // Convert seconds to minutes
    }
    
    // Add specific metrics based on entity type
    switch (entityType) {
      case EntityType.LESSON:
        // We'll count lesson completion in the markAsCompleted function
        break;
      case EntityType.EXAM:
      case EntityType.ATTEMPT:
        // We'll count test attempts in the exam submission function
        break;
      default:
        break;
    }
    
    // Only update streak if we have data to update
    if (Object.keys(streakData).length > 0) {
      await updateStreak(streakData);
    }
  };

  // Function to mark entity as completed
  const markAsCompleted = async (metadata?: Record<string, any>) => {
    const result = await updateProgress({
      entityId,
      entityType,
      isCompleted: true,
      metadata,
    });
    
    // Update streak data for completion
    const streakData: any = {};
    
    if (entityType === EntityType.LESSON) {
      streakData.lessonsCompleted = 1;
    } else if (entityType === EntityType.EXAM || entityType === EntityType.ATTEMPT) {
      streakData.testsAttempted = 1;
    }
    
    if (Object.keys(streakData).length > 0) {
      await updateStreak(streakData);
    }
    
    if (onProgressUpdate) {
      onProgressUpdate(result);
    }
    
    return result;
  };

  // Function to update last position (for videos)
  const updatePosition = async (position: number) => {
    const result = await updateProgress({
      entityId,
      entityType,
      lastPosition: position,
    });
    
    if (onProgressUpdate) {
      onProgressUpdate(result);
    }
    
    return result;
  };

  // Function to update score or accuracy
  const updateScore = async (score: number, accuracy?: number) => {
    const result = await updateProgress({
      entityId,
      entityType,
      score,
      accuracy,
    });
    
    // Update streak for questions answered
    if (entityType === EntityType.EXAM || entityType === EntityType.ATTEMPT) {
      await updateStreak({
        questionsAnswered: 1,
        pointsEarned: Math.round(score),
      });
    }
    
    if (onProgressUpdate) {
      onProgressUpdate(result);
    }
    
    return result;
  };

  // Function to update metadata
  const updateMetadata = async (metadata: Record<string, any>) => {
    const result = await updateProgress({
      entityId,
      entityType,
      metadata,
    });
    
    if (onProgressUpdate) {
      onProgressUpdate(result);
    }
    
    return result;
  };

  return (
    <>
      {children}
    </>
  );
}

// Higher-order component to wrap any component with progress tracking
export function withProgressTracking<P extends object>(Component: React.ComponentType<P>) {
  return function ProgressTrackedComponent(props: P & ProgressTrackerProps) {
    const { entityId, entityType, onProgressUpdate, autoTrackTimeSpent, ...componentProps } = props;
    
    return (
      <ProgressTracker
        entityId={entityId}
        entityType={entityType}
        onProgressUpdate={onProgressUpdate}
        autoTrackTimeSpent={autoTrackTimeSpent}
      >
        <Component {...componentProps as P} />
      </ProgressTracker>
    );
  };
}
