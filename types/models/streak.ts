export interface StudentStreak {
    id: string;
    streakCount: number;
    longestStreak: number;
    lastVisit: Date;
    userId: string;
  }
  
  export interface Todo {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
  }