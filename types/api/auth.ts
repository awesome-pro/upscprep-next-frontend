import { User } from '../models/user';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phoneNumber?: string;
  profileImage?: string;
}