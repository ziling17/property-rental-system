/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Building2, ShieldAlert } from 'lucide-react';
import { UserSession } from '../types';
import { useNavigate } from 'react-router-dom';

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

  // Feedbacks
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  // Default accounts for easy login helper
  const handleDemoFill = (selectedRole: 'tenant' | 'landlord') => {
    setRole(selectedRole);
    if (selectedRole === 'tenant') {
      setEmail('dingziling88@gmail.com');
      setPassword('tenant1234');
    } else {
      setEmail('landlord@mysewa.io');
      setPassword('landlord1234');
    }
    setErrorStatus(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorStatus(null);

    // Basic Validation
    if (!email || !email.includes('@')) {
      setErrorStatus('Please enter a valid email address.');
      return;
    }
    if (password.length < 4) {
      setErrorStatus('Password must be at least 4 characters long.');
      return;
    }

    // Determine Name based on email
    let name = 'User';
    if (role === 'tenant') {
      if (email.toLowerCase() === 'dingziling88@gmail.com') {
        name = 'Ding Zi Ling';
      } else if (email.toLowerCase().includes('emily')) {
        name = 'Emily Vance';
      } else {
        name = email.split('@')[0].replace('.', ' ');
        name = name.charAt(0).toUpperCase() + name.slice(1);
      }
    } else {
      name = 'Sewa Housing Admin';
    }

    const session: UserSession = {
      email: email.toLowerCase(),
      role: role,
      name: name
    };
    localStorage.setItem("userProfile", JSON.stringify(session));
    onLoginSuccess(session);

    onLoginSuccess(session);

    const redirectTo = sessionStorage.getItem('redirect_after_login');
    if (redirectTo) {
      sessionStorage.removeItem('redirect_after_login');
      navigate(redirectTo);
    } else {
      navigate(role === 'landlord' ? '/landlord-dashboard' : '/home');
    }
  };

  const handleOAuthClick = (service: 'Google' | 'Facebook') => {
    setOauthLoading(service);
    setErrorStatus(null);
    setTimeout(() => {
      setOauthLoading(null);
      // Simulate OAuth standard approval
      const mockEmail = service === 'Google' ? 'dingziling88@gmail.com' : 'facebook.user@mysewa.io';
      const name = service === 'Google' ? 'Ding Ziling' : 'Facebook User';
      onLoginSuccess({
        email: mockEmail,
        role: role, // inherit selected role tab
        name: name
      });

      onLoginSuccess({
        email: mockEmail,
        role: role,
        name: name
      });

      const redirectTo = sessionStorage.getItem('redirect_after_login');
      if (redirectTo) {
        sessionStorage.removeItem('redirect_after_login');
        navigate(redirectTo);
      } else {
        navigate(role === 'landlord' ? '/landlord-dashboard' : '/home');
      }
    }, 1200);
  };

  return (
    <div id="login-container-wrapper" className="w-full max-w-[480px] space-y-6">
      {/* Login Card */}
      <div id="login-card" className="bg-surface-container-lowest rounded-2xl login-card-shadow p-6 md:p-10 transition-soft border border-surface-container-high relative overflow-hidden">

        {/* Decorative ambient background inside card */}
        <div id="login-card-glow" className="absolute -top-10 -right-10 w-32 h-32 bg-primary/3 rounded-full blur-xl pointer-events-none" />

        <div className="text-center mb-6">
          <h1 className="font-bold text-3xl text-on-surface mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-on-surface-variant">
            Access your secure rental dashboard
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div id="role-selector-tabs" className="grid grid-cols-2 p-1 bg-surface-container-low rounded-xl mb-6 border border-surface-container/50">
          <button
            type="button"
            onClick={() => { setRole('tenant'); setErrorStatus(null); }}
            className={`py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${role === 'tenant'
              ? 'bg-white text-primary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
              }`}
            id="tenantTab"
          >
            Tenant
          </button>
          <button
            type="button"
            onClick={() => { setRole('landlord'); setErrorStatus(null); }}
            className={`py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${role === 'landlord'
              ? 'bg-white text-primary shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
              }`}
            id="landlordTab"
          >
            Landlord
          </button>
        </div>

        {/* Demonstration Help Callout */}
        <div id="demo-credentials-helper" className="mb-6 p-3 bg-surface-container/40 rounded-xl border border-surface-container-high flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
              ⚡ Quick Demo Login
            </span>
            <span className="text-[10px] text-on-surface-variant text-right">
              No registration needed
            </span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('tenant')}
              className="flex-1 py-1.5 px-2 bg-white hover:bg-surface-container-low text-[11px] font-semibold text-primary border border-outline-variant/30 rounded-lg transition-colors text-center"
              id="quick-demo-tenant-btn"
            >
              As Tenant (Ding Ziling)
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('landlord')}
              className="flex-1 py-1.5 px-2 bg-white hover:bg-surface-container-low text-[11px] font-semibold text-primary border border-outline-variant/30 rounded-lg transition-colors text-center"
              id="quick-demo-landlord-btn"
            >
              As Landlord (Admin)
            </button>
          </div>
        </div>

        {/* Error Feedback */}
        {errorStatus && (
          <div id="login-error-alert" className="mb-4 p-3 bg-error/10 text-error border border-error/20 rounded-xl flex items-start gap-2 text-xs">
            <ShieldAlert size={16} className="shrink-0 mt-0.5" />
            <span>{errorStatus}</span>
          </div>
        )}

        {/* Dynamic OAuth Loading Panel */}
        {oauthLoading && (
          <div id="oauth-spinner-overlay" className="absolute inset-0 bg-white/95 z-30 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <h4 className="font-bold text-on-surface text-base">Verifying Identity</h4>
            <p className="text-xs text-on-surface-variant mt-1">
              Establishing credential handshake with {oauthLoading} Secure Vault...
            </p>
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-4" id="login-form">
          <div id="form-group-email" className="space-y-1">
            <label htmlFor="login-email-input" className="text-xs font-semibold text-on-surface-variant flex justify-between items-center ml-1">
              <span>Email Address</span>
              {email && email.toLowerCase() === 'dingziling88@gmail.com' && (
                <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-mono font-bold">
                  Matched Tenant Account
                </span>
              )}
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
              <a
                onClick={(e) => { e.preventDefault(); setErrorStatus('To recover password, click the Quick Demo Logan buttons to login instantly!'); }}
                className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                href="#forgot"
                id="login-forgot-password-link"
              >
                Forgot?
              </a>
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

        {/* Divider */}
        <div className="relative my-6" id="login-or-divider">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-surface-container-highest"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-4 bg-surface-container-lowest text-on-surface-variant font-medium">
              Or continue with
            </span>
          </div>
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-2 gap-3" id="social-login-group">
          <button
            onClick={() => handleOAuthClick('Google')}
            className="h-12 border border-outline-variant rounded-xl flex items-center justify-center gap-2 text-xs font-semibold hover:bg-surface-container-low transition-soft active:scale-95 cursor-pointer bg-white"
            id="login-google-btn"
          >
            {/* Standard Google logo linked as specifically requested */}
            <img
              alt="Google logo"
              className="w-5 h-5 object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgo2aor85rGcK7Hh7eqKYLbHQ_Bk8qNx_0jW3hzfXdNQ5nTIRJlW-H-JgDJ218aQ0lFNwZVH6Tjz2F_K6IH8VAGM2IOvXl5JfiUz6YMYkgzrWDBfWzeiwYEjpUI2YVfE831J47AuLsDYzlIMshtjcE3HKu9iLjxjWtUb6NnmSFWhy1AFOlaEhQdxwj3HQXvI7xdNo8TIstKp0_VxXFm9wn4mPUkiwSzla-Sy5knCwYC8nd4XxD90qS3U12S3q-eof7Nx7vLOfTSiM"
            />
            Google
          </button>
          <button
            onClick={() => handleOAuthClick('Facebook')}
            className="h-12 border border-outline-variant rounded-xl flex items-center justify-center gap-2 text-xs font-semibold hover:bg-surface-container-low transition-soft active:scale-95 cursor-pointer bg-white"
            id="login-facebook-btn"
          >
            <span className="text-[#1877F2] font-semibold text-lg leading-none shrink-0" style={{ fontFamily: 'sans-serif' }}>
              f
            </span>
            Facebook
          </button>
        </div>
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
    </div>
  );
}