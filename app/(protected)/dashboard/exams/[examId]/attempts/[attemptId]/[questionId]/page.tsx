'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Clock, Save, AlertCircle } from 'lucide-react';
import { useExamAttempt } from '@/hooks/useExamAttempt';
import { QuestionType, AttemptStatus, Question } from '@/types/exams';

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

export default function AttemptQuestionPage() {
  const params = useParams();
  const router = useRouter();  const examId = params.examId as string;
  const attemptId = params.attemptId as string;
  const questionId = params.questionId as string;
  
  const [mcqOption, setMcqOption] = useState<string>("");
  const [answerText, setAnswerText] = useState<string>("");
  const [wordCount, setWordCount] = useState<number>(0);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [autoSaveMessage, setAutoSaveMessage] = useState<string>("");
  
  const { 
    attempt, 
    answers, 
    loading, 
    error, 
    loadAttempt, 
    submitAnswer, 
    updateTimeSpent 
  } = useExamAttempt({ examId, attemptId });
  
  const startTimeRef = useRef<number>(Date.now());
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timeSpentTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get the current question
  const currentQuestion = attempt?.exam?.questions?.find(q => q.id === questionId);
  
  // Get the current answer if it exists
  const currentAnswer = answers?.find(a => a.questionId === questionId);
  
  // Calculate word count for descriptive answers
  const calculateWordCount = (text: string): number => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  };
  
  // Format time from seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Load attempt and answer data
  useEffect(() => {
    if (attemptId && questionId) {
      loadAttempt(attemptId);
    }
  }, [attemptId, questionId, loadAttempt]);
  
  // Initialize form with existing answer data
  useEffect(() => {
    if (currentAnswer) {
      if (currentQuestion?.type === QuestionType.MCQ && currentAnswer.selectedOption) {
        setMcqOption(currentAnswer.selectedOption);
      } else if (currentQuestion?.type === QuestionType.DESCRIPTIVE && currentAnswer.answerText) {
        setAnswerText(currentAnswer.answerText);
        setWordCount(calculateWordCount(currentAnswer.answerText));
      }
      
      // Initialize time spent
      if (currentAnswer.timeSpent) {
        setTimeSpent(typeof currentAnswer.timeSpent === 'number' ? 
          currentAnswer.timeSpent : 
          (currentAnswer.timeSpent as any)?.seconds || 0
        );
      }
    }
  }, [currentAnswer, currentQuestion]);
  
  // Track time spent on question
  useEffect(() => {
    if (!currentQuestion || attempt?.status !== AttemptStatus.IN_PROGRESS) return;
    
    startTimeRef.current = Date.now();
    
    // Update time spent every second
    timeSpentTimerRef.current = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setTimeSpent(prev => prev + 1);
      
      // Update backend every 30 seconds
      if (elapsedSeconds > 0 && elapsedSeconds % 30 === 0) {
        updateTimeSpent(questionId, elapsedSeconds);
        startTimeRef.current = Date.now(); // Reset timer
      }
    }, 1000);
    
    return () => {
      if (timeSpentTimerRef.current) {
        clearInterval(timeSpentTimerRef.current);
      }
      
      // Save time spent when component unmounts
      const finalElapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      if (finalElapsedSeconds > 0) {
        updateTimeSpent(questionId, finalElapsedSeconds);
      }
    };
  }, [questionId, attempt?.status, updateTimeSpent]);
  
  // Handle MCQ option change
  const handleMcqChange = async (value: string) => {
    setMcqOption(value);
    await saveAnswer(value);
  };
  
  // Handle descriptive answer change with auto-save
  const handleDescriptiveChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setAnswerText(text);
    setWordCount(calculateWordCount(text));
    
    // Clear previous auto-save timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    
    // Set new auto-save timer (2 seconds after typing stops)
    autoSaveTimerRef.current = setTimeout(() => {
      saveAnswer(undefined, text);
    }, 2000);
  };
  
  // Save answer to backend
  const saveAnswer = async (option?: string, text?: string) => {
    if (!currentQuestion) return;
    
    setIsSaving(true);
    setAutoSaveMessage("Saving...");
    
    try {
      const answerData: any = { questionId };
      
      if (currentQuestion.type === QuestionType.MCQ) {
        answerData.selectedOption = option || mcqOption;
      } else {
        const textToSave = text !== undefined ? text : answerText;
        answerData.answerText = textToSave;
      }
      
      let result;
      if (currentAnswer) {
        // Update existing answer
        result = await submitAnswer(answerData, currentAnswer.id);
      } else {
        // Create new answer
        answerData.attemptId = attemptId;
        result = await submitAnswer(answerData);
      }
      
      if (result) {
        setAutoSaveMessage("Saved");
        setTimeout(() => setAutoSaveMessage(""), 2000);
      }
    } catch (error) {
      console.error("Error saving answer:", error);
      setAutoSaveMessage("Save failed");
      toast.error("Failed to save your answer");
    } finally {
      setIsSaving(false);
    }
  };
  
  // Manual save button handler
  const handleManualSave = async () => {
    if (currentQuestion?.type === QuestionType.MCQ) {
      await saveAnswer();
    } else {
      await saveAnswer(undefined, answerText);
    }
    toast.success("Answer saved");
  };
  
  // Navigate to next/previous question
  const navigateToQuestion = (direction: 'next' | 'prev') => {
    if (!attempt?.exam?.questions || !currentQuestion) return;
    
    const questions = attempt.exam.questions;
    const currentIndex = questions.findIndex(q => q.id === questionId);
    
    if (currentIndex === -1) return;
    
    let targetIndex;
    if (direction === 'next') {
      targetIndex = currentIndex < questions.length - 1 ? currentIndex + 1 : currentIndex;
    } else {
      targetIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;
    }
    
    if (targetIndex !== currentIndex) {
      router.push(`/dashboard/exams/${examId}/attempts/${attemptId}/${questions[targetIndex].id}`);
    }
  };
  
  // Return to attempt overview
  const returnToOverview = () => {
    router.push(`/dashboard/exams/${examId}/attempts/${attemptId}`);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" />
      </div>
    );
  }
  
  if (error || !attempt || !currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Question Not Found</h2>
        <p className="text-muted-foreground mb-4">{error || 'The question you\'re looking for doesn\'t exist or has been removed.'}</p>
        <Button onClick={returnToOverview}>Return to Exam</Button>
      </div>
    );
  }
  
  // If attempt is already submitted or completed, redirect to results page
  if (attempt.status !== AttemptStatus.IN_PROGRESS) {
    // Use a ref to track if we've already attempted to redirect
    const hasRedirectedRef = React.useRef(false);
    
    React.useEffect(() => {
      // Only redirect once to avoid infinite loops
      if (!hasRedirectedRef.current) {
        hasRedirectedRef.current = true;
        router.replace(`/dashboard/exams/${examId}/attempts/${attemptId}/result`);
      }
    }, [router, examId, attemptId]);
    
    return (
      <div className="container max-w-4xl py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Exam Already Submitted</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8">
            <div className="flex flex-col items-center justify-center gap-4">
              <AlertCircle className="w-12 h-12 text-amber-500" />
              <p className="text-muted-foreground">This exam attempt has been completed and submitted.</p>
              <p className="text-muted-foreground">Redirecting to results page...</p>
              <div className="mt-4">
                <Loader size="md" />
              </div>
              <Button 
                onClick={() => router.push(`/dashboard/exams/${examId}/attempts/${attemptId}/result`)} 
                className="mt-4"
              >
                View Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl py-4">
      {/* Question navigation header */}
      <div className="flex justify-between items-center mb-4">
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Time spent: {formatTime(timeSpent)}</span>
          </div>
          
          {autoSaveMessage && (
            <Badge variant="outline" className="text-xs">
              {autoSaveMessage}
            </Badge>
          )}
        </div>
      </div>
      
      {/* Question card */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <Badge className="mb-2">
                {currentQuestion.type === QuestionType.MCQ ? 'Multiple Choice' : 'Descriptive'}
              </Badge>
              <CardTitle className="text-xl">Question {attempt.exam?.questions && attempt.exam.questions.findIndex((q: Question) => q.id === questionId) + 1}</CardTitle>
            </div>
            <Badge variant="outline">
              {currentQuestion.marks} {currentQuestion.marks > 1 ? 'marks' : 'mark'}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="prose max-w-none mb-6">
            <div dangerouslySetInnerHTML={{ __html: currentQuestion.text }} />
          </div>
          
          <Separator className="my-6" />
          
          {/* Answer section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Your Answer</h3>
            
            {currentQuestion.type === QuestionType.MCQ ? (
              <RadioGroup value={mcqOption} onValueChange={handleMcqChange} className="space-y-3">
                {currentQuestion.options.map((option: string, index: number) => (
                  <RadioGroupItem key={index} value={option} />
                ))}
              </RadioGroup>
            ) : (
              <div className="space-y-2">
                <Textarea 
                  value={answerText} 
                  onChange={handleDescriptiveChange}
                  placeholder="Type your answer here..."
                  className="min-h-[200px] font-mono"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Word count: {wordCount}</span>
                  {currentQuestion.wordLimit && (
                    <span className={wordCount > currentQuestion.wordLimit ? "text-destructive" : ""}>
                      Word limit: {currentQuestion.wordLimit}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-6">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigateToQuestion('prev')}
              disabled={!attempt.exam?.questions || attempt.exam.questions.findIndex(q => q.id === questionId) === 0}
              className="gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigateToQuestion('next')}
              disabled={!attempt.exam?.questions || 
                attempt.exam.questions.findIndex(q => q.id === questionId) === attempt.exam.questions.length - 1}
              className="gap-1"
            >
              Next <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          
          <Button onClick={handleManualSave} disabled={isSaving} className="gap-2">
            {isSaving ? <Loader size="sm" /> : <Save className="w-4 h-4" />}
            Save Answer
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

