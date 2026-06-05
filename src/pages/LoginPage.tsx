import { useState } from 'react';
import { Building2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TrustBadges from '../components/TrustBadges';
import LoginScreen from '../components/LoginScreen';
import TenantDashboard from '../components/TenantDashboard';
import LandlordDashboard from '../components/LandlordDashboard';
import Sdg9Hub from '../components/SDG9Hub';
import Register from './RegisterPage';
import { UserSession } from '../types';
import { INITIAL_PROPERTIES, INITIAL_TENANTS, INITIAL_INVOICES, INITIAL_TICKETS, INITIAL_MESSAGES } from '../mockData';

export default function LoginPage() {
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem('mysewa_properties');
    return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
  });
  const [tenants, setTenants] = useState(() => {
    const saved = localStorage.getItem('mysewa_tenants');
    return saved ? JSON.parse(saved) : INITIAL_TENANTS;
  });
  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('mysewa_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });
  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('mysewa_tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('mysewa_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });
  const [session, setSession] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('mysewa_session');
    return saved ? JSON.parse(saved) : null;
  });
  const [showSdgHub, setShowSdgHub] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLoginSuccess = (userSession: UserSession) => {
    setSession(userSession);
    localStorage.setItem('mysewa_session', JSON.stringify(userSession));
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
        {!session ? (
          <div className="w-full flex flex-col items-center justify-center space-y-16 py-8">
            {showRegister ? (
              <Register
                onRegisterSuccess={() => setShowRegister(false)}
                onNavigateToLogin={() => setShowRegister(false)}
              />
            ) : (
              <>
                <LoginScreen
                  onLoginSuccess={handleLoginSuccess}
                  onRegisterClick={() => setShowRegister(true)}
                />
                <TrustBadges />
              </>
            )}
          </div>
        ) : (
          <div className="w-full py-4">
            <div className="flex justify-between items-center bg-white border border-surface-container-high rounded-2xl p-4 mb-6 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                  {session.role === 'tenant' ? 'Connected Tenant Portal' : 'Connected Landlord Authority'}
                </span>
              </div>
              <button onClick={handleLogout} className="text-xs text-primary font-bold hover:underline cursor-pointer">
                Sign Out ✕
              </button>
            </div>
            {session.role === 'tenant' ? (
              <TenantDashboard
                properties={properties}
                invoices={invoices}
                tickets={tickets}
                messages={messages}
                tenants={tenants}
                currentUserEmail={session.email}
                onPayInvoice={(id) => setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'Paid' } : inv))}
                onAddTicket={(t) => setTickets(prev => [{ ...t, id: `tkt-${prev.length + 1}`, propertyId: 'prop-1', propertyTitle: 'My Unit', status: 'Received', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...prev])}
                onSendMessage={(content) => setMessages(prev => [...prev, { id: `msg-${prev.length + 1}`, senderRole: 'Tenant', content, timestamp: new Date().toISOString() }])}
              />
            ) : (
              <LandlordDashboard
                properties={properties}
                tenants={tenants}
                invoices={invoices}
                tickets={tickets}
                messages={messages}
                onToggleOccupancy={(id) => setProperties(prev => prev.map(p => p.id === id ? { ...p, status: p.status === 'occupied' ? 'vacant' : 'occupied' } : p))}
                onAddProperty={(p) => setProperties(prev => [...prev, { ...p, id: `prop-${prev.length + 1}`, status: 'vacant' }])}
                onApproveTenant={(tenantId, propertyId) => setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, status: 'occupied', tenantId } : p))}
                onRejectTenant={(id) => setTenants(prev => prev.filter(t => t.id !== id))}
                onUpdateTicketStatus={(id, status) => setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t))}
                onGenerateInvoice={(inv) => setInvoices(prev => [...prev, { ...inv, id: `inv-${prev.length + 1}`, status: 'Pending' }])}
                onSendMessage={(content) => setMessages(prev => [...prev, { id: `msg-${prev.length + 1}`, senderRole: 'Landlord', content, timestamp: new Date().toISOString() }])}
              />
            )}
          </div>
        )}
      </main>
      <Footer onSdgClick={() => setShowSdgHub(true)} onLinkClick={() => { }} />
      {showSdgHub && <Sdg9Hub onClose={() => setShowSdgHub(false)} />}
    </div>
  );
}