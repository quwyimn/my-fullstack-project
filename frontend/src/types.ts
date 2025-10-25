// src/types.ts
export type UserRole = 'Player' | 'Admin';

// --- THÊM INTERFACE NÀY VÀO ---
export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  xp: number;
  completedStages: string[];
  badgeIds: string[];
}

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  stageId: string;
  difficulty: string;
  bloomTag: string;
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
  badgeId?: string; 
}