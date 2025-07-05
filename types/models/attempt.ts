import { AttemptStatus } from '../enums';
import { User } from './user';
import { MainsExam } from './mains-exam';
import { PrelimsExam } from './prelims-exam';
import { MCQ, MCQOption } from './mcq';

export interface MainsAttempt {
    id: string;
    answerUrl?: string;
    score?: number;
    feedback?: string;
    createdAt: Date;
    updatedAt: Date;
    status: AttemptStatus;
    studentId: string;
    examId: string;
}

export interface PrelimsAttempt {
    id: string;
    createdAt: Date;
    startedAt: Date;
    updatedAt: Date;
    completedAt?: Date;
    status: AttemptStatus;
    score?: number;
    accuracy?: number;
    timeSpent?: number;
    studentId: string;
    examId: string;
}

export interface MCQAttempt {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    prelimsAttemptId: string;
    mcqId: string;
}

export interface MainsAttemptWithRelations extends MainsAttempt {
    student?: User;
    exam?: MainsExam;
}

export interface PrelimsAttemptWithRelations extends PrelimsAttempt {
    student?: User;
    exam?: PrelimsExam;
    mcqAttempts?: MCQAttempt[];
}

export interface MCQAttemptWithRelations extends MCQAttempt {
    prelimsAttempt?: PrelimsAttempt;
    mcq?: MCQ;
    selectedOptions?: MCQOption[];
}