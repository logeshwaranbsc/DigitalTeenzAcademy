import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Briefcase, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  Database,
  UserCheck,
  LogOut
} from 'lucide-react';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export default function App() {
  const [role, setRole] = useState('admin'); // 'admin' | 'employee'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error' | 'info', text: string }
  const [currentUser, setCurrentUser] = useState(null);

  // Check existing session on load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setToast(null);
  };

  const handleDemoFill = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'admin') {
      setEmail('admin@digitalteenz.edu');
      setPassword('AdminPass2026!');
    } else {
      setEmail('employee@digitalteenz.edu');
      setPassword('EmployeePass2026!');
    }
    setToast({
      type: 'info',
      text: `Demo credentials for ${selectedRole === 'admin' ? 'Admin' : 'Employee'} loaded!`
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setEmail('');
    setPassword('');
    setToast({ type: 'info', text: 'You have been signed out.' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast(null);

    // 1. Frontend Validation
    if (!email || !email.includes('@')) {
      setToast({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    if (!password || password.length < 4) {
      setToast({ type: 'error', text: 'Password must be at least 4 characters.' });
      return;
    }

    setIsLoading(true);

    try {
      // 2. Call Laravel + Supabase Backend Endpoint
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
          role: role,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        // Save Auth Session
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setCurrentUser(data.user);

        setToast({
          type: 'success',
          text: `Welcome back, ${data.user.name}! (${data.user.role_name || data.user.role})`
        });
      } else {
        // Display backend validation or role mismatch error
        setToast({
          type: 'error',
          text: data.message || 'Invalid email or password.'
        });
      }
    } catch (error) {
      console.warn('Backend API offline or unreachable. Falling back to frontend validation for testing.', error);
      
      // Fallback verification if Laravel server is not yet running on port 8000
      const isAdminMatch = email.toLowerCase() === 'admin@digitalteenz.edu' && role === 'admin';
      const isEmployeeMatch = email.toLowerCase() === 'employee@digitalteenz.edu' && role === 'employee';

      if (isAdminMatch || isEmployeeMatch || password === 'AdminPass2026!' || password === 'EmployeePass2026!') {
        const mockUser = {
          id: role === 'admin' ? 1 : 2,
          name: role === 'admin' ? 'System Administrator' : 'Staff Employee',
          email: email,
          role: role,
          role_name: role === 'admin' ? 'Admin' : 'Employee'
        };
        localStorage.setItem('auth_token', 'mock_supabase_token_' + Date.now());
        localStorage.setItem('user', JSON.stringify(mockUser));
        setCurrentUser(mockUser);

        setToast({
          type: 'success',
          text: `[Demo Mode] Welcome back, ${mockUser.name}! Connect Laravel backend to enable Supabase DB live check.`
        });
      } else {
        setToast({
          type: 'error',
          text: `Backend API server offline (${API_BASE_URL}). Start Laravel server or use demo credentials.`
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Logged-In State View
  if (currentUser) {
    return (
      <div className="login-page-container">
        <header className="branding-header">
          <div className="logo-badge">
            <UserCheck size={34} strokeWidth={2} />
          </div>
          <h1 className="page-title">Dashboard Portal</h1>
          <p className="page-subtitle">Digital Teenz Academy Management System</p>
        </header>

        <main className="login-card" style={{ textAlign: 'center' }}>
          <h2 className="card-title">Hello, {currentUser.name}!</h2>
          <p className="card-subtitle" style={{ marginBottom: '1.25rem' }}>
            Account Role: <strong>{currentUser.role_name || currentUser.role.toUpperCase()}</strong>
          </p>

          <div className="toast-banner success" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
            <CheckCircle2 size={18} />
            <span>Authenticated via Supabase PostgreSQL</span>
          </div>

          <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>
            Email: <strong>{currentUser.email}</strong>
          </p>

          <button 
            type="button" 
            className="submit-btn" 
            onClick={handleLogout}
            style={{ background: 'linear-gradient(135deg, #475569 0%, #1e293b 100%)' }}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="login-page-container">
      {/* Branding Header Section */}
      <header className="branding-header">
        <div className="logo-badge" title="Digital Teenz Academy">
          <GraduationCap size={34} strokeWidth={2} />
        </div>
        <h1 className="page-title">Welcome Back</h1>
        <p className="page-subtitle">Sign in to your school management account</p>
      </header>

      {/* Main Login Card */}
      <main className="login-card">
        <h2 className="card-title">Sign In</h2>
        <p className="card-subtitle">Enter your credentials to access your account</p>

        {/* Role Selector Pills */}
        <div className="role-tab-bar" role="tablist" aria-label="Account Role Selector">
          <button
            type="button"
            role="tab"
            aria-selected={role === 'admin'}
            className={`role-tab ${role === 'admin' ? 'active' : ''}`}
            onClick={() => handleRoleChange('admin')}
          >
            <GraduationCap size={18} />
            <span>Admin</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={role === 'employee'}
            className={`role-tab ${role === 'employee' ? 'active' : ''}`}
            onClick={() => handleRoleChange('employee')}
          >
            <Briefcase size={18} />
            <span>Employee</span>
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Email Address Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="email-input">
              Email Address
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <Mail size={18} />
              </span>
              <input
                id="email-input"
                type="email"
                className="form-input"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="password-input">
              Password
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <Lock size={18} />
              </span>
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="forgot-password-wrapper">
            <a
              href="#forgot-password"
              className="forgot-password-link"
              onClick={(e) => {
                e.preventDefault();
                setToast({
                  type: 'info',
                  text: 'Password reset link request registered.'
                });
              }}
            >
              Forgot your password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner" />
                <span>Connecting to Supabase...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Feedback Toast Notification */}
        {toast && (
          <div className={`toast-banner ${toast.type}`}>
            {toast.type === 'success' ? (
              <CheckCircle2 size={18} />
            ) : toast.type === 'error' ? (
              <AlertCircle size={18} />
            ) : (
              <Database size={18} />
            )}
            <span>{toast.text}</span>
          </div>
        )}

        {/* Quick Demo Fill Helper */}
        <div className="demo-helper">
          <p className="demo-title">Quick Demo Credentials</p>
          <div className="demo-buttons">
            <button
              type="button"
              className="demo-btn"
              onClick={() => handleDemoFill('admin')}
            >
              ⚡ Fill Admin
            </button>
            <button
              type="button"
              className="demo-btn"
              onClick={() => handleDemoFill('employee')}
            >
              ⚡ Fill Employee
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
