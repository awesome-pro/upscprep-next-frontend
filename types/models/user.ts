import { UserRole } from '../enums';
import { MainsExam } from './mains-exam';
import { PrelimsExam } from './prelims-exam';
import { MainsAttempt, PrelimsAttempt } from './attempt';
import { StudentStreak, Todo } from './streak';
import { UserStatus } from '../user';

export interface User {
    id: string;
    email: string;
    name: string;
    status: UserStatus;
    role: UserRole;
    phoneNumber?: string;
    isEmailVerified: boolean;
    verificationToken?: string;
    resetPasswordToken?: string;
    resetPasswordExpiry?: Date;
    lastLoginAt?: Date;
    isActive: boolean;
    profileImage?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserWithRelations extends User {
    createdMainsExams?: MainsExam[];
    createdPrelimsExams?: PrelimsExam[];
    mainsAttempts?: MainsAttempt[];
    prelimsAttempts?: PrelimsAttempt[];
    streak?: StudentStreak;
    todos?: Todo[];
}