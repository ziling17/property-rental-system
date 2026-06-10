import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Building2, Menu, X, CheckSquare } from 'lucide-react';

interface HeaderProps {
  onNavigate: (section: string) => void;
  activeSection: string;
  userProfile: {
    name: string;
    role: 'tenant' | 'landlord';
    score?: number;
  } | null;
}

export default function Header({
  onNavigate,
  activeSection,
  userProfile
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Dynamic Route Conditions
  const isLandingPage = location.pathname === '/' || location.pathname === '/home';
  const isDashboardPage = location.pathname === '/tenant-dashboard' || location.pathname === '/rental-history';
  const isDetailOrMatch = location.pathname.startsWith('/property') || location.pathname === '/smartmatch';

  const handleLogoClick = () => {
    if (userProfile) {
      navigate('/home');
    } else {
      navigate('/');
    }
  };

  const handleProfileClick = () => {
    if (userProfile?.role === 'landlord') {
      navigate('/landlord-dashboard'); // Fallback structure for Landlords
    } else {
      navigate('/tenant-dashboard');   // Default workspace target
    }
  };

  return (
    <header className="bg-white/95 sticky top-0 z-50 border-b border-brand-border/60 backdrop-blur-md shadow-sm transition-all duration-300">
      <nav className="flex justify-between items-center px-6 md:px-16 h-16 w-full max-w-7xl mx-auto">

        {/* Logo */}
        <div
          onClick={handleLogoClick}
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

        {/* ========================================================= */}
        {/* DESKTOP NAVIGATION CONTENT                                 */}
        {/* ========================================================= */}

        {/* 1. Landing Page Navigation (3 items) */}
        {isLandingPage && (
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => { onNavigate('properties'); document.getElementById('properties-section')?.scrollIntoView({ behavior: 'smooth' }); }}
              className={`font-semibold text-[15px] pb-1 transition-all border-b-2 cursor-pointer ${activeSection === 'properties' ? 'text-brand-primary border-brand-primary' : 'text-brand-dark-text border-transparent hover:text-brand-primary hover:border-brand-primary/40'}`}
              id="nav-search-properties"
            >
              Search Properties
            </button>
            <button
              onClick={() => { onNavigate('calculator'); document.getElementById('stability-calculator-section')?.scrollIntoView({ behavior: 'smooth' }); }}
              className={`font-semibold text-[15px] pb-1 transition-all border-b-2 cursor-pointer ${activeSection === 'calculator' ? 'text-brand-primary border-brand-primary' : 'text-brand-dark-text border-transparent hover:text-brand-primary hover:border-brand-primary/40'}`}
              id="nav-stability-calculator"
            >
              Calculate Stability
            </button>
            <button
              onClick={() => { onNavigate('wizard'); document.getElementById('match-wizard-section')?.scrollIntoView({ behavior: 'smooth' }); }}
              className={`font-semibold text-[15px] pb-1 transition-all border-b-2 cursor-pointer ${activeSection === 'wizard' ? 'text-brand-primary border-brand-primary' : 'text-brand-dark-text border-transparent hover:text-brand-primary hover:border-brand-primary/40'}`}
              id="nav-smart-matching"
            >
              Smart Matching
            </button>
          </div>
        )}

        {/* 2. Tenant Dashboard Navigation (2 items) */}
        {isDashboardPage && (
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => navigate('/tenant-dashboard')}
              className={`font-semibold text-[15px] pb-1 transition-all border-b-2 cursor-pointer ${location.pathname === '/tenant-dashboard' ? 'text-brand-primary border-brand-primary' : 'text-brand-dark-text border-transparent hover:text-brand-primary hover:border-brand-primary/40'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/rental-history')}
              className={`font-semibold text-[15px] pb-1 transition-all border-b-2 cursor-pointer ${location.pathname === '/rental-history' ? 'text-brand-primary border-brand-primary' : 'text-brand-dark-text border-transparent hover:text-brand-primary hover:border-brand-primary/40'}`}
            >
              Rental History
            </button>
          </div>
        )}

        {/* 3. Detail or Match Navigation */}
        {isDetailOrMatch && (
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => {
                const lastId = localStorage.getItem('last_property_id');
                navigate(lastId ? `/property/${lastId}` : '/properties');
              }}
              className={`font-semibold text-[15px] pb-1 transition-all border-b-2 cursor-pointer ${location.pathname.startsWith('/property') ? 'text-brand-primary border-brand-primary' : 'text-brand-dark-text border-transparent hover:text-brand-primary'}`}
            >
              Properties Details
            </button>
            <button
              onClick={() => navigate('/smartmatch')}
              className={`font-semibold text-[15px] pb-1 transition-all border-b-2 cursor-pointer ${location.pathname === '/smartmatch' ? 'text-brand-primary border-brand-primary' : 'text-brand-dark-text border-transparent hover:text-brand-primary'}`}
            >
              AI Smart Match
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* RIGHT ACTION CORNER                                       */}
        {/* ========================================================= */}
        <div className="hidden md:flex items-center gap-4">
          {userProfile ? (
            /* AFTER LOGIN: Renders profile dashboard redirect context block */
            <div
              onClick={handleProfileClick}
              className="flex items-center gap-3 bg-brand-light-blue py-1.5 pl-3 pr-2.5 rounded-full border border-brand-border/80 cursor-pointer hover:bg-brand-primary/5 hover:border-brand-primary/30 transition-all duration-200 group animate-fade-in"
              title="Go to Dashboard"
            >
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-brand-dark tracking-tight group-hover:text-brand-primary transition-colors">
                  {userProfile.name}
                </span>
                {userProfile.role === 'tenant' ? (
                  <span className="text-[10px] text-brand-primary font-bold flex items-center justify-end gap-0.5">
                    <CheckSquare className="w-2.5 h-2.5 text-brand-primary fill-brand-primary/20" />
                    Verified Score: {userProfile.score || 0}%
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                    Verified Landlord
                  </span>
                )}
              </div>
              <div
                className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-semibold text-xs shadow-sm group-hover:scale-105 transition-transform"
                id="user-dashboard-avatar"
              >
                {userProfile.name.split(' ').map((n: string) => n[0]).join('')}
              </div>
            </div>
          ) : (
            /* BEFORE LOGIN ONLY: Hides entirely once authenticated */
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

        {/* Mobile menu avatar/trigger */}
        <div className="md:hidden flex items-center gap-3">
          {userProfile && (
            <div
              onClick={handleProfileClick}
              className="text-xs font-bold bg-brand-light-blue text-brand-primary px-3 py-1.5 rounded-full border border-brand-border/60 cursor-pointer active:scale-95 transition-transform"
              title="Go to Dashboard"
            >
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

      {/* ========================================================= */}
      {/* MOBILE NAVIGATION DRAWERS                                 */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-brand-border/50 py-4 px-6 animate-fade-in shadow-inner">
          <div className="flex flex-col gap-4">

            {/* Mobile Landing Page items */}
            {isLandingPage && (
              <>
                <button
                  onClick={() => { setMobileMenuOpen(false); document.getElementById('properties-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="text-left font-bold text-brand-dark hover:text-brand-primary py-1"
                >
                  Search Properties
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); document.getElementById('match-wizard-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="text-left font-bold text-brand-dark hover:text-brand-primary py-1"
                >
                  Smart Matching Wizard
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); document.getElementById('stability-calculator-section')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="text-left font-bold text-brand-dark hover:text-brand-primary py-1"
                >
                  Calculate Stability Score
                </button>
              </>
            )}

            {/* Mobile Dashboard items */}
            {isDashboardPage && (
              <>
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/tenant-dashboard'); }}
                  className={`text-left font-bold py-1 ${location.pathname === '/tenant-dashboard' ? 'text-brand-primary' : 'text-brand-dark'}`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/rental-history'); }}
                  className={`text-left font-bold py-1 ${location.pathname === '/rental-history' ? 'text-brand-primary' : 'text-brand-dark'}`}
                >
                  Rental History
                </button>
              </>
            )}

            {/* Mobile Property details items */}
            {isDetailOrMatch && (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    const lastId = localStorage.getItem('last_property_id');
                    navigate(lastId ? `/property/${lastId}` : '/properties');
                  }}
                  className="text-left font-bold text-brand-dark hover:text-brand-primary py-1"
                >
                  Properties Details
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/smartmatch'); }}
                  className="text-left font-bold text-brand-dark hover:text-brand-primary py-1"
                >
                  AI Smart Match
                </button>
              </>
            )}

            <hr className="border-brand-border/50" />

            {/* Mobile Auth Management Footer */}
            {userProfile ? (
              /* AFTER LOGIN: Only show profile link card, absolutely no log out choices */
              <div className="flex flex-col gap-3">
                <div
                  onClick={() => { setMobileMenuOpen(false); handleProfileClick(); }}
                  className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-brand-light-blue cursor-pointer transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {userProfile.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-dark">{userProfile.name}</p>
                    <p className="text-xs text-brand-primary font-semibold">View My Dashboard →</p>
                  </div>
                </div>
              </div>
            ) : (
              /* BEFORE LOGIN: Fallback registration block buttons */
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