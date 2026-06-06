/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import LucideIcon from "./LucideIcon";

interface GalleryProps {
  images: string[];
}

export default function Gallery({ images }: GalleryProps) {
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setActiveLightboxIndex(index);
  };

  const closeLightbox = () => {
    setActiveLightboxIndex(null);
  };

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % images.length);
    }
  };

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex - 1 + images.length) % images.length);
    }
  };

  return (
    <>
      <section 
        id="property-gallery-bento" 
        className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-[12px] h-[320px] sm:h-[420px] md:h-[560px] rounded-2xl overflow-hidden mb-6"
      >
        {/* Large Main Image on Left */}
        <div 
          onClick={() => openLightbox(0)}
          className="md:col-span-2 md:row-span-2 relative group cursor-pointer overflow-hidden bg-gray-100"
        >
          <img
            src={images[0]}
            alt="Main Living Space"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
          <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-xs font-semibold flex items-center gap-1">
            <LucideIcon name="Maximize2" size={12} />
            <span>Virtual Tour Available</span>
          </div>
        </div>

        {/* Top Middle Small Image */}
        <div 
          onClick={() => openLightbox(1 % images.length)}
          className="hidden md:block relative group cursor-pointer overflow-hidden bg-gray-100"
        >
          <img
            src={images[1] || images[0]}
            alt="Kitchen Layout"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
        </div>

        {/* Top Right Small Image */}
        <div 
          onClick={() => openLightbox(2 % images.length)}
          className="hidden md:block relative group cursor-pointer overflow-hidden bg-gray-100"
        >
          <img
            src={images[2] || images[0]}
            alt="Premium Bedroom"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
        </div>

        {/* Bottom Middle Small Image */}
        <div 
          onClick={() => openLightbox(3 % images.length)}
          className="hidden md:block relative group cursor-pointer overflow-hidden bg-gray-100"
        >
          <img
            src={images[3] || images[0]}
            alt="Executive Bathroom"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
        </div>

        {/* Bottom Right Small Image with "View all" Overlay */}
        <div 
          onClick={() => openLightbox(4 % images.length)}
          className="hidden md:block relative group cursor-pointer overflow-hidden bg-gray-100"
        >
          <img
            src={images[4] || images[0]}
            alt="Main Exterior view"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 flex flex-col items-center justify-center text-white transition-all duration-300">
            <LucideIcon name="Images" size={24} className="mb-1" />
            <span className="font-semibold text-sm">View all 24 photos</span>
          </div>
        </div>
      </section>

      {/* Lightbox / Carousel Overlay Modal */}
      {activeLightboxIndex !== null && (
        <div 
          onClick={closeLightbox}
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[110] flex flex-col items-center justify-between p-4"
        >
          {/* Header */}
          <div className="w-full max-w-6xl flex justify-between items-center text-white py-2">
            <div className="text-sm font-semibold">
              Photo {activeLightboxIndex + 1} of {images.length}
            </div>
            <button 
              onClick={closeLightbox}
              className="p-2 rounded-full hover:bg-white/10 text-white transition-all focus:outline-none"
            >
              <LucideIcon name="X" size={24} />
            </button>
          </div>

          {/* Core Content: image with prev/next buttons */}
          <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center p-4">
            <button
              onClick={showPrev}
              className="absolute left-2 p-3 rounded-full bg-black/60 border border-white/10 text-white hover:bg-black/80 transition-all z-10"
            >
              <LucideIcon name="ChevronLeft" size={28} />
            </button>

            <img
              src={images[activeLightboxIndex]}
              alt={`Property Photo ${activeLightboxIndex + 1}`}
              className="max-w-full max-h-[75vh] object-contain rounded-lg selection:bg-transparent shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              referrerPolicy="no-referrer"
            />

            <button
              onClick={showNext}
              className="absolute right-2 p-3 rounded-full bg-black/60 border border-white/10 text-white hover:bg-black/80 transition-all z-10"
            >
              <LucideIcon name="ChevronRight" size={28} />
            </button>
          </div>

          {/* Footer Thumbnails list */}
          <div className="w-full max-w-3xl overflow-x-auto py-4 flex gap-3 justify-center" onClick={(e) => e.stopPropagation()}>
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveLightboxIndex(idx)}
                className={`w-16 h-12 bg-gray-800 rounded-md overflow-hidden relative border-2 transition-all flex-shrink-0 ${
                  activeLightboxIndex === idx ? "border-blue-500 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
