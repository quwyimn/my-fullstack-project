// src/types.ts
export type UserRole = 'Player' | 'Admin';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  xp: number;
  completedStages: string[];
}

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number; 
  explanation: string;
  stageId: string; 
  difficulty: string;
}

export interface Stage {
  id: string;
  name: string;
  description: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  backgroundUrl: string;
  quizzes: Quiz[];
  creature?: {
    name: string;
    icon: string;
  };
  order: number;
}