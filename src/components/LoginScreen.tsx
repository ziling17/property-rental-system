/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldAlert } from 'lucide-react'; // ✅ removed Building2
import { UserSession } from '../types';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../utils/userStore';

interface LoginScreenProps {
  onLoginSuccess: (session: UserSession) => void;
  onRegisterClick: () => void;
}

export default function LoginScreen({ onLoginSuccess, onRegisterClick }: LoginScreenProps) {
  const navigate = useNavigate();
  const [role, setRole] = useState<'tenant' | 'landlord'>('tenant');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // ✅ Removed: oauthLoading state
  // ✅ Removed: handleDemoFill function
  // ✅ Removed: handleOAuthClick function

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorStatus(null);

    if (!email || !email.includes('@')) {
      setErrorStatus('Please enter a valid email address.');
      return;
    }
    if (password.length < 4) {
      setErrorStatus('Password must be at least 4 characters long.');
      return;
    }

    const result = loginUser(email, password, role);
    if (!result.success || !result.user || !result.token) {
      setErrorStatus(result.message);
      return;
    }

    // ✅ token included, onLoginSuccess called only once
    const session: UserSession = {
      email: result.user.email,
      role: result.user.role,
      name: result.user.name,
      token: result.token,
    };

    localStorage.setItem('mysewa_session', JSON.stringify(session));
    onLoginSuccess(session);

    const redirectTo = sessionStorage.getItem('redirect_after_login');
    sessionStorage.removeItem('redirect_after_login');
    navigate(redirectTo || (role === 'landlord' ? '/landlord-dashboard' : '/home'));
  };

  return (
    <div id="login-container-wrapper" className="w-full max-w-[480px] space-y-6">
      <div id="login-card" className="bg-surface-container-lowest rounded-2xl login-card-shadow p-6 md:p-10 transition-soft border border-surface-container-high relative overflow-hidden">

        <div id="login-card-glow" className="absolute -top-10 -right-10 w-32 h-32 bg-primary/3 rounded-full blur-xl pointer-events-none" />

        <div className="text-center mb-6">
          <h1 className="font-bold text-3xl text-on-surface mb-1">Welcome back</h1>
          <p className="text-sm text-on-surface-variant">Access your secure rental dashboard</p>
        </div>

        {/* Role Selection Tabs */}
        <div id="role-selector-tabs" className="grid grid-cols-2 p-1 bg-surface-container-low rounded-xl mb-6 border border-surface-container/50">
          <button
            type="button"
            onClick={() => { setRole('tenant'); setErrorStatus(null); }}
            className={`py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${role === 'tenant' ? 'bg-white text-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            id="tenantTab"
          >
            Tenant
          </button>
          <button
            type="button"
            onClick={() => { setRole('landlord'); setErrorStatus(null); }}
            className={`py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${role === 'landlord' ? 'bg-white text-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            id="landlordTab"
          >
            Landlord
          </button>
        </div>

        {/* ✅ Removed: demo-credentials-helper div */}

        {/* Error Feedback */}
        {errorStatus && (
          <div id="login-error-alert" className="mb-4 p-3 bg-error/10 text-error border border-error/20 rounded-xl flex items-start gap-2 text-xs">
            <ShieldAlert size={16} className="shrink-0 mt-0.5" />
            <span>{errorStatus}</span>
          </div>
        )}

        {/* ✅ Removed: oauthLoading spinner overlay */}

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-4" id="login-form">
          <div id="form-group-email" className="space-y-1">
            <label htmlFor="login-email-input" className="text-xs font-semibold text-on-surface-variant ml-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
              <input
                id="login-email-input"
                className="w-full pl-10 pr-4 h-12 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-hidden transition-soft text-sm text-on-surface placeholder:text-outline-variant"
                placeholder="name@company.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div id="form-group-password" className="space-y-1">
            <div className="flex justify-between items-center ml-1">
              <label htmlFor="login-password-input" className="text-xs font-semibold text-on-surface-variant">
                Password
              </label>
              {/* ✅ Removed: fake "Forgot?" that referenced demo buttons */}
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
              <input
                id="login-password-input"
                className="w-full pl-10 pr-12 h-12 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-hidden transition-soft text-sm text-on-surface placeholder:text-outline-variant"
                placeholder="••••••••"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors p-1 rounded"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                id="login-password-visibility-btn"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            className="w-full h-12 bg-primary text-on-primary rounded-xl font-semibold text-sm shadow-xs hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            type="submit"
            id="login-submit-btn"
          >
            Sign In
          </button>
        </form>

        {/* ✅ Removed: OAuth divider and Google/Facebook buttons */}

      </div>

      {/* Footer Link */}
      <p className="text-center text-xs text-on-surface-variant">
        Don't have an account?{' '}
        <a
          onClick={(e) => { e.preventDefault(); onRegisterClick(); }}
          className="text-primary font-semibold hover:underline cursor-pointer"
          href="#register"
          id="login-create-account-link"
        >
          Create a free account
        </a>
      </p>

    </div >
  );
}