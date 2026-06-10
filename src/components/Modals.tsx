import React, { useState, useEffect, useRef } from 'react';
import {
  X, Check, ShieldCheck, Mail, Lock, User, Phone,
  Send, HelpCircle, FileText, ArrowRight, Download, Eye, Sparkles, Building
} from 'lucide-react';
import { Property, BookingSummary } from '../types';
import { SUGGESTED_QUESTIONS, ADVISOR_RESPONSES } from '../bookingData';

interface ModalsProps {
  activeModal: 'none' | 'login' | 'register' | 'success' | 'advisor' | 'terms';
  onClose: () => void;
  selectedProperty: Property;
  bookingSummary: BookingSummary;
  userEmail: string | null;
  onLoginSuccess: (email: string) => void;
  termsData?: { title: string; content: string };
}

export default function Modals({
  activeModal,
  onClose,
  selectedProperty,
  bookingSummary,
  userEmail,
  onLoginSuccess,
  termsData
}: ModalsProps) {

  // Login State
  const [loginMail, setLoginMail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regMail, setRegMail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPass, setRegPass] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  // Multi-step Booking wizard
  const [bookingStep, setBookingStep] = useState(1); // 1 = Document upload, 2 = Verify & Sign, 3 = Completed!
  const [uploadedDoc, setUploadedDoc] = useState<string | null>(null);
  const [signatureText, setSignatureText] = useState('');
  const [isApproved, setIsApproved] = useState(false);

  // Advisor Chat states
  const [chatLog, setChatLog] = useState<Array<{ sender: 'user' | 'advisor'; text: string; id: string }>>([
    {
      sender: 'advisor',
      text: `Hello! I'm your MySewa Rental Advisor. I'm here to assist you with confirming your booking at ${selectedProperty.name}. How can I help you today?`,
      id: 'init'
    }
  ]);
  const [chatInp, setChatInp] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog, isTyping]);

  if (activeModal === 'none') return null;

  // Login handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginMail) return;
    onLoginSuccess(loginMail);
    onClose();
  };

  // Register handler
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regMail) return;
    onLoginSuccess(regMail);
    onClose();
  };

  // Chat advisor helper
  const triggerAdvisorAnswer = (question: string) => {
    // Add User message
    const userMsg = { sender: 'user' as const, text: question, id: Math.random().toString() };
    setChatLog((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      let replyText = ADVISOR_RESPONSES.default;

      const normalized = question.toLowerCase();
      if (normalized.includes('deposit') || normalized.includes('security') || normalized.includes('utility')) {
        replyText = ADVISOR_RESPONSES.deposit;
      } else if (normalized.includes('duration') || normalized.includes('minimum') || normalized.includes('lease') || normalized.includes('months')) {
        replyText = ADVISOR_RESPONSES.duration;
      } else if (normalized.includes('rules') || normalized.includes('pet') || normalized.includes('quiet') || normalized.includes('community')) {
        replyText = ADVISOR_RESPONSES.rules;
      } else if (normalized.includes('sdg') || normalized.includes('infrastructure') || normalized.includes('goal')) {
        replyText = ADVISOR_RESPONSES.sdg;
      }

      setChatLog((prev) => [
        ...prev,
        { sender: 'advisor' as const, text: replyText, id: Math.random().toString() }
      ]);
      setIsTyping(false);
    }, 850);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInp.trim()) return;
    const query = chatInp;
    setChatInp('');
    triggerAdvisorAnswer(query);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">

      {/* 1. LOGIN MODAL */}
      {activeModal === 'login' && (
        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-outline-variant animate-in zoom-in-95 duration-200">
          <div className="bg-primary text-on-primary px-6 py-5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              <h3 className="font-bold text-lg">Tenant Login</h3>
            </div>
            <button onClick={onClose} className="text-on-primary/80 hover:text-on-primary p-1 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
            <p className="text-xs text-on-surface-variant font-medium">
              Access your real-estate account, historical rental contracts, and live security escrow balance.
            </p>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface-variant" htmlFor="login-email">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                <input
                  required
                  id="login-email"
                  type="email"
                  value={loginMail}
                  onChange={(e) => setLoginMail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm focus:outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface-variant" htmlFor="login-password">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                <input
                  required
                  id="login-password"
                  type="password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm focus:outline-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-primary pt-1">
              <label className="flex items-center gap-1.5 text-on-surface-variant cursor-pointer">
                <input type="checkbox" className="rounded text-primary focus:ring-primary/20" />
                <span>Remember me</span>
              </label>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline">Forgot password?</a>
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-on-primary h-11 rounded-full font-bold text-sm tracking-wide mt-2 hover:bg-primary-container transition-all active:scale-95 duration-100 cursor-pointer"
            >
              Sign In Securely
            </button>
          </form>
        </div>
      )}

      {/* 2. REGISTER MODAL */}
      {activeModal === 'register' && (
        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-outline-variant animate-in zoom-in-95 duration-200">
          <div className="bg-primary text-on-primary px-6 py-5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <h3 className="font-bold text-lg">Create Tenant Account</h3>
            </div>
            <button onClick={onClose} className="text-on-primary/80 hover:text-on-primary p-1 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleRegisterSubmit} className="p-6 space-y-3.5">
            <p className="text-xs text-on-surface-variant font-medium">
              Join MySewa and access pre-approved vetted property listings with bank-grade security deposits.
            </p>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface-variant" htmlFor="reg-name">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                <input
                  required
                  id="reg-name"
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="John Smith"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm focus:outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface-variant" htmlFor="reg-email">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                <input
                  required
                  id="reg-email"
                  type="email"
                  value={regMail}
                  onChange={(e) => setRegMail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm focus:outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface-variant" htmlFor="reg-phone">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                <input
                  required
                  id="reg-phone"
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+60 12-345 6789"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm focus:outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface-variant" htmlFor="reg-password">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                <input
                  required
                  id="reg-password"
                  type="password"
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm focus:outline-none"
                />
              </div>
            </div>
            <label className="flex items-start gap-2 text-xs font-medium text-on-surface-variant pt-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
                className="rounded text-primary focus:ring-primary/20 mt-0.5"
              />
              <span>I consent to the digital processing and legal escrow protection of my deposits under SDG 9 infrastructure guidelines.</span>
            </label>
            <button
              type="submit"
              disabled={!isChecked}
              className={`w-full h-11 rounded-full font-bold text-sm tracking-wide mt-2 transition-all duration-100 ${isChecked
                ? 'bg-primary text-on-primary hover:bg-primary-container active:scale-95 cursor-pointer'
                : 'bg-secondary-fixed text-on-secondary-fixed-variant opacity-60 cursor-not-allowed'
                }`}
            >
              Sign Up Securely
            </button>
          </form>
        </div>
      )}

      {/* 3. PLATFORM TERMS MODAL */}
      {activeModal === 'terms' && termsData && (
        <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-outline-variant animate-in zoom-in-95 duration-200">
          <div className="bg-surface-container-high px-6 py-5 flex justify-between items-center border-b border-outline-variant">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg text-on-surface">{termsData.title}</h3>
            </div>
            <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <h4 className="font-bold text-sm text-primary uppercase tracking-wider">MySewa Real-Estate Guidelines</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {termsData.content}
            </p>
            <p className="text-xs text-outline leading-relaxed border-t border-outline-variant/60 pt-4">
              Authorized by MySewa Trust Compliance & SDG 9 Sustainable Cities Department. Last updated October 2024.
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={onClose}
                className="bg-primary text-on-primary px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-primary-container cursor-pointer transition-all active:scale-95"
              >
                Accept and Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. MULTI-STEP BOOKING SUCCESS WIZARD */}
      {activeModal === 'success' && (
        <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden border border-outline-variant animate-in zoom-in-95 duration-200">

          {/* Header */}
          <div className="bg-primary text-on-primary px-6 py-5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 fill-on-primary/10" />
              <h3 className="font-bold text-lg">Booking Confirmation Steps</h3>
            </div>
            <button onClick={onClose} className="text-on-primary/80 hover:text-on-primary p-1 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Master Steps indicators */}
          <div className="px-6 py-4 bg-surface-container-low border-b border-outline-variant/60 flex justify-between items-center text-xs md:text-sm">
            <div className="flex items-center gap-1.5 font-bold">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${bookingStep >= 1 ? 'bg-primary text-on-primary' : 'bg-outline-variant text-on-surface-variant'}`}>
                {bookingStep > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
              </span>
              <span className={bookingStep === 1 ? 'text-primary' : 'text-on-surface-variant font-medium'}>Documents</span>
            </div>
            <div className="h-px bg-outline-variant flex-1 mx-3 md:mx-6"></div>
            <div className="flex items-center gap-1.5 font-bold">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${bookingStep >= 2 ? 'bg-primary text-on-primary' : 'bg-outline-variant text-on-surface-variant'}`}>
                {bookingStep > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
              </span>
              <span className={bookingStep === 2 ? 'text-primary' : 'text-on-surface-variant font-medium'}>Sign Contract</span>
            </div>
            <div className="h-px bg-outline-variant flex-1 mx-3 md:mx-6"></div>
            <div className="flex items-center gap-1.5 font-bold">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${bookingStep >= 3 ? 'bg-green-600 text-white' : 'bg-outline-variant text-on-surface-variant'}`}>
                3
              </span>
              <span className={bookingStep === 3 ? 'text-green-600' : 'text-on-surface-variant font-medium'}>Completed</span>
            </div>
          </div>

          <div className="p-6 md:p-8">

            {/* STEP 1: Uploading supporting identities */}
            {bookingStep === 1 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex items-start gap-3">
                  <Building className="w-10 h-10 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold text-base text-on-surface">Supporting Document Declaration</h4>
                    <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                      To complete your lease at <strong className="text-primary">{selectedProperty.name}</strong>, landlord require standard proof of tenancy eligibility (Identity Card or Employment Letter).
                    </p>
                  </div>
                </div>

                {/* Simulated file upload block */}
                <div className="border-2 border-dashed border-outline-variant rounded-2xl p-8 text-center bg-surface hover:bg-surface-container transition-all cursor-pointer">
                  <input
                    type="file"
                    id="doc-upload-raw"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadedDoc(e.target.files[0].name);
                      }
                    }}
                  />
                  <label htmlFor="doc-upload-raw" className="cursor-pointer space-y-3 block">
                    <FileText className="w-10 h-10 text-outline mx-auto" />
                    <div className="text-xs md:text-sm font-semibold text-on-surface">
                      {uploadedDoc ? (
                        <div className="bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          <span>Uploaded: {uploadedDoc}</span>
                        </div>
                      ) : (
                        <span>Drag & Drop or Click to Select File</span>
                      )}
                    </div>
                    <p className="text-xs text-outline font-medium">Supports PDF, PNG, JPG up to 10MB</p>
                  </label>
                </div>

                {/* Pre-fill Option for rapid preview test */}
                <div className="flex justify-between items-center text-xs font-semibold bg-surface-container px-4 py-3 rounded-xl border border-outline-variant">
                  <span className="text-on-surface-variant">Quick Test? Autofill verified files:</span>
                  <button
                    type="button"
                    onClick={() => setUploadedDoc('malaysia_ic_verification.pdf')}
                    className="text-primary hover:underline cursor-pointer"
                  >
                    Use standard verified_tenant_id.pdf
                  </button>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      if (!uploadedDoc) {
                        alert('Please upload a document to proceed.');
                        return;
                      }
                      setBookingStep(2);
                    }}
                    className="bg-primary text-on-primary px-6 py-3 rounded-full font-bold text-sm tracking-wide hover:bg-primary-container transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Proceed to Contract Sign</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Digital Contract Signing */}
            {bookingStep === 2 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div>
                  <h4 className="font-bold text-base text-on-surface">Review & Digital Signature</h4>
                  <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                    Please review your rental terms starting from <strong>{bookingSummary.startDate}</strong> until <strong>{bookingSummary.endDate}</strong>. Deposit held securely by MySewa escrow services.
                  </p>
                </div>

                <div className="bg-surface-container rounded-xl p-4 border border-outline-variant text-xs space-y-2 max-h-[140px] overflow-y-auto custom-scrollbar leading-relaxed text-on-surface-variant font-medium">
                  <p className="font-bold text-on-surface text-center mb-1">STANDARD MYSEWA LEASE DEED SUMMARY</p>
                  <p>1. Tenant agrees to hire the property {selectedProperty.name} for {bookingSummary.durationMonths} months.</p>
                  <p>2. Monthly rental rate of RM {selectedProperty.monthlyRent.toLocaleString()} is fixed throughout this term.</p>
                  <p>3. Tenant authorizes the immediate safe-keeping of RM {bookingSummary.securityDeposit.toLocaleString()} security deposit & RM {bookingSummary.utilityDeposit.toLocaleString()} utility deposit in legal escrow.</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant" htmlFor="signature-raw">
                    Type your full name to Sign Contract
                  </label>
                  <input
                    id="signature-raw"
                    type="text"
                    value={signatureText}
                    onChange={(e) => setSignatureText(e.target.value)}
                    placeholder="E.g. John Smith"
                    className="w-full h-11 border border-outline-variant rounded-xl px-4 text-sm font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  />
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => setBookingStep(1)}
                    className="text-secondary font-semibold hover:bg-surface-container px-5 py-3 rounded-full text-sm cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      if (!signatureText.trim()) {
                        alert('Please sign your signature by typing your full name.');
                        return;
                      }
                      setIsApproved(true);
                      setBookingStep(3);
                    }}
                    className="bg-primary text-on-primary px-6 py-3 rounded-full font-bold text-sm tracking-wide hover:bg-primary-container transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Finalize and Submit Booking</span>
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Complete Success confirmation */}
            {bookingStep === 3 && (
              <div className="text-center space-y-6 py-4 animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto border-4 border-green-50 shadow-sm">
                  <ShieldCheck className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-xl text-on-surface">Congratulations! Booking Initiated</h4>
                  <p className="text-xs md:text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
                    Your escrow request for <strong className="text-primary">{selectedProperty.name}</strong> of RM <strong>{bookingSummary.totalPayment.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong> is safe. Landlord has been notified for final approval.
                  </p>
                </div>

                {/* PDF Invoice mockup box */}
                <div className="bg-surface-container rounded-xl p-5 text-left border border-outline-variant max-w-sm mx-auto text-xs space-y-3 font-medium">
                  <div className="flex justify-between text-outline">
                    <span>RECEIPT REFERENCE</span>
                    <span className="font-mono text-primary font-bold">#MSW-464A-2024</span>
                  </div>
                  <div className="h-px bg-outline-variant"></div>
                  <div className="flex justify-between text-on-surface flex-wrap">
                    <span>Lease Term:</span>
                    <span className="font-semibold">{bookingSummary.durationMonths} Months</span>
                  </div>
                  <div className="flex justify-between text-on-surface flex-wrap">
                    <span>Security Escrow Deposit:</span>
                    <span className="font-semibold text-primary">RM {(bookingSummary.securityDeposit + bookingSummary.utilityDeposit).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-on-surface font-bold border-t border-outline-variant pt-2">
                    <span>Paid on Submittal:</span>
                    <span className="text-green-600">RM {bookingSummary.totalPayment.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <div className="flex justify-center gap-3 flex-wrap">
                  <button
                    onClick={() => {
                      alert('Your digital PDF receipt and signed lease contract has been downloaded to your local device.');
                    }}
                    className="bg-white border border-outline-variant text-on-surface hover:text-primary hover:border-primary px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Contract PDF</span>
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      // Reset booking steps for next time
                      setBookingStep(1);
                      setUploadedDoc(null);
                      setSignatureText('');
                    }}
                    className="bg-primary text-on-primary hover:bg-primary-container px-6 py-2.5 rounded-full text-xs font-bold transition-all active:scale-95 cursor-pointer"
                  >
                    Fulfill Panel
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>
      )}

      {/* 5. LIVE HELP / ADVISOR FAQ SLIDE-OVER SHEET */}
      {activeModal === 'advisor' && (
        <div className="bg-white shadow-2xl overflow-hidden rounded-2xl w-full max-w-md border border-outline-variant animate-in slide-in-from-right duration-200">

          {/* Header */}
          <div className="bg-primary text-on-primary px-5 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-on-primary">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm">24/7 AI Rental Advisor</h3>
                <span className="text-[10px] text-primary-fixed/80 block uppercase font-bold tracking-wider">● Advisor Online</span>
              </div>
            </div>
            <button onClick={onClose} className="text-on-primary/80 hover:text-on-primary p-1 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat dialogue field */}
          <div className="p-4 bg-surface h-[320px] overflow-y-auto space-y-4 custom-scrollbar flex flex-col">

            {chatLog.map((chat) => (
              <div
                key={chat.id}
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs inline-block shadow-xs leading-relaxed ${chat.sender === 'advisor'
                  ? 'bg-white text-on-surface self-start rounded-tl-none border border-outline-variant/60'
                  : 'bg-primary text-on-primary self-end rounded-tr-none'
                  }`}
              >
                {chat.text}
              </div>
            ))}

            {isTyping && (
              <div className="bg-white rounded-2xl p-3 text-xs self-start rounded-tl-none border border-outline-variant/60 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-outline rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-outline rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-outline rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Pre-suggested quick interactive FAQ options */}
          <div className="px-4 py-2 border-t border-b border-outline-variant/60 bg-surface-container-low">
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1">
              Suggested Questions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_QUESTIONS.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => triggerAdvisorAnswer(question)}
                  className="bg-white border border-outline-variant text-[10px] text-on-surface hover:text-primary hover:border-primary px-2.5 py-1 rounded-full cursor-pointer transition-colors max-w-full truncate"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Form input field */}
          <form onSubmit={handleSendChat} className="p-3 bg-white border-t border-outline-variant flex gap-2">
            <input
              type="text"
              value={chatInp}
              onChange={(e) => setChatInp(e.target.value)}
              placeholder="Type message regarding deposits, dates..."
              className="flex-1 px-4 py-2 text-xs border border-outline-variant rounded-xl focus:border-primary focus:outline-none placeholder:text-outline font-medium"
            />
            <button
              type="submit"
              className="bg-primary text-on-primary p-2.5 rounded-xl hover:bg-primary-container transition-all active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
