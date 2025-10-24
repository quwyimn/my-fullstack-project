// src/App.tsx
import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GameMapPage from './pages/GameMapPage';
import StagePage from './pages/StagePage';
import AdminPage from './pages/AdminPage';
import AdminStageDetail from './pages/AdminStageDetail'; // Import trang chi tiết
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar';
import styles from './App.module.css';

const AppRouter: React.FC = () => {
  const [path, setPath] = useState(window.location.pathname);
  const { isAuthenticated, user } = useAuth(); 

  useEffect(() => {
    const onLocationChange = () => setPath(window.location.pathname);
    const handleNav = (e: Event) => {
      const newPath = (e as CustomEvent).detail.path;
      console.log("Đã nhận được yêu cầu điều hướng đến:", newPath); // Dòng debug
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
    if (!isAuthenticated) {
      switch (path) {
        case '/register': return <RegisterPage />;
        default: return <LoginPage />;
      }
    }

    // Logic cho người dùng đã đăng nhập
    const adminStageMatch = path.match(/^\/admin\/stage\/([^/]+)$/);
    if (adminStageMatch && user?.role === 'Admin') {
        return <AdminStageDetail stageId={adminStageMatch[1]} />;
    }
    if (path === '/admin' && user?.role === 'Admin') {
        return <AdminPage />;
    }
    if (path === '/profile') {
        return <ProfilePage />;
    }
    const stageMatch = path.match(/^\/stage\/([^/]+)$/);
    if (stageMatch) {
        return <StagePage stageId={stageMatch[1]} />;
    }
    
    return <GameMapPage />; // Trang mặc định sau khi đăng nhập
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

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

export default App;