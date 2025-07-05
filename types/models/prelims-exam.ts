import { ExamType, TestType, ExamStatus } from '../enums';
import { User } from './user';
import { PrelimsAttempt } from './attempt';
import { MCQ } from './mcq';

export interface Subject {
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    examId: string;
}

export interface Subtopic {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    subjectId: string;
}

export interface PrelimsExam {
    id: string;
    name: string;
    instructions?: string;
    type: ExamType;
    testType: TestType;
    duration: number;
    totalMarks: number;
    createdAt: Date;
    updatedAt: Date;
    status: ExamStatus;
    hasNegativeMarking: boolean;
    negativeMarkingValue: number;
    timeLimit: number;
    isDeleted: boolean;
    deletedAt?: Date;
    teacherId: string;
}

export interface SubjectWithRelations extends Subject {
    exam?: PrelimsExam;
    subtopics?: Subtopic[];
}

export interface SubtopicWithRelations extends Subtopic {
    subject?: Subject;
}

export interface PrelimsExamWithRelations extends PrelimsExam {
    teacher?: User;
    subjects?: Subject[];
    mcqs?: MCQ[];
    attempts?: PrelimsAttempt[];
}