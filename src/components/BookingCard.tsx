/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { Property, MatchingInputs } from "../types";
import { useNavigate } from 'react-router-dom';
import LucideIcon from "./LucideIcon";

interface BookingCardProps {
  property: Property;
  matchingInputs: MatchingInputs;
  onBookNow?: () => void;
}

export default function BookingCard({ property, matchingInputs, onBookNow }: BookingCardProps) {
  const navigate = useNavigate();
  const [checkInDate, setCheckInDate] = useState("2026-06-15");
  const [checkOutDate, setCheckOutDate] = useState("2026-07-15");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showCheckoutDrawer, setShowCheckoutDrawer] = useState(false);
  const [isSigningContract, setIsSigningContract] = useState(false);
  const [tenantSignature, setTenantSignature] = useState("");
  const [isContractSigned, setIsContractSigned] = useState(false);

  // Tour selection state
  const [showTourModal, setShowTourModal] = useState(false);
  const [tourDate, setTourDate] = useState("2026-06-10");
  const [tourTime, setTourTime] = useState("14:00");
  const [tourMode, setTourMode] = useState<"physical" | "virtual">("physical");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [tourConfirmed, setTourConfirmed] = useState(false);

  // Recalculate Smart Match Score on the fly
  const dynamicMatchScore = useMemo(() => {
    const commuteFactor = Math.max(0, 100 - (matchingInputs.klccCommuteMins - 10) * 2.5);
    const sustainabilityFactor = matchingInputs.prefersLeed ? 100 : 50;
    const rentRatio = Math.round((property.monthlyRent / (matchingInputs.monthlyIncome || 1)) * 100);
    const financialFactor = rentRatio <= 30 ? 100 : Math.max(0, 100 - (rentRatio - 30) * 3);
    const communityFactor = matchingInputs.techIndustry ? 100 : 70;

    return Math.round(
      commuteFactor * 0.3 +
      sustainabilityFactor * 0.2 +
      financialFactor * 0.3 +
      communityFactor * 0.2
    );
  }, [property, matchingInputs]);

  // Date difference logic
  const daysCount = useMemo(() => {
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 30;

    const diffTime = end.getTime() - start.getTime();
    if (diffTime <= 0) return 0;

    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [checkInDate, checkOutDate]);

  // Payment components requested: First Month's rent, Security Deposit, Utility Deposit
  const firstMonthRent = property.monthlyRent;
  const securityDeposit = property.deposit;
  const utilityDeposit = Math.round(property.monthlyRent * 0.5);
  const totalDue = firstMonthRent + securityDeposit + utilityDeposit;

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
      maximumFractionDigits: 0,
    }).format(amt);
  };

  const handleBookNowClick = () => {
    if (daysCount <= 0) {
      alert("Please select valid future dates where Check-out is after Check-in.");
      return;
    }
    if (onBookNow) {
      onBookNow();
      return;
    }
    navigate(`/booking/${property.id}`, {
      state: { checkInDate, checkOutDate, totalDue, firstMonthRent, securityDeposit, utilityDeposit, daysCount }
    });
  };

  const handleExecuteContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantSignature) return;

    setIsSigningContract(true);
    setTimeout(() => {
      setIsSigningContract(false);
      setIsContractSigned(true);
      setBookingSuccess(true);
      setShowCheckoutDrawer(false);
    }, 1500);
  };

  const handleScheduleTour = (e: React.FormEvent) => {
    e.preventDefault();
    setTourConfirmed(true);
    setTimeout(() => {
      setTourConfirmed(false);
      setShowTourModal(false);
    }, 3000);
  };

  return (
    <>
      <div id="booking-card-main" className="bg-white p-6 rounded-2xl shadow-xl border border-gray-150 space-y-6">
        {/* Scoring Indicators: Dual Gauges */}
        <div className="flex justify-around items-center pt-2 pb-4 border-b border-gray-100">
          {/* Stability Score */}
          <div className="flex flex-col items-center gap-1.5 focus-indigo-ring">
            <div className="relative w-20 h-20">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  className="text-gray-100"
                  cx="40"
                  cy="40"
                  fill="transparent"
                  r="34"
                  stroke="currentColor"
                  strokeWidth="5"
                ></circle>
                <circle
                  className="text-blue-600 transition-all duration-500"
                  cx="40"
                  cy="40"
                  fill="transparent"
                  r="34"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeDasharray="213.6"
                  strokeDashoffset={213.6 - (213.6 * property.metrics.stability) / 100}
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-black text-blue-600 leading-none">
                  {property.metrics.stability}
                </span>
                <span className="text-[8px] text-gray-400 font-bold tracking-tight mt-0.5">INDEX</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Stability</span>
          </div>

          {/* Smart Match Level */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="relative w-20 h-20">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  className="text-gray-100"
                  cx="40"
                  cy="40"
                  fill="transparent"
                  r="34"
                  stroke="currentColor"
                  strokeWidth="5"
                ></circle>
                <circle
                  className="text-amber-500 transition-all duration-500"
                  cx="40"
                  cy="40"
                  fill="transparent"
                  r="34"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeDasharray="213.6"
                  strokeDashoffset={213.6 - (213.6 * dynamicMatchScore) / 100}
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-black text-amber-500 leading-none">
                  {dynamicMatchScore}%
                </span>
                <span className="text-[8px] text-gray-400 font-bold tracking-tight mt-0.5">MATCH</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Smart Match</span>
          </div>
        </div>

        {/* Availability Form Block */}
        <div className="space-y-4">
          <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
            CHECK AVAILABILITY
          </label>
          <div className="grid grid-cols-2 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden divide-x divide-gray-200">
            <div className="p-3 flex flex-col">
              <span className="text-[9px] font-extrabold text-blue-600 uppercase tracking-wider mb-1">
                Check-in
              </span>
              <input
                id="checkin-picker"
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="bg-transparent border-0 p-0 text-xs font-bold text-gray-800 focus:outline-none focus:ring-0 w-full"
              />
            </div>
            <div className="p-3 flex flex-col">
              <span className="text-[9px] font-extrabold text-blue-600 uppercase tracking-wider mb-1">
                Check-out
              </span>
              <input
                id="checkout-picker"
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="bg-transparent border-0 p-0 text-xs font-bold text-gray-800 focus:outline-none focus:ring-0 w-full"
              />
            </div>
          </div>
          {daysCount <= 0 && (
            <div className="text-[10px] text-red-600 bg-red-50 p-2 rounded-lg border border-red-100 flex items-center gap-1">
              <LucideIcon name="AlertCircle" size={12} />
              <span>Checkout date must trigger after Check-in</span>
            </div>
          )}
        </div>

        {/* Pricing Subtotals Breakdown */}
        {daysCount > 0 && (
          <div className="space-y-3 pt-2 text-xs text-gray-600 font-medium">
            <div className="flex justify-between items-center text-gray-500">
              <span>First Month's Rent</span>
              <span className="font-bold text-gray-900">{formatCurrency(firstMonthRent)}</span>
            </div>
            <div className="flex justify-between items-center text-gray-500">
              <span>Security Deposit</span>
              <span className="font-bold text-gray-900">{formatCurrency(securityDeposit)}</span>
            </div>
            <div className="flex justify-between items-center text-gray-500">
              <span>Utility Deposit</span>
              <span className="font-bold text-gray-900">{formatCurrency(utilityDeposit)}</span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex justify-between items-center font-bold text-sm text-gray-900">
              <span>Total Payment Due</span>
              <span className="text-blue-600 text-lg font-black">{formatCurrency(totalDue)}</span>
            </div>
          </div>
        )}

        {/* Dynamic CTAs */}
        <div className="space-y-3">
          <button
            id="btn-book-now"
            onClick={handleBookNowClick}
            disabled={daysCount <= 0}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-md hover:bg-blue-700 hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Book Now
          </button>
          <button
            id="btn-schedule-tour"
            onClick={() => setShowTourModal(true)}
            className="w-full border border-gray-200 text-gray-700 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <LucideIcon name="Calendar" size={15} />
            <span>Schedule Tour</span>
          </button>
        </div>

        {/* Safe Rental Shield Info Block */}
        <div className="flex items-start gap-3 p-3.5 bg-blue-50/40 rounded-xl border border-blue-50">
          <div className="text-blue-600 mt-0.5">
            <LucideIcon name="Shield" size={18} className="fill-blue-100" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-blue-700 block">
              Safe Rental Escrow Shield
            </span>
            <span className="text-[10px] text-gray-400 leading-normal block">
              Your security deposit is retained completely within MySewa Secure Escrow infrastructure. Only dispatched after tenant entry check.
            </span>
          </div>
        </div>
      </div>

      {/* Booking Checkout Contract Drawer Overlay */}
      {showCheckoutDrawer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[110] p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-lg w-full flex flex-col max-h-[85vh] overflow-hidden animate-slide-up">
            <div className="p-6 border-b border-gray-100 flex justify-between items-start">
              <div>
                <h3 className="font-sans font-extrabold text-lg text-gray-950">
                  Secure Rental Escrow Contract
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Powered by MySewa PropTech Trust protocols.
                </p>
              </div>
              <button
                onClick={() => setShowCheckoutDrawer(false)}
                className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              >
                <LucideIcon name="X" size={18} />
              </button>
            </div>

            {/* Contract Body content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-gray-600 leading-relaxed font-normal bg-gray-50/50">
              <div className="bg-white p-4 rounded-xl shadow-xs border border-gray-200">
                <span className="block font-bold text-gray-900 text-xs mb-1 uppercase">
                  Lease parameters summary:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400">Property:</span>
                    <p className="font-semibold text-gray-800">{property.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Location:</span>
                    <p className="font-semibold text-gray-800">{property.location}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Tenure:</span>
                    <p className="font-semibold text-gray-800">
                      {checkInDate} to {checkOutDate} ({daysCount} Days)
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">Initial Upfront Payment:</span>
                    <p className="font-extrabold text-blue-600">{formatCurrency(totalDue)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-gray-800">1. PARTIES & COMPLIANCE</p>
                <p>
                  This lease agreement compliance constitutes a binding trust-verified contract between the Tenant (You) and Landlord ({property.host.name}) coordinated of SDG 9 infrastructure optimization standards.
                </p>
                <p className="font-semibold text-gray-800">2. SECURE ESCROW DISPATCH</p>
                <p>
                  The security deposit of {formatCurrency(securityDeposit)} and utility deposit of {formatCurrency(utilityDeposit)} are fully secured by MySewa Secure Escrow. Dispatch is triggered precisely after check-in confirmation and physical parameter review.
                </p>
                <p className="font-semibold text-gray-800">3. HIGH-SPEED CONNECTIVITY UNDERTAKING</p>
                <p>
                  Landlord maintains the high-speed fiber internet and power backup nodes intact. In case of disruption exceeding 4 hours, compensatory escrow penalties trigger automatically.
                </p>
              </div>

              {/* Signature area */}
              <form onSubmit={handleExecuteContract} className="space-y-3 pt-4 border-t border-gray-150">
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                    Sign Digitally (Type full name to execute)
                  </label>
                  <input
                    type="text"
                    required
                    value={tenantSignature}
                    onChange={(e) => setTenantSignature(e.target.value)}
                    placeholder="e.g. Priyasheel Sharma"
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSigningContract}
                  className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isSigningContract ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying Escrow Ledger...</span>
                    </>
                  ) : (
                    <>
                      <LucideIcon name="Cpu" size={13} />
                      <span>Execute Escrow Agreement</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Tour Booking Modal Popup */}
      {showTourModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[110] p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-sm w-full p-6 relative overflow-hidden animate-slide-up">
            <button
              onClick={() => setShowTourModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-all"
            >
              <LucideIcon name="X" size={18} />
            </button>

            {tourConfirmed ? (
              <div className="text-center py-6 space-y-4 animate-scale-in">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto border border-green-100 shadow-xs">
                  <LucideIcon name="Check" size={24} className="font-bold animate-bounce" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-gray-900 text-lg">Tour Scheduled!</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Your {tourMode} tour on <strong>{tourDate}</strong> at <strong>{tourTime}</strong> is booked with {property.host.name}. Confirmation sent to {phoneNumber || "your phone"}!
                  </p>
                </div>
                <div className="text-[10px] text-gray-400 italic">
                  Generating Google Meet invites / entry gatepasses...
                </div>
              </div>
            ) : (
              <form onSubmit={handleScheduleTour} className="space-y-4">
                <div>
                  <h4 className="font-sans font-bold text-gray-950 text-base">Schedule a Property Tour</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Connect with Vikram to experience the space digitally or physically.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setTourMode("physical")}
                    className={`py-1.5 rounded-md text-xs font-bold transition-all ${tourMode === "physical"
                      ? "bg-white text-blue-600 shadow-xs"
                      : "text-gray-500 hover:text-gray-800"
                      }`}
                  >
                    Physical Visit
                  </button>
                  <button
                    type="button"
                    onClick={() => setTourMode("virtual")}
                    className={`py-1.5 rounded-md text-xs font-bold transition-all ${tourMode === "virtual"
                      ? "bg-white text-blue-600 shadow-xs"
                      : "text-gray-500 hover:text-gray-800"
                      }`}
                  >
                    Virtual Videocall
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      required
                      value={tourDate}
                      onChange={(e) => setTourDate(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      required
                      value={tourTime}
                      onChange={(e) => setTourTime(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                    Active Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-blue-700 transition-colors"
                >
                  Confirm Tour
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Booking Absolute Success Dialog */}
      {bookingSuccess && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[120] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-gray-200 shadow-2xl relative text-center space-y-5 animate-scale-in">
            <button
              onClick={() => setBookingSuccess(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <LucideIcon name="X" size={20} />
            </button>

            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto border border-blue-100 shadow-md">
              <LucideIcon name="ShieldCheck" size={32} className="animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] tracking-widest font-extrabold uppercase text-green-600 bg-green-50 px-2.5 py-1 rounded-md border border-green-150-v">
                ESCROW AGREEMENT LIVE
              </span>
              <h3 className="font-sans font-black text-2xl text-gray-950">
                Booking Completed!
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed font-normal">
                Congratulations, your reservation for <strong>{property.name}</strong> is locked in securely!
              </p>
            </div>

            {/* Smart ledger confirmation details */}
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-left space-y-1.5">
              <div className="flex justify-between text-xs text-gray-600">
                <span className="font-semibold">Initial Payment Secured:</span>
                <span className="font-bold text-gray-950">{formatCurrency(totalDue)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span className="font-semibold">Period:</span>
                <span className="font-bold text-gray-950">
                  {daysCount} Days ({checkInDate})
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span className="font-semibold">Escrow Ledger Hash:</span>
                <span className="font-mono text-[9px] text-blue-600 select-all font-bold">
                  sewa_tx_9019af723e1b00a20bc
                </span>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 leading-normal italic">
              Verified by Vikram Malhotra. A physical check-in entry pass has been emailed. Welcome to sustainable smart living.
            </p>

            <button
              onClick={() => setBookingSuccess(false)}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-xs hover:bg-blue-700 transition-colors"
            >
              Return to Property Details
            </button>
          </div>
        </div>
      )}
    </>
  );
}
