import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sdg9Hub from '../components/SDG9Hub';
import Register from '../components/Register';

export default function RegisterPage() {
    const [showSdgHub, setShowSdgHub] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-brand-background flex flex-col font-sans">
            <Header
                mode="auth"
                onNavigate={() => navigate('/')}
                activeSection=""
                userProfile={null}
                onOpenAuth={() => { }}
                onLogout={() => { }}
            />
            <main className="flex-grow flex flex-col items-center justify-center py-10 px-4 md:px-6">
                <Register
                    onRegisterSuccess={() => navigate('/login')}
                    onNavigateToLogin={() => navigate('/login')}
                />
            </main>
            <Footer onSdgClick={() => setShowSdgHub(true)} onLinkClick={() => { }} />
            {showSdgHub && <Sdg9Hub onClose={() => setShowSdgHub(false)} />}
        </div>
    );
}