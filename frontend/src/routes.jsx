import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Performance from './pages/Performance';
import PanelHealth from './pages/PanelHealth';
import AIAnalysis from './pages/AIAnalysis';
import Financials from './pages/Financials';
import Alerts from './pages/Alerts';
import AdminPanel from './pages/AdminPanel';
import DigitalTwin from './pages/DigitalTwin';
import Sustainability from './pages/Sustainability';

export const routes = [
  { path: '/login', element: <Login />, public: true },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/performance', element: <Performance /> },
  { path: '/panel-health', element: <PanelHealth /> },
  { path: '/ai-analysis', element: <AIAnalysis /> },
  { path: '/financials', element: <Financials /> },
  { path: '/alerts', element: <Alerts /> },
  { path: '/admin', element: <AdminPanel />, adminOnly: true },
  { path: '/digital-twin', element: <DigitalTwin /> },
  { path: '/sustainability', element: <Sustainability /> },
];
