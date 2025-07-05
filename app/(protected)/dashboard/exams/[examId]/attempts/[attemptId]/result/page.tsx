'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useExamAttempt } from '@/hooks/useExamAttempt';
import { AttemptStatus } from '@/types/exams';

// Custom loader component
const Loader = ({ size = "md", className = "" }: { size?: "sm" | "md" | "lg", className?: string }) => {
  const sizeClass = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  }[size];
  
  return (
    <div className={`animate-spin rounded-full border-2 border-primary border-t-transparent ${sizeClass} ${className}`}></div>
  );
};

export default function AttemptResultPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;
  const attemptId = params.attemptId as string;
  
  const [isLoading, setIsLoading] = useState(true);
  
  const { attempt, answers, loading, error, loadAttempt, evaluateAttempt, isEvaluating } = useExamAttempt({ examId, attemptId });
  
  // Load attempt data
  useEffect(() => {
    if (attemptId) {
      loadAttempt(attemptId).finally(() => {
        // Add a small delay to ensure a smooth transition
        setTimeout(() => setIsLoading(false), 500);
      });
    }
  }, [attemptId, loadAttempt]);
  
  // Use the score from the attempt object if available, otherwise calculate it
  const totalMarks = attempt?.maxScore || attempt?.exam?.questions?.reduce((sum, q) => sum + (q.marks || 0), 0) || 0;
  const obtainedMarks = attempt?.score !== undefined && attempt?.score !== null ? attempt.score : 
    answers?.reduce((sum, a) => sum + (a.marks || 0), 0) || 0;
  const scorePercentage = attempt?.percentage !== undefined && attempt?.percentage !== null ? 
    Math.round(attempt.percentage) : 
    (totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0);
  
  // Return to dashboard
  const goToDashboard = () => {
    router.push('/dashboard/exams');
  };
  
  if (loading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader size="lg" />
        <p className="mt-4 text-muted-foreground">Loading your results...</p>
      </div>
    );
  }
  
  if (error || !attempt) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error Loading Results</h2>
        <p className="text-muted-foreground mb-4">{error || 'Unable to load exam results'}</p>
        <Button onClick={goToDashboard}>Return to Dashboard</Button>
      </div>
    );
  }
  
  // Check attempt status
  const isCompleted = attempt.status === AttemptStatus.COMPLETED;
  const isSubmitted = attempt.status === AttemptStatus.SUBMITTED;
  
  // Handle evaluation
  const handleEvaluate = async () => {
    await evaluateAttempt();
  };
  
  return (
    <div className="container max-w-4xl py-8">
      {/* Success message */}
      {isCompleted ? (
        <div className="flex flex-col items-center justify-center mb-8 py-6 bg-green-50 rounded-lg">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <h1 className="text-2xl font-bold text-center">Exam Submitted Successfully!</h1>
          <p className="text-muted-foreground text-center mt-2">Your answers have been recorded and evaluated.</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mb-8 py-6 bg-amber-50 rounded-lg">
          <AlertCircle className="w-16 h-16 text-amber-500 mb-4" />
          <h1 className="text-2xl font-bold text-center">Exam Submission Status</h1>
          <p className="text-muted-foreground text-center mt-2">This exam is {attempt.status.toLowerCase().replace('_', ' ')}.</p>
        </div>
      )}
      
      {/* Exam details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{attempt.exam?.title}</CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">{attempt.exam?.questions?.length || 0} Questions</Badge>
            <Badge variant="outline">{attempt.exam?.duration} Minutes</Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {/* Score overview */}
            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-lg font-medium mb-3">Score Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-background p-3 rounded-md border">
                  <p className="text-sm text-muted-foreground">Total Marks</p>
                  <p className="text-2xl font-bold">{totalMarks}</p>
                </div>
                <div className="bg-background p-3 rounded-md border">
                  <p className="text-sm text-muted-foreground">Marks Obtained</p>
                  <p className="text-2xl font-bold">{obtainedMarks}</p>
                </div>
                <div className="bg-background p-3 rounded-md border">
                  <p className="text-sm text-muted-foreground">Percentage</p>
                  <p className="text-2xl font-bold">{scorePercentage}%</p>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Score</span>
                  <span>{obtainedMarks}/{totalMarks}</span>
                </div>
                <Progress value={scorePercentage} className="h-2" />
              </div>
            </div>
            
            {/* Attempt summary */}
            <div>
              <h3 className="text-lg font-medium mb-3">Attempt Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={isCompleted ? "success" : "outline"}>
                    {attempt.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Started At</span>
                  <span>{new Date(attempt.startTime).toLocaleString()}</span>
                </div>
                {attempt.endTime && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Completed At</span>
                    <span>{new Date(attempt.endTime).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Questions Attempted</span>
                  <span>
                    {attempt.correctAnswers !== undefined && attempt.incorrectAnswers !== undefined ? 
                      `${attempt.correctAnswers + attempt.incorrectAnswers} of ${attempt.exam?.questions?.length || 0}` : 
                      `${answers.length} of ${attempt.exam?.questions?.length || 0}`}
                  </span>
                </div>
                {attempt.correctAnswers !== undefined && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Correct Answers</span>
                    <span>{attempt.correctAnswers}</span>
                  </div>
                )}
                {attempt.incorrectAnswers !== undefined && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Incorrect Answers</span>
                    <span>{attempt.incorrectAnswers}</span>
                  </div>
                )}
                {attempt.accuracy !== undefined && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Accuracy</span>
                    <span>{Math.round(attempt.accuracy)}%</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Time Spent</span>
                  <span>
                    {attempt.timeSpent ? 
                      `${Math.floor(attempt.timeSpent / 60)} min ${attempt.timeSpent % 60} sec` : 
                      'N/A'}
                  </span>
                </div>
                {attempt.submitTime && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Submitted At</span>
                    <span>{new Date(attempt.submitTime).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-6">
          <Button variant="outline" onClick={goToDashboard} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Button>
          
          <div className="flex gap-2">
            {isSubmitted && (
              <Button 
                onClick={handleEvaluate} 
                disabled={isEvaluating}
                variant="secondary"
              >
                {isEvaluating ? (
                  <>
                    <Loader size="sm" className="mr-2" /> Evaluating...
                  </>
                ) : (
                  'Evaluate Answers'
                )}
              </Button>
            )}
            
            {(isCompleted || isSubmitted) && (
              <Button onClick={() => router.push(`/dashboard/exams/${examId}/attempts/${attemptId}/review`)}>
                Review Answers
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
