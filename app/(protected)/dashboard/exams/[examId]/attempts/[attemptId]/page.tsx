'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { AttemptStatus } from '@/types/exams';
import { useExamAttempt } from '@/hooks/useExamAttempt';

// Custom loader component since we don't have the actual component
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

export default function AttemptPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;
  const attemptId = params.attemptId as string;
  
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { attempt, answers, loading, error, loadAttempt, submitAttempt } = useExamAttempt({ examId, attemptId });
  
  // Calculate time remaining
  useEffect(() => {
    if (!attempt?.exam?.duration || attempt.status !== AttemptStatus.IN_PROGRESS) return;
    
    const durationMinutes = attempt.exam.duration;
    const startTime = new Date(attempt.startTime).getTime();
    const endTime = startTime + (durationMinutes * 60 * 1000);
    
    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((endTime - now) / 1000));
      
      setTimeLeft(diff);
      
      // Auto-submit when time runs out
      if (diff <= 0 && attempt.status === AttemptStatus.IN_PROGRESS) {
        handleSubmitExam();
      }
    };
    
    updateTimer();
    const timerId = setInterval(updateTimer, 1000);
    
    return () => clearInterval(timerId);
  }, [attempt]);
  
  // Load attempt data
  useEffect(() => {
    if (attemptId) {
      loadAttempt(attemptId);
    }
  }, [attemptId, loadAttempt]);
  
  // Get questions from the attempt
  const questions = useMemo(() => {
    return attempt?.exam?.questions || [];
  }, [attempt]);
  
  // Get current question
  const currentQuestion = useMemo(() => {
    return questions[currentQuestionIndex] || null;
  }, [questions, currentQuestionIndex]);
  
  // Get answer for current question
  const currentAnswer = useMemo(() => {
    if (!currentQuestion) return null;
    return answers.find(a => a.questionId === currentQuestion.id) || null;
  }, [answers, currentQuestion]);
  
  // Navigation functions
  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, questions.length]);
  
  const goToPrevQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);
  
  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  }, [questions.length]);
  
  // Submit exam function
  const handleSubmitExam = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitAttempt();
      if (result) {
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
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
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
  
  // Render the active exam attempt
  return (
        <div className="md:col-span-3 order-1 md:order-2">
          <Card className="mb-4">
            <CardContent className="pt-6">
              {currentQuestion ? (
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-lg font-medium">Question {currentQuestionIndex + 1}</h2>
                    <div className="text-sm px-2 py-1 bg-muted rounded-md">
                      {currentQuestion.marks} {currentQuestion.marks > 1 ? 'marks' : 'mark'}
                    </div>
                  </div>
                  
                  <div className="prose max-w-none mb-6">
                    <div dangerouslySetInnerHTML={{ __html: currentQuestion.text }} />
                  </div>
                  
                  {/* Question will be rendered in the question page */}
                  <div className="flex justify-center">
                    <Button 
                      onClick={() => router.push(`/dashboard/exams/${examId}/attempts/${attemptId}/${currentQuestion.id}`)}
                      className="w-full md:w-auto"
                    >
                      Answer This Question
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <p>No questions available</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={goToPrevQuestion}
              disabled={currentQuestionIndex === 0}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </Button>
            
            <Button
              variant="outline"
              onClick={goToNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
              className="gap-2"
            >
              Next <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
  );
}

