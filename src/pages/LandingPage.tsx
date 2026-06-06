import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CheckCircle, MessageSquare, Check, Sparkles, Home, Building2 } from 'lucide-react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import PropertiesSection from '../components/PropertiesSection';
import StabilityCalculator from '../components/StabilityCalculator';
import MatchWizard from '../components/MatchWizard';
import PropertyDetailModal from '../components/PropertyDetailModal';
import Footer from '../components/Footer';
import { Property } from '../types';

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [userProfile] = useState(() => {
    const saved = localStorage.getItem('mysewa_session');
    return saved ? JSON.parse(saved) : null;
  });
  const [userStabilityScore, setUserStabilityScore] = useState<number | null>(null);

  const handleOpenAuth = () => {
    const saved = localStorage.getItem('mysewa_session');
    if (saved) {
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

  const handleSearchKeywordInput = (keyword: string) => {
    navigate(`/properties?search=${keyword}`);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      const sections = ['features-section', 'properties-section', 'stability-calculator-section', 'match-wizard-section'];
      for (const sect of sections) {
        const el = document.getElementById(sect);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            if (sect === 'features-section') setActiveSection('hero');
            if (sect === 'properties-section') setActiveSection('properties');
            if (sect === 'stability-calculator-section') setActiveSection('calculator');
            if (sect === 'match-wizard-section') setActiveSection('wizard');
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f8f9ff]">
      <Header mode="main"
        onNavigate={(sect) => setActiveSection(sect)}
        activeSection={activeSection}
        userProfile={userProfile}
        onOpenAuth={handleOpenAuth}
        onLogout={() => { }}
      />
      <main className="flex-1">
        <Hero
          onSearchSubmit={handleSearchKeywordInput}
          onBrowseClick={() => navigate('/home')}
          onLoginClick={handleOpenAuth}
          userProfile={userProfile}
        />
        <Features
          userStabilityScore={userStabilityScore}
          onNavigateToCalculator={() => {
            const el = document.getElementById('stability-calculator-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
        <PropertiesSection
          onPropertySelect={(prop) => setSelectedProperty(prop)}
          searchKeyword={searchKeyword}
          onClearSearch={() => setSearchKeyword('')}
        />
        <StabilityCalculator
          onCalculate={(score) => setUserStabilityScore(score)}
          currentScore={userStabilityScore}
        />
        <MatchWizard
          onPropertySelect={(prop) => setSelectedProperty(prop)}
        />
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-16">
            <div className="bg-brand-blue-bg text-white rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden shadow-xl">
              <div className="relative z-10 text-center md:text-left space-y-6">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  Ready for a stable rental experience?
                </h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <div className="flex items-center gap-1.5 bg-white/20 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm">
                    <CheckCircle className="w-4 h-4 text-brand-yellow" />
                    <span>Verified Landlords</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/20 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm">
                    <CheckCircle className="w-4 h-4 text-brand-yellow" />
                    <span>Secure Deposit Escrow</span>
                  </div>
                </div>
              </div>
              <div className="relative z-10 flex flex-col sm:flex-row gap-4 shrink-0">
                <button
                  onClick={() => navigate('/home')}
                  className="bg-white text-brand-primary font-extrabold h-12 px-8 rounded-xl shadow-md transition-all text-sm cursor-pointer"
                >
                  Start Searching
                </button>
                <button
                  onClick={handleOpenAuth}
                  className="bg-transparent border border-white/40 text-white font-bold h-12 px-8 rounded-xl transition-all text-sm cursor-pointer"
                >
                  Landlord Portal
                </button>
              </div>
              <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-12 -translate-y-12">
                <Building2 className="w-96 h-96" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer onNavigate={(sect) => setActiveSection(sect)} />
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          userProfile={userProfile}
        />
      )}
    </div>
  );
}