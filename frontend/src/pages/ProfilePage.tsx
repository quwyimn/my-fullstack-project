// src/pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import styles from './ProfilePage.module.css';
import { apiService } from '../services/apiService';
import type { Badge } from '../types';

const ProfilePage: React.FC = () => {
    const { user } = useAuth();
    const [allBadges, setAllBadges] = useState<Badge[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        apiService.getBadges()
            .then(setAllBadges)
            .finally(() => setIsLoading(false));
    }, []);

    if (!user || isLoading) {
        return <div className={styles.container}>Đang tải thông tin người dùng...</div>;
    }

    // ĐẢM BẢO DÒNG NÀY ĐÚNG CHÍNH TẢ
    const userBadges = allBadges.filter(badge => user.badgeIds.includes(badge.id));

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
                        <div className={styles.statItem}>
                            <span>{userBadges.length}</span> Huy hiệu
                        </div>
                    </div>
                </div>
            </div>

            <h2 className={styles.sectionTitle}>Bộ Sưu Tập Huy Hiệu</h2>
            <div className={styles.grid}>
                {userBadges.length > 0 ? (
                    userBadges.map(badge => (
                        <div key={badge.id} className={styles.itemCard} title={badge.description}>
                            <i className={badge.icon} style={{ color: '#facc15' }}></i>
                            <p>{badge.name}</p>
                        </div>
                    ))
                ) : (
                    <p>Bạn chưa thu thập được huy hiệu nào.</p>
                )}
            </div>

            <h2 className={styles.sectionTitle}>ID Các Màn Đã Hoàn Thành</h2>
            <div className={styles.grid}>
                {user.completedStages.length > 0 ? (
                    user.completedStages.map(stageId => (
                        <div key={stageId} className={styles.itemCard}>
                            <i className={'fas fa-check-circle'} style={{ color: '#6ee7b7' }}></i>
                            <p>{stageId}</p>
                        </div>
                    ))
                ) : (
                    <p>Bạn chưa hoàn thành màn chơi nào.</p>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;