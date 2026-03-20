import { useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import PublicHeader from './components/PublicHeader';
import { routes } from './routes';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user } = useAuth();
  const showShell = !!user;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const showPublicHeader = !showShell && location.pathname !== '/login';

  return (
    <div className="app-shell">
      {showShell && <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />}
      {showPublicHeader && <PublicHeader />}
      <div className={showShell ? 'layout' : ''}>
        {showShell && (
          <>
            <div className={`mobile-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
            <Sidebar mobileOpen={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
          </>
        )}
        <main>
          <Routes>
            <Route path="/" element={<Navigate to={user ? '/dashboard' : '/home'} />} />
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.public ? route.element : <ProtectedRoute adminOnly={route.adminOnly}>{route.element}</ProtectedRoute>}
              />
            ))}
            <Route path="*" element={<Navigate to={user ? '/dashboard' : '/home'} replace />} />
          </Routes>
          {showShell && <Footer />}
        </main>
      </div>
    </div>
  );
}
