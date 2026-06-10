import React, { useState } from 'react';
import { Search, Plus, Filter, Key, Home, Trash2, Edit3, Settings, Calendar, ListFilter, Users, Check, MapPin } from 'lucide-react';
import { Property, PropertyType, PropertyStatus } from '../types';

interface PropertiesViewProps {
  properties: Property[];
  onAddProperty: (newProp: Property) => void;
  onUpdateProperty: (updatedProp: Property) => void;
  onDeleteProperty: (id: string) => void;
  isAddModalOpenInitially: boolean;
  clearAddModalFlag: () => void;
}

export default function PropertiesView({
  properties,
  onAddProperty,
  onUpdateProperty,
  onDeleteProperty,
  isAddModalOpenInitially,
  clearAddModalFlag
}: PropertiesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedProp, setSelectedProp] = useState<Property | null>(null);

  // Modal open states
  const [isAddModalOpen, setIsAddModalOpen] = useState(isAddModalOpenInitially);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit/Add Form states
  const [formName, setFormName] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formType, setFormType] = useState<PropertyType>('Apartment');
  const [formUnits, setFormUnits] = useState(1);
  const [formOccupied, setFormOccupied] = useState(1);
  const [formRent, setFormRent] = useState(1500);
  const [formStatus, setFormStatus] = useState<PropertyStatus>('Active');
  const [formImage, setFormImage] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formAmenities, setFormAmenities] = useState('');
  const [formYearBuilt, setFormYearBuilt] = useState(2020);

  if (isAddModalOpenInitially && !isAddModalOpen) {
    setIsAddModalOpen(true);
    clearAddModalFlag();
  }

  // Filter listings
  const filteredProperties = properties.filter((prop) => {
    const matchesSearch = prop.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          prop.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || prop.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || prop.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const resetForm = () => {
    setFormName('');
    setFormAddress('');
    setFormType('Apartment');
    setFormUnits(1);
    setFormOccupied(1);
    setFormRent(1500);
    setFormStatus('Active');
    setFormImage('');
    setFormDesc('');
    setFormAmenities('');
    setFormYearBuilt(2020);
  };

  const handleOpenAddModal = () => {
    resetForm();
    // Pre-fill some pretty fallback image
    setFormImage('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80');
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (prop: Property) => {
    setFormName(prop.name);
    setFormAddress(prop.address);
    setFormType(prop.type);
    setFormUnits(prop.units);
    setFormOccupied(prop.occupiedUnits);
    setFormRent(prop.monthlyRent);
    setFormStatus(prop.status);
    setFormImage(prop.image);
    setFormDesc(prop.description);
    setFormAmenities(prop.amenities.join(', '));
    setFormYearBuilt(prop.yearBuilt);
    setIsEditModalOpen(true);
    setSelectedProp(prop);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formAddress) return;

    const newProp: Property = {
      id: `prop-${Date.now()}`,
      name: formName,
      address: formAddress,
      type: formType,
      units: Number(formUnits),
      occupiedUnits: Number(formOccupied),
      monthlyRent: Number(formRent),
      status: formStatus,
      image: formImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      description: formDesc || 'A gorgeous property registered on MySewa, located in prime sector with premium features.',
      amenities: formAmenities ? formAmenities.split(',').map(a => a.trim()) : ['High Speed Wifi', 'Modern Kitchen'],
      yearBuilt: Number(formYearBuilt)
    };

    onAddProperty(newProp);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProp || !formName || !formAddress) return;

    const updated: Property = {
      ...selectedProp,
      name: formName,
      address: formAddress,
      type: formType,
      units: Number(formUnits),
      occupiedUnits: Number(formOccupied),
      monthlyRent: Number(formRent),
      status: formStatus,
      image: formImage,
      description: formDesc,
      amenities: formAmenities ? formAmenities.split(',').map(a => a.trim()) : [],
      yearBuilt: Number(formYearBuilt)
    };

    onUpdateProperty(updated);
    setIsEditModalOpen(false);
    setSelectedProp(null);
    resetForm();
  };

  return (
    <div className="space-y-8">
      {/* Search and Filters Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-3xs">
        <div className="relative flex-1 w-full max-w-md">
          <Search size={18} className="absolute left-3.5 top-3 text-gray-400" />
          <input
            id="property-search-input"
            type="text"
            placeholder="Search properties by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {/* Custom Select for Property Type */}
          <div className="relative text-xs">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none font-medium text-gray-600 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl cursor-pointer hover:bg-gray-100 outline-none"
            >
              <option value="All">All Types</option>
              <option value="Apartment">Apartment</option>
              <option value="Suite">Suite</option>
              <option value="Condo">Condo</option>
              <option value="House">House</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>

          <div className="relative text-xs">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none font-medium text-gray-600 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl cursor-pointer hover:bg-gray-100 outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Vacant">Vacant</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <button
            id="prop-filter-add-btn"
            onClick={handleOpenAddModal}
            className="ml-auto md:ml-0 flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Plus size={16} /> Add Property
          </button>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((prop) => (
          <div
            key={prop.id}
            className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            {/* Image container & Type badge */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={prop.image}
                alt={prop.name}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 flex gap-1.5">
                <span className="bg-white/95 text-slate-800 font-bold px-2.5 py-1 rounded-full text-xs shadow-xs uppercase tracking-wider">
                  {prop.type}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-xs ${
                  prop.status === 'Active' ? 'bg-emerald-600' :
                  prop.status === 'Under Maintenance' ? 'bg-amber-500' : 'bg-red-500'
                }`}>
                  {prop.status}
                </span>
              </div>
            </div>

            {/* General Info */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                  {prop.name}
                </h4>
                <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-1">
                  <MapPin size={12} className="text-gray-400" />
                  {prop.address}
                </p>
                <p className="text-sm text-gray-500 mt-3 line-clamp-2 leading-relaxed">
                  {prop.description}
                </p>
              </div>

              {/* Multi-unit display and pricing card */}
              <div className="mt-5 border-t border-gray-50 pt-4">
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3.5">
                  <div className="bg-gray-50/50 p-2 rounded-xl text-center">
                    <span className="block font-medium text-gray-400">Total Units</span>
                    <span className="text-sm font-bold text-slate-700">{prop.units}</span>
                  </div>
                  <div className="bg-gray-50/50 p-2 rounded-xl text-center">
                    <span className="block font-medium text-gray-400">Occupied</span>
                    <span className="text-sm font-bold text-blue-600">{prop.occupiedUnits}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-blue-50/30 p-2.5 rounded-xl border border-blue-50/20">
                  <div>
                    <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider block">Monthly Rent</span>
                    <span className="text-lg font-extrabold text-blue-800">${prop.monthlyRent}</span>
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      id={`edit-property-${prop.id}`}
                      onClick={() => handleOpenEditModal(prop)}
                      className="p-1.5 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit details"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      id={`delete-property-${prop.id}`}
                      onClick={() => onDeleteProperty(prop.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Property"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredProperties.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <Home size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium text-sm">No properties found matching your selection.</p>
            <button
              onClick={() => { setSearchTerm(''); setTypeFilter('All'); setStatusFilter('All'); }}
              className="text-blue-600 text-xs font-semibold mt-2 hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Property Slide-over Modal Form: Add Property */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-xl w-full flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
              <h3 className="font-bold text-gray-900 text-lg">Add New Property to Portfolio</h3>
              <button
                onClick={() => { setIsAddModalOpen(false); if (clearAddModalFlag) clearAddModalFlag(); }}
                className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 cursor-pointer"
              >
                <XCloseIcon />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Property Name</label>
                  <input
                    id="add-prop-name"
                    type="text"
                    required
                    placeholder="e.g. Grandview Heights"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Street Address</label>
                  <input
                    id="add-prop-address"
                    type="text"
                    required
                    placeholder="e.g. 425 Skyview Terrace, Central District"
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Property Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as PropertyType)}
                    className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none cursor-pointer"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Suite">Suite</option>
                    <option value="Condo">Condo</option>
                    <option value="House">House</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Monthly Rent ($)</label>
                  <input
                    id="add-prop-rent"
                    type="number"
                    required
                    value={formRent}
                    onChange={(e) => setFormRent(Number(e.target.value))}
                    className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Total Units Count</label>
                  <input
                    id="add-prop-units"
                    type="number"
                    required
                    value={formUnits}
                    onChange={(e) => setFormUnits(Number(e.target.value))}
                    className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Occupied Units Count</label>
                  <input
                    type="number"
                    required
                    value={formOccupied}
                    onChange={(e) => setFormOccupied(Number(e.target.value))}
                    className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Portfolio Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as PropertyStatus)}
                    className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 outline-none cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                    <option value="Vacant">Vacant</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Year Constructed</label>
                  <input
                    type="number"
                    required
                    value={formYearBuilt}
                    onChange={(e) => setFormYearBuilt(Number(e.target.value))}
                    className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Image URL</label>
                <input
                  type="text"
                  placeholder="Insert image hotlink address..."
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Amenities (separated by comma)</label>
                <input
                  type="text"
                  placeholder="e.g. Gym, Parking, Pool, Air Conditioning"
                  value={formAmenities}
                  onChange={(e) => setFormAmenities(e.target.value)}
                  className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Marketing Description</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  rows={3}
                  className="w-full text-sm rounded-xl border border-gray-200 p-3 focus:border-blue-500 outline-none resize-none"
                  placeholder="Describe the rooms, views, neighborhood, amenities..."
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); if (clearAddModalFlag) clearAddModalFlag(); }}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="add-property-form-submit-btn"
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={16} /> Save Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Property Edit Slide-over Modal Form */}
      {isEditModalOpen && selectedProp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-xl w-full flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
              <h3 className="font-bold text-gray-900 text-lg">Modify Property Details</h3>
              <button
                onClick={() => { setIsEditModalOpen(false); setSelectedProp(null); }}
                className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 cursor-pointer"
              >
                <XCloseIcon />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Property Name</label>
                  <input
                    id="edit-prop-name"
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Street Address</label>
                  <input
                    id="edit-prop-address"
                    type="text"
                    required
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Property Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as PropertyType)}
                    className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 outline-none cursor-pointer"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Suite">Suite</option>
                    <option value="Condo">Condo</option>
                    <option value="House">House</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Monthly Rent ($)</label>
                  <input
                    id="edit-prop-rent"
                    type="number"
                    required
                    value={formRent}
                    onChange={(e) => setFormRent(Number(e.target.value))}
                    className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Total Units Count</label>
                  <input
                    type="number"
                    required
                    value={formUnits}
                    onChange={(e) => setFormUnits(Number(e.target.value))}
                    className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Occupied Units Count</label>
                  <input
                    type="number"
                    required
                    value={formOccupied}
                    onChange={(e) => setFormOccupied(Number(e.target.value))}
                    className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Portfolio Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as PropertyStatus)}
                    className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 outline-none cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                    <option value="Vacant">Vacant</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Year Constructed</label>
                  <input
                    type="number"
                    required
                    value={formYearBuilt}
                    onChange={(e) => setFormYearBuilt(Number(e.target.value))}
                    className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Image URL</label>
                <input
                  type="text"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Amenities (separated by comma)</label>
                <input
                  type="text"
                  value={formAmenities}
                  onChange={(e) => setFormAmenities(e.target.value)}
                  className="w-full text-sm rounded-xl border border-gray-200 p-2.5 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Marketing Description</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  rows={3}
                  className="w-full text-sm rounded-xl border border-gray-200 p-3 focus:border-blue-500 outline-none resize-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => { setIsEditModalOpen(false); setSelectedProp(null); }}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="save-edited-property-btn"
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Check size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function XCloseIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
