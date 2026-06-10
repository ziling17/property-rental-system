import React, { useState } from 'react';
import { Search, Plus, Calendar, FileText, User, Tag, Mail, Phone, CalendarRange, Clock, AlertTriangle, Check, Trash2, X } from 'lucide-react';
import { Lease, LeaseStatus, Property } from '../types';

interface LeasesViewProps {
  leases: Lease[];
  properties: Property[];
  onAddLease: (newLease: Lease) => void;
  onUpdateLeaseStatus: (id: string, nextStatus: LeaseStatus) => void;
  onDeleteLease: (id: string) => void;
}

export default function LeasesView({
  leases,
  properties,
  onAddLease,
  onUpdateLeaseStatus,
  onDeleteLease
}: LeasesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isDraftLeaseModalOpen, setIsDraftLeaseModalOpen] = useState(false);

  // Form states for drafting new leases
  const [tenantName, setTenantName] = useState('');
  const [tenantEmail, setTenantEmail] = useState('');
  const [tenantPhone, setTenantPhone] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [monthlyRent, setMonthlyRent] = useState(1500);
  const [securityDeposit, setSecurityDeposit] = useState(1500);

  // Filter listings
  const filteredLeases = leases.filter((lease) => {
    const matchesSearch = lease.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lease.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lease.tenantEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || lease.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handlePropertyChange = (selectedId: string) => {
    setPropertyId(selectedId);
    const linkedProp = properties.find(p => p.id === selectedId);
    if (linkedProp) {
      setMonthlyRent(linkedProp.monthlyRent);
      setSecurityDeposit(linkedProp.monthlyRent);
    }
  };

  const handleDraftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantName || !tenantEmail || !propertyId || !startDate || !endDate) return;

    const linkedProp = properties.find(p => p.id === propertyId);
    const newLease: Lease = {
      id: `lease-${Date.now()}`,
      tenantName,
      tenantEmail,
      tenantPhone: tenantPhone || undefined,
      propertyId,
      propertyName: linkedProp ? linkedProp.name : 'Unknown Property',
      unitNumber: unitNumber || 'Unit 1A',
      startDate,
      endDate,
      monthlyRent: Number(monthlyRent),
      securityDeposit: Number(securityDeposit),
      status: 'Pending'
    };

    onAddLease(newLease);
    setIsDraftLeaseModalOpen(false);

    // Reset fields
    setTenantName('');
    setTenantEmail('');
    setTenantPhone('');
    setPropertyId('');
    setUnitNumber('');
    setStartDate('');
    setEndDate('');
    setMonthlyRent(1500);
    setSecurityDeposit(1500);
  };

  return (
    <div className="space-y-8">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-3xs">
        <div className="relative flex-1 w-full max-w-sm">
          <Search size={18} className="absolute left-3.5 top-3 text-gray-400" />
          <input
            id="lease-search-input"
            type="text"
            placeholder="Search leases by tenant name or property..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl cursor-pointer hover:bg-gray-100 outline-none"
          >
            <option value="All">All Leases</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending Approval</option>
            <option value="Expired">Expired</option>
            <option value="Terminated">Terminated</option>
          </select>

          <button
            id="open-draft-lease-btn"
            onClick={() => setIsDraftLeaseModalOpen(true)}
            className="ml-auto md:ml-0 flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Plus size={16} /> Draft New Lease
          </button>
        </div>
      </div>

      {/* Leases Table or Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredLeases.map((lease) => {
          const isExpired = lease.status === 'Expired' || lease.status === 'Terminated';
          const isPending = lease.status === 'Pending';
          return (
            <div
              key={lease.id}
              className={`bg-white rounded-2xl border ${
                isExpired ? 'border-gray-100 opacity-80' : 'border-blue-100/50'
              } p-6 shadow-3xs hover:shadow-md transition-all duration-300 flex flex-col justify-between`}
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-extrabold text-lg text-slate-900">{lease.tenantName}</h4>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                    <Mail size={12} />
                    <span>{lease.tenantEmail}</span>
                    {lease.tenantPhone && (
                      <>
                        <span className="mx-1">•</span>
                        <Phone size={12} />
                        <span>{lease.tenantPhone}</span>
                      </>
                    )}
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-3xs ${
                  lease.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                  lease.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                  lease.status === 'Expired' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
                }`}>
                  {lease.status}
                </span>
              </div>

              {/* Lease properties spec details */}
              <div className="bg-slate-50/50 rounded-xl p-4 space-y-3 border border-slate-100 mb-5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 font-medium">Agreement Property:</span>
                  <span className="font-bold text-slate-800 text-right">{lease.propertyName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 font-medium">Assigned Unit:</span>
                  <span className="font-bold text-gray-800">{lease.unitNumber}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 font-medium">Contract Terms:</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Calendar size={13} className="text-gray-400" />
                    {lease.startDate} to {lease.endDate}
                  </span>
                </div>
                <div className="border-t border-slate-100 pt-2.5 mt-2 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-gray-400 font-semibold block uppercase">Rent Commitment</span>
                    <span className="text-sm font-extrabold text-blue-700">${lease.monthlyRent} / mo</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 font-semibold block uppercase">Security Deposit</span>
                    <span className="text-sm font-extrabold text-slate-700">${lease.securityDeposit}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end pt-2 border-t border-gray-50 mt-auto">
                <button
                  id={`delete-lease-${lease.id}`}
                  onClick={() => onDeleteLease(lease.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer mr-auto"
                  title="Archive/Delete Lease"
                >
                  <Trash2 size={16} />
                </button>

                {isPending && (
                  <button
                    id={`approve-lease-${lease.id}`}
                    onClick={() => onUpdateLeaseStatus(lease.id, 'Active')}
                    className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-sm cursor-pointer"
                  >
                    <Check size={14} /> Approve & Sign
                  </button>
                )}

                {lease.status === 'Active' && (
                  <>
                    <button
                      id={`expire-lease-${lease.id}`}
                      onClick={() => onUpdateLeaseStatus(lease.id, 'Expired')}
                      className="text-gray-600 hover:bg-gray-100 text-xs font-bold py-1.5 px-3 border border-gray-200 rounded-lg cursor-pointer"
                    >
                      Mark Expired
                    </button>
                    <button
                      id={`terminate-lease-${lease.id}`}
                      onClick={() => onUpdateLeaseStatus(lease.id, 'Terminated')}
                      className="bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold py-1.5 px-3 rounded-lg border border-red-100 cursor-pointer"
                    >
                      Terminate Early
                    </button>
                  </>
                )}

                {isExpired && (
                  <button
                    id={`renew-lease-${lease.id}`}
                    onClick={() => onUpdateLeaseStatus(lease.id, 'Active')}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold py-1.5 px-3 rounded-lg border border-blue-100 cursor-pointer"
                  >
                    Renew Agreement
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredLeases.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <FileText size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium text-sm">No lease agreements found matching your filter selection.</p>
          </div>
        )}
      </div>

      {/* Draft lease Modal */}
      {isDraftLeaseModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-lg w-full flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
              <h3 className="font-bold text-gray-900 text-lg">Draft New Lease Agreement</h3>
              <button
                onClick={() => setIsDraftLeaseModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleDraftSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Tenant Name</label>
                <input
                  id="draft-tenant-name"
                  type="text"
                  required
                  placeholder="e.g. Elena Rodriguez"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email address</label>
                  <input
                    id="draft-tenant-email"
                    type="email"
                    required
                    placeholder="elena@example.com"
                    value={tenantEmail}
                    onChange={(e) => setTenantEmail(e.target.value)}
                    className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={tenantPhone}
                    onChange={(e) => setTenantPhone(e.target.value)}
                    className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Select Property</label>
                  <select
                    required
                    value={propertyId}
                    onChange={(e) => handlePropertyChange(e.target.value)}
                    className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 outline-none cursor-pointer"
                  >
                    <option value="">-- Choose --</option>
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Unit Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Unit B or Suite 8A"
                    value={unitNumber}
                    onChange={(e) => setUnitNumber(e.target.value)}
                    className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Rent Term Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Negotiated Rent ($ / mo)</label>
                  <input
                    type="number"
                    required
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(Number(e.target.value))}
                    className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Security Deposit ($)</label>
                  <input
                    type="number"
                    required
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                    className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setIsDraftLeaseModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="draft-lease-form-submit-btn"
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={16} /> Draft Lease
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
