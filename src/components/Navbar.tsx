/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, PlusCircle, LogIn, User, Compass, Landmark } from 'lucide-react';

interface NavbarProps {
  onSearchClick: () => void;
  onBrowseClick: () => void;
  onSavedClick: () => void;
  onListPropertyClick: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  savedCount: number;
  user: { name: string; email: string; loggedIn: boolean } | null;
  onLogout: () => void;
  activeTab: 'search' | 'browse' | 'saved';
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearchClick,
  onBrowseClick,
  onSavedClick,
  onListPropertyClick,
  onLoginClick,
  onRegisterClick,
  savedCount,
  user,
  onLogout,
  activeTab,
}) => {
  return (
    <header className="bg-surface-container-lowest border-b border-outline-variant/30 sticky top-0 z-50 shadow-sm transition-all">
      <div className="flex justify-between items-center px-4 md:px-16 h-16 w-full max-w-7xl mx-auto">
        
        {/* Brand Logo & Core Navigation Links */}
        <div className="flex items-center gap-6">
          <div 
            onClick={onBrowseClick}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span className="font-bold text-2xl tracking-tight text-primary transition-colors group-hover:text-primary-container">
              MySewa
            </span>
            <div className="bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <Landmark size={10} />
              SDG 9
            </div>
          </div>
          
          <nav className="hidden md:flex gap-6 ml-8">
            <button
              onClick={onSearchClick}
              className={`font-medium py-1 text-[15px] transition-all relative ${
                activeTab === 'search'
                  ? 'text-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Search Properties
              {activeTab === 'search' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full" />
              )}
            </button>
            
            <button
              onClick={onBrowseClick}
              className={`font-medium py-1 text-[15px] transition-all relative ${
                activeTab === 'browse'
                  ? 'text-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Browse
              {activeTab === 'browse' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full" />
              )}
            </button>
          </nav>
        </div>

        {/* Actions & User state */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* List Property CTA */}
          <button
            onClick={onListPropertyClick}
            className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-primary hover:bg-surface-container px-3 py-2 rounded-xl border border-primary/20 transition-all cursor-pointer"
          >
            <PlusCircle size={15} />
            <span className="hidden sm:inline">List Property</span>
          </button>

          {/* Bookmarks Toggle button */}
          <button
            onClick={onSavedClick}
            className="relative p-2 text-on-surface-variant hover:text-primary transition-all rounded-full hover:bg-surface-container"
            title="Saved Properties"
          >
            <Heart size={20} className={savedCount > 0 ? "fill-red-500 text-red-500" : ""} />
            {savedCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {savedCount}
              </span>
            )}
          </button>

          {/* Auth State buttons */}
          {user && user.loggedIn ? (
            <div className="flex items-center gap-3">
              <span className="hidden md:inline text-xs text-on-surface-variant">
                Hi, <strong className="text-on-surface font-semibold">{user.name.split(' ')[0]}</strong>
              </span>
              
              <div className="relative group cursor-pointer">
                <div className="h-10 w-10 rounded-full overflow-hidden border border-outline-variant hover:border-primary transition-all">
                  <img
                    alt="User Profile"
                    referrerPolicy="no-referrer"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7s9cXwkI21lWiU3ds-nNsKXPKiGRBtWvK-No4JEqnUFjV9C1GMTHp4K1R3sNQl9Swf6p5PqFzS_7f6S62EYrTmrnF45pcIklvc6sptcLGnSSNQW5e5GvvF1VZ-SqhymBghbYJ7-Azpe-dFAVrSskMnbS6dRvre5Lw1C04IXDYodoI-y7aHorxvDqyXMiWUK47ESXo4FHTHlmxeBlWeugP35bxSrBILJ1cyDv_DbuKIsMagj2eDEAy6KWJ5yfoOH0nI-f2Zm4nQMg"
                    className="object-cover w-full h-full"
                  />
                </div>
                
                {/* Micro dropdown menu for sign out */}
                <div className="absolute right-0 top-11 bg-white border border-outline-variant/30 rounded-xl shadow-lg p-2 hidden group-hover:block w-40 animate-fade-in">
                  <div className="p-2 border-b border-outline-variant/20 text-xs">
                    <p className="font-semibold text-on-surface truncate">{user.name}</p>
                    <p className="text-on-surface-variant truncate text-[10px]">{user.email}</p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="w-full text-left p-2 hover:bg-red-50 hover:text-red-600 text-xs font-medium rounded-lg transition-colors mt-1"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onLoginClick}
                className="hidden sm:flex items-center gap-1.5 text-primary hover:bg-surface-container font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer text-sm"
              >
                <LogIn size={15} />
                Login
              </button>
              <button
                onClick={onRegisterClick}
                className="bg-primary text-on-primary font-semibold text-sm px-4 py-1.5 md:py-2 rounded-xl shadow-sm hover:bg-primary-container active:scale-95 duration-150 transition-all cursor-pointer"
              >
                Register
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
