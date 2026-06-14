import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TrustBadges from '../components/TrustBadges';
import LoginScreen from '../components/LoginScreen';
import Sdg9Hub from '../components/SDG9Hub';
import { UserSession } from '../types';
import { useNavigate } from 'react-router-dom';
import { validateSession } from '../utils/sessionUtils';

export default function LoginPage() {
  const navigate = useNavigate();

  // ✅ useEffect MUST be here, before any return
  const [session, setSession] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('mysewa_session');
    if (!saved) return null;
    const parsed: UserSession = JSON.parse(saved);
    return validateSession(parsed) ? parsed : null;
  });

  const [showSdgHub, setShowSdgHub] = useState(false);


  // ✅ Moved up here — hooks cannot come after logic/returns
  useEffect(() => {
    const saved = localStorage.getItem('mysewa_session');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!validateSession(parsed)) {
        localStorage.removeItem('mysewa_session');
      }
    }
  }, []);

  const handleLoginSuccess = (userSession: UserSession) => {
    setSession(userSession);
    localStorage.setItem('mysewa_session', JSON.stringify(userSession));
    if (userSession.role === 'tenant') {
      navigate('/tenant-dashboard');
    } else {
      navigate('/landlord-dashboard');
    }
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem('mysewa_session');
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-sans">
      <Header
        mode="auth"
        onNavigate={() => window.location.href = '/home'}
        activeSection=""
        userProfile={session ? { name: session.name, score: 0, role: session.role } : null}
        onOpenAuth={() => window.location.href = '/login'}
        onLogout={handleLogout}
      />
      <main className="flex-grow flex flex-col items-center justify-center py-10 px-4 md:px-16 w-full max-w-screen-xl mx-auto">
        <div className="w-full mb-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <span>←</span>
            <span>Back to Main</span>
          </button>
        </div>
        <div className="w-full flex flex-col items-center justify-center space-y-16 py-8">
          <>
            <LoginScreen
              onLoginSuccess={handleLoginSuccess}
              onRegisterClick={() => navigate('/register')}
            />
            <TrustBadges />
          </>
        </div>
      </main>
      <Footer onSdgClick={() => setShowSdgHub(true)} onLinkClick={() => { }} />
      {showSdgHub && <Sdg9Hub onClose={() => setShowSdgHub(false)} />}
    </div>
  );
}