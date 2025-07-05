import { PaginationMeta } from "@/lib/pagination";

export enum NotificationType {
  COURSE = 'COURSE',
  TEST_SERIES = 'TEST_SERIES',
  EXAM = 'EXAM',
  ATTEMPT = 'ATTEMPT',
  EVALUATION = 'EVALUATION',
  REMINDER = 'REMINDER',
  SYSTEM = 'SYSTEM',
  OTHER = 'OTHER'
}

export enum NotificationChannel {
  EMAIL = 'EMAIL',
  IN_APP = 'IN_APP',
  PUSH = 'PUSH'
}

export interface NotificationPreference {
  id: string;
  userId: string;
  type: NotificationType;
  channel: NotificationChannel;
  enabled: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  metadata: Record<string, any>;
  isRead: boolean;
  actionUrl?: string;
  actionData?: Record<string, any>;
}

export interface NotificationResponse {
  data: Notification[];
  meta: PaginationMeta;
}

export interface UnreadCountResponse {
  count: number;
}

export interface CreateNotificationPreferenceDto {
  type: NotificationType;
  channel: NotificationChannel;
  enabled?: boolean;
}

export interface UpdateNotificationPreferenceDto {
  enabled: boolean;
}
