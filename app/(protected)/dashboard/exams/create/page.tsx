"use client";

import { ExamForm } from "../components/exam-form";

export default function CreateExamPage() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Create New Exam</h1>
          <p className="text-muted-foreground">
            Create a new exam with questions, marking scheme, and settings.
          </p>
        </div>
      </div>

      <ExamForm />
    </div>
  );
}
