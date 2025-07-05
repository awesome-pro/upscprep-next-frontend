"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ExamService } from "@/services/exam.service";
import { Exam } from "@/types/exams";
import { ExamForm } from "../../components/exam-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditExamPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchExam = async () => {
      setLoading(true);
      try {
        const examData = await ExamService.getExamById(examId);
        setExam(examData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
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
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Edit Exam</h1>
        <p className="text-muted-foreground">
          Update exam details, settings, and files.
        </p>
      </div>

      <ExamForm exam={exam} isEditing={true} />
    </div>
  );
}
