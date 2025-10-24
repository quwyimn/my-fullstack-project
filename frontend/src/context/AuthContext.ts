// src/context/AuthContext.ts
import { createContext } from 'react';
import type { User } from '../types';

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (userData: User) => void;
    logout: () => void;
    updateUserProgress: (stageId: string, xpGained: number) => void;
}

export const AuthContext = createContext<AuthContextType>(null!);