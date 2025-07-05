'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Clock, FileText, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { AccessType } from '@/types';
import { useExamAttempt } from '@/hooks/useExamAttempt';
import { Exam } from '@/types/exams';
import Loading from '@/components/loading';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ExamService } from '@/services';

// Function to format minutes into hours and minutes
const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''}` : ''}${hours > 0 && mins > 0 ? ' ' : ''}${mins > 0 ? `${mins} minute${mins > 1 ? 's' : ''}` : ''}`;
};

export default function CreateAttemptPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessType, setAccessType] = useState<AccessType>(AccessType.INDIVIDUAL);
  const [enrollmentId, setEnrollmentId] = useState<string>('');
  const [isStarting, setIsStarting] = useState(false);
  const { startAttempt } = useExamAttempt({ examId });

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await ExamService.getExamById(examId);
        setExam(response);
      } catch (error) {
        toast.error('Error loading exam details');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (examId) {
      fetchExam();
    }
  }, [examId]);

  const handleStartAttempt = async () => {
    setIsStarting(true);
    try {
      const attempt = await startAttempt(accessType, enrollmentId || undefined);
      if (attempt) {
        toast.success('Exam attempt started successfully!');
        router.push(`/dashboard/exams/${examId}/attempts/${attempt.id}`);
      }
    } catch (error) {
      toast.error('Failed to start exam attempt');
      console.error(error);
    } finally {
      setIsStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loading />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Exam Not Found</h2>
        <p className="text-muted-foreground mb-4">The exam you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-4xl mx-auto">
      <Card className="border-2 shadow-md">
        <CardHeader className="bg-muted/50">
          <div className="flex justify-between items-start p-2">
            <div>
              <CardTitle className="text-2xl font-bold">{exam.title}</CardTitle>
              <CardDescription className="mt-2">{exam.description}</CardDescription>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-full text-primary font-medium">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(exam.duration)}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:gap-8">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Exam Details</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{exam.type} - {exam.testType}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-muted-foreground">Subject:</span>
                    <span className="font-medium">{exam.subject || 'General'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-muted-foreground">Total Questions:</span>
                    <span className="font-medium">{exam.totalQuestions}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-muted-foreground">Total Marks:</span>
                    <span className="font-medium">{exam.totalMarks}</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Marking Scheme</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-muted-foreground">Correct Answer:</span>
                    <span className="font-medium text-green-600">
                      +{exam.correctMark || 1} mark{(exam.correctMark || 1) > 1 ? 's' : ''}
                    </span>
                  </li>
                  {exam.negativeMarking && (
                    <li className="flex items-center gap-2">
                      <span className="text-muted-foreground">Incorrect Answer:</span>
                      <span className="font-medium text-destructive">
                        {exam.incorrectMark ? `-${exam.incorrectMark}` : '-0.25'} mark
                      </span>
                    </li>
                  )}
                  <li className="flex items-center gap-2">
                    <span className="text-muted-foreground">Negative Marking:</span>
                    <span className="font-medium">{exam.negativeMarking ? 'Yes' : 'No'}</span>
                  </li>
                </ul>
              </div>
            </div>

            <Separator />
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Access Type</h3>
              <RadioGroup 
                value={accessType} 
                onValueChange={(value) => setAccessType(value as AccessType)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={AccessType.INDIVIDUAL} id="individual" />
                  <Label htmlFor="individual">Individual Exam</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={AccessType.TEST_SERIES} id="test-series" />
                  <Label htmlFor="test-series">Test Series</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={AccessType.COURSE} id="course" />
                  <Label htmlFor="course">Course</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800">Important Instructions</h4>
                  <ul className="mt-2 text-sm text-amber-700 list-disc list-inside space-y-1">
                    <li>Once started, the exam timer cannot be paused.</li>
                    <li>Ensure you have a stable internet connection.</li>
                    <li>Do not refresh or close the browser during the exam.</li>
                    <li>You must submit your answers before the time expires.</li>
                    <li>Read all questions carefully before answering.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between bg-muted/30 border-t">
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
          <Button 
            onClick={handleStartAttempt} 
            disabled={isStarting}
            className="gap-2"
          >
            {isStarting ? <Loading /> : <FileText className="w-4 h-4" />}
            Start Exam
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

