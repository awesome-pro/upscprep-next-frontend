'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { useExamAttempt } from '@/hooks/useExamAttempt';
import { QuestionType } from '@/types/exams';

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

export default function AttemptReviewPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;
  const attemptId = params.attemptId as string;
  
  const [activeTab, setActiveTab] = useState<string>('all');
  
  const { 
    attempt, 
    answers, 
    loading, 
    error, 
    loadAttempt 
  } = useExamAttempt({ examId, attemptId });
  
  // Load attempt data
  useEffect(() => {
    if (attemptId) {
      loadAttempt(attemptId);
    }
  }, [attemptId, loadAttempt]);
  
  // Return to results page
  const goToResults = () => {
    router.push(`/dashboard/exams/${examId}/attempts/${attemptId}/result`);
  };
  
  // Return to dashboard
  const goToDashboard = () => {
    router.push('/dashboard/exams');
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader size="lg" />
        <p className="mt-4 text-muted-foreground">Loading your answers...</p>
      </div>
    );
  }
  
  if (error || !attempt || !attempt.exam) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <HelpCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error Loading Review</h2>
        <p className="text-muted-foreground mb-4">{error || 'Unable to load exam review'}</p>
        <Button onClick={goToDashboard}>Return to Dashboard</Button>
      </div>
    );
  }
  
  // Process questions and answers
  const questions = attempt.exam.questions || [];
  const questionMap = new Map();
  
  // Create a map of questions with their answers
  questions.forEach(question => {
    const answer = answers?.find(a => a.questionId === question.id);
    
    let status = 'unattempted';
    if (answer) {
      if (question.type === QuestionType.MCQ) {
        status = answer.selectedOption === question.correctOption ? 'correct' : 'incorrect';
      } else {
        // For descriptive questions, we can't automatically determine correctness
        status = answer.answerText ? 'attempted' : 'unattempted';
      }
    }
    
    questionMap.set(question.id, {
      question,
      answer,
      status
    });
  });
  
  // Filter questions based on active tab
  const filteredQuestions = Array.from(questionMap.values()).filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'correct') return item.status === 'correct';
    if (activeTab === 'incorrect') return item.status === 'incorrect';
    if (activeTab === 'unattempted') return item.status === 'unattempted';
    return true;
  });
  
  // Count questions by status
  const correctCount = Array.from(questionMap.values()).filter(item => item.status === 'correct').length;
  const incorrectCount = Array.from(questionMap.values()).filter(item => item.status === 'incorrect').length;
  const unattemptedCount = Array.from(questionMap.values()).filter(item => item.status === 'unattempted').length;
  
  return (
    <div className="container max-w-4xl py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Answer Review</h1>
        <Button variant="outline" onClick={goToResults}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Results
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="all">
            All ({questions.length})
          </TabsTrigger>
          <TabsTrigger value="correct">
            Correct ({correctCount})
          </TabsTrigger>
          <TabsTrigger value="incorrect">
            Incorrect ({incorrectCount})
          </TabsTrigger>
          <TabsTrigger value="unattempted">
            Unattempted ({unattemptedCount})
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="space-y-6">
        {filteredQuestions.map(({ question, answer, status }) => (
          <Card key={question.id} className={`
            ${status === 'correct' ? 'border-green-200 bg-green-50' : ''}
            ${status === 'incorrect' ? 'border-red-200 bg-red-50' : ''}
            ${status === 'unattempted' ? 'border-gray-200 bg-gray-50' : ''}
            ${status === 'attempted' ? 'border-blue-200 bg-blue-50' : ''}
          `}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {status === 'correct' && <CheckCircle className="h-5 w-5 text-green-500" />}
                  {status === 'incorrect' && <XCircle className="h-5 w-5 text-red-500" />}
                  {status === 'unattempted' && <HelpCircle className="h-5 w-5 text-gray-500" />}
                  {status === 'attempted' && <Badge variant="outline">Descriptive</Badge>}
                  <CardTitle className="text-lg">Question {question.questionNumber || questions.indexOf(question) + 1}</CardTitle>
                </div>
                <Badge variant="outline">
                  {question.marks} {question.marks > 1 ? 'marks' : 'mark'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="prose max-w-none mb-4">
                <div dangerouslySetInnerHTML={{ __html: question.text }} />
              </div>
              
              {question.imageUrls && question.imageUrls.length > 0 && (
                <div className="mb-4">
                  {question.imageUrls.map((url: string, index: number) => (
                    <img 
                      key={index} 
                      src={url} 
                      alt={`Question ${question.questionNumber || questions.indexOf(question) + 1} image ${index + 1}`} 
                      className="max-h-64 object-contain mb-2"
                    />
                  ))}
                </div>
              )}
              
              <Separator className="my-4" />
              
              {/* Answer section */}
              <div>
                <h3 className="text-md font-medium mb-3">Your Answer</h3>
                
                {question.type === QuestionType.MCQ ? (
                  <div className="space-y-2">
                    {question.options.map((option: string, index: number) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-md border ${option === answer?.selectedOption ? 'border-primary bg-primary/10' : 'border-muted'} 
                          ${option === question.correctOption ? 'border-green-500 bg-green-50' : ''}
                        `}
                      >
                        <div className="flex items-center gap-2">
                          {option === question.correctOption && <CheckCircle className="h-4 w-4 text-green-500" />}
                          {option === answer?.selectedOption && option !== question.correctOption && <XCircle className="h-4 w-4 text-red-500" />}
                          <span>{option}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {answer?.answerText ? (
                      <div className="p-3 rounded-md border border-muted bg-muted/20 whitespace-pre-wrap font-mono text-sm">
                        {answer.answerText}
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">No answer provided</p>
                    )}
                    
                    {answer?.marks !== undefined && (
                      <div className="mt-4">
                        <Badge variant={answer.marks >= (question.marks / 2) ? "success" : "destructive"}>
                          Score: {answer.marks} / {question.marks}
                        </Badge>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
