'use client';

import React, { useEffect, useState } from 'react';
import { useProgress } from '@/hooks/useProgress';
import { useStreak } from '@/hooks/useStreak';
import { EntityType, UserProgress } from '@/types/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, BarChart2, Calendar, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';

interface LessonProgressProps {
  lessonId: string;
  lessonTitle?: string;
  onProgressUpdate?: (progress: UserProgress) => void;
  showDetailedStats?: boolean;
}

export function LessonProgress({ lessonId, lessonTitle, onProgressUpdate, showDetailedStats = false }: LessonProgressProps) {
  const { getProgress, updateProgress } = useProgress();
  const { updateStreak } = useStreak();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true);
      const data = await getProgress(lessonId, EntityType.LESSON);
      setProgress(data);
      setLoading(false);
    };

    fetchProgress();
  }, [lessonId]);

  const handleMarkComplete = async () => {
    if (progress?.isCompleted) return;

    const updatedProgress = await updateProgress({
      entityId: lessonId,
      entityType: EntityType.LESSON,
      isCompleted: true,
    });

    // Update streak for lesson completion
    await updateStreak({
      lessonsCompleted: 1,
    });

    setProgress(updatedProgress);
    if (onProgressUpdate) {
      onProgressUpdate(updatedProgress);
    }
  };

  // Format time spent in hours and minutes
  const formatTimeSpent = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} min`;
  };
  
  // Calculate engagement score based on various metrics
  const calculateEngagementScore = () => {
    if (!progress) return 0;
    
    // Base score from time spent (1 point per minute, max 10)
    const timeScore = Math.min(10, Math.floor(progress.timeSpent / 60));
    
    // Visit count score (1 point per visit, max 5)
    const visitScore = Math.min(5, progress.visitCount || 0);
    
    // Completion bonus
    const completionScore = progress.isCompleted ? 10 : 0;
    
    // Calculate total score out of 25 possible points
    const totalScore = timeScore + visitScore + completionScore;
    
    // Convert to percentage
    return Math.round((totalScore / 25) * 100);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2 cursor-help">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {loading ? 'Loading...' : formatTimeSpent(progress?.timeSpent || 0)}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Total time spent on this lesson</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {!loading && progress && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-1 cursor-help">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {progress.lastAccessedAt ? format(new Date(progress.lastAccessedAt), 'MMM d') : 'Never'}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Last accessed on {progress.lastAccessedAt ? format(new Date(progress.lastAccessedAt), 'MMMM d, yyyy') : 'Never'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {showDetailedStats && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowStats(!showStats)}
              className="flex items-center"
            >
              <BarChart2 className="h-4 w-4" />
              <span className="sr-only">Toggle Stats</span>
            </Button>
          )}
          
          <Button
            variant={progress?.isCompleted ? 'outline' : 'default'}
            size="sm"
            onClick={handleMarkComplete}
            disabled={loading || progress?.isCompleted}
            className="flex items-center space-x-1"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            {progress?.isCompleted ? 'Completed' : 'Mark as Complete'}
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span>
            {progress?.isCompleted ? '100%' : 
              progress ? `${Math.min(99, Math.round((progress.timeSpent / 300) * 100))}%` : '0%'}
          </span>
        </div>
        <Progress 
          value={progress?.isCompleted ? 100 : 
            (progress?.timeSpent ? Math.min(99, Math.round((progress.timeSpent / 300) * 100)) : 0)} 
        />
      </div>
      
      {showDetailedStats && showStats && progress && (
        <Card className="mt-4">
          <CardContent className="pt-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium flex items-center">
                <Award className="h-4 w-4 mr-2" />
                Engagement Analytics
              </h4>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Visit count</p>
                  <p className="font-medium">{progress.visitCount || 0} visits</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Engagement score</p>
                  <p className="font-medium">{calculateEngagementScore()}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">First accessed</p>
                  <p className="font-medium">
                    {progress.createdAt ? format(new Date(progress.createdAt), 'MMM d, yyyy') : 'Never'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Completion status</p>
                  <p className="font-medium">{progress.isCompleted ? 'Completed' : 'In progress'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
