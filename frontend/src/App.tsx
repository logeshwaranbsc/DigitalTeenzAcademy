import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import RoleRoute from './components/RoleRoute';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Admin pages
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import UsersPage from './pages/admin/UsersPage';

// Role dashboards
import StudentDashboard from './pages/student/StudentDashboard';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public auth routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Student routes */}
          <Route
            path="/student/dashboard"
            element={
              <RoleRoute allowedRoles={['student']}>
                <StudentDashboard />
              </RoleRoute>
            }
          />

          {/* Employee routes */}
          <Route
            path="/employee/dashboard"
            element={
              <RoleRoute allowedRoles={['employee']}>
                <EmployeeDashboard />
              </RoleRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <RoleRoute allowedRoles={['admin']}>
                <AdminLayout />
              </RoleRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="users" element={<UsersPage />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px',
              fontSize: '14px',
              padding: '12px 16px',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
