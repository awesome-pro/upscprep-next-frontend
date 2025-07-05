import { ExamType, ExamStatus } from '../enums';
import { User } from './user';
import { MainsAttempt } from './attempt';

export interface MainsExam {
  id: string;
  name: string;
  type: ExamType;
  duration: number;
  totalMarks: number;
  questionUrl: string;
  createdAt: Date;
  updatedAt: Date;
  status: ExamStatus;
  instructions?: string;
  isDeleted: boolean;
  deletedAt?: Date;
  teacherId: string;
}

export interface MainsExamWithRelations extends MainsExam {
  teacher?: User;
  attempts?: MainsAttempt[];
}