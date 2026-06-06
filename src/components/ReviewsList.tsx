/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { Review, CategoryRatings } from "../types";
import LucideIcon from "./LucideIcon";

interface ReviewsListProps {
  reviews: Review[];
  categoryRatings: CategoryRatings;
  onAddReview: (newReview: Review, updatedRatings: CategoryRatings) => void;
}

export default function ReviewsList({
  reviews,
  categoryRatings,
  onAddReview,
}: ReviewsListProps) {
  const [showAllReviewsModal, setShowAllReviewsModal] = useState(false);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [starFilter, setStarFilter] = useState<number | null>(null);

  // New review form states
  const [reviewerName, setReviewerName] = useState("");
  const [ratingCleanliness, setRatingCleanliness] = useState(5);
  const [ratingAccuracy, setRatingAccuracy] = useState(5);
  const [ratingCommunication, setRatingCommunication] = useState(5);
  const [ratingCheckIn, setRatingCheckIn] = useState(5);
  const [ratingLocation, setRatingLocation] = useState(5);
  const [ratingValue, setRatingValue] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewerDuration, setReviewerDuration] = useState("Stayed 3 months");
  const [selectedAvatar, setSelectedAvatar] = useState(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
  );

  const avatarsList = [
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80"
  ];

  // Compute stats on the fly
  const averageStars = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.stars, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews]);

  const starBreakdowns = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const rounded = Math.round(r.stars) as 5 | 4 | 3 | 2 | 1;
      if (counts[rounded] !== undefined) {
        counts[rounded]++;
      }
    });

    const total = reviews.length || 1;
    return {
      5: Math.round((counts[5] / total) * 100),
      4: Math.round((counts[4] / total) * 100),
      3: Math.round((counts[3] / total) * 100),
      2: Math.round((counts[2] / total) * 100),
      1: Math.round((counts[1] / total) * 100),
    };
  }, [reviews]);

  // Handle new review submission
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !reviewComment) return;

    // Calculate stars as average of the 6 core components
    const averageScore = Math.round(((ratingCleanliness + ratingAccuracy + ratingCommunication + ratingCheckIn + ratingLocation + ratingValue) / 6) * 10) / 10;

    const newRev: Review = {
      id: "rev-" + Date.now(),
      name: reviewerName,
      avatar: selectedAvatar,
      date: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      duration: reviewerDuration,
      stars: averageScore,
      comment: reviewComment,
    };

    // Calculate new property category averages
    const count = reviews.length;
    const updatedRatings: CategoryRatings = {
      cleanliness: Math.round(((categoryRatings.cleanliness * count + ratingCleanliness) / (count + 1)) * 10) / 10,
      accuracy: Math.round(((categoryRatings.accuracy * count + ratingAccuracy) / (count + 1)) * 10) / 10,
      communication: Math.round(((categoryRatings.communication * count + ratingCommunication) / (count + 1)) * 10) / 10,
      checkIn: Math.round(((categoryRatings.checkIn * count + ratingCheckIn) / (count + 1)) * 10) / 10,
      location: Math.round(((categoryRatings.location * count + ratingLocation) / (count + 1)) * 10) / 10,
      value: Math.round(((categoryRatings.value * count + ratingValue) / (count + 1)) * 10) / 10,
    };

    onAddReview(newRev, updatedRatings);

    // Clear form
    setReviewerName("");
    setReviewComment("");
    setShowWriteReview(false);
  };

  // Filter reviews inside the "Show All" modal based on query and score
  const filteredAllReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchText = r.comment.toLowerCase().includes(searchQuery.toLowerCase()) || r.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStars = starFilter === null || Math.round(r.stars) === starFilter;
      return matchText && matchStars;
    });
  }, [reviews, searchQuery, starFilter]);

  return (
    <section id="reviews-section" className="mt-12 border-t border-gray-100 pt-12">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-10">
        {/* Guest Favorite Banner */}
        <div className="flex-1 flex items-center gap-6 bg-blue-50/40 p-6 rounded-2xl border border-blue-50">
          <div className="flex flex-col items-center">
            <span className="text-5xl font-extrabold text-blue-600 tracking-tight">{averageStars.toFixed(1)}</span>
            <div className="flex text-amber-400 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <LucideIcon
                  key={i}
                  name="Star"
                  size={14}
                  className={i < Math.round(averageStars) ? "fill-amber-400" : "text-gray-200"}
                />
              ))}
            </div>
          </div>
          <div className="w-px h-16 bg-gray-200"></div>
          <div className="flex-1">
            <div className="flex items-center gap-1 text-blue-600 mb-1">
              <LucideIcon name="Award" size={18} className="fill-blue-100" />
              <span className="font-sans font-bold text-sm">Guest Favorite</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              One of the most loved homes on MySewa, based on ratings, reviews, and infrastructure reliability.
            </p>
            <p className="font-bold text-xs text-gray-900 mt-2">{reviews.length} reviews verified</p>
          </div>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="flex-1 space-y-1.5 justify-center">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Score Distribution</span>
          {[5, 4, 3, 2, 1].map((star) => {
            const pct = starBreakdowns[star as 5 | 4 | 3 | 2 | 1] || 0;
            return (
              <div key={star} className="flex items-center gap-3">
                <span className="w-3 text-xs font-bold text-gray-400">{star}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
                <span className="w-8 text-xs font-semibold text-gray-500 text-right">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Ratings Grid */}
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">LEASING CRITERIA RATINGS</h3>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8 border-y border-gray-100 py-6 text-center">
        <div className="flex flex-col items-center gap-1.5 border-r border-gray-100 last:border-0 md:[&:nth-child(5)]:border-r-0 md:[&:nth-child(5)]:border-none text-gray-800">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Cleanliness</span>
          <span className="text-xl font-extrabold text-blue-600">{categoryRatings.cleanliness.toFixed(1)}</span>
          <LucideIcon name="Droplets" className="text-blue-500" size={24} />
        </div>
        <div className="flex flex-col items-center gap-1.5 border-r border-gray-100 last:border-0 md:[&:nth-child(5)]:border-r-0 text-gray-800">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Accuracy</span>
          <span className="text-xl font-extrabold text-blue-600">{categoryRatings.accuracy.toFixed(1)}</span>
          <LucideIcon name="CheckSquare" className="text-blue-500" size={24} />
        </div>
        <div className="flex flex-col items-center gap-1.5 border-r border-gray-100 last:border-0 text-gray-800">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Communication</span>
          <span className="text-xl font-extrabold text-blue-600">{categoryRatings.communication.toFixed(1)}</span>
          <LucideIcon name="MessageSquare" className="text-blue-500" size={24} />
        </div>
        <div className="flex flex-col items-center gap-1.5 border-r border-gray-100 last:border-0 text-gray-800">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Check-in</span>
          <span className="text-xl font-extrabold text-blue-600">{categoryRatings.checkIn.toFixed(1)}</span>
          <LucideIcon name="Key" className="text-blue-500" size={24} />
        </div>
        <div className="flex flex-col items-center gap-1.5 border-r border-gray-100 md:border-r last:border-0 text-gray-800">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Location</span>
          <span className="text-xl font-extrabold text-blue-600">{categoryRatings.location.toFixed(1)}</span>
          <LucideIcon name="Compass" className="text-blue-500" size={24} />
        </div>
        <div className="flex flex-col items-center gap-1.5 text-gray-800">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Value Ratio</span>
          <span className="text-xl font-extrabold text-blue-600">{categoryRatings.value.toFixed(1)}</span>
          <LucideIcon name="Tag" className="text-blue-500" size={24} />
        </div>
      </div>

      {/* Primary Display Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        {reviews.slice(0, 4).map((r) => (
          <div key={r.id} className="space-y-3 bg-gray-50/20 p-5 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-4">
              <img
                alt={r.name}
                className="w-12 h-12 rounded-full object-cover border border-gray-100"
                src={r.avatar}
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="font-sans font-bold text-sm text-gray-900">{r.name}</h4>
                <p className="text-xs text-gray-400 font-semibold flex items-center gap-1">
                  <span>{r.duration}</span>
                  <span>•</span>
                  <span>{r.date}</span>
                </p>
              </div>
            </div>
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <LucideIcon
                  key={i}
                  name="Star"
                  size={12}
                  className={i < Math.round(r.stars) ? "fill-amber-400" : "text-gray-200"}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed font-normal">
              {r.comment}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          onClick={() => setShowAllReviewsModal(true)}
          className="border border-gray-200 px-6 py-2.5 rounded-xl font-bold text-xs text-gray-800 hover:bg-gray-50 transition-colors"
        >
          Show all {reviews.length} reviews
        </button>

        <button
          onClick={() => setShowWriteReview(!showWriteReview)}
          className="bg-blue-50 border border-blue-100 px-6 py-2.5 rounded-xl font-bold text-xs text-blue-600 hover:bg-blue-100 transition-colors flex items-center gap-2"
        >
          <LucideIcon name="PenTool" size={13} />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Interactive Write a Review Section */}
      {showWriteReview && (
        <form
          onSubmit={handleSubmitReview}
          className="mt-6 p-6 bg-gray-50/50 rounded-2xl border border-gray-150 space-y-4 max-w-xl animate-slide-up"
        >
          <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
            <LucideIcon name="Sparkles" size={16} className="text-blue-500" />
            <span>Submit Your Custom Tenant Review</span>
          </h4>

          {/* Persona Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wide mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                required
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="e.g. Shruti Patel"
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wide mb-1">
                Lease Duration Info
              </label>
              <input
                type="text"
                required
                value={reviewerDuration}
                onChange={(e) => setReviewerDuration(e.target.value)}
                placeholder="e.g. Stayed 6 months"
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Avatar selector */}
          <div>
            <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wide mb-1">
              Select Profile Picture
            </label>
            <div className="flex gap-2">
              {avatarsList.map((url, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedAvatar(url)}
                  className={`w-8 h-8 rounded-full overflow-hidden border-2 relative transition-all ${
                    selectedAvatar === url ? "border-blue-500 scale-110" : "border-transparent opacity-60"
                  }`}
                >
                  <img src={url} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Rating inputs for the 6 criteria */}
          <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-gray-100 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Cleanliness:</span>
              <select
                value={ratingCleanliness}
                onChange={(e) => setRatingCleanliness(Number(e.target.value))}
                className="font-bold text-blue-600 bg-transparent py-0"
              >
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Accuracy:</span>
              <select
                value={ratingAccuracy}
                onChange={(e) => setRatingAccuracy(Number(e.target.value))}
                className="font-bold text-blue-600 bg-transparent py-0"
              >
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Communication:</span>
              <select
                value={ratingCommunication}
                onChange={(e) => setRatingCommunication(Number(e.target.value))}
                className="font-bold text-blue-600 bg-transparent py-0"
              >
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Check-in:</span>
              <select
                value={ratingCheckIn}
                onChange={(e) => setRatingCheckIn(Number(e.target.value))}
                className="font-bold text-blue-600 bg-transparent py-0"
              >
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Location:</span>
              <select
                value={ratingLocation}
                onChange={(e) => setRatingLocation(Number(e.target.value))}
                className="font-bold text-blue-600 bg-transparent py-0"
              >
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Value of Lease:</span>
              <select
                value={ratingValue}
                onChange={(e) => setRatingValue(Number(e.target.value))}
                className="font-bold text-blue-600 bg-transparent py-0"
              >
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
              </select>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wide mb-1">
              Your Review Text
            </label>
            <textarea
              required
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="How was the infrastructure reliability, internet, and Vikram's landlord collaboration?"
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-xl text-xs hover:bg-blue-700 transition-colors"
          >
            Submit Review & Recalculate App Indexes
          </button>
        </form>
      )}

      {/* Show All Reviews Modal */}
      {showAllReviewsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[100] p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-start">
              <div>
                <h3 className="font-sans font-bold text-xl text-gray-900">
                  Guest Reviews ({reviews.length})
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Verified landlord checkouts for secure contracts.
                </p>
              </div>
              <button
                onClick={() => setShowAllReviewsModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
              >
                <LucideIcon name="X" size={20} />
              </button>
            </div>

            {/* Filter bar */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Query reviews by name or text..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <div className="absolute left-3 inset-y-0 flex items-center pointer-events-none text-gray-400">
                  <LucideIcon name="Search" size={14} />
                </div>
              </div>

              {/* Star selector */}
              <div className="flex items-center gap-1.5 self-center">
                <span className="text-[10px] uppercase font-bold text-gray-500">Rating:</span>
                <select
                  value={starFilter === null ? "" : starFilter}
                  onChange={(e) => setStarFilter(e.target.value === "" ? null : Number(e.target.value))}
                  className="text-xs text-blue-600 font-bold bg-white border border-gray-200 rounded-lg py-1 px-2 focus:ring-1"
                >
                  <option value="">All Stars</option>
                  {[5, 4, 3, 2, 1].map((star) => (
                    <option key={star} value={star}>{star} Stars</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reviews display list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {filteredAllReviews.length > 0 ? (
                filteredAllReviews.map((r, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-gray-100 bg-white space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <img src={r.avatar} className="w-9 h-9 rounded-full object-cover" />
                        <div>
                          <h5 className="text-xs font-bold text-gray-900">{r.name}</h5>
                          <span className="text-[10px] text-gray-400">{r.duration} • {r.date}</span>
                        </div>
                      </div>
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <LucideIcon
                            key={i}
                            name="Star"
                            size={10}
                            className={i < Math.round(r.stars) ? "fill-amber-400" : "text-gray-100"}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed font-normal">
                      {r.comment}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <LucideIcon name="ShieldAlert" size={32} className="mx-auto mb-2 opacity-55 text-blue-500" />
                  <p className="text-xs font-semibold">No reviews correspond to your criteria.</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs px-6">
              <span className="text-gray-500">Returned {filteredAllReviews.length} records</span>
              <button
                onClick={() => setShowAllReviewsModal(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
