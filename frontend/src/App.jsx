
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';

// Routes where Navbar should NOT appear
const NO_NAVBAR_ROUTES = ['/', '/login', '/register', '/forgot-password'];

const AppRoutes = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const isResetPassword = pathname.startsWith('/reset-password');
  const showNavbar = user && !NO_NAVBAR_ROUTES.includes(pathname) && !isResetPassword;

  return (
    <>
      {showNavbar && <Navbar />}
      <main>
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" replace /> : <Landing />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/dashboard" replace /> : <Register />}
          />
          {/* Forgot/reset password routes removed */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
};

const HashRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { hash } = window.location;
    if (hash.startsWith('#/')) {
      const path = hash.slice(1);
      if (path !== window.location.pathname) {
        navigate(path, { replace: true });
      }
    }
  }, [navigate]);

  return null;
};

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <HashRedirect />
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontFamily: 'DM Sans, sans-serif',
                  boxShadow: 'var(--shadow-card)',
                },
                success: {
                  iconTheme: { primary: '#34d399', secondary: 'var(--bg-card)' },
                },
                error: {
                  iconTheme: { primary: '#fb7185', secondary: 'var(--bg-card)' },
                },
              }}
            />
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;