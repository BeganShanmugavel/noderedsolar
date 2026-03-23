import React from 'react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Performance from './pages/Performance';
import PanelHealth from './pages/PanelHealth';
import AIAnalysis from './pages/AIAnalysis';
import Financials from './pages/Financials';
import Alerts from './pages/Alerts';
import AdminPanel from './pages/AdminPanel';
import UserDetails from './pages/UserDetails';
import DigitalTwin from './pages/DigitalTwin';
import Sustainability from './pages/Sustainability';
import OperationsPlanner from './pages/OperationsPlanner';

export const routes = [
  { path: '/home', element: <Home />, public: true },
  { path: '/login', element: <Login />, public: true },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/performance', element: <Performance /> },
  { path: '/panel-health', element: <PanelHealth /> },
  { path: '/ai-analysis', element: <AIAnalysis /> },
  { path: '/operations-planner', element: <OperationsPlanner /> },
  { path: '/financials', element: <Financials /> },
  { path: '/alerts', element: <Alerts /> },
  { path: '/admin', element: <AdminPanel />, adminOnly: true },
  { path: '/user-details', element: <UserDetails />, adminOnly: true },
  { path: '/digital-twin', element: <DigitalTwin /> },
  { path: '/sustainability', element: <Sustainability /> },
];
