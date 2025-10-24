// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import styles from './LoginPage.module.css';
import { apiService } from '../services/apiService';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const loggedInUser = await apiService.login(email, password);
      login(loggedInUser);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Đã xảy ra một lỗi không xác định.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('navigate', { detail: { path: '/register' } }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <div className={styles.header}>
          <h1>Chào mừng đến AlgoQuest</h1>
          <p>Đăng nhập để bắt đầu cuộc phiêu lưu!</p>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" required className={styles.input} placeholder="ban@email.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Mật khẩu</label>
            <input id="password" type="password" required className={styles.input} placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
          </div>
          {error && <p style={{ color: '#f87171', textAlign: 'center', margin: 0 }}>{error}</p>}
          <div>
            <button type="submit" className={styles.button} disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </div>
        </form>
        <div className={styles.linkContainer}>
          <p>
            Chưa có tài khoản?{' '}
            <a href="/register" onClick={navigateToRegister} className={styles.link}>
              Đăng ký ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;