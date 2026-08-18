import React from 'react';
import { 
  Gauge, 
  Layers, 
  GitCompare, 
  History, 
  Wrench, 
  User, 
  Sparkles, 
  Radio,
  Volume2
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: 'showcase' | 'hud' | 'comparator' | 'custom_lab' | 'heritage';
  setActiveTab: (tab: 'showcase' | 'hud' | 'comparator' | 'custom_lab' | 'heritage') => void;
  userProfile: UserProfile;
  onOpenAuthModal: () => void;
  onOpenSoundboard?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  onOpenAuthModal,
  onOpenSoundboard,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full liquid-nav">
      {/* Top telemetry status ticker with clear glass */}
      <div className="hidden md:flex items-center justify-between px-8 py-1.5 bg-white/[0.02] border-b border-white/10 text-[11px] font-telemetry tracking-wider text-white/60 backdrop-blur-md">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse"></span>
            <span className="text-[#00F0FF] font-semibold">TELEMETRY LINK: 125 Hz ACTIVE</span>
          </div>
          <div>
            SAMPLING: <span className="text-white">6-AXIS IMU GYROSCOPE</span>
          </div>
          <div>
            SESSION: <span className="text-[#FFB800]">WSBK PROTOCOL V4</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div>
            PILOT: <span className="text-white font-bold">{userProfile.callSign}</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="h-16 flex items-center justify-between px-4 sm:px-8">
        
        {/* Diamond Logo & Brand Identity */}
        <div 
          onClick={() => setActiveTab('showcase')}
          className="flex items-center gap-3.5 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 bg-[#FF0055] flex items-center justify-center rounded-sm rotate-45 shadow-[0_0_15px_rgba(255,0,85,0.4)] group-hover:scale-105 transition-transform">
            <span className="-rotate-45 font-orbitron font-bold text-lg text-white">A</span>
          </div>
          <div className="flex flex-col">
            <span className="font-orbitron tracking-widest text-lg font-bold leading-none text-white">APEX</span>
            <span className="text-[10px] tracking-[0.3em] text-[#00F0FF] font-semibold">SUPERBIKE HERITAGE & TELEMETRY</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-3 font-inter text-sm tracking-wide text-white/70">
          <button
            onClick={() => setActiveTab('showcase')}
            className={`transition-all cursor-pointer px-4 py-2 rounded-lg font-orbitron text-xs font-semibold tracking-wider ${
              activeTab === 'showcase'
                ? 'liquid-tab-active'
                : 'hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            GARAGE
          </button>

          <button
            onClick={() => setActiveTab('hud')}
            className={`transition-all cursor-pointer px-4 py-2 rounded-lg font-orbitron text-xs font-semibold tracking-wider ${
              activeTab === 'hud'
                ? 'liquid-tab-active'
                : 'hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            TELEMETRY HUD
          </button>

          <button
            onClick={() => setActiveTab('comparator')}
            className={`transition-all cursor-pointer px-4 py-2 rounded-lg font-orbitron text-xs font-semibold tracking-wider ${
              activeTab === 'comparator'
                ? 'liquid-tab-active'
                : 'hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            COMPARATOR
          </button>

          <button
            onClick={() => setActiveTab('heritage')}
            className={`transition-all cursor-pointer px-4 py-2 rounded-lg font-orbitron text-xs font-semibold tracking-wider ${
              activeTab === 'heritage'
                ? 'liquid-tab-active'
                : 'hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            HERITAGE & HISTORY
          </button>

          <button
            onClick={() => setActiveTab('custom_lab')}
            className={`transition-all cursor-pointer px-4 py-2 rounded-lg font-orbitron text-xs font-semibold tracking-wider ${
              activeTab === 'custom_lab'
                ? 'liquid-tab-active'
                : 'hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            CUSTOM LAB
          </button>
        </div>

        {/* Right Tools: Real Sounds & Pilot Profile */}
        <div className="flex items-center gap-3">
          {onOpenSoundboard && (
            <button
              onClick={onOpenSoundboard}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#00F0FF]/10 hover:bg-[#00F0FF]/20 border border-[#00F0FF]/30 text-[#00F0FF] font-orbitron font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_10px_rgba(0,240,255,0.2)]"
              title="Real-Life Superbike Exhaust Soundboard"
            >
              <Volume2 className="w-3.5 h-3.5 animate-pulse" />
              <span>REAL SOUNDS</span>
            </button>
          )}

          {/* Right Pilot Profile Tool */}
          <div 
            onClick={onOpenAuthModal}
            className="flex items-center gap-2.5 cursor-pointer group p-1.5 rounded-xl hover:bg-white/5 transition-colors"
          >
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold font-orbitron text-white group-hover:text-[#00F0FF] transition-colors tracking-wide">
              Nixh
            </p>
            <p className="text-[10px] text-[#FFB800] uppercase font-bold font-orbitron tracking-widest">
              Team
            </p>
          </div>

          <div className="relative flex items-center justify-center flex-shrink-0">
            {userProfile.avatarUrl ? (
              <img
                src={userProfile.avatarUrl}
                alt="Nixh"
                className="w-10 h-10 rounded-full object-cover border-2 border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.35)]"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border-2 border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.35)] flex items-center justify-center text-[#00F0FF] font-orbitron text-sm font-extrabold select-none group-hover:border-white group-hover:text-white group-hover:bg-white/20 transition-all">
                N
              </div>
            )}
          </div>
        </div>
      </div>

    </nav>

      {/* Mobile Tab Navigation (Pure Liquid Glass Without Tint) */}
      <div className="flex lg:hidden overflow-x-auto py-2.5 px-3 no-scrollbar liquid-tab-bar w-full">
        <div className="flex items-center justify-center space-x-2 mx-auto min-w-max">
          <button
            onClick={() => setActiveTab('showcase')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-orbitron font-bold whitespace-nowrap transition-all ${
              activeTab === 'showcase' ? 'liquid-tab-active' : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            GARAGE
          </button>
          <button
            onClick={() => setActiveTab('hud')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-orbitron font-bold whitespace-nowrap transition-all ${
              activeTab === 'hud' ? 'liquid-tab-active' : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            HUD
          </button>
          <button
            onClick={() => setActiveTab('comparator')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-orbitron font-bold whitespace-nowrap transition-all ${
              activeTab === 'comparator' ? 'liquid-tab-active' : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            COMPARATOR
          </button>
          <button
            onClick={() => setActiveTab('heritage')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-orbitron font-bold whitespace-nowrap transition-all ${
              activeTab === 'heritage' ? 'liquid-tab-active' : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            HERITAGE
          </button>
          <button
            onClick={() => setActiveTab('custom_lab')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-orbitron font-bold whitespace-nowrap transition-all ${
              activeTab === 'custom_lab' ? 'liquid-tab-active' : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            CUSTOM LAB
          </button>
        </div>
      </div>
    </header>
  );
};
