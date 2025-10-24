// src/services/apiService.ts
import type { User, Stage, Quiz } from '../types';

// THAY ĐỔI ĐỊA CHỈ NÀY cho đúng với backend của bạn
const BASE_URL = 'http://localhost:5135/api'; 

// Hàm helper chung để gọi API, xử lý lỗi và parse JSON
async function apiFetch(endpoint: string, options: RequestInit = {}) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                // Trong tương lai, bạn có thể thêm token xác thực ở đây
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
                ...options.headers,
            },
        });

        if (!response.ok) {
            // Cố gắng đọc lỗi từ body của response
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(errorData.message || `Lỗi ${response.status}`);
        }

        // Xử lý trường hợp response không có nội dung (ví dụ: 204 No Content)
        if (response.status === 204) {
            return null;
        }

        return response.json();

    } catch (error) {
        console.error('Lỗi mạng hoặc lỗi kết nối API:', error);
        // Ném ra một lỗi chung chung hơn để giao diện hiển thị
        throw new Error('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    }
}

// Đối tượng chứa tất cả các hàm gọi API cụ thể
export const apiService = {
    /**
     * Gửi yêu cầu POST đến /Users/login
     */
    login: async (email: string, password_param: string): Promise<User> => {
        return apiFetch('/Users/login', {
            method: 'POST',
            body: JSON.stringify({ email, password: password_param }),
        });
    },

    /**
     * Gửi yêu cầu POST đến /Users/register
     */
    register: async (username: string, email: string, password_param: string): Promise<User> => {
        return apiFetch('/Users/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password: password_param }),
        });
    },

    /**
     * Gửi yêu cầu GET đến /Stages
     */
    getStages: async (): Promise<Stage[]> => {
        return apiFetch('/Stages');
    },

    /**
     * Gửi yêu cầu GET đến /Stages/{id}
     */
    getStageById: async (id: string): Promise<Stage> => {
        return apiFetch(`/Stages/${id}`);
    },

    /**
     * Gửi yêu cầu GET đến /Users (Yêu cầu quyền Admin)
     */
    getUsers: async (): Promise<User[]> => {
        return apiFetch('/Users');
    },
      createStage: async (stageData: Omit<Stage, 'id' | 'quizzes' | 'creature'>): Promise<Stage> => {
        return apiFetch('/Stages', {
            method: 'POST',
            body: JSON.stringify(stageData),
        });
    },

    updateStage: async (id: string, stageData: Omit<Stage, 'id' | 'quizzes' | 'creature'>): Promise<void> => {
        return apiFetch(`/Stages/${id}`, {
            method: 'PUT',
            body: JSON.stringify(stageData),
        });
    },

    deleteStage: async (id: string): Promise<void> => {
        return apiFetch(`/Stages/${id}`, {
            method: 'DELETE',
        });
    },

       getQuizzesByStageId: async (stageId: string): Promise<Quiz[]> => {
        return apiFetch(`/Quizzes/${stageId}`);
    },

    createQuiz: async (quizData: Omit<Quiz, 'id'>): Promise<Quiz> => {
        return apiFetch('/Quizzes', {
            method: 'POST',
            body: JSON.stringify(quizData),
        });
    },

    updateQuiz: async (id: string, quizData: Omit<Quiz, 'id'>): Promise<void> => {
        return apiFetch(`/Quizzes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(quizData),
        });
    },

    deleteQuiz: async (id: string): Promise<void> => {
        return apiFetch(`/Quizzes/${id}`, {
            method: 'DELETE',
        });
    },
};


