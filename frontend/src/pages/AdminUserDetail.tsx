// src/pages/AdminUserDetail.tsx
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import type { User } from '../types';
import styles from './AdminPage.module.css'; // Tái sử dụng style chung

interface AdminUserDetailProps {
    userId: string;
}

const AdminUserDetail: React.FC<AdminUserDetailProps> = ({ userId }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = (path: string) => {
        window.dispatchEvent(new CustomEvent('navigate', { detail: { path } }));
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await apiService.getUserById(userId);
                setUser(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu người dùng");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, [userId]);

    if (isLoading) return <div className={styles.loading}>Đang tải...</div>;
    if (error) return <div className={styles.error}>Lỗi: {error}</div>;
    if (!user) return <div className={styles.container}>Không tìm thấy người dùng.</div>;

    return (
        <div className={styles.container}>
            <button onClick={() => navigate('/admin')} style={{ marginBottom: '1rem' }}>&larr; Quay lại Danh sách</button>
            <h1 className={styles.title}>Thống kê Tiến độ: {user.username}</h1>
            
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <tbody>
                        <tr><th style={{width: '200px'}}>ID</th><td>{user.id}</td></tr>
                        <tr><th>Email</th><td>{user.email}</td></tr>
                        <tr><th>Vai trò</th><td>{user.role}</td></tr>
                        <tr><th>Điểm kinh nghiệm (XP)</th><td>{user.xp}</td></tr>
                        <tr>
                            <th>Các màn đã hoàn thành ({user.completedStages.length})</th>
                            <td>
                                {user.completedStages.length > 0 
                                    ? user.completedStages.join(', ') 
                                    : "Chưa hoàn thành màn nào."}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUserDetail;