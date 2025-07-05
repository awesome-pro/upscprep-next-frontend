'use client';

import { useState, useEffect, useRef } from 'react';
import { CourseLesson } from '@/types/course';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Video, FileQuestion, Clock, CheckCircle } from 'lucide-react';
import { VideoPlayer } from './video-player';
import { FileViewer } from './file-viewer';
import { toast } from 'sonner';
import { useProgress } from '@/hooks/useProgress';
import { EntityType } from '@/types/progress';

interface LessonDetailProps {
  lesson: CourseLesson;
  moduleId: string;
  courseId: string;
  nextLessonId?: string;
  prevLessonId?: string;
}

export function LessonDetail({
  lesson,
  moduleId,
  courseId,
  nextLessonId,
  prevLessonId,
}: LessonDetailProps) {
  const { updateProgress, getProgress } = useProgress();
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [lastPosition, setLastPosition] = useState(0);
  const [isActive, setIsActive] = useState(true);
  
  // Refs for tracking time spent
  const startTimeRef = useRef<number>(Date.now());
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load initial progress data
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const progressData = await getProgress(lesson.id, EntityType.LESSON);
        if (progressData) {
          setIsCompleted(progressData.isCompleted);
          setTimeSpent(progressData.timeSpent || 0);
          setLastPosition(progressData.lastPosition || 0);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
        setLoading(false);
      }
    };
    
    fetchProgress();
  }, [lesson.id]);

  // Set up time tracking
  useEffect(() => {
    // Start tracking time spent
    startTimeTracking();
    
    // Set up activity listeners
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);
    window.addEventListener('click', handleUserActivity);
    
    // Clean up
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
      updateTimeSpent();
      
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
    };
  }, []);

  const startTimeTracking = () => {
    startTimeRef.current = Date.now();
    
    // Update time spent every 30 seconds
    progressIntervalRef.current = setInterval(() => {
      if (isActive) {
        setTimeSpent(prev => prev + 30);
        updateTimeSpent();
      }
    }, 30000); // 30 seconds
    
    // Set inactivity timeout (2 minutes)
    resetInactivityTimeout();
  };
  
  const handleUserActivity = () => {
    if (!isActive) {
      setIsActive(true);
      startTimeRef.current = Date.now();
    }
    resetInactivityTimeout();
  };
  
  const resetInactivityTimeout = () => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }
    
    inactivityTimeoutRef.current = setTimeout(() => {
      setIsActive(false);
    }, 120000); // 2 minutes of inactivity
  };
  
  const updateTimeSpent = async () => {
    try {
      await updateProgress({
        entityId: lesson.id,
        entityType: EntityType.LESSON,
        timeSpent: timeSpent,
        lastPosition: lastPosition
      });
    } catch (error) {
      console.error('Error updating time spent:', error);
    }
  };
  
  const markAsCompleted = async () => {
    try {
      await updateProgress({
        entityId: lesson.id,
        entityType: EntityType.LESSON,
        isCompleted: true,
        timeSpent: timeSpent,
        lastPosition: lastPosition
      });
      setIsCompleted(true);
      toast.success('Lesson marked as completed!');
    } catch (error) {
      console.error('Error marking lesson as completed:', error);
      toast.error('Failed to mark lesson as completed');
    }
  };
  
 
  return (
    <div className="space-y-6">
      <div className="mt-6 space-y-8">
        {/* Text Content Section */}
        {lesson.textContent && (
          <Card>
            <CardContent className="p-6">
              <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: lesson.textContent }} />
                <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                {Math.floor(timeSpent / 60)} min {timeSpent % 60} sec
              </div>
              <Button
                onClick={markAsCompleted}
                disabled={isCompleted}
                variant={isCompleted ? "outline" : "default"}
                className={isCompleted ? "bg-green-50" : ""}
              >
                {isCompleted ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-4 w-4" /> Completed
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" /> Mark as Completed
                  </span>
                )}
              </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Video Content Section */}
        {lesson.videoUrls && lesson.videoUrls.length > 0 && (
          <div className="space-y-4">
            
            <h2 className="text-xl font-semibold flex items-center">
              <Video className="h-5 w-5 mr-2" />
              Video Content
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {lesson.videoUrls.map((url, index) => (
                <div key={`video-${index}`}>
                  {index > 0 && <h3 className="text-lg font-medium mb-2">Video {index + 1}</h3>}
                  <VideoPlayer 
                    url={url} 
                    lessonId={lesson.id} 
                    initialPosition={index === 0 ? lastPosition : 0}
                    onComplete={index === 0 ? markAsCompleted : undefined}
                    onProgressUpdate={(position: number) => {
                      setLastPosition(position);
                      updateProgress({
                        entityId: lesson.id,
                        entityType: EntityType.LESSON,
                        lastPosition: position,
                        timeSpent: timeSpent
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* File Content Section */}
        {lesson.fileUrls && lesson.fileUrls.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Documents & Files
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {lesson.fileUrls.map((url, index) => (
                <FileViewer 
                  key={`file-${index}`} 
                  url={url} 
                  index={index} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Quiz Content Section */}
        {lesson.quizData && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <FileQuestion className="h-5 w-5 mr-2" />
              Quiz
            </h2>
            <Card>
              <CardContent className="p-6">
                <div>
                  <p>Quiz content will be implemented here</p>
                  <Button onClick={markAsCompleted} className="mt-4">
                    Submit Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* No Content Message */}
        {!lesson.textContent && 
         (!lesson.videoUrls || lesson.videoUrls.length === 0) && 
         (!lesson.fileUrls || lesson.fileUrls.length === 0) && 
         (!lesson.quizData || lesson.quizData.length === 0) && 
         (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No content available for this lesson.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
