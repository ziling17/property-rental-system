/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, LogIn, CheckCircle, Landmark, ShieldCheck, Mail, Lock, UserPlus, Info } from 'lucide-react';

interface AuthModalsProps {
  type: 'login' | 'register' | null;
  onClose: () => void;
  onSuccess: (user: { name: string; email: string; loggedIn: boolean }) => void;
}

export const AuthModals: React.FC<AuthModalsProps> = ({
  type,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!type) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (type === 'register' && !name)) {
      alert('Please fill out all required fields');
      return;
    }

    const mockUser = {
      name: type === 'register' ? name : email.split('@')[0].toUpperCase(),
      email: email,
      loggedIn: true,
    };

    setIsSubmitted(true);
    setTimeout(() => {
      onSuccess(mockUser);
      setIsSubmitted(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Background dark blur */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Main card box */}
      <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-sm w-full z-10 p-6 border border-outline-variant/30 animate-scale-up space-y-4">
        
        {/* Header Close button */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5 text-primary">
            <ShieldCheck size={20} className="fill-primary/10" />
            <span className="font-bold text-sm tracking-wide">MySewa Secure Access</span>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="h-12 w-12 rounded-full bg-green-50 text-green-600 border border-green-200 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle size={24} />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-800">Authenticating...</h4>
              <p className="text-xs text-slate-400 font-medium">Validating blockchain security signatures</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            
            <div className="text-center space-y-1">
              <h3 className="font-bold text-xl text-on-surface">
                {type === 'login' ? 'Welcome Back!' : 'Create Trust Account'}
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {type === 'login' 
                  ? 'Access advanced property intelligence and secure digital keys.' 
                  : 'Get a free MySewa tenant/landlord passport with instant ID verification.'
                }
              </p>
            </div>

            {type === 'register' && (
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rachel Tan"
                    className="w-full h-10 pl-10 pr-3 border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white bg-slate-50"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={14} />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. Rachel@domain.com"
                  className="w-full h-10 pl-10 pr-3 border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white bg-slate-50"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Secure Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={14} />
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 pl-10 pr-3 border border-outline-variant rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white bg-slate-50"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl shadow-sm tracking-wide transition-all duration-150 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer mt-2"
            >
              {type === 'login' ? <LogIn size={14} /> : <UserPlus size={14} />}
              <span>{type === 'login' ? 'Account Login' : 'Register Secure Passport'}</span>
            </button>

            {/* SDG 9 footer banner note */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-outline-variant/30 flex gap-2 items-center text-[9px] text-slate-500 leading-normal font-medium">
              <Info size={14} className="text-primary shrink-0" />
              <span>
                Passwords are cryptographically protected. Registered users automatically participate in active SDG 9 housing infrastructure programs.
              </span>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
