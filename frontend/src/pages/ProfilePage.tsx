// src/pages/ProfilePage.tsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import styles from './ProfilePage.module.css';

const ProfilePage: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return <div className={styles.container}>Đang tải thông tin người dùng...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.profileCard}>
                <div className={styles.avatar}>
                    <i className="fas fa-user-astronaut"></i>
                </div>
                <div className={styles.info}>
                    <h1>{user.username}</h1>
                    <p>{user.email}</p>
                    <div className={styles.stats}>
                        <div className={styles.statItem}>
                            <span>{user.xp}</span> XP
                        </div>
                        <div className={styles.statItem}>
                            <span>{user.completedStages.length}</span> Màn đã qua
                        </div>
                    </div>
                </div>
            </div>

            <h2 className={styles.sectionTitle}>ID Các Màn Đã Hoàn Thành</h2>
            <div className={styles.grid}>
                {user.completedStages.length > 0 ? (
                    // Chỉ cần lặp qua mảng completedStages có sẵn trong user
                    user.completedStages.map(stageId => (
                        <div key={stageId} className={styles.itemCard}>
                            <i className={'fas fa-check-circle'}></i>
                            <p>{stageId}</p>
                        </div>
                    ))
                ) : (
                    <p>Bạn chưa hoàn thành màn chơi nào. Hãy bắt đầu cuộc phiêu lưu!</p>
                )}
            </div>

            <h2 className={styles.sectionTitle}>Bộ Sưu Tập Huy Hiệu</h2>
            <p>Tính năng Huy hiệu sẽ sớm được cập nhật!</p>
        </div>
    );
};

export default ProfilePage;