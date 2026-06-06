/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { AmenityCategory } from "../types";
import LucideIcon from "./LucideIcon";

interface AmenitiesModalProps {
  categories: AmenityCategory[];
  totalCount: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function AmenitiesModal({
  categories,
  totalCount,
  isOpen,
  onClose,
}: AmenitiesModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [premiumOnly, setPremiumOnly] = useState(false);

  const filteredCategories = useMemo(() => {
    return categories
      .map((cat) => {
        const filteredItems = cat.items.filter((item) => {
          const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
          const isPremium =
            !premiumOnly ||
            item.name.toLowerCase().includes("premium") ||
            item.name.toLowerCase().includes("standalone") ||
            item.name.toLowerCase().includes("microgrid") ||
            item.name.toLowerCase().includes("nest") ||
            item.name.toLowerCase().includes("gigabit") ||
            item.name.toLowerCase().includes("sonos") ||
            item.name.toLowerCase().includes("gourmet") ||
            item.name.toLowerCase().includes("leed") ||
            item.name.toLowerCase().includes("chef") ||
            item.name.toLowerCase().includes("coffee") ||
            item.name.toLowerCase().includes("infinity") ||
            item.name.toLowerCase().includes("concierge");

          return matchesSearch && isPremium;
        });

        return {
          ...cat,
          items: filteredItems,
        };
      })
      .filter((cat) => cat.items.length > 0);
  }, [categories, searchQuery, premiumOnly]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[100] p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-start">
          <div>
            <h3 className="font-sans font-extrabold text-xl text-gray-900">
              All {totalCount} Amenities
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Smart-infrastructure list supporting SDG 9 (Industry, Innovation & Infrastructure).
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
          >
            <LucideIcon name="X" size={20} />
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search amenities (e.g. WiFi, tub, Sonos)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="absolute left-3 inset-y-0 flex items-center pointer-events-none text-gray-400">
              <LucideIcon name="Search" size={16} />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 inset-y-0 flex items-center text-gray-400 hover:text-gray-600 font-bold"
              >
                ×
              </button>
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-gray-700 font-semibold self-center">
            <input
              type="checkbox"
              checked={premiumOnly}
              onChange={(e) => setPremiumOnly(e.target.checked)}
              className="rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            <span>Show Signature/Premium only</span>
          </label>
        </div>

        {/* Categories Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((cat, idx) => (
              <div key={idx} className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-1.5 pl-1">
                  {cat.category}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-1">
                  {cat.items.map((item, itemIdx) => {
                    const highlight =
                      item.name.toLowerCase().includes("premium") ||
                      item.name.toLowerCase().includes("standalone") ||
                      item.name.toLowerCase().includes("gigabit") ||
                      item.name.toLowerCase().includes("leed");

                    return (
                      <div
                        key={itemIdx}
                        className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all ${
                          highlight
                            ? "bg-blue-50/40 border-blue-100 text-blue-900"
                            : "bg-white border-gray-150 text-gray-700 hover:border-gray-200"
                        }`}
                      >
                        <div className={`mt-0.5 ${highlight ? "text-blue-600" : "text-gray-400"}`}>
                          <LucideIcon name={item.iconName} size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium leading-normal">
                            {item.name}
                          </span>
                          {highlight && (
                            <span className="text-[10px] text-blue-600 font-bold tracking-tight uppercase">
                              Signature Feature
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-300 inline-flex items-center justify-center p-3 rounded-full bg-gray-50 border border-gray-100 mb-3">
                <LucideIcon name="ShieldAlert" size={32} />
              </div>
              <h5 className="font-bold text-gray-800 text-sm">No Matching Amenities</h5>
              <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                Try loosening your limits or searching a different term.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 px-6">
          <span>
            Showing <strong>{filteredCategories.reduce((acc, c) => acc + c.items.length, 0)}</strong> out of {totalCount} items
          </span>
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
