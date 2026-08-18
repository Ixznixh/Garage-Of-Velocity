import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Heart, 
  Wrench, 
  Trophy, 
  Trash2, 
  Layers
} from 'lucide-react';
import { UserProfile, Superbike } from '../types';

interface AuthAndProfileModalProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  allBikes: Superbike[];
  onClose: () => void;
  onSelectBike: (bike: Superbike) => void;
}

export const AuthAndProfileModal: React.FC<AuthAndProfileModalProps> = ({
  userProfile,
  onUpdateProfile,
  allBikes,
  onClose,
  onSelectBike,
}) => {
  const [activeTab, setActiveTab] = useState<'favorites' | 'builds' | 'laps'>('favorites');

  const handleDeleteBuild = (buildId: string) => {
    onUpdateProfile({
      ...userProfile,
      customBuilds: userProfile.customBuilds.filter((b) => b.id !== buildId),
    });
  };

  const favoriteBikes = allBikes.filter((b) => userProfile.favoriteBikeIds.includes(b.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl rounded-2xl liquid-card border border-white/15 p-5 sm:p-7 shadow-2xl space-y-6"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl liquid-glass hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 border-b border-white/10 pb-3 sm:pb-4 pr-8">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#00F0FF]/15 border border-[#00F0FF]/40 flex items-center justify-center text-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.3)] flex-shrink-0">
            <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-xl font-orbitron font-extrabold text-white leading-tight">
              PILOT GARAGE & SAVED RECORDS
            </h2>
            <p className="text-[11px] sm:text-xs font-inter text-white/50 mt-0.5 leading-snug">
              Saved flagship favorites, bespoke workshop prototypes, and track lap records
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 border-b border-white/10 pb-2.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-3 py-1.5 rounded-xl text-xs font-orbitron font-bold transition-all cursor-pointer border flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
              activeTab === 'favorites'
                ? 'liquid-tab-active shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                : 'liquid-glass text-white/50 border-white/10 hover:text-white hover:border-white/30'
            }`}
          >
            <Heart className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Saved Favorites ({favoriteBikes.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('builds')}
            className={`px-3 py-1.5 rounded-xl text-xs font-orbitron font-bold transition-all cursor-pointer border flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
              activeTab === 'builds'
                ? 'liquid-tab-active shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                : 'liquid-glass text-white/50 border-white/10 hover:text-white hover:border-white/30'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Custom Builds ({userProfile.customBuilds.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('laps')}
            className={`px-3 py-1.5 rounded-xl text-xs font-orbitron font-bold transition-all cursor-pointer border flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
              activeTab === 'laps'
                ? 'liquid-tab-active shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                : 'liquid-glass text-white/50 border-white/10 hover:text-white hover:border-white/30'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Track Lap Records ({userProfile.lapRecords?.length || 0})</span>
          </button>
        </div>

        {/* Tab 1: Favorites List */}
        {activeTab === 'favorites' && (
          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 no-scrollbar">
            {favoriteBikes.length === 0 ? (
              <div className="text-center py-8 text-white/40 text-sm font-inter">
                No favorite superbikes bookmarked yet. Click the heart icon on any bike card to save it here.
              </div>
            ) : (
              favoriteBikes.map((bike) => (
                <div
                  key={bike.id}
                  className="p-2.5 sm:p-3 rounded-xl liquid-glass border border-white/10 flex items-center justify-between hover:border-[#00F0FF]/40 transition-colors gap-2.5"
                >
                  <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                    <img 
                      src={bike.heroImage} 
                      alt={bike.name} 
                      className="w-12 h-9 sm:w-14 sm:h-10 rounded-lg object-cover bg-black border border-white/10 flex-shrink-0" 
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-orbitron font-bold text-white truncate leading-tight">
                        {bike.shortName}
                      </h4>
                      <span className="text-[10px] sm:text-xs font-telemetry text-[#00F0FF] whitespace-nowrap block mt-0.5">
                        {bike.metrics.powerHp} HP • {bike.metrics.topSpeedKmh} KM/H
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onSelectBike(bike);
                      onClose();
                    }}
                    className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg liquid-glass hover:bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40 text-[11px] sm:text-xs font-orbitron font-bold cursor-pointer transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    View in HUD
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Custom Builds */}
        {activeTab === 'builds' && (
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1 no-scrollbar">
            {userProfile.customBuilds.length === 0 ? (
              <div className="text-center py-8 text-white/40 text-sm font-inter">
                No custom prototypes created. Head to the "Custom Lab" tab to build your bespoke superbike.
              </div>
            ) : (
              userProfile.customBuilds.map((build) => {
                const base = allBikes.find((b) => b.id === build.baseBikeId) || allBikes[0];
                return (
                  <div
                    key={build.id}
                    className="p-3.5 rounded-xl liquid-glass border border-white/10 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-sm font-orbitron font-bold text-white">{build.buildName}</h4>
                      <div className="text-xs font-telemetry text-white/50 mt-0.5">
                        Base: <strong className="text-[#00F0FF]">{base.shortName}</strong> | {build.exhaust.name.split(' ')[0]} Exhaust
                      </div>
                      <div className="text-[11px] font-telemetry text-emerald-400">
                        Gain: +{build.exhaust.hpGain + build.ecuTune.hpGain} HP | -{build.exhaust.weightSavingKg + build.wheels.weightSavingKg} kg
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteBuild(build.id)}
                      className="p-2 rounded-xl bg-[#FF0055]/20 text-[#FF0055] hover:bg-[#FF0055]/40 text-xs cursor-pointer border border-[#FF0055]/30 transition-colors"
                      title="Delete Build"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 4: Lap Records */}
        {activeTab === 'laps' && (
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1 no-scrollbar">
            {(!userProfile.lapRecords || userProfile.lapRecords.length === 0) ? (
              <div className="text-center py-8 text-white/40 text-sm font-inter">
                No lap records logged yet. Run simulated laps in the Telemetry HUD to save lap records here.
              </div>
            ) : (
              userProfile.lapRecords.map((lap, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl liquid-glass border border-white/10 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-orbitron font-bold text-white">{lap.track}</div>
                    <div className="text-[11px] font-telemetry text-white/60">
                      Machine: <span className="text-[#00F0FF] font-bold">{lap.bikeName}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-orbitron font-extrabold text-[#FFB800]">{lap.lapTime}</div>
                    <div className="text-[10px] font-telemetry text-white/40">V-Max: {lap.topSpeed} km/h</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </motion.div>
    </div>
  );
};
