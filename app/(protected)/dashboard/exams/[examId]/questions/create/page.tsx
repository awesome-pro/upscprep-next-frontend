"use client";

import { useParams } from "next/navigation";
import { QuestionForm } from "../components/question-form";

export default function QuestionCreatePage() {
  const params = useParams();
  const examId = params.examId as string;
  
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create New Question</h1>
        <p className="text-muted-foreground">
          Add a new question to the exam with details and options.
        </p>
      </div>
      
      <QuestionForm examId={examId} />
    </div>
  );
}
