"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { QuestionForm } from "../../components/question-form";
import { QuestionService } from "@/services/question.service";
import { Question } from "@/types/exams";

export default function QuestionEditPage() {
  const params = useParams();
  const examId = params.examId as string;
  const questionId = params.questionId as string;
  
  const [question, setQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setIsLoading(true);
        const data = await QuestionService.getQuestionById(questionId);
        setQuestion(data);
      } catch (err) {
        console.error("Error fetching question:", err);
        setError("Failed to load question. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuestion();
  }, [questionId]);
  
  if (isLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 flex justify-center items-center min-h-[400px]">
        <p>Loading question...</p>
      </div>
    );
  }
  
  if (error || !question) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error || "Question not found"}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Edit Question</h1>
        <p className="text-muted-foreground">
          Update the question details, options, and settings.
        </p>
      </div>
      
      <QuestionForm 
        examId={examId} 
        questionId={questionId} 
        initialData={question} 
      />
    </div>
  );
}
