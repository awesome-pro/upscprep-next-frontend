'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, AlertCircle, AlertTriangle, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { AttemptStatus } from '@/types/exams';
import { useExamAttempt } from '@/hooks/useExamAttempt';
import { useProgress } from '@/hooks/useProgress';
import { useStreak } from '@/hooks/useStreak';
import { EntityType } from '@/types/progress';

// Custom loader component
const Loader = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClass = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  }[size];
  
  return (
    <div className={`animate-spin rounded-full border-2 border-primary border-t-transparent ${sizeClass}`}></div>
  );
};

// Format time function (converts seconds to MM:SS format)
const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  const format = (num: number) => num.toString().padStart(2, '0');
  
  if (hours > 0) {
    return `${format(hours)}:${format(minutes)}:${format(seconds)}`;
  }
  
  return `${format(minutes)}:${format(seconds)}`;
};

export default function AttemptLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;
  const attemptId = params.attemptId as string;
  const questionId = params.questionId as string;
  
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { attempt, answers, loading, error, loadAttempt, submitAttempt, updateTimeSpent } = useExamAttempt({ examId, attemptId });
  const { updateProgress } = useProgress();
  const { updateStreak } = useStreak();
  
  // Calculate time remaining and sync with backend
  useEffect(() => {
    if (!attempt?.exam?.duration || !attempt?.startTime || attempt.status !== AttemptStatus.IN_PROGRESS) {
      return;
    }
    
    const durationMinutes = attempt.exam.duration;
    const startTime = new Date(attempt.startTime).getTime();
    const endTime = startTime + (durationMinutes * 60 * 1000);
    
    // Initial timer update
    const now = Date.now();
    const initialDiff = Math.max(0, Math.floor((endTime - now) / 1000));
    setTimeLeft(initialDiff);
    
    // Update timer every second
    const updateTimer = () => {
      const currentTime = Date.now();
      const diff = Math.max(0, Math.floor((endTime - currentTime) / 1000));
      
      setTimeLeft(diff);
      
      // Auto-submit when time runs out
      if (diff <= 0 && attempt.status === AttemptStatus.IN_PROGRESS) {
        handleSubmitExam();
      }
    };
    
    // Set up timer interval
    const timerId = setInterval(updateTimer, 1000);
    
    // Set up backend sync interval (every 30 seconds)
    const syncTimerId = setInterval(() => {
      // Only sync if there's still time left
      if (timeLeft > 0) {
        // Update time spent for the current question if available
        if (questionId) {
          updateTimeSpent(questionId, 30); // Update with 30 seconds increment
        }
        
        // Track progress for both exam and attempt
        updateProgress({
          entityId: examId,
          entityType: EntityType.EXAM,
          timeSpent: 30,
        });
        
        updateProgress({
          entityId: attemptId,
          entityType: EntityType.ATTEMPT,
          timeSpent: 30,
        });
        
        // Update streak data for study minutes
        updateStreak({
          studyMinutes: 0.5, // 30 seconds = 0.5 minutes
        });
      }
    }, 30000);
    
    return () => {
      clearInterval(timerId);
      clearInterval(syncTimerId);
    };
  }, [attempt?.exam?.duration, attempt?.startTime, attempt?.status, examId, attemptId, questionId, timeLeft]);
  
  // Load attempt data and record visit
  useEffect(() => {
    if (attemptId) {
      loadAttempt(attemptId);
      
      // Record visit to exam and attempt
      if (examId && attemptId) {
        updateProgress({
          entityId: examId,
          entityType: EntityType.EXAM,
        });
        
        updateProgress({
          entityId: attemptId,
          entityType: EntityType.ATTEMPT,
        });
      }
    }
  }, [attemptId, examId, loadAttempt]);
  
  // Get questions from the attempt
  const questions = useMemo(() => {
    return attempt?.exam?.questions || [];
  }, [attempt]);
  
  // Submit exam function
  const handleSubmitExam = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitAttempt();
      if (result) {
        // Calculate score and accuracy
        const totalQuestions = questions.length;
        const answeredQuestions = answers.length;
        const score = result.score || 0;
        const accuracy = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
        
        // Mark exam and attempt as completed
        await updateProgress({
          entityId: examId,
          entityType: EntityType.EXAM,
          isCompleted: true,
          score,
          accuracy,
          metadata: {
            totalQuestions,
            answeredQuestions,
            timeSpent: result.timeSpent,
          },
        });
        
        await updateProgress({
          entityId: attemptId,
          entityType: EntityType.ATTEMPT,
          isCompleted: true,
          score,
          accuracy,
          metadata: {
            totalQuestions,
            answeredQuestions,
            timeSpent: result.timeSpent,
          },
        });
        
        // Update streak data
        await updateStreak({
          testsAttempted: 1,
          questionsAnswered: answeredQuestions,
          pointsEarned: Math.round(score),
        });
        
        toast.success('Exam submitted successfully!');
        router.push(`/dashboard/exams/${examId}/attempts/${attemptId}/result`);
      }
    } catch (error) {
      toast.error('Failed to submit exam');
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setShowSubmitDialog(false);
    }
  };
  
  // Calculate progress
  const progress = useMemo(() => {
    if (!questions.length) return 0;
    const answeredCount = answers.length;
    return Math.round((answeredCount / questions.length) * 100);
  }, [questions.length, answers.length]);
  
  // Navigate to a specific question
  const goToQuestion = (questionId: string) => {
    router.push(`/dashboard/exams/${examId}/attempts/${attemptId}/${questionId}`);
  };
  
  // Check if attempt is active
  const isAttemptActive = useMemo(() => {
    return attempt?.status === AttemptStatus.IN_PROGRESS;
  }, [attempt?.status]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" />
      </div>
    );
  }
  
  if (error || !attempt) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error Loading Attempt</h2>
        <p className="text-muted-foreground mb-4">{error || 'Unable to load exam attempt'}</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }
  
  // If attempt is already submitted or completed
  if (attempt.status !== AttemptStatus.IN_PROGRESS) {
    return (
      <div className="container max-w-4xl py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Exam Attempt: {attempt.exam?.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8">
            <AlertCircle className="w-16 h-16 text-amber-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Exam Already Submitted</h2>
            <p className="text-muted-foreground mb-6">This exam attempt has been completed and submitted.</p>
            <Button onClick={() => router.push(`/dashboard/exams/${examId}/attempts/${attemptId}/result`)}>
              View Results
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Find current question index
  const currentQuestionIndex = questions.findIndex(q => q.id === questionId);
  
  // Render the active exam attempt with layout
  return (
    <div className="">
      {/* Header with timer and progress - fixed at top */}
      <div className="sticky top-0 z-10 bg-background px-4 py-2 border-b mb-4">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-xl font-bold">{attempt.exam?.title}</h1>
            <p className="text-sm text-muted-foreground">
              {currentQuestionIndex >= 0 ? `Question ${currentQuestionIndex + 1} of ${questions.length}` : `${questions.length} Questions`}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-md">
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="font-mono font-medium text-amber-800">{formatTime(timeLeft)}</span>
            </div>
            
            <Button 
              variant="destructive" 
              onClick={() => setShowSubmitDialog(true)}
            >
              Submit Exam
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Progress value={progress} className="h-2" />
          <span className="text-xs font-medium">{progress}%</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4">
        {/* Question navigation panel - fixed sidebar */}
        <div className="md:col-span-1 order-2 md:order-1">
          <div className="md:sticky md:top-24">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">Questions</CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((question, index) => {
                    const isAnswered = answers.some(a => a.questionId === question.id);
                    const isActive = question.id === questionId;
                    
                    return (
                      <Button
                        key={question.id}
                        variant={isActive ? "default" : isAnswered ? "outline" : "ghost"}
                        className={`h-10 w-10 p-0 ${isAnswered ? "border-green-500" : ""}`}
                        onClick={() => goToQuestion(question.id)}
                      >
                        {index + 1}
                        {isAnswered && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
                        )}
                      </Button>
                    );
                  })}
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs">Answered: {answers.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                    <span className="text-xs">Unattempted: {questions.length - answers.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Question content area */}
        <div className="md:col-span-3 order-1 md:order-2">
          {children}
        </div>
      </div>
      
      {/* Submit confirmation dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Exam</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your exam? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <p className="text-sm font-medium text-amber-800">
                You have answered {answers.length} out of {questions.length} questions.
              </p>
            </div>
            
            <div className="bg-muted p-3 rounded-md">
              <ul className="text-sm space-y-1">
                <li>• Once submitted, you cannot return to this attempt.</li>
                <li>• Unanswered questions will be marked as incorrect.</li>
                <li>• Your answers will be evaluated and results will be available shortly.</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmitExam} disabled={isSubmitting} className="gap-2">
              {isSubmitting ? <Loader size="sm" /> : <Send className="w-4 h-4" />}
              Submit Exam
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}