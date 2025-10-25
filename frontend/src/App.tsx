// src/App.tsx
import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GameMapPage from './pages/GameMapPage';
import StagePage from './pages/StagePage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import AdminStageDetail from './pages/AdminStageDetail';
import AdminUserDetail from './pages/AdminUserDetail';
import Navbar from './components/Navbar';
import styles from './App.module.css';

// Component Chúc mừng cuối cùng
const FinalVictoryScreen: React.FC = () => {
    const { user } = useAuth();
    return (
        <div style={{ textAlign: 'center', paddingTop: '5rem' }}>
            <i className="fas fa-crown" style={{ fontSize: '5rem', color: '#facc15', animation: 'bounce 1s infinite' }}></i>
            <h1 style={{ fontSize: '3rem', color: '#2dd4bf', marginTop: '2rem' }}>CHIẾN THẮNG TUYỆT ĐỐI!</h1>
            <p style={{ fontSize: '1.5rem' }}>
                Chúc mừng nhà thám hiểm <strong style={{ color: '#5eead4' }}>{user?.username}</strong>!
            </p>
            <p>Bạn đã chinh phục tất cả các thử thách của AlgoQuest!</p>
        </div>
    );
};

// Component AppRouter chứa logic định tuyến
const AppRouter: React.FC = () => {
  const [path, setPath] = useState(window.location.pathname);
  const { isAuthenticated, user } = useAuth(); 

  useEffect(() => {
    const onLocationChange = () => setPath(window.location.pathname);
    const handleNav = (e: Event) => {
      const newPath = (e as CustomEvent).detail.path;
      window.history.pushState({}, '', newPath);
      setPath(newPath);
    };

    window.addEventListener('popstate', onLocationChange);
    window.addEventListener('navigate', handleNav);
    return () => {
      window.removeEventListener('popstate', onLocationChange);
      window.removeEventListener('navigate', handleNav);
    };
  }, []);

  const renderPage = () => {
    // Logic cho người dùng CHƯA đăng nhập
    if (!isAuthenticated) {
      switch (path) {
        case '/register': return <RegisterPage />;
        default: return <LoginPage />;
      }
    }

    // Logic cho người dùng ĐÃ đăng nhập
    // 1. Ưu tiên các route của Admin trước
    const adminUserMatch = path.match(/^\/admin\/user\/([^/]+)$/);
    if (adminUserMatch && user?.role === 'Admin') {
        return <AdminUserDetail userId={adminUserMatch[1]} />;
    }
    const adminStageMatch = path.match(/^\/admin\/stage\/([^/]+)$/);
    if (adminStageMatch && user?.role === 'Admin') {
        return <AdminStageDetail stageId={adminStageMatch[1]} />;
    }
    if (path === '/admin' && user?.role === 'Admin') {
        return <AdminPage />;
    }

    // 2. Sau đó, ưu tiên các route của người dùng cá nhân
    if (path === '/profile') {
        return <ProfilePage />;
    }

    // 3. Kiểm tra xem người dùng đã "phá đảo" game chưa
    const lastStageId = 'stage6'; // Tạm thời hardcode
    if (user && user.completedStages.includes(lastStageId)) {
        // Chỉ hiển thị màn hình chiến thắng ở trang chủ ('/')
        if (path === '/') {
            return <FinalVictoryScreen />;
        }
    }

    // 4. Các route chơi game
    const stageMatch = path.match(/^\/stage\/([^/]+)$/);
    if (stageMatch) {
        return <StagePage stageId={stageMatch[1]} />;
    }
    
    // 5. Trang mặc định cuối cùng là Bản đồ Game
    return <GameMapPage />; 
  };

  return (
    <>
      {isAuthenticated && <Navbar />}
      <main className={isAuthenticated ? styles.mainContent : ''}>
        {renderPage()}
      </main>
    </>
  );
};

// Component App chính, bao bọc toàn bộ ứng dụng
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

export default App;