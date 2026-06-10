import React, { useState } from 'react';
import { Search, Plus, Calendar, DollarSign, Wallet, Check, AlertCircle, ArrowUpRight, Clock, Trash2, Tag, X } from 'lucide-react';
import { Payment, PaymentStatus, PaymentMethod, Property } from '../types';

interface PaymentsViewProps {
  payments: Payment[];
  properties: Property[];
  onAddPayment: (newPay: Payment) => void;
  onUpdatePaymentStatus: (id: string, newStatus: PaymentStatus) => void;
  onDeletePayment: (id: string) => void;
}

export default function PaymentsView({
  payments,
  properties,
  onAddPayment,
  onUpdatePaymentStatus,
  onDeletePayment
}: PaymentsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  // Record Form States
  const [tenantName, setTenantName] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('Direct Deposit');
  const [status, setStatus] = useState<PaymentStatus>('Paid');

  // Filter listings
  const filteredPayments = payments.filter((pay) => {
    const matchesSearch = pay.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          pay.propertyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || pay.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate totals
  const totalPaid = payments
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter(p => p.status === 'Pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalOverdue = payments
    .filter(p => p.status === 'Overdue')
    .reduce((sum, p) => sum + p.amount, 0);

  const handlePropertyChange = (selectedName: string) => {
    setPropertyName(selectedName);
    const linkedProp = properties.find(p => p.name === selectedName);
    if (linkedProp) {
      setAmount(linkedProp.monthlyRent);
    }
  };

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantName || !propertyName || amount <= 0 || !date) return;

    const newPay: Payment = {
      id: `pay-${Date.now()}`,
      tenantName,
      propertyName,
      amount: Number(amount),
      date,
      status,
      method
    };

    onAddPayment(newPay);
    setIsRecordModalOpen(false);

    // Reset fields
    setTenantName('');
    setPropertyName('');
    setAmount(0);
    setDate('');
    setMethod('Direct Deposit');
    setStatus('Paid');
  };

  return (
    <div className="space-y-8">
      {/* Financial Analytics summary bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Paid collections card */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider block">Completed Rent Credits</span>
            <span className="text-3xl font-extrabold text-emerald-800 mt-1">${totalPaid.toLocaleString()}</span>
            <span className="text-xs text-emerald-600 block mt-1 font-medium">Month to date</span>
          </div>
          <span className="p-3.5 bg-emerald-100 text-emerald-700 rounded-xl">
            <ArrowUpRight size={24} />
          </span>
        </div>

        {/* Pending Collections card */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs text-amber-700 font-bold uppercase tracking-wider block">Outstanding Collections</span>
            <span className="text-3xl font-extrabold text-amber-800 mt-1">${totalPending.toLocaleString()}</span>
            <span className="text-xs text-amber-600 block mt-1 font-medium">Awaiting clearing</span>
          </div>
          <span className="p-3.5 bg-amber-100 text-amber-700 rounded-xl">
            <Clock size={24} />
          </span>
        </div>

        {/* Overdue Collections Card */}
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs text-rose-700 font-bold uppercase tracking-wider block">Overdue Arrears</span>
            <span className="text-3xl font-extrabold text-rose-800 mt-1">${totalOverdue.toLocaleString()}</span>
            <span className="text-xs text-rose-600 block mt-1 font-medium">Alert issued</span>
          </div>
          <span className="p-3.5 bg-rose-100 text-rose-700 rounded-xl">
            <AlertCircle size={24} />
          </span>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-3xs">
        <div className="relative flex-1 w-full max-w-sm">
          <Search size={18} className="absolute left-3.5 top-3 text-gray-400" />
          <input
            id="payment-search-input"
            type="text"
            placeholder="Search payment logs by tenant or property..."
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
            <option value="All">All statuses</option>
            <option value="Paid">Cleared (Paid)</option>
            <option value="Pending">Awaiting (Pending)</option>
            <option value="Overdue">Overdue</option>
          </select>

          <button
            id="open-record-payment-btn"
            onClick={() => setIsRecordModalOpen(true)}
            className="ml-auto md:ml-0 flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Plus size={16} /> Record Rent
          </button>
        </div>
      </div>

      {/* Receipts Table List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-3xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6">Tenant Name</th>
                <th className="py-4 px-6">Property</th>
                <th className="py-4 px-6">Receipt Date</th>
                <th className="py-4 px-6">Method</th>
                <th className="py-4 px-6">Volume ($)</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm focus:outline-none">
              {filteredPayments.map((pay) => (
                <tr key={pay.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-900">{pay.tenantName}</td>
                  <td className="py-4 px-6 font-medium text-gray-600">{pay.propertyName}</td>
                  <td className="py-4 px-6 text-gray-500 font-mono text-xs">{pay.date}</td>
                  <td className="py-4 px-6 text-gray-500 font-medium">
                    <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg text-xs">
                      {pay.method}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-extrabold text-slate-800">${pay.amount.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-3xs ${
                      pay.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                      pay.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        pay.status === 'Paid' ? 'bg-emerald-500' :
                        pay.status === 'Pending' ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                      {pay.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center items-center gap-2">
                      {pay.status !== 'Paid' && (
                        <button
                          id={`mark-paid-btn-${pay.id}`}
                          onClick={() => onUpdatePaymentStatus(pay.id, 'Paid')}
                          className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold px-2 py-1 rounded-lg text-xs cursor-pointer"
                        >
                          Clear Payment
                        </button>
                      )}
                      <button
                        id={`delete-payment-${pay.id}`}
                        onClick={() => onDeletePayment(pay.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="py-16 text-center">
            <Wallet size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium text-sm">No transaction statements match your selection.</p>
          </div>
        )}
      </div>

      {/* Record Rent Modal */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
              <h3 className="font-bold text-gray-900 text-lg">Record Rent Payment</h3>
              <button
                onClick={() => setIsRecordModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRecordSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Tenant Name</label>
                <input
                  id="record-pay-tenant"
                  type="text"
                  required
                  placeholder="e.g. Elena Rodriguez"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Select Property</label>
                <select
                  required
                  value={propertyName}
                  onChange={(e) => handlePropertyChange(e.target.value)}
                  className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 outline-none cursor-pointer"
                >
                  <option value="">-- Choose Property --</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Rent Amount ($)</label>
                  <input
                    id="record-pay-amount"
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Statement Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Payment Method</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                    className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 outline-none cursor-pointer"
                  >
                    <option value="Direct Deposit">Direct Deposit</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Venmo">Venmo</option>
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PaymentStatus)}
                    className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 outline-none cursor-pointer"
                  >
                    <option value="Paid">Paid / Cleared</option>
                    <option value="Pending">Pending / Inbound</option>
                    <option value="Overdue">Overdue / Arrears</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="record-pay-form-submit-btn"
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Check size={16} /> Record payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
