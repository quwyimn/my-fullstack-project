// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import styles from './RegisterPage.module.css';
import { apiService } from '../services/apiService';

const RegisterPage: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
        setError('Mật khẩu phải có ít nhất 6 ký tự.');
        return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const newUser = await apiService.register(username, email, password);
      login(newUser);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Đã xảy ra một lỗi không xác định.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('navigate', { detail: { path: '/login' } }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <div className={styles.header}>
          <h1>Tạo tài khoản AlgoQuest</h1>
          <p>Tham gia cộng đồng và chinh phục thuật toán!</p>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Tên người dùng</label>
            <input id="username" type="text" required className={styles.input} placeholder="algo_master" value={username} onChange={(e) => setUsername(e.target.value)} disabled={isLoading} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" required className={styles.input} placeholder="ban@email.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Mật khẩu</label>
            <input id="password" type="password" required className={styles.input} placeholder="Tối thiểu 6 ký tự" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
          </div>
          {error && <p style={{ color: '#f87171', textAlign: 'center', margin: 0 }}>{error}</p>}
          <div>
            <button type="submit" className={styles.button} disabled={isLoading}>
              {isLoading ? 'Đang tạo...' : 'Đăng ký'}
            </button>
          </div>
        </form>
        <div className={styles.linkContainer}>
          <p>
            Đã có tài khoản?{' '}
            <a href="/login" onClick={navigateToLogin} className={styles.link}>
              Đăng nhập
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;