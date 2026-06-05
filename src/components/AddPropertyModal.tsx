import React, { useState } from "react";
import { X, Plus, Image, Home, DollarSign, MapPin, Maximize2, User, Loader2 } from "lucide-react";
import { motion } from "motion/react";

interface AddPropertyModalProps {
  onClose: () => void;
  onAddProperty: (newProp: any) => void;
}

export default function AddPropertyModal({ onClose, onAddProperty }: AddPropertyModalProps) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [state, setState] = useState("Kuala Lumpur");
  const [price, setPrice] = useState("2500");
  const [beds, setBeds] = useState("3");
  const [baths, setBaths] = useState("2");
  const [sqft, setSqft] = useState("1020");
  const [type, setType] = useState("Condo");
  const [landlordName, setLandlordName] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Asset presets selection for easy visual listing
  const imagePresets = [
    { name: "Urban Loft Condo", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBG2Pn2hdM2odsTK8n6tzyPIxcmCb5pxE9EMF6L9fzOv9bqiGXjUjPFaaUEXjPlgBEr7vp21sAUQlPwtmO5Cl4qPn7mlht-95NRn6IakSfKbeuZjUJW9ecVhCkgTve0QLAU9o2g-4WxR7Hjm6GeGIhlT8oXQSTHGojScnPFa7otuIjx6C_MUQxsSesHp-PMmSPJ6qieGf2fAWAc7kl7vHoJ3LPV-sZQN11CHZoLc8B41lscE3sbTRlTxcTk7eNKIsS8IbodXV5tU-0" },
    { name: "Suburban Villa Space", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtFFGUQ5jaFx8IGzhX0CPX4RIjwOWNVfLb21avA7MrAjGdQ1xmnzbH-CrQcsUNEHwDxQlU_rO_4NFuZCVN5dbVluZbJOtf06YdxfVpW5nP3fiez1GQoszgbtRCX-f3kbl7mCjdMp5eBmpScf5HllROZ-iWkqog9cB8ASz4QK3cRUx1Zp70zDSahe6IBrhSyFDztpiQSLnLJngaYn9h_tkUr_l788yA3LDOnI9QVGtrxCemPeNKEqZwDVdD2vCQruXi7yVLMvmhefI" },
    { name: "Compact Studio Apartment", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXX8T99FmkUarbdSATAqQ8gXKgdWxzRngx4vVsHbv4Fx_X1SxDiIEDaX45eHrAPrJArlVq8g9kJEhUTVi0o-7Jj-sveggLIachmMXf9vGt4sZj90vckcwQJE_CVM-z6cEb5CKFI9e87waMZXWQ7KhxN9ixpfb5v0JQO2m9dsvXR1y6oBfM0jaqOU_Fab5PO9kQx-I8pcnow__M5uPc7i-L0kR5E_WP73oYdDqEAI2ss2zkuWFeYqFTT_otFJBfX_3RESjUOiSNRoM" },
    { name: "Beautiful Park Terrace", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAb7aWMkmH0UYmRMTTvBV7EL3aNTsKqxduLdjtpcFOPk8R82moUAw3tQiKfK3xzouEbnLFDFtEPn6i6T4LD41oeSEgxHthlaZfn4k7pg3re6EQWbtydM5UU_H4tvlpMZICvCrCvEooVxe9wtbeiZfFQk5xj4Len23lzzTkgEIfrPtE38MYAlHAWWXyzKoEQs5_lqVBJ8xikzoHpIhigfHGmMXgK_Dv50Yl7XwR_xa9rN9MJEge5Fo2mn1OhRm0evAtiS4MlHgF_tcc" }
  ];
  const [selectedImageUrl, setSelectedImageUrl] = useState(imagePresets[0].url);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim() || !landlordName.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          location,
          state,
          price,
          beds,
          baths,
          sqft,
          type,
          landlordName,
          details,
          image: selectedImageUrl
        })
      });
      if (response.ok) {
        const data = await response.json();
        onAddProperty(data);
        onClose();
      }
    } catch (err) {
      console.error("Enlistment failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="bg-[#2563eb] text-white p-5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-base tracking-tight font-sans uppercase">Register High-Trust Property</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-white cursor-pointer transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-grow p-6 overflow-y-auto space-y-4 text-xs font-sans text-on-surface custom-scrollbar">
          {/* Cover option */}
          <div>
            <label className="block font-bold text-[#434655] mb-2 uppercase tracking-wide text-[10px]">Select Visual Blueprint Cover</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {imagePresets.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageUrl(img.url)}
                  className={`relative h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImageUrl === img.url ? "border-primary ring-2 ring-primary/20 scale-[0.98]" : "border-gray-100 opacity-70"
                  }`}
                >
                  <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 font-bold text-[9px] bg-black/75 text-white px-1 py-0.5 rounded-sm truncate max-w-[90%]">{img.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#434655] mb-1 uppercase tracking-wide text-[10px]">Property Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Bangsar Heights Premium Penthouse"
                className="w-full bg-[#f8f9ff] px-3 py-2 border border-blue-50 rounded-lg focus:ring-1 focus:ring-primary outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-[#434655] mb-1 uppercase tracking-wide text-[10px]">Landlord Name</label>
              <input
                type="text"
                required
                value={landlordName}
                onChange={(e) => setLandlordName(e.target.value)}
                placeholder="e.g. Datuk Salim Ibrahim"
                className="w-full bg-[#f8f9ff] px-3 py-2 border border-blue-50 rounded-lg focus:ring-1 focus:ring-primary outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#434655] mb-1 uppercase tracking-wide text-[10px]">Precise Area</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bangsar, KL"
                className="w-full bg-[#f8f9ff] px-3 py-2 border border-blue-50 rounded-lg focus:ring-1 focus:ring-primary outline-hidden"
              />
            </div>
            <div>
              <label className="block font-bold text-[#434655] mb-1 uppercase tracking-wide text-[10px]">State Hub</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-[#f8f9ff] px-3 py-2 border border-blue-50 rounded-lg focus:ring-1 focus:ring-primary outline-hidden text-gray-700 font-medium"
              >
                <option value="Kuala Lumpur">Kuala Lumpur</option>
                <option value="Selangor">Selangor</option>
                <option value="Penang">Penang</option>
                <option value="Johor Bahru">Johor Bahru</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#434655] mb-1 uppercase tracking-wide text-[10px]">Property Class</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-[#f8f9ff] px-3 py-2 border border-blue-50 rounded-lg focus:ring-1 focus:ring-primary outline-hidden text-gray-700 font-medium"
              >
                <option value="Condo">Condo</option>
                <option value="Terrace">Terrace</option>
                <option value="Bungalow">Bungalow</option>
                <option value="Apartment">Apartment</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-bold text-[#434655] mb-1 uppercase tracking-wide text-[10px]">Monthly (RM)</label>
              <input
                type="number"
                required
                min="300"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-[#f8f9ff] px-3 py-2 border border-blue-50 rounded-lg focus:ring-1 focus:ring-primary outline-hidden font-extrabold text-[#2563eb]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#434655] mb-1 uppercase tracking-wide text-[10px]">Beds count</label>
              <select
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
                className="w-full bg-[#f8f9ff] px-3 py-2 border border-blue-50 rounded-lg focus:ring-1 focus:ring-primary outline-hidden text-gray-700 font-medium"
              >
                <option value="Studio">Studio</option>
                <option value="1">1 Bed</option>
                <option value="2">2 Bed</option>
                <option value="3">3 Bed</option>
                <option value="4">4 Bed</option>
                <option value="5+">5+ Bed</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#434655] mb-1 uppercase tracking-wide text-[10px]">Baths count</label>
              <select
                value={baths}
                onChange={(e) => setBaths(e.target.value)}
                className="w-full bg-[#f8f9ff] px-3 py-2 border border-blue-50 rounded-lg focus:ring-1 focus:ring-primary outline-hidden text-gray-700 font-medium"
              >
                <option value="1">1 Bath</option>
                <option value="2">2 Bath</option>
                <option value="3">3 Bath</option>
                <option value="4">4 Bath</option>
                <option value="5+">5+ Bath</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#434655] mb-1 uppercase tracking-wide text-[10px]">Size (sqft)</label>
              <input
                type="number"
                required
                min="100"
                value={sqft}
                onChange={(e) => setSqft(e.target.value)}
                className="w-full bg-[#f8f9ff] px-3 py-2 border border-blue-50 rounded-lg focus:ring-1 focus:ring-primary outline-hidden font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#434655] mb-1 uppercase tracking-wide text-[10px]">Amenities & Description</label>
            <textarea
              required
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="List specific furnishings, gated security access keys, nearby LRT/MRT stations, structural repair response guarantees..."
              rows={3}
              className="w-full bg-[#f8f9ff] p-3 border border-blue-50 rounded-lg focus:ring-1 focus:ring-primary outline-hidden text-on-surface"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary hover:bg-[#2563eb] text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-[0.98] transition-transform cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Ledger Block...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Publish to MySewa Trust Grid</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
