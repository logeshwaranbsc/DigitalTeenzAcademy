import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProfile } from '../../api/auth';
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  BookOpen,
  Briefcase,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';

type LoginRole = 'student' | 'employee';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, role } = useAuth();

  const [selectedRole, setSelectedRole] = useState<LoginRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // If already authenticated, redirect
  if (isAuthenticated && role) {
    const destination =
      role === 'admin' ? '/admin/dashboard' :
      role === 'student' ? '/student/dashboard' :
      '/employee/dashboard';
    navigate(destination, { replace: true });
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Frontend validation
    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Authenticate with Supabase
      await login(email, password);

      // 2. Fetch profile from Laravel (verifies role)
      const profile = await getProfile();

      // 3. Verify role match
      if (profile.status === 'inactive') {
        setError('Your account has been deactivated. Please contact your administrator.');
        return;
      }

      if (profile.role !== selectedRole) {
        if (profile.role === 'admin') {
          setError('This account has Administrator privileges. Please click "Sign In as Admin" at the top right.');
        } else {
          const actualRole = profile.role.charAt(0).toUpperCase() + profile.role.slice(1);
          setError(`This account is registered as an ${actualRole}. Please select the ${actualRole} tab.`);
        }
        return;
      }

      // 4. Redirect to correct dashboard
      toast.success(`Welcome back, ${profile.first_name}!`);
      const destination = selectedRole === 'student' ? '/student/dashboard' : '/employee/dashboard';
      navigate(destination, { replace: true });
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const apiMessage = axiosError.response?.data?.message;
      const message = apiMessage || (err instanceof Error ? err.message : 'Login failed');

      if (message.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please try again.');
      } else if (message.includes('Email not confirmed')) {
        setError('Please verify your email address before signing in.');
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col items-center justify-center px-4 py-8">
      {/* Dotted background pattern */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Admin login button — top right */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
        <Link
          to="/admin/login"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-white hover:border-indigo-300 hover:text-indigo-700 transition-all duration-200 shadow-sm"
        >
          <ShieldCheck size={16} />
          <span>Sign in As Admin</span>
        </Link>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 w-full max-w-md">
        {/* Branding header */}
        <header className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <GraduationCap className="w-9 h-9 text-white" strokeWidth={1.8} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-500 mt-1.5 text-sm sm:text-base">
            Sign in to your school management account
          </p>
        </header>

        {/* Login card */}
        <main className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-0.5">Sign In</h2>
          <p className="text-sm text-slate-500 mb-5">
            Enter your credentials to access your account
          </p>

          {/* Role selector tabs */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-6" role="tablist" aria-label="Account type selector">
            <button
              type="button"
              role="tab"
              aria-selected={selectedRole === 'student'}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedRole === 'student'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              onClick={() => { setSelectedRole('student'); setError(''); }}
            >
              <BookOpen size={16} />
              <span>Student</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={selectedRole === 'employee'}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedRole === 'employee'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              onClick={() => { setSelectedRole('employee'); setError(''); }}
            >
              <Briefcase size={16} />
              <span>Employee</span>
            </button>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Email field */}
            <div className="mb-4">
              <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={18} />
                </span>
                <input
                  id="login-email"
                  type="email"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password field */}
            <div className="mb-4">
              <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={18} />
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end mb-5">
              <Link
                to="/forgot-password"
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Error message */}
          {error && (
            <div className="mt-4 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Info message */}
          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <p className="text-xs text-slate-500 text-center">
              Secured with Supabase Authentication • Digital Teenz Academy
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
