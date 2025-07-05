export type Status = 'PENDING' | 'EVALUATED' | 'BLOCKED';

export interface Student {
    name: string;
    avatar: string;
    email: string;
}

export interface MainsExamSubmission {
    id: string;
    title: string;
    createdAt: Date;
    submittedAt: Date;
    student: Student;
    score: number | null;
    status: Status;
    answerUrl: string;
    feedback?: string
}