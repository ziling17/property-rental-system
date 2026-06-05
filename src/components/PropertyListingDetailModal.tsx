import React, { useState, useEffect } from "react";
import { Property, Review, Transaction } from "../types";
import { 
  X, MapPin, Bed, Bath, Maximize2, Shield, User, FileText, Check, 
  Sparkles, HelpCircle, Star, Send, Wallet, Percent, AlertCircle, Loader2, Printer 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PropertyDetailsModalProps {
  property: Property;
  onClose: () => void;
  onRefreshProperty: (updatedProperty: Property) => void;
  onAddTransaction: (newTx: any) => void;
}

export default function PropertyDetailsModal({ 
  property, 
  onClose, 
  onRefreshProperty,
  onAddTransaction 
}: PropertyDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "contract" | "audit" | "escrow">("overview");
  
  // Review form state
  const [reviewerName, setReviewerName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Contract Generator State
  const [tenantName, setTenantName] = useState("");
  const [leaseTerm, setLeaseTerm] = useState("12");
  const [customRules, setCustomRules] = useState("");
  const [generatingContract, setGeneratingContract] = useState(false);
  const [generatedContract, setGeneratedContract] = useState("");

  // Audit State
  const [landlordCommitment, setLandlordCommitment] = useState("Landlord promises to complete standard water pipes and electric repairs within 48 hours in corporate lease addendum.");
  const [depositAgreement, setDepositAgreement] = useState("2 months deposit held inside MySewa neutral digital escrow vault ledger.");
  const [grossIncome, setGrossIncome] = useState("15,000");
  const [auditing, setAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<{ score: number; riskAssessment: string } | null>(null);

  // Escrow State
  const [escrowAmount, setEscrowAmount] = useState(property.depositRequired);
  const [escrowStatus, setEscrowStatus] = useState<"idle" | "locking" | "locked">("idle");
  const [escrowTx, setEscrowTx] = useState<any>(null);

  // Reset active tab to overview when property changes
  useEffect(() => {
    setActiveTab("overview");
    setGeneratedContract("");
    setAuditResult(null);
    setEscrowStatus("idle");
    setEscrowTx(null);
  }, [property]);

  // Income ratio calculation
  const monthlyRent = property.price;
  const incomeNum = Number(grossIncome.replace(/,/g, "")) || 1;
  const rentToIncomeRatio = Math.round((monthlyRent / incomeNum) * 100);

  // Submit standard customer rating
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      const response = await fetch(`/api/properties/${property.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: reviewerName,
          rating: reviewRating,
          comment: reviewComment
        })
      });
      if (response.ok) {
        const updated: Property = await response.json();
        onRefreshProperty(updated);
        setReviewerName("");
        setReviewComment("");
        setReviewRating(5);
      }
    } catch (err) {
      console.error("Failed to post review:", err);
    } finally {
      setSubmittingReview(false);
    }
  };

  // Draft Legally Clean Tenancy Contract via Gemini
  const handleDraftContract = async () => {
    if (!tenantName.trim()) return;
    setGeneratingContract(true);
    try {
      const response = await fetch("/api/generate-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyTitle: property.title,
          tenantName,
          monthlyRent: property.price,
          depositAmount: property.depositRequired,
          leaseTermMonths: leaseTerm,
          customRules
        })
      });
      if (response.ok) {
        const data = await response.json();
        setGeneratedContract(data.contract);
      }
    } catch (err) {
      console.error("Contract draft error:", err);
    } finally {
      setGeneratingContract(false);
    }
  };

  // Run AI Security Proposal Audit
  const handleRunAudit = async () => {
    setAuditing(true);
    try {
      const response = await fetch("/api/stability-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          landlordOffersRepairs: landlordCommitment,
          depositAgreement: depositAgreement,
          rentToIncomeRatio: rentToIncomeRatio,
          tenantContractReview: `Evaluating proposed tenancy of ${property.title} by ${property.landlordName}. Term: ${leaseTerm} months. Stability index is ${property.stabilityScore}.`
        })
      });
      if (response.ok) {
        const data = await response.json();
        setAuditResult({
          score: data.score,
          riskAssessment: data.riskAssessment
        });
      }
    } catch (err) {
      console.error("Audit error:", err);
    } finally {
      setAuditing(false);
    }
  };

  // Safe lock deposit in third-party escrow
  const handleLockEscrow = async () => {
    setEscrowStatus("locking");
    try {
      const response = await fetch("/api/escrow/lock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyName: property.title,
          amount: escrowAmount
        })
      });
      if (response.ok) {
        const data = await response.json();
        setEscrowStatus("locked");
        setEscrowTx(data.transaction);
        onAddTransaction(data.transaction);
      }
    } catch (err) {
      console.error("Escrow error:", err);
      setEscrowStatus("idle");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="bg-[#f8f9ff] w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-full max-h-[90vh]"
      >
        {/* Left Side: Property Image Gallery & Key Metrics */}
        <div className="w-full md:w-5/12 bg-white flex flex-col border-r border-gray-100 p-6 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-4 md:hidden">
            <h2 className="text-lg font-bold text-primary">MySewa Secure Detail</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="relative rounded-xl overflow-hidden shadow-xs h-52 md:h-64 shrink-0 bg-gray-50">
            <img 
              src={property.image} 
              alt={property.title} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover" 
            />
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-green-400" />
              <span>Escrow Bond Guaranteed</span>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <span className="text-xs font-semibold text-primary uppercase bg-blue-50 px-2.5 py-1 rounded-md font-mono">{property.type}</span>
              <h2 className="text-xl md:text-2xl font-bold font-sans text-on-surface mt-2 tracking-tight">
                {property.title}
              </h2>
              <p className="text-sm text-on-surface-variant flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4 shrink-0 text-gray-400" />
                <span>{property.location}</span>
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-[#eff4ff] p-3 rounded-xl border border-blue-50 text-center text-xs">
              <div>
                <p className="text-[#737686] font-medium">Beds</p>
                <p className="font-bold text-on-surface mt-1 flex items-center justify-center gap-1">
                  <Bed className="w-3.5 h-3.5 text-primary" /> {property.beds}
                </p>
              </div>
              <div>
                <p className="text-[#737686] font-medium">Baths</p>
                <p className="font-bold text-on-surface mt-1 flex items-center justify-center gap-1">
                  <Bath className="w-3.5 h-3.5 text-primary" /> {property.baths}
                </p>
              </div>
              <div>
                <p className="text-[#737686] font-medium">Size</p>
                <p className="font-bold text-on-surface mt-1 flex items-center justify-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5 text-primary" /> {property.sqft} sqft
                </p>
              </div>
            </div>

            {/* Landlord Trust Badge block */}
            <div className="border border-green-100 bg-emerald-50/50 p-4 rounded-xl space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <User className="w-4.5 h-4.5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-on-surface">{property.landlordName}</h4>
                  <p className="text-[11px] text-emerald-700 flex items-center gap-1 font-semibold uppercase">
                    <Check className="w-3.5 h-3.5" /> Registered Landlord
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-emerald-100 text-xs text-on-surface-variant">
                <div>
                  <p className="font-medium text-gray-500">Lease Renewal</p>
                  <p className="font-bold text-gray-900 mt-0.5">{property.renewRate}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Safety Index</p>
                  <p className="font-bold text-emerald-600 mt-0.5">{property.contractSafety}</p>
                </div>
              </div>
            </div>

            {/* System Description */}
            <div className="text-xs leading-relaxed text-on-surface-variant bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              <h5 className="font-bold text-on-surface mb-1 uppercase tracking-wide text-[10px]">Property Note</h5>
              <p>{property.details}</p>
            </div>
          </div>
        </div>

        {/* Right Side: Tabbed Dynamic Intelligence Workflow Panel */}
        <div className="flex-grow flex flex-col h-full bg-[#f8f9ff] overflow-hidden">
          {/* Header tabs row */}
          <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
            <div className="flex space-x-1 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === "overview" 
                    ? "bg-primary text-white shadow-sm" 
                    : "text-[#737686] hover:bg-gray-100 hover:text-on-surface"
                }`}
              >
                Overview & Reviews
              </button>
              <button
                onClick={() => setActiveTab("contract")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                  activeTab === "contract" 
                    ? "bg-primary text-white shadow-sm" 
                    : "text-[#737686] hover:bg-gray-100 hover:text-on-surface"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Draft AI Agreement
              </button>
              <button
                onClick={() => setActiveTab("audit")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                  activeTab === "audit" 
                    ? "bg-primary text-white shadow-sm" 
                    : "text-[#737686] hover:bg-gray-100 hover:text-on-surface"
                }`}
              >
                <Percent className="w-3.5 h-3.5" />
                Proposal Safety Audit
              </button>
              <button
                onClick={() => setActiveTab("escrow")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                  activeTab === "escrow" 
                    ? "bg-primary text-white shadow-sm" 
                    : "text-[#737686] hover:bg-gray-100 hover:text-on-surface"
                }`}
              >
                <Wallet className="w-3.5 h-3.5" />
                SafePay Escrow
              </button>
            </div>

            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 hidden md:flex cursor-pointer transition-colors"
            >
              <X className="w-6 h-6 text-gray-400 hover:text-on-surface" />
            </button>
          </div>

          {/* Dynamic Window Area */}
          <div className="flex-grow p-6 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  {/* Landlord Stability Score Badge Card */}
                  <div className="bg-[#ffe083] bg-opacity-20 border border-[#cea700] rounded-xl p-5 flex flex-col sm:flex-row items-center gap-4 dark:bg-opacity-5">
                    <div className="w-16 h-16 rounded-full bg-[#ffe083] flex items-center justify-center text-[#231b00] text-3xl font-bold border-4 border-white shadow-md">
                      {property.stabilityScore}
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-on-surface flex items-center gap-1.5 uppercase tracking-wide text-xs">
                        <Sparkles className="w-4 h-4 text-[#cea700]" />
                        Landlord Trust Stability Score: {property.stabilityScore}/100
                      </h4>
                      <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
                        Calculated based on prompt security deposit release, lease renewals, tenant dispute resolutions, and upkeep compliance. Highly stable profiles guarantee reliable transactions alignment.
                      </p>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg text-on-surface font-sans">
                      Verified Resident Reviews ({property.reviews.length})
                    </h3>

                    {property.reviews.length === 0 ? (
                      <p className="text-sm text-on-surface-variant bg-white p-4 text-center rounded-xl border border-gray-100">
                        No reviews posted yet. Be the first to add verified feedback!
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {property.reviews.map((rev, index) => (
                          <div key={index} className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-on-surface">{rev.author}</span>
                              <span className="text-gray-400 font-mono">{rev.date}</span>
                            </div>
                            <div className="flex text-amber-500">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-3.5 h-3.5 ${i < Math.round(rev.rating) ? "fill-current" : "text-gray-200"}`} 
                                />
                              ))}
                            </div>
                            <p className="text-xs text-on-surface-variant leading-relaxed">{rev.comment}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Leave interactive review Form */}
                  <form onSubmit={handleReviewSubmit} className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs space-y-4">
                    <h4 className="font-bold text-sm text-[#121c2a] uppercase tracking-wider text-xs">Add Verified Feedback</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#434655] mb-1">Your Full Name</label>
                        <input
                          type="text"
                          required
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          placeholder="Zaleha Kasim"
                          className="w-full bg-[#f8f9ff] text-xs px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#434655] mb-1">Tenancy Rating</label>
                        <select
                          value={reviewRating}
                          onChange={(e) => setReviewRating(Number(e.target.value))}
                          className="w-full bg-[#f8f9ff] text-xs px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary outline-hidden font-semibold"
                        >
                          <option value="5">⭐⭐⭐⭐⭐ Excellent (5/5)</option>
                          <option value="4">⭐⭐⭐⭐ Great (4/5)</option>
                          <option value="3">⭐⭐⭐ Standard (3/5)</option>
                          <option value="2">⭐⭐ Fair (2/5)</option>
                          <option value="1">⭐ Poor (1/5)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#434655] mb-1">Tenancy Experience Notes</label>
                      <textarea
                        required
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Detail repair responses, communication safety, and utility billing fairness..."
                        rows={3}
                        className="w-full bg-[#f8f9ff] text-xs p-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary outline-hidden text-on-surface"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="w-full bg-primary hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {submittingReview ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>Submit Review & Recalculate Score</span>
                    </button>
                  </form>
                </motion.div>
              )}

              {activeTab === "contract" && (
                <motion.div
                  key="contract"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-5"
                >
                  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs space-y-4">
                    <div>
                      <h3 className="font-bold text-base text-on-surface flex items-center gap-1">
                        <Sparkles className="w-5 h-5 text-[#cea700]" />
                        MySewa Gemini Tenancy Agreement Draft Tool
                      </h3>
                      <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
                        Compose a legally robust residential tenancy contract in moments. Our high-trust system validates details against Malaysian tenancy laws by querying server-side Gemini.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#434655] mb-1">Tenant Full Name (as per IC/Passport)</label>
                        <input
                          type="text"
                          required
                          value={tenantName}
                          onChange={(e) => setTenantName(e.target.value)}
                          placeholder="Ding Zi Ling"
                          className="w-full bg-[#f8f9ff] text-xs px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#434655] mb-1">Lease Duration</label>
                        <select
                          value={leaseTerm}
                          onChange={(e) => setLeaseTerm(e.target.value)}
                          className="w-full bg-[#f8f9ff] text-xs px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary outline-hidden font-medium"
                        >
                          <option value="6">6 Months Term</option>
                          <option value="12">12 Months (1 Year)</option>
                          <option value="24">24 Months (2 Years)</option>
                          <option value="36">36 Months (3 Years)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#434655] mb-1">Custom Safety Clauses or Rules (Optional)</label>
                      <textarea
                        value={customRules}
                        onChange={(e) => setCustomRules(e.target.value)}
                        placeholder="Example: Domestic pets permitted with cleanliness bond, no commercial Airbnb subletting, maintenance under RM200 minor repairs..."
                        rows={2.5}
                        className="w-full bg-[#f8f9ff] text-xs p-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary outline-hidden text-on-surface"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={generatingContract || !tenantName.trim()}
                      onClick={handleDraftContract}
                      className="w-full bg-[#2563eb] text-white hover:bg-blue-700 font-semibold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {generatingContract ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>AI Drafting Tenancy Terms...</span>
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4" />
                          <span>Generate Certified Agreement Preview via AI</span>
                        </>
                      )}
                    </button>
                  </div>

                  {generatedContract && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4"
                    >
                      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 font-mono uppercase">
                          <Check className="w-4 h-4" /> Gemini Legal Verification Complete
                        </span>
                        <button 
                          onClick={() => window.print()}
                          className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                        >
                          <Printer className="w-3.5 h-3.5" /> Print / PDF Draft
                        </button>
                      </div>

                      <div className="bg-[#f8f9ff] font-mono text-xs p-4 rounded-lg overflow-x-auto max-h-[250px] overflow-y-auto whitespace-pre-wrap leading-relaxed text-on-surface border border-gray-100">
                        {generatedContract}
                      </div>

                      <p className="text-[10px] text-on-surface-variant leading-relaxed text-center italic">
                        *This agreement aligns with standard smart escrow protection guidelines (SDG 9 Infrastructure Certification). Hand signatures or electronic signing via verified ID locks this contract terms.*
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {activeTab === "audit" && (
                <motion.div
                  key="audit"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-5"
                >
                  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs space-y-4">
                    <div>
                      <h3 className="font-bold text-base text-on-surface flex items-center gap-1">
                        <Shield className="w-5 h-5 text-primary" />
                        Interactive Rental Cybersecurity & Proposal Audit
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                        Assess financial and contractual safety risks of this potential rental proposal dynamically prior to committing money inside the blockchain/escrow ledger.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#434655] mb-1">Your Gross Monthly Household Income (RM)</label>
                        <input
                          type="text"
                          value={grossIncome}
                          onChange={(e) => setGrossIncome(e.target.value)}
                          className="w-full bg-[#f8f9ff] text-xs px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary outline-hidden font-bold"
                        />
                      </div>
                      <div className="bg-[#eff4ff] p-2.5 rounded-lg border border-blue-100 flex flex-col justify-center">
                        <span className="text-[10px] text-gray-400 font-semibold uppercase font-mono">Rent-to-income Ratio</span>
                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span className={`text-xl font-extrabold ${rentToIncomeRatio > 35 ? "text-red-600" : "text-emerald-700"}`} >
                            {rentToIncomeRatio}%
                          </span>
                          <span className="text-[10px] text-on-surface-variant">
                            {rentToIncomeRatio > 35 ? "(Heavy budget strain)" : "(Highly Sustainable)"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#434655] mb-1">Landlord Repairs Commitment Clause</label>
                      <input
                        type="text"
                        value={landlordCommitment}
                        onChange={(e) => setLandlordCommitment(e.target.value)}
                        className="w-full bg-[#f8f9ff] text-xs px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary outline-hidden font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#434655] mb-1">Deposit Storage & Rules</label>
                      <input
                        type="text"
                        value={depositAgreement}
                        onChange={(e) => setDepositAgreement(e.target.value)}
                        className="w-full bg-[#f8f9ff] text-xs px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary outline-hidden font-medium"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={auditing}
                      onClick={handleRunAudit}
                      className="w-full bg-primary hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {auditing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Analyzing rental parameters via Gemini...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Execute AI Tenancy Risk Audit</span>
                        </>
                      )}
                    </button>
                  </div>

                  {auditResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <h4 className="font-bold text-sm text-[#121c2a] flex items-center gap-1">
                          <AlertCircle className="w-4 h-4 text-primary" />
                          MySewa AI Tenancy Risk Score Analysis
                        </h4>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-gray-400 font-semibold font-mono">Proposal Score:</span>
                          <span className={`font-mono font-extrabold text-[#ffffff] px-2 py-0.5 rounded-md text-xs ${
                            auditResult.score >= 85 ? "bg-emerald-600" : "bg-amber-600"
                          }`}>
                            {auditResult.score}/100
                          </span>
                        </div>
                      </div>

                      <div className="text-xs leading-relaxed text-on-surface-variant space-y-2 prose prose-sm max-h-[220px] overflow-y-auto pr-1">
                        <div className="whitespace-pre-wrap">{auditResult.riskAssessment}</div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {activeTab === "escrow" && (
                <motion.div
                  key="escrow"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-5"
                >
                  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs space-y-4">
                    <div>
                      <h3 className="font-bold text-base text-on-surface flex items-center gap-1">
                        <Wallet className="w-5 h-5 text-primary" />
                        MySewa Escrow SafePay Ledger (SDG 9 Infrastructure)
                      </h3>
                      <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
                        By deploying rental deposits inside our licensed Escrow, funds are securely "locked" and only authorized for release upon mutual checkout validation or official court arbitration.
                      </p>
                    </div>

                    <div className="bg-[#eff4ff] p-4 rounded-xl border border-blue-50 space-y-2">
                      <div className="flex justify-between items-center text-xs text-[#434655]">
                        <span>Secure Holding Deposit</span>
                        <span>Rent protection bond (2 months)</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-2xl font-extrabold text-primary">RM {property.depositRequired.toLocaleString()}</span>
                        <span className="text-xs text-[#2563eb] font-semibold">Protected Escrow Standard</span>
                      </div>
                    </div>

                    {escrowStatus === "idle" && (
                      <button
                        type="button"
                        onClick={handleLockEscrow}
                        className="w-full bg-primary hover:bg-blue-700 text-white font-semibold text-xs py-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Shield className="w-4 h-4 text-[#ffe083]" />
                        <span>Lock RM {property.depositRequired} Security Deposit In Escrow</span>
                      </button>
                    )}

                    {escrowStatus === "locking" && (
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col items-center justify-center text-center space-y-2">
                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                        <p className="text-xs text-on-surface font-semibold animate-pulse">Contacting Trust Escrow Registry ledger holds...</p>
                      </div>
                    )}

                    {escrowStatus === "locked" && escrowTx && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg space-y-3"
                      >
                        <div className="flex items-center gap-2 text-emerald-800">
                          <Check className="w-5 h-5 bg-emerald-100 rounded-full text-emerald-800 p-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-bold font-sans uppercase tracking-wider">Deposit Holds Activated Successfully!</p>
                            <p className="text-[11px] text-emerald-700 font-mono mt-0.5">Reference State: {escrowTx.id}</p>
                          </div>
                        </div>

                        <div className="bg-white p-3 rounded-lg border border-emerald-100 space-y-2 text-xs">
                          <div className="flex justify-between font-medium">
                            <span className="text-gray-400">Merchant Registry</span>
                            <span className="text-gray-900">MySewa SafePay Escrow Ltd</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span className="text-gray-400">Lock Amount</span>
                            <span className="text-emerald-700 font-bold">RM {escrowTx.amount}</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span className="text-gray-400">Holding Conditions</span>
                            <span className="text-gray-900 text-right">Inter-release on checkout checklist success</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
