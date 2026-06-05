/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building2, Users, FileText, ClipboardList, Send, PlusCircle, CheckCircle2, 
  X, AlertTriangle, ShieldCheck, Cpu, ArrowUpRight, Grid 
} from 'lucide-react';
import { Property, Tenant, Invoice, MaintenanceTicket, Message } from '../types';

interface LandlordDashboardProps {
  properties: Property[];
  tenants: Tenant[];
  invoices: Invoice[];
  tickets: MaintenanceTicket[];
  messages: Message[];
  onToggleOccupancy: (propertyId: string) => void;
  onAddProperty: (property: Omit<Property, 'id' | 'status'>) => void;
  onApproveTenant: (tenantId: string, propertyId: string) => void;
  onRejectTenant: (tenantId: string) => void;
  onUpdateTicketStatus: (ticketId: string, status: 'Received' | 'Scheduled' | 'Resolved') => void;
  onGenerateInvoice: (invoice: Omit<Invoice, 'id' | 'status'>) => void;
  onSendMessage: (content: string) => void;
}

export default function LandlordDashboard({
  properties,
  tenants,
  invoices,
  tickets,
  messages,
  onToggleOccupancy,
  onAddProperty,
  onApproveTenant,
  onRejectTenant,
  onUpdateTicketStatus,
  onGenerateInvoice,
  onSendMessage
}: LandlordDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'screening' | 'billing' | 'maintenance' | 'messages'>('overview');

  // Modal control states
  const [showAddPropModal, setShowAddPropModal] = useState(false);
  const [showGenerateInvoiceModal, setShowGenerateInvoiceModal] = useState(false);

  // Form states - Add Property
  const [propTitle, setPropTitle] = useState('');
  const [propAddress, setPropAddress] = useState('');
  const [propRent, setPropRent] = useState('');
  const [propDeposit, setPropDeposit] = useState('');
  const [propSize, setPropSize] = useState('');
  const [propBeds, setPropBeds] = useState('');
  const [propBaths, setPropBaths] = useState('');

  // Form states - Generate Invoice
  const [selectedTenantName, setSelectedTenantName] = useState('');
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [invoiceDueDate, setInvoiceDueDate] = useState('');
  const [invoicePropId, setInvoicePropId] = useState('');

  // Direct action success feedback states
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Landlord direct messaging state
  const [landlordChatInput, setLandlordChatInput] = useState('');

  // Metrics calculations
  const totalProperties = properties.length;
  const occupiedCount = properties.filter(p => p.status === 'occupied').length;
  const occupancyRate = totalProperties > 0 ? Math.round((occupiedCount / totalProperties) * 100) : 0;
  
  const pendingInvoicesAmount = invoices
    .filter(inv => inv.status === 'Pending')
    .reduce((sum, current) => sum + current.amount, 0);
  
  const totalRevenueCollected = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, current) => sum + current.amount, 0);

  const pendingTickets = tickets.filter(t => t.status !== 'Resolved').length;

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propTitle || !propAddress || !propRent || !propSize) return;

    onAddProperty({
      title: propTitle,
      address: propAddress,
      rentAmount: Number(propRent),
      depositAmount: Number(propDeposit) || Number(propRent),
      size: propSize,
      bedrooms: Number(propBeds) || 1,
      bathrooms: Number(propBaths) || 1,
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80' // default modern apartment aesthetic
    });

    setPropTitle('');
    setPropAddress('');
    setPropRent('');
    setPropDeposit('');
    setPropSize('');
    setPropBeds('');
    setPropBaths('');
    setShowAddPropModal(false);
    triggerFeedback('Property successfully listed in standard directory!');
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenantName || !invoiceAmount || !invoiceDueDate || !invoicePropId) return;

    const matchedProp = properties.find(p => p.id === invoicePropId);
    
    onGenerateInvoice({
      propertyId: invoicePropId,
      propertyTitle: matchedProp ? matchedProp.title : 'MySewa Property Unit',
      tenantName: selectedTenantName,
      amount: Number(invoiceAmount),
      dueDate: invoiceDueDate
    });

    setSelectedTenantName('');
    setInvoiceAmount('');
    setInvoiceDueDate('');
    setInvoicePropId('');
    setShowGenerateInvoiceModal(false);
    triggerFeedback('Billing invoice successfully generated and dispatched!');
  };

  const handleApproveScreening = (tenantId: string, propertyId: string) => {
    onApproveTenant(tenantId, propertyId);
    triggerFeedback('Tenant successfully matching credentials validated! Unit occupied.');
  };

  const handleRejectScreening = (tenantId: string) => {
    onRejectTenant(tenantId);
    triggerFeedback('Application dismissed.');
  };

  const handleUpdateTicket = (ticketId: string, nextStatus: 'Received' | 'Scheduled' | 'Resolved') => {
    onUpdateTicketStatus(ticketId, nextStatus);
    triggerFeedback(`Ticket status updated to [${nextStatus}] successfully.`);
  };

  const handleLandlordChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!landlordChatInput.trim()) return;
    onSendMessage(landlordChatInput);
    setLandlordChatInput('');
  };

  const triggerFeedback = (message: string) => {
    setActionFeedback(message);
    setTimeout(() => {
      setActionFeedback(null);
    }, 4000);
  };

  return (
    <div id="landlord-dashboard-container" className="space-y-6">
      
      {/* Upper Metrics Bento Grid Row */}
      <div id="landlord-metrics-grid" className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Metric 1: Occupancy */}
        <div className="bg-white p-5 rounded-2xl border border-surface-container-high flex items-center justify-between shadow-xs relative overflow-hidden">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">
              Occupancy Ratio
            </span>
            <div className="text-3xl font-bold text-on-surface mt-1">
              {occupancyRate}%
            </div>
            <p className="text-[11px] text-on-surface-variant font-medium mt-1">
              {occupiedCount} of {totalProperties} units filled
            </p>
          </div>
          <div className="bg-surface-container-low p-4 rounded-2xl text-primary shrink-0">
            <Building2 size={24} />
          </div>
        </div>

        {/* Metric 2: Revenue Collected */}
        <div className="bg-white p-5 rounded-2xl border border-surface-container-high flex items-center justify-between shadow-xs relative overflow-hidden">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">
              Gross Revenue Paid
            </span>
            <div className="text-3xl font-bold text-green-700 mt-1">
              ${totalRevenueCollected}.00
            </div>
            <p className="text-[11px] text-green-700 font-semibold mt-1">
              No outstanding overdues
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-2xl text-green-700 shrink-0 border border-green-100">
            <CheckCircle2 size={24} />
          </div>
        </div>

        {/* Metric 3: Active Receivables */}
        <div className="bg-white p-5 rounded-2xl border border-surface-container-high flex items-center justify-between shadow-xs relative overflow-hidden">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">
              Pending Receivables
            </span>
            <div className="text-3xl font-bold text-[#b45309] mt-1">
              ${pendingInvoicesAmount}.00
            </div>
            <p className="text-[11px] text-[#b45309] font-semibold mt-1">
              {invoices.filter(inv => inv.status === 'Pending').length} active statements
            </p>
          </div>
          <div className="bg-amber-50 p-4 rounded-2xl text-amber-700 shrink-0 border border-amber-100">
            <FileText size={24} />
          </div>
        </div>

        {/* Metric 4: Maintenance load */}
        <div className="bg-white p-5 rounded-2xl border border-surface-container-high flex items-center justify-between shadow-xs relative overflow-hidden">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block">
              Active Support Load
            </span>
            <div className="text-3xl font-bold text-on-surface mt-1">
              {pendingTickets} Open
            </div>
            <p className="text-[11px] text-on-surface-variant font-medium mt-1">
              {tickets.filter(t => t.status === 'Received').length} unassigned tickets
            </p>
          </div>
          <div className="bg-surface-container-low p-4 rounded-2xl text-primary shrink-0">
            <ClipboardList size={24} />
          </div>
        </div>
      </div>

      {/* Floating Action Notifications if any */}
      {actionFeedback && (
        <div id="landlord-action-toast" className="p-4 bg-green-50 border border-green-100 text-green-800 text-xs font-semibold rounded-2xl flex items-center gap-2.5 animate-bounce shadow-md max-w-md">
          <CheckCircle2 size={16} className="text-green-600 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Primary Tab Navigation Menu */}
      <div id="landlord-horizontal-nav" className="bg-white border border-surface-container-high p-1.5 rounded-2xl flex flex-wrap gap-2 shadow-xs shrink-0">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-primary text-white shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
          }`}
          id="tab-landlord-overview"
        >
          Overview Dashboard
        </button>
        <button
          onClick={() => setActiveTab('properties')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'properties'
              ? 'bg-primary text-white shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
          }`}
          id="tab-landlord-properties"
        >
          My Assets ({properties.length})
        </button>
        <button
          onClick={() => setActiveTab('screening')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
            activeTab === 'screening'
              ? 'bg-primary text-white shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
          }`}
          id="tab-landlord-screening"
        >
          Matching Screener
          {tenants.some(t => {
            // Unallocated pre-screened people waiting for matching property
            return !properties.some(p => p.tenantId === t.id);
          }) && (
            <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-pulse">
              !
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'billing'
              ? 'bg-primary text-white shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
          }`}
          id="tab-landlord-billing"
        >
          Billing Control
        </button>
        <button
          onClick={() => setActiveTab('maintenance')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'maintenance'
              ? 'bg-primary text-white shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
          }`}
          id="tab-landlord-maintenance"
        >
          Service Tickets ({pendingTickets})
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'messages'
              ? 'bg-primary text-white shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
          }`}
          id="tab-landlord-messages"
        >
          Tenant Messages Log
        </button>
      </div>

      {/* Main Content Area panels */}
      <div id="landlord-main-panel-view" className="space-y-6">

        {/* TAB 1: OVERVIEW & SVG GRAPHS */}
        {activeTab === 'overview' && (
          <div id="landlord-panel-overview" className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
            {/* Rent performance graph */}
            <div className="md:col-span-2 bg-white rounded-3xl border border-surface-container-high p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-base text-on-surface">Rent Distribution Performance</h3>
                  <p className="text-[11px] text-on-surface-variant">
                    Comparison of gross billed assets vs. real collection cycles.
                  </p>
                </div>
                <span className="text-[10px] bg-green-50 text-green-700 font-bold border border-green-100 px-2 py-1 rounded-md">
                  100% Secure Receipts
                </span>
              </div>

              {/* Responsive SVG chart representing custom Recharts replacement */}
              <div className="h-56 w-full pt-4 relative bg-surface-container-low rounded-2xl border border-surface-container flex flex-col justify-end p-4">
                <div className="flex items-end justify-around h-full w-full pb-4 px-2">
                  {/* Jan bar */}
                  <div className="flex flex-col items-center gap-1.5 w-12">
                    <div className="text-[10.5px] font-mono font-bold text-primary">$1.2K</div>
                    <div className="w-6 h-12 bg-primary rounded-t-md hover:brightness-110 transition-all duration-300" title="Billed Jan: $1200" />
                    <span className="text-[9px] text-on-surface-variant font-semibold">Jan</span>
                  </div>
                  {/* Feb bar */}
                  <div className="flex flex-col items-center gap-1.5 w-12">
                    <div className="text-[10.5px] font-mono font-bold text-primary">$1.8K</div>
                    <div className="w-6 h-18 bg-primary rounded-t-md hover:brightness-110 transition-all duration-300" title="Billed Feb: $1800" />
                    <span className="text-[9px] text-on-surface-variant font-semibold">Feb</span>
                  </div>
                  {/* Mar bar */}
                  <div className="flex flex-col items-center gap-1.5 w-12">
                    <div className="text-[10.5px] font-mono font-bold text-primary">$2.4K</div>
                    <div className="w-6 h-24 bg-primary rounded-t-md hover:brightness-110 transition-all duration-300" title="Billed Mar: $2400" />
                    <span className="text-[9px] text-on-surface-variant font-semibold">Mar</span>
                  </div>
                  {/* Apr bar */}
                  <div className="flex flex-col items-center gap-1.5 w-12">
                    <div className="text-[10.5px] font-mono font-bold text-primary">$3.1K</div>
                    <div className="w-6 h-32 bg-primary rounded-t-md hover:brightness-110 transition-all duration-300 relative" title="Billed Apr: $3100">
                      <div className="absolute top-0 right-0 left-0 h-4 bg-tertiary-container opacity-85 rounded-t-md" title="SDG 9 Bonus yield" />
                    </div>
                    <span className="text-[9px] text-on-surface-variant font-semibold">Apr</span>
                  </div>
                  {/* May bar */}
                  <div className="flex flex-col items-center gap-1.5 w-12">
                    <div className="text-[10.5px] font-mono font-bold text-primary">$4.5K</div>
                    <div className="w-6 h-40 bg-primary rounded-t-md hover:brightness-110 transition-all duration-300" title="Billed May: $4500" />
                    <span className="text-[9px] text-on-surface-variant font-semibold">May</span>
                  </div>
                </div>

                <div className="border-t border-surface-container-high pt-2 flex justify-between items-center text-[10px] text-on-surface-variant font-medium">
                  <span>Legend: 🟦 Base rent collections</span>
                  <span className="font-mono text-primary font-bold">Total target: $4500/mo</span>
                </div>
              </div>
            </div>

            {/* Quick action quicklist on right */}
            <div className="bg-white rounded-3xl border border-surface-container-high p-6 space-y-4">
              <h3 className="font-bold text-base text-on-surface">Platform Compliance Tools</h3>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Configure housing indices conforming with the requirements of regional infrastructure development plans.
              </p>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => setShowAddPropModal(true)}
                  className="w-full text-left p-3.5 bg-surface-container-low hover:bg-surface-container border border-surface-container-high rounded-xl text-xs font-semibold text-primary transition-all flex items-center justify-between"
                  id="add-prop-quicklink"
                >
                  <span>List New Modular Unit</span>
                  <PlusCircle size={16} />
                </button>

                <button
                  onClick={() => setShowGenerateInvoiceModal(true)}
                  className="w-full text-left p-3.5 bg-surface-container-low hover:bg-surface-container border border-surface-container-high rounded-xl text-xs font-semibold text-primary transition-all flex items-center justify-between"
                  id="gen-invoice-quicklink"
                >
                  <span>Dispatch Rent Request</span>
                  <PlusCircle size={16} />
                </button>
                
                <div className="p-3 bg-[#fdfaf2] text-[#735c00] rounded-xl text-[11px] border border-[#f5ebcb] leading-relaxed">
                  <strong>⭐ SDG 9 Trust scoring active:</strong> Pre-screened tenants here feature verified banking matching tags, lessening deposit disputes.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY PROPERTIES PORTFOLIO */}
        {activeTab === 'properties' && (
          <div id="landlord-panel-properties" className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-surface-container-high">
              <div>
                <h2 className="text-lg font-bold text-on-surface">Registered Residential Assets</h2>
                <p className="text-xs text-on-surface-variant mt-1">
                  Manage occupancy targets and toggle statuses manually if offline adjustments occur.
                </p>
              </div>
              <button
                onClick={() => setShowAddPropModal(true)}
                className="bg-primary text-white hover:bg-primary-container px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                id="add-prop-main-btn"
              >
                <PlusCircle size={14} />
                Add Property Unit
              </button>
            </div>

            {/* List Array Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {properties.map((prop) => (
                <div key={prop.id} className="bg-white border border-surface-container-high rounded-3xl overflow-hidden shadow-xs flex flex-col md:flex-row">
                  <div className="w-full md:w-40 h-40 overflow-hidden relative shrink-0">
                    <img src={prop.image} alt={prop.title} className="w-full h-full object-cover" />
                    <span className={`absolute top-2 left-2 text-[10px] font-bold py-1 px-2.5 rounded-md text-white ${
                      prop.status === 'occupied' ? 'bg-[#15803d]' : 'bg-[#a18100]'
                    }`}>
                      {prop.status}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col justify-between flex-grow space-y-3">
                    <div>
                      <span className="text-[9px] font-mono text-primary font-bold uppercase tracking-wider">{prop.id}</span>
                      <h4 className="font-bold text-sm text-on-surface">{prop.title}</h4>
                      <p className="text-[11px] text-on-surface-variant min-h-[30px] mt-1">📍 {prop.address}</p>
                    </div>

                    <div className="flex justify-between items-center text-xs pt-2 border-t border-surface-container">
                      <div className="font-bold text-on-surface">
                        ${prop.rentAmount} <span className="text-[10px] text-on-surface-variant font-normal">/ month</span>
                      </div>
                      
                      {/* Toggle control */}
                      <button
                        onClick={() => { onToggleOccupancy(prop.id); triggerFeedback('Asset status adjusted manually!'); }}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors ${
                          prop.status === 'occupied'
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-100'
                            : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-100'
                        }`}
                        id={`toggle-status-${prop.id}`}
                      >
                        {prop.status === 'occupied' ? 'Mark Vacant' : 'Force Occupied'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PROPTECH TRUST MATCHING SCREENER */}
        {activeTab === 'screening' && (
          <div id="landlord-panel-screening" className="space-y-6 animate-fadeIn">
            <div className="bg-white p-5 rounded-2xl border border-surface-container-high">
              <h2 className="text-lg font-bold text-on-surface">Algorithmic Match & Screening Registry</h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Verify qualified applicant applications pre-screened on credit ledgers. Approved people occupy available vacant properties.
              </p>
            </div>

            <div className="space-y-4">
              {tenants.map((tnt) => {
                const assignedProperty = properties.find(p => p.tenantId === tnt.id);
                if (assignedProperty) {
                  // already assigned and renting
                  return (
                    <div key={tnt.id} className="bg-white border border-surface-container-high rounded-3xl p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base text-on-surface">{tnt.name}</h4>
                          <span className="text-[10px] bg-green-50 text-green-700 font-bold border border-green-100 px-1.5 py-0.5 rounded">Active Tenant</span>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-1">
                          ✉️ {tnt.email} | 📞 {tnt.phone}
                        </p>
                        <p className="text-xs font-semibold text-primary mt-2">
                          Mapped to resource asset Unit: <span className="underline">{assignedProperty.title}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-6 text-xs font-bold text-on-surface text-right">
                        <div>
                          <div className="text-[10px] text-on-surface-variant font-normal">Sewa Trust Rating</div>
                          <div className="text-green-700 font-bold">{tnt.creditScore} / 850</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-on-surface-variant font-normal">Matching Quotient</div>
                          <div className="text-[#a18100]">{tnt.matchingScore}% Match</div>
                        </div>
                      </div>
                    </div>
                  );
                }

                // pre-screened applicant, check if there is an empty/vacant property available to map
                const vacantProps = properties.filter(p => p.status === 'vacant');

                return (
                  <div key={tnt.id} className="bg-white border-2 border-dashed border-outline-variant rounded-3xl p-5 md:p-6 space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base text-on-surface">{tnt.name}</h4>
                          <span className="text-[10px] bg-amber-50 text-[#b45309] font-bold border border-amber-100 px-1.5 py-0.5 rounded">Pending Match Application</span>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-1">
                          ✉️ {tnt.email} | 📞 {tnt.phone}
                        </p>
                      </div>

                      <div className="flex items-center gap-6 text-xs text-right shrink-0">
                        <div>
                          <span className="text-[10px] text-on-surface-variant font-medium block">Compliance Risk</span>
                          <span className="text-green-700 font-bold bg-green-50 px-2 py-1 rounded text-xs border border-green-100 mt-1 inline-block">{tnt.riskRating} risk</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-on-surface-variant font-medium block">Match score</span>
                          <span className="text-primary font-bold bg-surface-container px-2 py-1 rounded text-xs border border-surface-container-high mt-1 inline-block">{tnt.matchingScore}% Match</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-surface-container pt-3 flex flex-wrap justify-between items-center gap-3">
                      <div className="text-xs text-on-surface-variant">
                        {vacantProps.length > 0 ? (
                          <div className="flex items-center gap-1">
                            <span>Ready to map to:</span>
                            <select 
                              id={`assign-prop-select-${tnt.id}`}
                              className="bg-surface-container border border-outline-variant px-2 py-1 rounded text-xs font-semibold text-primary outline-hidden"
                            >
                              {vacantProps.map(vp => (
                                <option key={vp.id} value={vp.id}>{vp.title} - ${vp.rentAmount}</option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <span className="text-rose-700 font-semibold flex items-center gap-1">
                            ⚠️ No vacant modular properties located. Add an asset to map applicant!
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRejectScreening(tnt.id)}
                          className="px-3.5 py-1.5 text-xs font-semibold rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-100"
                        >
                          Dismiss
                        </button>
                        {vacantProps.length > 0 && (
                          <button
                            onClick={() => {
                              const selector = document.getElementById(`assign-prop-select-${tnt.id}`) as HTMLSelectElement;
                              const propId = selector ? selector.value : vacantProps[0].id;
                              handleApproveScreening(tnt.id, propId);
                            }}
                            className="px-4 py-1.5 text-xs font-bold rounded-lg bg-primary text-white hover:opacity-90 active:scale-95 transition-all shadow-xs"
                            id={`approve-scr-btn-${tnt.id}`}
                          >
                            Approve & Assign
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: BILLING CONTROL */}
        {activeTab === 'billing' && (
          <div id="landlord-panel-billing" className="bg-white border border-surface-container-high rounded-3xl p-6 md:p-8 space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-on-surface">Financial Ledger Activity logs</h2>
                <p className="text-xs text-on-surface-variant mt-1">
                  Monitoring tenant payment behaviors and dispatching monthly rent requests.
                </p>
              </div>
              <button
                onClick={() => setShowGenerateInvoiceModal(true)}
                className="bg-primary text-white hover:bg-primary-container px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                id="invoice-modal-trigger-btn"
              >
                <PlusCircle size={14} />
                Generate Statement
              </button>
            </div>

            {/* List Array */}
            <div className="overflow-x-auto pt-4 border-t border-surface-container">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-surface-container text-on-surface-variant font-semibold">
                    <th className="pb-3">Invoice Ref</th>
                    <th className="pb-3">Tenant Client</th>
                    <th className="pb-3">Property Location</th>
                    <th className="pb-3">Target Due</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3 text-right">Settlement Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container/30">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="text-on-surface hover:bg-surface-container-low/20">
                      <td className="py-4 font-mono font-bold text-primary">{inv.id}</td>
                      <td className="py-4 font-semibold">{inv.tenantName}</td>
                      <td className="py-4 text-on-surface-variant">{inv.propertyTitle}</td>
                      <td className="py-4 font-medium text-on-surface-variant">{inv.dueDate}</td>
                      <td className="py-4 font-bold">${inv.amount}.00</td>
                      <td className="py-4 text-right">
                        <span className={`inline-block px-2.5 py-1.5 rounded-lg text-[9px] font-bold ${
                          inv.status === 'Paid'
                            ? 'bg-green-50 text-green-700 border border-green-100'
                            : 'bg-orange-50 text-orange-700 border border-orange-100'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: SERVICE TICKETS */}
        {activeTab === 'maintenance' && (
          <div id="landlord-panel-maintenance" className="bg-white border border-surface-container-high rounded-3xl p-6 space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-lg font-bold text-on-surface">Active Maintenance Service Center</h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Monitor tenant-filed support tickets and update repair priority dispatch.
              </p>
            </div>

            <div className="space-y-4">
              {tickets.map((tkt) => (
                <div key={tkt.id} className="p-5 border border-surface-container rounded-2xl bg-surface-container-low/45 flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md">{tkt.id}</span>
                      <h4 className="font-bold text-sm text-on-surface">{tkt.title}</h4>
                      <span className="text-[10px] text-on-surface-variant">| Location: {tkt.propertyTitle}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed max-w-2xl">{tkt.description}</p>
                    <p className="text-[10px] text-on-surface-variant pt-2 border-t border-surface-container/50">
                      Filed: {tkt.createdAt} | Priority: <strong className="uppercase">{tkt.priority}</strong>
                    </p>
                  </div>

                  <div className="flex flex-col items-end shrink-0 justify-between gap-4">
                    <span className={`inline-block px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider ${
                      tkt.status === 'Resolved'
                        ? 'bg-green-50 text-green-700 border border-green-100'
                        : tkt.status === 'Scheduled'
                        ? 'bg-blue-50 text-blue-700 border border-blue-100'
                        : 'bg-orange-50 text-orange-700 border border-orange-100'
                    }`}>
                      {tkt.status}
                    </span>

                    {/* Quick switch status tools */}
                    <div className="flex items-center gap-1 text-[11px]" id={`ticket-tools-${tkt.id}`}>
                      <span className="text-on-surface-variant text-[10px] mr-1">Update:</span>
                      {tkt.status === 'Received' && (
                        <button
                          onClick={() => handleUpdateTicket(tkt.id, 'Scheduled')}
                          className="bg-primary text-white px-2 py-1 rounded font-semibold text-[10px]"
                        >
                          Schedule Tech
                        </button>
                      )}
                      {tkt.status === 'Scheduled' && (
                        <button
                          onClick={() => handleUpdateTicket(tkt.id, 'Resolved')}
                          className="bg-green-700 text-white px-2 py-1 rounded font-semibold text-[10px]"
                        >
                          Mark Solved
                        </button>
                      )}
                      {tkt.status === 'Resolved' && (
                        <span className="text-on-surface-variant text-[10px] italic">No action needed</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {tickets.length === 0 && (
                <div className="text-center py-8 text-on-surface-variant text-xs">
                  All property assets are clear. No active maintenance support tickets found.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: MESSAGES */}
        {activeTab === 'messages' && (
          <div id="landlord-panel-messages" className="bg-white border border-surface-container-high rounded-3xl p-6 md:p-8 flex flex-col h-[520px] animate-fadeIn">
            <div className="flex justify-between items-center pb-4 border-b border-surface-container shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold shadow-xs shrink-0">
                  🏢
                </div>
                <div>
                  <h3 className="font-bold text-sm text-on-surface">Tenant Direct Messenger Vault</h3>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">
                    Continuous secure dialogue logs matching lease profiles.
                  </p>
                </div>
              </div>
              <span className="text-[10px] bg-sky-50 text-primary px-2.5 py-1 rounded-lg border border-sky-100 font-semibold">
                Direct Sync Log
              </span>
            </div>

            {/* Chats messages box */}
            <div className="flex-grow overflow-y-auto py-6 space-y-4 pr-1 scroll-smooth">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${
                    msg.senderRole === 'Landlord'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div 
                    className={`max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed shadow-xs ${
                      msg.senderRole === 'Landlord'
                        ? 'bg-primary text-white rounded-tr-xs'
                        : 'bg-surface-container text-on-surface rounded-tl-xs'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <span className={`text-[9px] block mt-1.5 text-right ${
                      msg.senderRole === 'Landlord' ? 'text-white/70' : 'text-on-surface-variant'
                    }`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Sending form */}
            <form onSubmit={handleLandlordChatSubmit} className="flex gap-2 pt-4 border-t border-surface-container-high shrink-0">
              <input
                className="flex-grow px-4 h-12 bg-white border border-outline-variant rounded-xl text-xs text-on-surface focus:ring-1 focus:ring-primary outline-hidden"
                placeholder="Secure message to active tenants..."
                value={landlordChatInput}
                onChange={(e) => setLandlordChatInput(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-12 h-12 bg-primary text-white hover:bg-primary-container rounded-xl flex items-center justify-center transition-all shadow-xs active:scale-95 shrink-0"
                id="landlord-send-chat-btn"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* MODAL WINDOWS FOR LANDLORD ACTION PORTALS */}

      {/* OPTION A: ADD PROPERTY MODAL */}
      {showAddPropModal && (
        <div id="add-property-modal" className="fixed inset-0 bg-on-background/35 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 relative border border-surface-container-high shadow-2xl animate-scaleIn">
            <button 
              onClick={() => setShowAddPropModal(false)}
              className="absolute right-4 top-4 text-on-surface-variant hover:text-on-surface p-1.5 hover:bg-surface-container rounded-xl"
              id="close-add-modal-btn"
            >
              <X size={18} />
            </button>

            <div className="mb-4">
              <h3 className="font-bold text-lg text-on-surface">List Modular Resource Apartment</h3>
              <p className="text-[11px] text-on-surface-variant mt-1">
                Publish a pre-fabricated high-durability space to our verified local directory.
              </p>
            </div>

            <form onSubmit={handleCreateProperty} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="modal-prop-id" className="text-[10px] font-bold text-on-surface-variant uppercase">Apartment Title Name</label>
                <input
                  id="modal-prop-id"
                  className="w-full px-3.5 h-10 bg-white border border-outline-variant rounded-xl text-xs text-on-surface focus:ring-1 focus:ring-primary"
                  placeholder="e.g. Sewa Eco-Apartments - Unit 104"
                  value={propTitle}
                  onChange={(e) => setPropTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="modal-prop-address" className="text-[10px] font-bold text-on-surface-variant uppercase">Physical Location Address</label>
                <input
                  id="modal-prop-address"
                  className="w-full px-3.5 h-10 bg-white border border-outline-variant rounded-xl text-xs text-on-surface focus:ring-1 focus:ring-primary"
                  placeholder="e.g. 52 Greenway Blvd, Sector 9"
                  value={propAddress}
                  onChange={(e) => setPropAddress(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="modal-prop-rent" className="text-[10px] font-bold text-on-surface-variant uppercase">Monthly Rent ($)</label>
                  <input
                    id="modal-prop-rent"
                    className="w-full px-3.5 h-10 bg-white border border-outline-variant rounded-xl text-xs text-on-surface focus:ring-1 focus:ring-primary"
                    placeholder="e.g. 1200"
                    type="number"
                    value={propRent}
                    onChange={(e) => setPropRent(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="modal-prop-deposit" className="text-[10px] font-bold text-on-surface-variant uppercase">Initial Deposit ($)</label>
                  <input
                    id="modal-prop-deposit"
                    className="w-full px-3.5 h-10 bg-white border border-outline-variant rounded-xl text-xs text-on-surface focus:ring-1 focus:ring-primary"
                    placeholder="Defaults to Rent"
                    type="number"
                    value={propDeposit}
                    onChange={(e) => setPropDeposit(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label htmlFor="modal-prop-size" className="text-[10px] font-bold text-on-surface-variant uppercase">Size (sq ft)</label>
                  <input
                    id="modal-prop-size"
                    className="w-full px-3 h-10 bg-white border border-outline-variant rounded-xl text-xs text-on-surface focus:ring-1 focus:ring-primary"
                    placeholder="650 sq ft"
                    value={propSize}
                    onChange={(e) => setPropSize(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="modal-prop-beds" className="text-[10px] font-bold text-on-surface-variant uppercase">Bedrooms</label>
                  <input
                    id="modal-prop-beds"
                    className="w-full px-3 h-10 bg-white border border-outline-variant rounded-xl text-xs text-on-surface focus:ring-1 focus:ring-primary"
                    placeholder="1"
                    type="number"
                    value={propBeds}
                    onChange={(e) => setPropBeds(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="modal-prop-baths" className="text-[10px] font-bold text-on-surface-variant uppercase">Bathrooms</label>
                  <input
                    id="modal-prop-baths"
                    className="w-full px-3 h-10 bg-white border border-outline-variant rounded-xl text-xs text-on-surface focus:ring-1 focus:ring-primary"
                    placeholder="1"
                    type="number"
                    value={propBaths}
                    onChange={(e) => setPropBaths(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-primary text-white font-bold text-xs rounded-xl hover:brightness-110 shadow-xs transition-colors"
                id="submit-prop-btn"
              >
                Register Asset Unit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* OPTION B: GENERATE STATEMENTS MODAL */}
      {showGenerateInvoiceModal && (
        <div id="generate-invoice-modal" className="fixed inset-0 bg-on-background/35 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 relative border border-surface-container-high shadow-2xl animate-scaleIn">
            <button 
              onClick={() => setShowGenerateInvoiceModal(false)}
              className="absolute right-4 top-4 text-on-surface-variant hover:text-on-surface p-1.5 hover:bg-surface-container rounded-xl"
              id="close-invoice-modal-btn"
            >
              <X size={18} />
            </button>

            <div className="mb-4">
              <h3 className="font-bold text-lg text-on-surface">Generate Secure Tenant Invoice</h3>
              <p className="text-[11px] text-on-surface-variant mt-1">
                Dispatch verified lease statements and service fee adjustments.
              </p>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="invoice-tenant-select" className="text-[10px] font-bold text-on-surface-variant uppercase">Select Target Tenant Client</label>
                <select
                  id="invoice-tenant-select"
                  className="w-full px-3.5 h-10 bg-white border border-outline-variant rounded-xl text-xs text-on-surface focus:ring-1 focus:ring-primary outline-hidden cursor-pointer"
                  value={selectedTenantName}
                  onChange={(e) => setSelectedTenantName(e.target.value)}
                  required
                >
                  <option value="">-- Choose verified client --</option>
                  {tenants.map(tnt => (
                    <option key={tnt.id} value={tnt.name}>{tnt.name} ({tnt.email})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="invoice-prop-select" className="text-[10px] font-bold text-on-surface-variant uppercase">Target Asset Unit</label>
                <select
                  id="invoice-prop-select"
                  className="w-full px-3.5 h-10 bg-white border border-outline-variant rounded-xl text-xs text-on-surface focus:ring-1 focus:ring-primary outline-hidden cursor-pointer"
                  value={invoicePropId}
                  onChange={(e) => setInvoicePropId(e.target.value)}
                  required
                >
                  <option value="">-- Choose asset units --</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.title} (${p.rentAmount}/mo)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="invoice-amount-input" className="text-[10px] font-bold text-on-surface-variant uppercase">Billed Amount ($)</label>
                  <input
                    id="invoice-amount-input"
                    className="w-full px-3.5 h-10 bg-white border border-outline-variant rounded-xl text-xs text-on-surface focus:ring-1 focus:ring-primary"
                    placeholder="e.g. 1200"
                    type="number"
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="invoice-duedate-input" className="text-[10px] font-bold text-[#434655] uppercase">Target Due Date</label>
                  <input
                    id="invoice-duedate-input"
                    className="w-full px-2.5 h-10 bg-white border border-outline-variant rounded-xl text-xs text-on-surface focus:ring-1 focus:ring-primary"
                    type="date"
                    value={invoiceDueDate}
                    onChange={(e) => setInvoiceDueDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-primary text-white font-bold text-xs rounded-xl hover:brightness-110 shadow-xs transition-colors mt-2"
                id="submit-invoice-btn"
              >
                Dispatch Rent Statement
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
