"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ExamService } from "@/services/exam.service";
import { AttemptService } from "@/services/attempt-service";
import { AnswerKeyService } from "@/services/answer-key-service";
import { Exam, Attempt, AnswerKey } from "@/types/exams";
// import { useProgress } from "@/hooks/useProgress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExamHeader } from "./components/exam-header";
import { ExamDetails } from "./components/exam-details";
import { AttemptList } from "./components/attempt-list";
import { AnswerKeyList } from "./components/answer-key-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types";

export default function ExamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;

  const [exam, setExam] = useState<Exam | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [answerKeys, setAnswerKeys] = useState<AnswerKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  // const { updateProgress, getProgress } = useProgress();
  const { user } = useAuth();

  useEffect(() => {
    const fetchExamData = async () => {
      setLoading(true);
      try {
        const examData = await ExamService.getExamById(examId);
        setExam(examData);
        
        // Fetch attempts for this exam
        const attemptsResponse = await AttemptService.getAttemptsByExam(examId, {
          page: 1,
          pageSize: 10,
        });
        setAttempts(attemptsResponse.data);
        
        // Fetch answer keys for this exam
        if (user?.role === UserRole.ADMIN || user?.role === UserRole.TEACHER) {
          const answerKeysData = await AnswerKeyService.getAnswerKeysByExam(examId);
          setAnswerKeys(answerKeysData);
        }
        // Record the visit to this exam for progress tracking
        // await updateProgress({
        //   entityId: examId,
        //   entityType: EntityType.EXAM,
        // });
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchExamData();
  }, [examId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-destructive/10 p-4 rounded-md">
          <h2 className="text-xl font-semibold text-destructive">Error</h2>
          <p>Failed to load exam details. Please try again later.</p>
          <Button 
            variant="outline" 
            onClick={() => router.push('/dashboard/exams')}
            className="mt-4"
          >
            Back to Exams
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <ExamHeader exam={exam} />
      
      <div className="w-full bg-slate-100 dark:bg-slate-800 p-4 rounded-md flex items-center justify-between">
        <h2 className="text-2xl font-bold">Questions</h2>
        <Link href={`/dashboard/exams/${examId}/questions`}>
          <Button>View All Questions</Button>
        </Link>
        {(user?.role === UserRole.ADMIN || user?.role === UserRole.TEACHER) && (
          <Link href={`/dashboard/exams/${examId}/questions/create`}>
            <Button variant="outline">Add Question</Button>
          </Link>
        )}
      </div>
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className=" w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attempts">Attempts</TabsTrigger>
          {
            user?.role === UserRole.ADMIN || user?.role === UserRole.TEACHER && (
              <TabsTrigger value="answer-keys">Answer Keys</TabsTrigger>
            )
          }
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="overview" className="space-y-6">
            <ExamDetails exam={exam} />
          </TabsContent>
          
          <TabsContent value="attempts">
            <AttemptList attempts={attempts} examId={examId} />
          </TabsContent>
          
          {
            user?.role === UserRole.ADMIN || user?.role === UserRole.TEACHER && (
              <TabsContent value="answer-keys">
                <AnswerKeyList answerKeys={answerKeys} examId={examId} />
              </TabsContent>
            )
          }
        </div>
      </Tabs>
    </div>
  );
}
