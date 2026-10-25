import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { loginUser, registerUser, resetPassword } from '../utils/auth';
import { User } from '../types';

interface AuthViewProps {
  onAuthSuccess: (user: User) => void;
}

type AuthMode = 'login' | 'register' | 'forgot';

export const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password Visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetFormState = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSwitchMode = (newMode: AuthMode) => {
    resetFormState();
    setMode(newMode);
  };

  // Quick-fill demo account credentials for immediate testing
  const handleFillDemoAccount = () => {
    setEmail('user@shieldher.safe');
    setPassword('ShieldHer2026!');
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();
    setLoading(true);

    try {
      if (mode === 'login') {
        const result = await loginUser(email, password);
        if (result.success && result.user) {
          onAuthSuccess(result.user);
        } else {
          setErrorMessage(result.error || 'Login failed. Please check your credentials.');
        }
      } else if (mode === 'register') {
        const result = await registerUser(name, email, password, confirmPassword);
        if (result.success && result.user) {
          onAuthSuccess(result.user);
        } else {
          setErrorMessage(result.error || 'Registration failed. Please verify your details.');
        }
      } else if (mode === 'forgot') {
        const result = await resetPassword(email, password, confirmPassword);
        if (result.success) {
          setSuccessMessage('Password reset successfully! You can now log in with your new password.');
          setTimeout(() => {
            setMode('login');
            setPassword('');
            setConfirmPassword('');
            resetFormState();
          }, 2000);
        } else {
          setErrorMessage(result.error || 'Password reset failed.');
        }
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden font-sans selection:bg-pink-500 selection:text-white">
      {/* Background ambient gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-pink-900/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        
        {/* Branding Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 via-pink-600 to-rose-500 shadow-glow-pink p-0.5 mb-2 hover:scale-105 transition-transform">
            <div className="w-full h-full bg-navy-950 rounded-[22px] flex items-center justify-center">
              <Shield className="w-8 h-8 text-pink-400" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              SHIELD <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-rose-400 bg-clip-text text-transparent">HER</span>
            </h1>
            <p className="text-sm font-semibold tracking-wide text-purple-200 mt-1">
              Your Safety. Your Privacy. Your Power.
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Personal Safety & Digital Protection Platform
            </p>
          </div>
        </div>

        {/* Auth Card Container */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-purple-900/40 shadow-2xl space-y-6">
          
          {/* Section Mode Header */}
          <div className="border-b border-purple-900/40 pb-4 text-center">
            <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
              {mode === 'login' && <span>Sign In to Your Account</span>}
              {mode === 'register' && <span>Create Protected Account</span>}
              {mode === 'forgot' && <span>Reset Your Password</span>}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {mode === 'login' && 'Enter your credentials to access your safety vault and circle.'}
              {mode === 'register' && 'Register your private guardian profile with local cryptographic security.'}
              {mode === 'forgot' && 'Provide your registered email address and choose a new password.'}
            </p>
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div 
              className="p-3.5 rounded-2xl bg-red-950/70 border border-red-500/50 text-xs text-red-200 flex items-start gap-2.5 animate-in fade-in"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Success Message Box */}
          {successMessage && (
            <div 
              className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-xs text-emerald-200 flex items-start gap-2.5 animate-in fade-in"
              role="status"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{successMessage}</span>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name Field (Register Mode Only) */}
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label 
                  htmlFor="register-fullname" 
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    id="register-fullname"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900 border border-slate-700/80 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-white placeholder-slate-500 text-sm transition-all"
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            {/* Email Address Field */}
            <div className="space-y-1.5">
              <label 
                htmlFor="auth-email" 
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="auth-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900 border border-slate-700/80 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-white placeholder-slate-500 text-sm transition-all"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label 
                  htmlFor="auth-password" 
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  {mode === 'forgot' ? 'New Password' : 'Password'}
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('forgot')}
                    className="text-xs text-pink-400 hover:text-pink-300 font-medium transition-colors"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'forgot' ? 'Min 6 characters' : 'Enter your password'}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-navy-900 border border-slate-700/80 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-white placeholder-slate-500 text-sm transition-all"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field (Register & Forgot Modes) */}
            {(mode === 'register' || mode === 'forgot') && (
              <div className="space-y-1.5">
                <label 
                  htmlFor="auth-confirm-password" 
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    id="auth-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-navy-900 border border-slate-700/80 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-white placeholder-slate-500 text-sm transition-all"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 text-white font-bold text-sm tracking-wide shadow-glow-pink transition-all mt-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'login' && 'Sign In to Shield Her'}
                    {mode === 'register' && 'Create Account'}
                    {mode === 'forgot' && 'Update Password'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Quick Demo Credentials Assistant (for testing & evaluation) */}
          {mode === 'login' && (
            <div className="pt-3 border-t border-purple-900/30">
              <button
                type="button"
                onClick={handleFillDemoAccount}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/40 border border-purple-500/30 text-xs text-purple-200 transition-colors"
              >
                <div className="flex items-center gap-2 text-left">
                  <Sparkles className="w-4 h-4 text-pink-400 flex-shrink-0" />
                  <div>
                    <span className="font-semibold block text-white">Fill Quick Demo Account</span>
                    <span className="text-[11px] text-purple-300">user@shieldher.safe / ShieldHer2026!</span>
                  </div>
                </div>
                <span className="text-pink-400 font-bold text-[11px] uppercase tracking-wider">Fill In</span>
              </button>
            </div>
          )}

          {/* Switch Modes Links */}
          <div className="text-center pt-2 text-xs text-slate-400 space-y-1">
            {mode === 'login' && (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('register')}
                  className="text-pink-400 hover:text-pink-300 font-semibold underline ml-1"
                >
                  Sign Up for Free
                </button>
              </p>
            )}

            {mode === 'register' && (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('login')}
                  className="text-pink-400 hover:text-pink-300 font-semibold underline ml-1"
                >
                  Return to Sign In
                </button>
              </p>
            )}

            {mode === 'forgot' && (
              <p>
                Remembered your password?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('login')}
                  className="text-pink-400 hover:text-pink-300 font-semibold underline ml-1"
                >
                  Return to Sign In
                </button>
              </p>
            )}
          </div>

        </div>

        {/* Security and Privacy Assurance Notes */}
        <div className="text-center space-y-2 text-xs text-slate-500">
          <div className="flex items-center justify-center gap-4">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Salted SHA-256 Hashing
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
              Zero Plaintext Storage
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              Offline Capable
            </span>
          </div>
          <p>© 2026 SHIELD HER. Your Safety. Your Privacy. Your Power.</p>
        </div>

      </div>
    </div>
  );
};
