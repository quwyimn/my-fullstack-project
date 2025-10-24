// src/context/AuthProvider.tsx
import React, { useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import { AuthContext, type AuthContextType } from './AuthContext';

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('algoquest_user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Lỗi khi đọc dữ liệu người dùng từ storage:", error);
            localStorage.removeItem('algoquest_user');
        }
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('algoquest_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('algoquest_user');
    };

    const updateUserProgress = (stageId: string, xpGained: number) => {
        setUser(currentUser => {
            if (!currentUser) return null;
            const updatedUser: User = {
                ...currentUser,
                xp: currentUser.xp + xpGained,
                completedStages: [...new Set([...currentUser.completedStages, stageId])],
            };
            localStorage.setItem('algoquest_user', JSON.stringify(updatedUser));
            return updatedUser;
        });
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateUserProgress,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};