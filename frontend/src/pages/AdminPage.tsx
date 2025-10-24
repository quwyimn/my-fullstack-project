// src/pages/AdminPage.tsx
import React, { useState } from 'react';
import styles from './AdminPage.module.css';
import AdminUserList from '../components/admin/AdminUserList';
import AdminStageManager from '../components/admin/AdminStageManager';

const AdminPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('users');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'users':
                return <AdminUserList />;
            case 'stages':
                return <AdminStageManager />;
            default:
                return null;
        }
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Bảng điều khiển Quản trị</h1>
            
            <div className={styles.tabContainer}>
                <button 
                    onClick={() => setActiveTab('users')}
                    className={`${styles.tabButton} ${activeTab === 'users' ? styles.active : ''}`}
                >
                    Người dùng
                </button>
                <button 
                    onClick={() => setActiveTab('stages')}
                    className={`${styles.tabButton} ${activeTab === 'stages' ? styles.active : ''}`}
                >
                    Màn chơi & Câu đố
                </button>
            </div>

            <div>
                {renderTabContent()}
            </div>
        </div>
    );
};

export default AdminPage;