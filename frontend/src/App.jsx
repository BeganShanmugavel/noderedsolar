import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import { routes } from './routes';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user } = useAuth();
  const showShell = !!user;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      {showShell && <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />}
      <div className={showShell ? 'layout' : ''}>
        {showShell && (
          <>
            <div className={`mobile-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
            <Sidebar mobileOpen={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
          </>
        )}
        <main>
          <Routes>
            <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.public ? route.element : <ProtectedRoute adminOnly={route.adminOnly}>{route.element}</ProtectedRoute>}
              />
            ))}
          </Routes>
          {showShell && <Footer />}
        </main>
      </div>
    </div>
  );
}
