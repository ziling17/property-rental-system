import React from 'react';
import { ArrowRight, Headphones, AlertCircle } from 'lucide-react';
import { Property, BookingSummary } from '../types';

interface PaymentSummaryProps {
  property: Property;
  summary: BookingSummary;
  onConfirmBooking: () => void;
  onOpenAdvisor: () => void;
  onOpenTerms: (title: string, content: string) => void;
}

export default function PaymentSummary({
  property,
  summary,
  onConfirmBooking,
  onOpenAdvisor,
  onOpenTerms
}: PaymentSummaryProps) {
  
  const formattedRent = property.monthlyRent.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const formattedSecurity = summary.securityDeposit.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const formattedUtility = summary.utilityDeposit.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const formattedTotal = summary.totalPayment.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const handleAgreementClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpenTerms(
      'Rental Agreement',
      'This agreement is a binding legal contract between the tenant and the landlord. The security deposit is held inside a designated MySewa escrow account and is fully refundable at completion if the inspection matches the original verified state.'
    );
  };

  const handleTermsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpenTerms(
      'Platform Terms & Policies',
      'By using MySewa, you agree to our zero-tolerance policy against fake listings, discriminatory landlord policies, and unannounced fees. All deposits are protected under SDG 9 digital billing guidelines and bank-grade encryption protocols.'
    );
  };

  return (
    <div 
      className="sticky top-24 bg-white rounded-xl shadow-lg border border-outline-variant p-6 md:p-8 transition-transform duration-300"
      id="payment-summary-card"
    >
      {/* Card Header */}
      <h3 className="text-xl font-bold text-on-surface mb-6">Payment Summary</h3>

      {/* Bill Items list */}
      <div className="space-y-4 mb-6">
        
        {/* Item 1: Rent */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-on-surface-variant font-medium">First Month Rent</span>
          <span className="font-semibold text-on-surface">RM {formattedRent}</span>
        </div>

        {/* Item 2: Security */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-on-surface-variant font-medium">Security Deposit (Refundable)</span>
          <span className="font-semibold text-on-surface">RM {formattedSecurity}</span>
        </div>

        {/* Item 3: Utility */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-on-surface-variant font-medium">Utility Deposit (Refundable)</span>
          <span className="font-semibold text-on-surface">RM {formattedUtility}</span>
        </div>

        {/* Divider line */}
        <div className="h-px bg-outline-variant my-4"></div>

        {/* Dynamic Total Initial payment */}
        <div className="flex justify-between items-end">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-on-surface-variant block mb-0.5">
              Total Initial Payment
            </span>
            <span className="text-xs text-outline font-medium">Due upon confirmation</span>
          </div>
          <span className="text-2xl font-bold text-primary">
            RM {formattedTotal}
          </span>
        </div>

      </div>

      {/* Main Trigger buttons and validation feedback */}
      <div className="flex flex-col gap-4">
        
        {summary.isValid ? (
          <button 
            onClick={onConfirmBooking}
            className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold text-base shadow-md hover:bg-primary-container transition-all active:scale-95 duration-150 flex justify-center items-center gap-2 cursor-pointer cursor-pointer hover:shadow-lg"
            id="confirm-booking-btn"
          >
            <span>Confirm Booking</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <button 
              disabled
              className="w-full bg-secondary-fixed text-on-secondary-fixed-variant py-4 rounded-xl font-bold text-base flex justify-center items-center gap-2 cursor-not-allowed opacity-60"
              id="confirm-booking-disabled-btn"
            >
              <span>Booking Locked</span>
              <AlertCircle className="w-5 h-5 text-error" />
            </button>
            <p className="text-xs text-error font-medium text-center">
              Please choose a lease duration of at least 6 months.
            </p>
          </div>
        )}

        {/* Legalese links */}
        <p className="text-center text-xs text-outline px-4 leading-relaxed font-medium">
          By clicking confirm, you agree to our{' '}
          <a onClick={handleAgreementClick} className="underline hover:text-primary cursor-pointer transition-colors" href="#">
            Rental Agreement
          </a>{' '}
          and{' '}
          <a onClick={handleTermsClick} className="underline hover:text-primary cursor-pointer transition-colors" href="#">
            Platform Terms
          </a>.
        </p>
      </div>

      {/* Helpdesk Advisor prompt */}
      <div 
        onClick={onOpenAdvisor}
        className="mt-8 pt-6 border-t border-outline-variant cursor-pointer group hover:opacity-90 active:scale-[0.98] transition-all"
        id="advisor-help-launcher"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors border border-primary/10">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors">
              Need help?
            </p>
            <p className="text-xs text-on-surface-variant font-medium">
              Talk to a rental advisor 24/7
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
