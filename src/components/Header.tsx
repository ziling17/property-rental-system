import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Building2, User, LogIn, Menu, X, CheckSquare } from 'lucide-react';

interface HeaderProps {
  mode?: 'main' | 'auth';
  onNavigate: (section: string) => void;
  activeSection: string;
  userProfile: any;
  onOpenAuth: any;
  onLogout: any;
}

export default function Header({
  mode = 'main',
  onNavigate,
  activeSection,
  userProfile,
  onOpenAuth,
  onLogout
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (

    <header className="bg-white/95 sticky top-0 z-45 border-b border-brand-border/60 backdrop-blur-md shadow-sm transition-all duration-300">
      <nav className="flex justify-between items-center px-6 md:px-16 h-16 w-full max-w-7xl mx-auto">
        {/* Logo */}
        <div
          onClick={() => {
            const session = localStorage.getItem('mysewa_session');
            if (session) {
              navigate('/home');
            } else {
              navigate('/');
            }
          }}
          className="flex items-center gap-2 cursor-pointer group"
          id="mysewa-logo"
        >
          <div className="w-10 h-10 rounded-lg bg-brand-primary flex items-center justify-center text-white shadow-sm ring-4 ring-brand-primary/10 transition-transform group-hover:scale-105">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold font-sans tracking-tight text-brand-primary">
            MySewa
          </span>
        </div>

        {/* Desktop Nav */}
        {mode === 'main' && (
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => {
                onNavigate('properties');
                const el = document.getElementById('properties-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`font-semibold text-[15px] pb-1 transition-all border-b-2 cursor-pointer ${activeSection === 'properties'
                ? 'text-brand-primary border-brand-primary'
                : 'text-brand-dark-text border-transparent hover:text-brand-primary hover:border-brand-primary/40'
                }`}
              id="nav-search-properties"
            >
              Search Properties
            </button>

            <button
              onClick={() => {
                onNavigate('calculator');
                const el = document.getElementById('stability-calculator-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`font-semibold text-[15px] pb-1 transition-all border-b-2 cursor-pointer ${activeSection === 'calculator'
                ? 'text-brand-primary border-brand-primary'
                : 'text-brand-dark-text border-transparent hover:text-brand-primary hover:border-brand-primary/40'
                }`}
              id="nav-stability-calculator"
            >
              Calculate Stability
            </button>

            <button
              onClick={() => {
                onNavigate('wizard');
                const el = document.getElementById('match-wizard-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`font-semibold text-[15px] pb-1 transition-all border-b-2 cursor-pointer ${activeSection === 'wizard'
                ? 'text-brand-primary border-brand-primary'
                : 'text-brand-dark-text border-transparent hover:text-brand-primary hover:border-brand-primary/40'
                }`}
              id="nav-smart-matching"
            >
              Smart Matching
            </button>
          </div>
        )}

        {/* Action Buttons / Profile */}
        <div className="hidden md:flex items-center gap-4">
          {userProfile ? (
            <div className="flex items-center gap-3 bg-brand-light-blue py-1.5 pl-3 pr-2.5 rounded-full border border-brand-border/80">
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-brand-dark tracking-tight">{userProfile.name}</span>
                {userProfile.role === 'tenant' ? (
                  <span className="text-[10px] text-brand-primary font-bold flex items-center justify-end gap-0.5">
                    <CheckSquare className="w-2.5 h-2.5 text-brand-primary fill-brand-primary/20" />
                    Verified Score: {userProfile.score}%
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Verified Landlord</span>
                )}
              </div>
              <button
                onClick={() => onOpenAuth(null)}
                className="w-8 h-8 rounded-full bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary flex items-center justify-center transition-all cursor-pointer font-semibold text-xs"
                title={userProfile.name}
                id="logout-btn"
              >
                {userProfile.name.split(' ').map(n => n[0]).join('')}
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="text-brand-primary font-semibold text-sm px-4 py-2 hover:bg-brand-light-blue rounded-lg transition-all cursor-pointer"
                id="header-login-btn"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-brand-primary text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:shadow-md hover:brightness-110 active:scale-95 transition-all duration-150 cursor-pointer"
                id="header-register-btn"
              >
                Register
              </button>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center gap-3">
          {userProfile && (
            <div className="text-xs font-bold bg-brand-light-blue px-3 py-1.5 rounded-full border border-brand-border/60">
              {userProfile.name.split(' ')[0]}
            </div>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-brand-dark hover:bg-brand-light-blue rounded-lg transition-all cursor-pointer"
            id="mobile-menu-trigger"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile nav content */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-brand-border/50 py-4 px-6 animate-fade-in shadow-inner">
          <div className="flex flex-col gap-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                const el = document.getElementById('properties-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-left font-bold text-brand-dark hover:text-brand-primary py-1"
              id="mobile-nav-search"
            >
              Search Properties
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                const el = document.getElementById('match-wizard-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-left font-bold text-brand-dark hover:text-brand-primary py-1"
              id="mobile-nav-wizard"
            >
              Smart Matching Wizard
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                const el = document.getElementById('stability-calculator-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-left font-bold text-brand-dark hover:text-brand-primary py-1"
              id="mobile-nav-calculator"
            >
              Calculate Stability Score
            </button>

            <hr className="border-brand-border/50" />

            {userProfile ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-xs">
                    {userProfile.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-dark">{userProfile.name}</p>
                    <p className="text-xs text-brand-dark-text">Role: {userProfile.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full bg-brand-light-blue text-brand-primary font-bold text-sm px-4 py-2.5 rounded-lg text-center"
                  id="mobile-logout-btn"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                  className="w-full text-brand-primary font-bold text-sm bg-brand-light-blue py-2.5 rounded-lg text-center"
                  id="mobile-login-btn"
                >
                  Login
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/register'); }}
                  className="w-full bg-brand-primary text-white font-bold text-sm py-2.5 rounded-lg text-center"
                  id="mobile-register-btn"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
