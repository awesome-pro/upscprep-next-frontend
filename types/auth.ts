import { UserRole } from "./enums";

export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput {
    email: string;
    password: string;
    name: string;
    company?: string;
    role: UserRole;
    phoneNumber: string;
}