"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuestionService } from "@/services/question.service";
import { Question, QuestionType, Difficulty } from "@/types/exams";

export default function QuestionViewPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;
  const questionId = params.questionId as string;
  
  const [question, setQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
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
  
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
      return;
    }
    
    try {
      setIsDeleting(true);
      await QuestionService.deleteQuestion(questionId);
      toast.success("Question deleted successfully");
      router.push(`/dashboard/exams/${examId}`);
    } catch (err) {
      console.error("Error deleting question:", err);
      toast.error("Failed to delete question. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };
  
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/exams/${examId}/questions/${questionId}/edit`)}
            disabled={isDeleting}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold">
                Question {question.questionNumber}
              </CardTitle>
              <div className="flex gap-2 mt-2">
                <Badge variant={question.isActive ? "default" : "outline"}>
                  {question.isActive ? "Active" : "Inactive"}
                </Badge>
                <Badge variant="secondary">
                  {question.type === QuestionType.MCQ ? "Multiple Choice" : "Descriptive"}
                </Badge>
                <Badge variant="outline" className={
                  question.difficulty === Difficulty.EASY ? "bg-green-50 text-green-700 border-green-200" :
                  question.difficulty === Difficulty.MEDIUM ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                  "bg-red-50 text-red-700 border-red-200"
                }>
                  {question.difficulty}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{question.marks} {question.marks === 1 ? "Mark" : "Marks"}</div>
              {question.topic && <div className="text-sm text-muted-foreground">Topic: {question.topic}</div>}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Question Text</h3>
              <div className="whitespace-pre-wrap p-4 bg-muted rounded-md">{question.text}</div>
            </div>
            
            {question.imageUrls && question.imageUrls.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Images</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {question.imageUrls.map((url, index) => (
                    <div key={index} className="border rounded-md overflow-hidden">
                      <img 
                        src={url} 
                        alt={`Question image ${index + 1}`} 
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {question.type === QuestionType.MCQ && (
              <div>
                <h3 className="font-medium mb-2">Options</h3>
                <ul className="space-y-2">
                  {question.options?.map((option, index) => (
                    <li 
                      key={index} 
                      className={`p-3 rounded-md ${option === question.correctOption ? 'bg-green-50 border border-green-200' : 'bg-muted'}`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${option === question.correctOption ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                          {option === question.correctOption && '✓'}
                        </div>
                        <span>{option}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                
                {question.explanation && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Explanation</h3>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                      {question.explanation}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {question.type === QuestionType.DESCRIPTIVE && (
              <div className="space-y-4">
                {question.wordLimit && (
                  <div>
                    <h3 className="font-medium mb-2">Word Limit</h3>
                    <div className="p-2 bg-muted rounded-md inline-block">
                      {question.wordLimit} words
                    </div>
                  </div>
                )}
                
                {question.expectedAnswerPoints && question.expectedAnswerPoints.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Expected Answer Points</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {question.expectedAnswerPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {question.modelAnswer && (
                  <div>
                    <h3 className="font-medium mb-2">Model Answer</h3>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-md whitespace-pre-wrap">
                      {question.modelAnswer}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
