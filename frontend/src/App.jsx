import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import ToastContainer from './components/common/ToastContainer';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

function MainApp() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <DashboardPage /> : <LoginPage />;
}

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <ErrorBoundary>
            <MainApp />
            <ToastContainer />
          </ErrorBoundary>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
