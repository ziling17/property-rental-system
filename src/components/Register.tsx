import React, { useState } from 'react';
import { ShieldCheck, Compass, Eye, EyeOff, User, Building } from 'lucide-react';
import { UserRole } from '../types';

interface RegisterProps {
    onRegisterSuccess: (name: string, email: string, role: UserRole) => void;
    onNavigateToLogin: () => void;
}

export default function Register({ onRegisterSuccess, onNavigateToLogin }: RegisterProps) {
    const [role, setRole] = useState<UserRole>('tenant');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Please enter your full name');
            return;
        }
        if (!email.trim() || !email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }
        if (!agreeTerms) {
            setError('You must agree to the Terms of Service and Privacy Policy');
            return;
        }

        // Save registration mock state
        const users = JSON.parse(localStorage.getItem('mysewa_users') || '[]');
        const userExists = users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());

        if (userExists) {
            setError('An account with this email already exists.');
            return;
        }

        const newUser = {
            id: `user-${Date.now()}`,
            name,
            email: email.toLowerCase(),
            role,
            password,
            createdAt: new Date().toISOString(),
            trustScore: role === 'tenant' ? 95 : undefined,
            verifications: role === 'tenant' ? {
                identity: true,
                employment: false,
                income: false,
                history: true
            } : undefined
        };

        users.push(newUser);
        localStorage.setItem('mysewa_users', JSON.stringify(users));

        // Alert or proceed directly to login
        onRegisterSuccess(name, email, role);
    };

    return (
        <div className="w-full max-w-[1100px] grid md:grid-cols-2 gap-12 bg-white rounded-3xl shadow-lg border border-brand-outline-variant/30 overflow-hidden min-h-[700px] transition-all duration-300">

            {/* Left Side: Aesthetic/Trust Panel */}
            <div className="hidden md:flex flex-col justify-between p-12 relative bg-brand-primary-container text-white overflow-hidden">
                {/* Decorative backdrop gradients */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_white_10%,transparent_70%)]"></div>
                </div>

                {/* Top brand header */}
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold tracking-tight leading-tight mb-4">
                        Empowering Secure Rentals with MySewa
                    </h1>
                    <p className="text-lg opacity-90 leading-relaxed max-w-sm font-light">
                        Join a community-driven marketplace built on the foundations of industry innovation and sustainable infrastructure.
                    </p>
                </div>

                {/* Real SDG alignment and trust badges aligned vertically */}
                <div className="relative z-10 space-y-5">
                    {/* SDG 9 badge */}
                    <div className="flex items-start gap-4 bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/10">
                        <div className="w-12 h-12 flex items-center justify-center bg-brand-tertiary-fixed rounded-xl text-brand-on-tertiary-container animate-pulse shrink-0">
                            <Compass className="w-6 h-6 stroke-[2]" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm tracking-wider uppercase opacity-90">SDG 9 Aligned</h3>
                            <p className="text-sm opacity-85 mt-1 leading-snug">Promoting resilient infrastructure and innovation in property rentals.</p>
                        </div>
                    </div>

                    {/* Secure Verified badge */}
                    <div className="flex items-start gap-4 bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/10 animate-fade-in">
                        <div className="w-12 h-12 flex items-center justify-center bg-brand-primary rounded-xl text-white shrink-0">
                            <ShieldCheck className="w-6 h-6 stroke-[2]" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm tracking-wider uppercase opacity-90">Secure & Verified</h3>
                            <p className="text-sm opacity-85 mt-1 leading-snug">High-trust ecosystem for both verified landlords and pre-screened tenants.</p>
                        </div>
                    </div>
                </div>

                {/* Skyscraper Image precisely mirroring mockup */}
                <div className="relative z-10 pt-6">
                    <img
                        alt="Modern Infrastructure"
                        className="rounded-2xl object-cover w-full h-44 shadow-md border border-white/20 hover:scale-[1.02] transition-transform duration-300"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8a_ylhuisnx4fmdHK-0O5PER9AnfpY8nglCaVeeiJ-MMFFTR1DdrKypnyvrNX0ZYbWwseLcW1OQu8_qjzU3llv2JWB-cNKjbwyUslTItxNSq2OHEev9vlBLPVvwSnZbGN-McLJZfwseTOIL6G0iF15mdFWaRnlQP-iaDdjVVV5NCUt7YMzblzz7GHe-OIH92VAQGM8ytKuXr3gk9FDRgZnPOHoMKEKaY-Z6NxIC4tWVByzN5l_9hO73OeLXPpDqmX8lG1Qs5yKrU"
                    />
                </div>
            </div>

            {/* Right Side: Registration Form */}
            <div className="flex flex-col justify-center p-8 md:p-12">
                <div className="mb-8">
                    <div className="text-xl font-bold text-brand-primary mb-1">MySewa</div>
                    <h2 className="text-3xl font-bold text-brand-on-background tracking-tight leading-tight">Create your account</h2>
                    <p className="text-sm text-brand-on-surface-variant mt-1">Start your journey into a secure rental ecosystem.</p>
                </div>

                {error && (
                    <div id="error-alert" className="mb-5 p-4 bg-brand-error-container/50 border border-brand-error text-brand-error text-sm rounded-xl">
                        {error}
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* Role Selector */}
                    <div>
                        <label className="text-sm font-semibold text-brand-on-surface block mb-2">I am a...</label>
                        <div className="grid grid-cols-2 gap-3" id="role-selector">
                            <button
                                className={`flex items-center justify-center gap-2 p-3 border-2 rounded-2xl transition-all duration-300 ${role === 'tenant'
                                    ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                                    : 'border-brand-outline-variant text-brand-on-surface-variant hover:border-brand-primary/40'
                                    }`}
                                onClick={() => setRole('tenant')}
                                type="button"
                                id="select-tenant"
                            >
                                <User className="w-5 h-5" />
                                <span className="font-semibold text-sm">Tenant</span>
                            </button>

                            <button
                                className={`flex items-center justify-center gap-2 p-3 border-2 rounded-2xl transition-all duration-300 ${role === 'landlord'
                                    ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                                    : 'border-brand-outline-variant text-brand-on-surface-variant hover:border-brand-primary/40'
                                    }`}
                                onClick={() => setRole('landlord')}
                                type="button"
                                id="select-landlord"
                            >
                                <Building className="w-5 h-5" />
                                <span className="font-semibold text-sm">Landlord</span>
                            </button>
                        </div>
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className="text-sm font-semibold text-brand-on-surface block mb-2" htmlFor="name">Full Name</label>
                        <input
                            className="w-full h-12 px-4 bg-brand-surface-container-low border border-brand-outline-variant rounded-2xl focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-sm text-brand-on-background"
                            id="name"
                            placeholder="John Doe"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-sm font-semibold text-brand-on-surface block mb-2" htmlFor="email">Email Address</label>
                        <input
                            className="w-full h-12 px-4 bg-brand-surface-container-low border border-brand-outline-variant rounded-2xl focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-sm text-brand-on-background"
                            id="email"
                            placeholder="john@example.com"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-sm font-semibold text-brand-on-surface block mb-2" htmlFor="password">Password</label>
                        <div className="relative">
                            <input
                                className="w-full h-12 pl-4 pr-12 bg-brand-surface-container-low border border-brand-outline-variant rounded-2xl focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-sm text-brand-on-background"
                                id="password"
                                placeholder="••••••••"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-on-surface-variant hover:text-brand-primary transition-colors focus:outline-none"
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Terms */}
                    <div className="flex items-start gap-3">
                        <input
                            className="mt-1 w-5 h-5 rounded border-brand-outline-variant text-brand-primary focus:ring-brand-primary cursor-pointer accent-brand-primary"
                            id="terms"
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                        />
                        <label className="text-xs text-brand-on-surface-variant leading-normal cursor-pointer" htmlFor="terms">
                            I agree to the <a className="text-brand-primary font-semibold hover:underline" href="#terms">Terms of Service</a> and <a className="text-brand-primary font-semibold hover:underline" href="#privacy">Privacy Policy</a>.
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        className="w-full h-12 bg-brand-primary text-white font-semibold text-sm rounded-2xl shadow-sm hover:bg-brand-primary-container hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 mt-4 cursor-pointer flex items-center justify-center gap-2"
                        type="submit"
                    >
                        Create Account
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-brand-outline-variant/40 text-center">
                    <p className="text-sm text-brand-on-surface-variant">
                        Already have an account?{' '}
                        <button
                            onClick={onNavigateToLogin}
                            className="text-brand-primary font-bold hover:underline focus:outline-none cursor-pointer"
                        >
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}