import { PrelimsExam } from './prelims-exam';
import { MCQAttempt } from './attempt';

export interface MCQ {
  id: string;
  title: string;
  correctReason?: string;
  marks: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  examId: string;
}

export interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
  createdAt: Date;
  updatedAt: Date;
  mcqId: string;
}

export interface MCQWithRelations extends MCQ {
  exam?: PrelimsExam;
  options?: MCQOption[];
  attempts?: MCQAttempt[];
}

export interface MCQOptionWithRelations extends MCQOption {
  mcq?: MCQ;
  attempts?: MCQAttempt[];
}