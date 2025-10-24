// src/components/admin/AdminUserList.tsx
import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import type { User } from '../../types';
import styles from '../../pages/AdminPage.module.css'; // Tái sử dụng style

const AdminUserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        apiService.getUsers()
            .then(setUsers)
            .catch(err => setError(err.message))
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) return <div className={styles.loading}>Đang tải...</div>;
    if (error) return <div className={styles.error}>Lỗi: {error}</div>;

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Tên người dùng</th>
                        <th>Email</th>
                        <th>Vai trò</th>
                        <th>XP</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>
                                <span className={`${styles.roleBadge} ${user.role === 'Admin' ? styles.roleAdmin : styles.rolePlayer}`}>
                                    {user.role}
                                </span>
                            </td>
                            <td>{user.xp}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUserList;