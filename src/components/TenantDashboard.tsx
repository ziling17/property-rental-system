/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building2, Calendar, ClipboardList, Send, FileText, CheckCircle2, 
  Clock, AlertTriangle, Play, HelpCircle, ArrowRight, ShieldCheck, Cpu 
} from 'lucide-react';
import { Property, Invoice, MaintenanceTicket, Message, Tenant } from '../types';

interface TenantDashboardProps {
  properties: Property[];
  invoices: Invoice[];
  tickets: MaintenanceTicket[];
  messages: Message[];
  tenants: Tenant[];
  currentUserEmail: string;
  onPayInvoice: (invoiceId: string) => void;
  onAddTicket: (ticket: { title: string; description: string; priority: 'Low' | 'Medium' | 'High' }) => void;
  onSendMessage: (content: string) => void;
}

export default function TenantDashboard({
  properties,
  invoices,
  tickets,
  messages,
  tenants,
  currentUserEmail,
  onPayInvoice,
  onAddTicket,
  onSendMessage
}: TenantDashboardProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'lease' | 'billing' | 'maintenance' | 'messages'>('home');

  // Input states
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [newTicketDesc, setNewTicketDesc] = useState('');
  const [newTicketPriority, setNewTicketPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Payment states
  const [payingInvoiceId, setPayingInvoiceId] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<'idle' | 'authorizing' | 'success'>('idle');

  // Match the logged in tenant profile
  const tenantProfile = tenants.find(t => t.email.toLowerCase() === currentUserEmail.toLowerCase()) || tenants[1]; // fallback to Ding Ziling
  const occupiedProperty = properties.find(p => p.tenantId === tenantProfile.id) || properties[0];

  const tenantInvoices = invoices.filter(inv => inv.tenantName.toLowerCase() === tenantProfile.name.toLowerCase());
  const tenantTickets = tickets.filter(t => t.propertyId === occupiedProperty.id);

  // Handlers
  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketTitle || !newTicketDesc) return;
    
    onAddTicket({
      title: newTicketTitle,
      description: newTicketDesc,
      priority: newTicketPriority
    });

    setTicketSuccess(true);
    setNewTicketTitle('');
    setNewTicketDesc('');
    setTimeout(() => setTicketSuccess(false), 3000);
  };

  const startPayment = (invoiceId: string) => {
    setPayingInvoiceId(invoiceId);
    setPaymentStep('authorizing');
    setTimeout(() => {
      onPayInvoice(invoiceId);
      setPaymentStep('success');
      setTimeout(() => {
        setPaymentStep('idle');
        setPayingInvoiceId(null);
      }, 1500);
    }, 1500);
  };

  const handleSendChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    onSendMessage(chatInput);
    const sentMsg = chatInput;
    setChatInput('');

    // Trigger mock landlord typing responsive feedback after 2s
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 2500);
  };

  return (
    <div id="tenant-dashboard-container" className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Left Sidebar Menu */}
      <div id="tenant-sidebar-nav" className="lg:col-span-1 space-y-4">
        {/* Short Profile Card */}
        <div className="bg-surface-container rounded-2xl p-5 border border-surface-container-high text-center">
          <div className="h-16 w-16 bg-white border-2 border-primary rounded-2xl flex items-center justify-center text-2xl mx-auto shadow-xs mb-3">
            👤
          </div>
          <h3 className="font-bold text-lg text-on-surface leading-tight">
            {tenantProfile.name}
          </h3>
          <p className="text-xs text-on-surface-variant font-medium mt-1">
            {tenantProfile.email}
          </p>
          <div className="inline-flex items-center gap-1.5 mt-3 py-1 px-3 bg-[#f0fdf4] text-green-700 text-xs font-semibold rounded-full border border-green-100">
            <ShieldCheck size={14} />
            Verified SDG 9 Tenant
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl border border-surface-container-high p-2.5 space-y-1 shadow-xs">
          <button
            onClick={() => setActiveTab('home')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-colors ${
              activeTab === 'home'
                ? 'bg-primary text-white'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
            }`}
            id="tab-tenant-home"
          >
            <Building2 size={18} />
            Overview Home
          </button>
          <button
            onClick={() => setActiveTab('lease')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-colors ${
              activeTab === 'lease'
                ? 'bg-primary text-white'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
            }`}
            id="tab-tenant-lease"
          >
            <Cpu size={18} />
            My Eco-Lease
          </button>
          <button
            onClick={() => { setActiveTab('billing'); }}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-colors relative ${
              activeTab === 'billing'
                ? 'bg-primary text-white'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
            }`}
            id="tab-tenant-billing"
          >
            <FileText size={18} />
            Billing & Invoices
            {tenantInvoices.some(inv => inv.status === 'Pending') && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-colors ${
              activeTab === 'maintenance'
                ? 'bg-primary text-white'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
            }`}
            id="tab-tenant-maintenance"
          >
            <ClipboardList size={18} />
            Service Tickets
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-colors ${
              activeTab === 'messages'
                ? 'bg-primary text-white'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
            }`}
            id="tab-tenant-messages"
          >
            <Send size={18} />
            Direct Messages
          </button>
        </div>

        {/* Dynamic Micro-bond Progress Card */}
        <div className="bg-[#fffbeb] rounded-2xl p-5 border border-amber-200/50 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#b45309] uppercase tracking-wider">
              Smart Deposit Bond Balance
            </span>
            <span className="inline-block px-1.5 py-0.5 bg-amber-100 text-[#b45309] text-[9px] font-bold rounded">
              SDG 9 Yielding
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-900">${occupiedProperty.depositAmount}</div>
            <p className="text-[11px] text-[#92400e] mt-1">
              Escrow stored in municipal infrastucture micro-bonds.
            </p>
          </div>
          {/* Progress gauge */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-[#92400e] font-semibold">
              <span>Earned Yield: +$14.80</span>
              <span>4.2% APY</span>
            </div>
            <div className="w-full bg-[#fef3c7] h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-600 h-full w-[65%] rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Panel Content Area */}
      <div id="tenant-main-content" className="lg:col-span-3 space-y-6">
        {/* Dynamic Payment Portal Overlay during payment */}
        {paymentStep !== 'idle' && (
          <div id="billing-payment-overlay" className="fixed inset-0 bg-on-background/35 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center border border-surface-container-high shadow-2xl">
              {paymentStep === 'authorizing' ? (
                <>
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <h3 className="font-bold text-lg text-on-surface">Decrypting Handshake</h3>
                  <p className="text-xs text-on-surface-variant mt-2">
                    Routing rent token transfer securely through municipal micro-bond vaults...
                  </p>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4 border border-green-100 animate-bounce">
                    <CheckCircle2 size={28} />
                  </div>
                  <h3 className="font-bold text-lg text-on-surface">Payment Settled!</h3>
                  <p className="text-xs text-green-700 font-semibold bg-green-50 max-w-xs mx-auto py-1 px-3 rounded-lg border border-green-100 mt-2">
                    Rent verified. SDG 9 loyalty tokens dispatched.
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* TAB 1: OVERVIEW HOME */}
        {activeTab === 'home' && (
          <div id="tenant-tab-home" className="space-y-6 animate-fadeIn">
            {/* Greeting block */}
            <div className="bg-white border border-surface-container-high rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-primary/5 to-transparent pointer-events-none" />
              <div className="max-w-xl space-y-2">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  ACTIVE TENANCY DASHBOARD
                </span>
                <h2 className="text-2xl font-bold text-on-surface">
                  Welcome to {occupiedProperty.title}
                </h2>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Your modular housing unit has been pre-screened and certified under SDG 9 resource compliance parameters. Everything is running nominally.
                </p>
              </div>
            </div>

            {/* Quick Metrics Bento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-surface-container-high flex items-center justify-between shadow-xs">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Monthly Rent Detail
                  </div>
                  <div className="text-xl font-bold text-on-surface mt-1">
                    ${occupiedProperty.rentAmount}/mo
                  </div>
                  <div className="text-[11px] text-green-700 font-medium mt-1">
                    Next due: July 1
                  </div>
                </div>
                <div className="bg-surface-container-low p-3 rounded-xl text-primary shrink-0">
                  <Calendar size={20} />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-surface-container-high flex items-center justify-between shadow-xs">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Active Service Tickets
                  </div>
                  <div className="text-xl font-bold text-on-surface mt-1">
                    {tenantTickets.filter(t => t.status !== 'Resolved').length} Active
                  </div>
                  <div className="text-[11px] text-on-surface-variant mt-1">
                    Latest status: {tenantTickets[0]?.status || 'None'}
                  </div>
                </div>
                <div className="bg-surface-container-low p-3 rounded-xl text-primary shrink-0">
                  <ClipboardList size={20} />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-surface-container-high flex items-center justify-between shadow-xs">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Sewa Rent Trust Score
                  </div>
                  <div className="text-xl font-bold text-green-700 mt-1">
                    {tenantProfile.creditScore} / 850
                  </div>
                  <div className="text-[11px] text-primary font-medium mt-1">
                    Exemplary Payment Record
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded-xl text-green-700 shrink-0 border border-green-100">
                  <ShieldCheck size={20} />
                </div>
              </div>
            </div>

            {/* Active Property Card Highlight */}
            <div className="bg-white border border-surface-container-high rounded-3xl overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-2">
              <div className="h-64 md:h-auto overflow-hidden relative">
                <img 
                  src={occupiedProperty.image} 
                  alt={occupiedProperty.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <span className="absolute top-4 left-4 inline-block bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                  Smart Tech Cert
                </span>
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Property Allocation Detail
                  </span>
                  <h3 className="text-xl font-bold text-on-surface">
                    {occupiedProperty.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    📍 {occupiedProperty.address}
                  </p>
                  <p className="text-xs leading-relaxed text-on-surface-variant pt-2 border-t border-surface-container-high">
                    Equipped with automated power grid linkages, optimized waste processing, and local fiber connectivity. Certified high infrastructure resilience.
                  </p>
                </div>

                <div className="flex items-center gap-6 pt-4 text-xs font-semibold text-on-surface">
                  <span className="flex items-center gap-1.5 bg-surface-container-low py-1.5 px-3 rounded-lg">
                    📐 {occupiedProperty.size}
                  </span>
                  <span className="flex items-center gap-1.5 bg-surface-container-low py-1.5 px-3 rounded-lg">
                    🛏️ {occupiedProperty.bedrooms} Bed
                  </span>
                  <span className="flex items-center gap-1.5 bg-surface-container-low py-1.5 px-3 rounded-lg">
                    🚿 {occupiedProperty.bathrooms} Bath
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY ECO-LEASE */}
        {activeTab === 'lease' && (
          <div id="tenant-tab-lease" className="bg-white border border-surface-container-high rounded-3xl p-6 md:p-8 space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold text-on-surface">
                Eco-Lease Specifications
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Authorized digital matching parameters under UN SDG 9 global standards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-surface-container-high">
              <div className="space-y-4">
                <h4 className="font-semibold text-on-surface text-sm">Contingency Bond Escrow</h4>
                <div className="p-4 bg-surface-container-low rounded-xl space-y-2 border border-surface-container">
                  <div className="flex justify-between text-xs">
                    <span className="text-on-surface-variant">Deposit Amount:</span>
                    <span className="font-bold text-on-surface">${occupiedProperty.depositAmount}.00</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-on-surface-variant">Holder Institution:</span>
                    <span className="font-bold text-on-surface">Sewa Municipal Green Fund</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-on-surface-variant">Maturity Status:</span>
                    <span className="text-green-700 font-bold bg-green-50 px-1.5 py-0.5 rounded text-[10px]">Active & Yielding</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-on-surface text-sm">Industrial Compliance Ratings Information</h4>
                <div className="p-4 bg-surface-container-low rounded-xl space-y-2 border border-surface-container">
                  <div className="flex justify-between text-xs">
                    <span className="text-on-surface-variant">Carbon-smart HVAC:</span>
                    <span className="font-bold text-[#a18100]">A+ Rated</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-on-surface-variant">Drywall Eco-Material:</span>
                    <span className="font-bold text-primary">Certified Prefab</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-on-surface-variant">Match Priority Quality:</span>
                    <span className="font-bold text-green-700">{tenantProfile.matchingScore}% Perfect match</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#f0f9ff] text-primary rounded-2xl flex gap-3 text-xs leading-relaxed border border-blue-100">
              <Cpu size={18} className="shrink-0 mt-0.5" />
              <div>
                <strong>How modular construction saves you money:</strong> Because pre-screened landlords utilize municipal industrial guidelines to construct high-performance walls, heating bills are reduced by averages of 24%. MySewa credits these allocations directly back to your rental profile history.
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BILLING & INVOICES */}
        {activeTab === 'billing' && (
          <div id="tenant-tab-billing" className="bg-white border border-surface-container-high rounded-3xl p-6 md:p-8 space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-on-surface">
                  Billing Ledgers & Receipts
                </h2>
                <p className="text-xs text-on-surface-variant mt-1">
                  Manage outstanding security deposits and monthly rent invoices safely.
                </p>
              </div>
              <span className="bg-green-50 text-green-700 font-bold text-xs py-1.5 px-3 rounded-lg border border-green-100 flex items-center gap-1.5 shrink-0">
                <ShieldCheck size={14} />
                Escrow Guarantee Act Enabled
              </span>
            </div>

            {/* List Table */}
            <div className="overflow-x-auto pt-4 border-t border-surface-container-high">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-surface-container-high text-on-surface-variant font-semibold">
                    <th className="pb-3 font-semibold">Reference ID</th>
                    <th className="pb-3 font-semibold">Description</th>
                    <th className="pb-3 font-semibold">Due Date</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold text-center">Status</th>
                    <th className="pb-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container/50">
                  {tenantInvoices.map((inv) => (
                    <tr key={inv.id} className="text-on-surface group hover:bg-surface-container-lowest transition-colors">
                      <td className="py-4 font-mono font-bold text-primary">{inv.id}</td>
                      <td className="py-4">
                        <div className="font-semibold">{inv.propertyTitle}</div>
                        <div className="text-[10px] text-on-surface-variant uppercase mt-0.5">Recurring Monthly Rent</div>
                      </td>
                      <td className="py-4 text-on-surface-variant">
                        {inv.dueDate}
                      </td>
                      <td className="py-4 font-bold text-[#1f2937]">
                        ${inv.amount}.00
                      </td>
                      <td className="py-4 text-center">
                        <span className={`inline-block px-2 py-1.5 rounded-lg text-[9px] font-bold ${
                          inv.status === 'Paid'
                            ? 'bg-green-50 text-green-700 border border-green-100'
                            : 'bg-orange-50 text-orange-700 border border-orange-100'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        {inv.status === 'Pending' ? (
                          <button
                            onClick={() => startPayment(inv.id)}
                            className="bg-primary text-white hover:bg-primary-container px-3.5 py-1.5 rounded-lg font-semibold text-xs transition-colors shadow-xs"
                            id={`pay-btn-${inv.id}`}
                          >
                            Pay Rent
                          </button>
                        ) : (
                          <span className="text-xs text-on-surface-variant font-medium">Receipt Sent ✓</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {tenantInvoices.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-on-surface-variant">
                        No outstanding billing invoice records located.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: SERVICE TICKETS */}
        {activeTab === 'maintenance' && (
          <div id="tenant-tab-maintenance" className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
            {/* LHS: File new Ticket */}
            <div className="md:col-span-1 bg-white border border-surface-container-high rounded-3xl p-5 space-y-4">
              <div>
                <h3 className="font-bold text-base text-on-surface">Raise Support Ticket</h3>
                <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                  Notice air filter anomalies, light bulb flickers, or water pressure changes? File it below.
                </p>
              </div>

              {ticketSuccess && (
                <div className="p-3 bg-green-50 text-green-700 border border-green-100 rounded-xl text-xs font-medium animate-bounce">
                  Ticket dispatched to Admin! Landlords can resolve/schedule it immediately.
                </div>
              )}

              <form onSubmit={handleTicketSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="ticket-title-input" className="text-[11px] font-semibold text-on-surface-variant">Brief Title</label>
                  <input
                    id="ticket-title-input"
                    className="w-full px-3 py-2 border border-outline-variant rounded-xl text-xs bg-white text-on-surface focus:ring-1 focus:ring-primary outline-hidden"
                    placeholder="e.g. Bathroom drain slowing"
                    type="text"
                    value={newTicketTitle}
                    onChange={(e) => setNewTicketTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="ticket-desc-textarea" className="text-[11px] font-semibold text-on-surface-variant">Description Details</label>
                  <textarea
                    id="ticket-desc-textarea"
                    className="w-full px-3 py-2 border border-outline-variant rounded-xl text-xs bg-white text-on-surface focus:ring-1 focus:ring-primary outline-hidden h-20 resize-none"
                    placeholder="Identify specific location and behaviors..."
                    value={newTicketDesc}
                    onChange={(e) => setNewTicketDesc(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="ticket-priority-select" className="text-[11px] font-semibold text-on-surface-variant">Incident Priority</label>
                  <select
                    id="ticket-priority-select"
                    className="w-full px-3 py-2 border border-outline-variant rounded-xl text-xs bg-white text-on-surface focus:ring-1 focus:ring-primary outline-hidden cursor-pointer"
                    value={newTicketPriority}
                    onChange={(e) => setNewTicketPriority(e.target.value as any)}
                  >
                    <option value="Low">Low - Cosmetic / Optimization</option>
                    <option value="Medium">Medium - Standard Repair</option>
                    <option value="High">High - Emergency Malfunction</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-xs"
                  id="dispath-ticket-btn"
                >
                  File Ticket
                </button>
              </form>
            </div>

            {/* RHS: List existing Tickets */}
            <div className="md:col-span-2 bg-white border border-surface-container-high rounded-3xl p-6 space-y-6">
              <div>
                <h3 className="font-bold text-base text-on-surface">Registered Tickets History</h3>
                <p className="text-[11px] text-on-surface-variant mt-1">
                  Real-time synchronization with active municipal repair crews.
                </p>
              </div>

              <div className="space-y-4">
                {tenantTickets.map((tkt) => (
                  <div key={tkt.id} className="p-4 rounded-2xl border border-surface-container bg-surface-container-low flex justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-primary">{tkt.id}</span>
                        <h4 className="font-bold text-xs text-on-surface">{tkt.title}</h4>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-1 leading-normal max-w-md">
                        {tkt.description}
                      </p>
                      <div className="flex items-center gap-4 text-[10px] text-on-surface-variant pt-2 border-t border-surface-container/30">
                        <span>Filed: {tkt.createdAt}</span>
                        <span className={`inline-block font-mono font-bold uppercase ${
                          tkt.priority === 'High' ? 'text-red-600' : 'text-on-surface-variant'
                        }`}>
                          Priority: {tkt.priority}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0 justify-between">
                      <span className={`inline-block px-2 py-1 rounded text-[9px] font-bold ${
                        tkt.status === 'Resolved'
                          ? 'bg-green-50 text-green-700 border border-green-100'
                          : tkt.status === 'Scheduled'
                          ? 'bg-blue-50 text-blue-700 border border-blue-100 animate-pulse'
                          : 'bg-orange-50 text-orange-700 border border-orange-100'
                      }`}>
                        {tkt.status}
                      </span>
                      <span className="text-[9px] text-on-surface-variant">Update: {tkt.updatedAt}</span>
                    </div>
                  </div>
                ))}
                {tenantTickets.length === 0 && (
                  <div className="text-center py-8 text-on-surface-variant text-xs">
                    No support logs found. Use the form on the left to file!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: MESSENGER */}
        {activeTab === 'messages' && (
          <div id="tenant-tab-messages" className="bg-white border border-surface-container-high rounded-3xl p-6 md:p-8 flex flex-col h-[520px] animate-fadeIn">
            <div className="flex justify-between items-center pb-4 border-b border-surface-container-high shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold shadow-xs shrink-0">
                  🏢
                </div>
                <div>
                  <h3 className="font-bold text-sm text-on-surface">Landlord Connection Vault</h3>
                  <p className="text-[10px] text-green-700 font-semibold flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping shrink-0" />
                    Online - Aligned Landlord Authority
                  </p>
                </div>
              </div>
              <span className="text-[10px] bg-sky-50 text-primary px-2.5 py-1 rounded-lg border border-sky-100 font-semibold">
                Direct Sync Log
              </span>
            </div>

            {/* Chats Container */}
            <div className="flex-grow overflow-y-auto py-6 space-y-4 pr-1 scroll-smooth">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${
                    msg.senderRole === 'Tenant'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div 
                    className={`max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed shadow-xs ${
                      msg.senderRole === 'Tenant'
                        ? 'bg-primary text-white rounded-tr-xs'
                        : 'bg-surface-container text-on-surface rounded-tl-xs'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <span className={`text-[9px] block mt-1.5 text-right ${
                      msg.senderRole === 'Tenant' ? 'text-white/70' : 'text-on-surface-variant'
                    }`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-surface-container rounded-2xl rounded-tl-xs p-4 text-xs text-on-surface-variant shadow-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce shrink-0" />
                    <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce shrink-0 delay-100" />
                    <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce shrink-0 delay-200" />
                    <span>Landlord typing compliance advice...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Action Form */}
            <form onSubmit={handleSendChatSubmit} className="flex gap-2 pt-4 border-t border-surface-container-high shrink-0">
              <input
                className="flex-grow px-4 h-12 bg-white border border-outline-variant rounded-xl text-xs text-on-surface focus:ring-1 focus:ring-primary outline-hidden"
                placeholder="Secure message to landlord..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-12 h-12 bg-primary text-white hover:bg-primary-container rounded-xl flex items-center justify-center transition-all shadow-xs active:scale-95 shrink-0"
                id="send-message-btn"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
