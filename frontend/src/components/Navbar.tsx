// src/components/Navbar.tsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  const navigate = (path: string) => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: { path } }));
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <button onClick={() => navigate('/')} className={styles.logo}>
          AlgoQuest
        </button>
        
        <div className={styles.userSection}>
          {user && (
            <>
              {/* Nút dẫn đến trang Hồ sơ */}
              <button 
                onClick={() => navigate('/profile')} 
                title="Xem hồ sơ"
                style={{ 
                  color: 'white', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontSize: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.5rem'
                }}
              >
                <i className="fas fa-user-circle"></i>
              </button>

              <div className={styles.userInfo}>
                <span>{user.username}</span>
                <p>{user.xp} XP</p>
              </div>
              
              {/* Nút Quản trị (chỉ hiển thị cho Admin) */}
              {user.role === 'Admin' && (
                <button 
                  onClick={() => navigate('/admin')} 
                  style={{ 
                    backgroundColor: '#4f46e5', 
                    padding: '0.5rem 1rem', 
                    borderRadius: '0.375rem', 
                    border: 'none', 
                    color: 'white', 
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Quản trị
                </button>
              )}

              {/* Nút Đăng xuất */}
              <button onClick={handleLogout} className={styles.logoutButton}>
                <i className="fa-solid fa-right-from-bracket"></i>
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;