import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { routes } from './routes';

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <div className="layout">
        <Sidebar />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            {routes.map((route) => <Route key={route.path} path={route.path} element={route.element} />)}
          </Routes>
        </main>
      </div>
    </div>
  );
}
