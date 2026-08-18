import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  SUPERBIKES, 
  DEFAULT_USER_PROFILE 
} from './data/superbikes';
import { Superbike, UserProfile, CustomBuild } from './types';
import { findBestSuperbike } from './utils/bikeMatcher';
import { Navbar } from './components/Navbar';
import { HeroCarousel } from './components/HeroCarousel';
import { TelemetryHUD } from './components/TelemetryHUD';
import { SuperbikeGrid } from './components/SuperbikeGrid';
import { SpecComparator } from './components/SpecComparatorModal';
import { CustomBikeBuilder } from './components/CustomBikeBuilder';
import { BrandHeritageTimeline } from './components/BrandHeritageTimeline';
import { BikeDetailModal } from './components/BikeDetailModal';
import { AuthAndProfileModal } from './components/AuthAndProfileModal';
import { FloatingConcierge } from './components/FloatingConcierge';
import { RealSoundboardModal } from './components/RealSoundboardModal';
import { Footer } from './components/Footer';
import { 
  Bot, 
  Sparkles, 
  Gauge, 
  GitCompare, 
  Wrench, 
  History, 
  Grid 
} from 'lucide-react';

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<'showcase' | 'hud' | 'comparator' | 'custom_lab' | 'heritage'>('showcase');

  // Selected bike for active focus / HUD
  const [selectedBike, setSelectedBike] = useState<Superbike>(SUPERBIKES[0]);
  const [detailModalBike, setDetailModalBike] = useState<Superbike | null>(null);

  // Comparison list (2 or 3 bikes)
  const [comparisonBikes, setComparisonBikes] = useState<Superbike[]>([SUPERBIKES[0], SUPERBIKES[1]]);

  // User Profile & Garage State (Stored in localStorage for persistence)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('apex_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_USER_PROFILE;
      }
    }
    return DEFAULT_USER_PROFILE;
  });

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState<boolean>(false);
  const [isSoundboardModalOpen, setIsSoundboardModalOpen] = useState<boolean>(false);

  // Search & Filter state for grid
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Auto-focus selectedBike whenever user searches in grid or changes bike query
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length >= 1) {
      const match = findBestSuperbike(query, SUPERBIKES);
      if (match) {
        if (match.id !== selectedBike.id) {
          setSelectedBike(match);
        }
        if (selectedManufacturer !== 'All' && match.manufacturer !== selectedManufacturer) {
          setSelectedManufacturer('All');
        }
      }
    }
  };

  const handleManufacturerChange = (mfg: string) => {
    setSelectedManufacturer(mfg);
    if (mfg !== 'All') {
      const match = SUPERBIKES.find((b) => b.manufacturer.toLowerCase() === mfg.toLowerCase());
      if (match && match.id !== selectedBike.id) {
        setSelectedBike(match);
      }
    }
  };

  // Persist user profile updates
  useEffect(() => {
    localStorage.setItem('apex_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Compare toggle
  const handleToggleCompare = (bike: Superbike) => {
    if (comparisonBikes.some((b) => b.id === bike.id)) {
      if (comparisonBikes.length > 2) {
        setComparisonBikes(comparisonBikes.filter((b) => b.id !== bike.id));
      }
    } else {
      if (comparisonBikes.length < 3) {
        setComparisonBikes([...comparisonBikes, bike]);
      } else {
        setComparisonBikes([comparisonBikes[0], comparisonBikes[1], bike]);
      }
    }
  };

  const isCompared = (bikeId: string) => comparisonBikes.some((b) => b.id === bikeId);

  // Favorite toggle
  const handleToggleFavorite = (bikeId: string) => {
    const exists = userProfile.favoriteBikeIds.includes(bikeId);
    const updatedIds = exists
      ? userProfile.favoriteBikeIds.filter((id) => id !== bikeId)
      : [...userProfile.favoriteBikeIds, bikeId];

    setUserProfile({
      ...userProfile,
      favoriteBikeIds: updatedIds,
    });
  };

  const isFavorite = (bikeId: string) => userProfile.favoriteBikeIds.includes(bikeId);

  // Save Custom Build
  const handleSaveCustomBuild = (build: CustomBuild) => {
    setUserProfile((prev) => ({
      ...prev,
      customBuilds: [build, ...prev.customBuilds],
    }));
  };

  // Switch to HUD with specific bike
  const handleLaunchTelemetry = (bike: Superbike) => {
    setSelectedBike(bike);
    setActiveTab('hud');
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col font-sans selection:bg-[#00F0FF] selection:text-black carbon-bg">
      
      {/* Main Top Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenSoundboard={() => setIsSoundboardModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Showcase Screen */}
        {activeTab === 'showcase' && (
          <div className="space-y-10">
            {/* Dynamic Hero Carousel */}
            <HeroCarousel
              bikes={SUPERBIKES}
              selectedBike={selectedBike}
              onSelectBike={setSelectedBike}
              onLaunchTelemetry={handleLaunchTelemetry}
              onOpenDetails={(bike) => setDetailModalBike(bike)}
              onToggleCompare={handleToggleCompare}
              isCompared={isCompared}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={isFavorite}
            />

            {/* Complete Homologation Superbike Grid */}
            <div className="space-y-4 pt-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-orbitron font-extrabold text-white flex items-center gap-2.5">
                    <Grid className="w-5 h-5 text-[#00F0FF]" />
                    <span>HOMOLOGATED SUPERBIKE GARAGE ({SUPERBIKES.length})</span>
                  </h2>
                  <p className="text-xs font-inter text-white/50 mt-1">
                    Explore high-performance superbikes with telemetry specs, exhaust acoustics, dyno benchmarks, and live comparison.
                  </p>
                </div>

                <div className="text-xs font-telemetry text-[#00F0FF]">
                  DISPLAYING {SUPERBIKES.length} FLAGSHIPS
                </div>
              </div>

              <SuperbikeGrid
                bikes={SUPERBIKES}
                selectedBike={selectedBike}
                selectedManufacturer={selectedManufacturer}
                setSelectedManufacturer={handleManufacturerChange}
                searchQuery={searchQuery}
                setSearchQuery={handleSearchChange}
                onSelectBike={setSelectedBike}
                onLaunchTelemetry={handleLaunchTelemetry}
                onOpenDetails={(bike) => setDetailModalBike(bike)}
                onToggleCompare={handleToggleCompare}
                isCompared={isCompared}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={isFavorite}
              />
            </div>
          </div>
        )}

        {/* Live Trackside Telemetry HUD */}
        {activeTab === 'hud' && (
          <div className="space-y-6">
            <TelemetryHUD
              bike={selectedBike}
              allBikes={SUPERBIKES}
              onSelectBike={setSelectedBike}
            />

            {/* Quick Switcher Strip */}
            <div className="p-4 rounded-xl liquid-card border border-white/10 flex items-center space-x-3 overflow-x-auto no-scrollbar">
              <span className="text-xs font-orbitron font-bold text-white/50 uppercase whitespace-nowrap">
                Quick Machine Select:
              </span>
              {SUPERBIKES.slice(0, 10).map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBike(b)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-orbitron font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedBike.id === b.id
                      ? 'liquid-tab-active'
                      : 'liquid-glass text-white/70 hover:text-white hover:border-[#00F0FF]/40'
                  }`}
                >
                  {b.shortName} ({b.metrics.powerHp} HP)
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Side-by-Side Spec Comparator Matrix */}
        {activeTab === 'comparator' && (
          <SpecComparator
            allBikes={SUPERBIKES}
            comparisonBikes={comparisonBikes}
            onRemoveBike={(bikeId) => setComparisonBikes(comparisonBikes.filter((b) => b.id !== bikeId))}
            onAddBike={(bike) => setComparisonBikes([...comparisonBikes, bike])}
          />
        )}

        {/* Apex Custom Lab Workshop */}
        {activeTab === 'custom_lab' && (
          <CustomBikeBuilder
            allBikes={SUPERBIKES}
            userProfile={userProfile}
            onSaveCustomBuild={handleSaveCustomBuild}
          />
        )}

        {/* Brand Heritage Timelines */}
        {activeTab === 'heritage' && (
          <BrandHeritageTimeline />
        )}

      </main>

      {/* Floating AI Concierge Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {/* Active Telemetry Pill Tag next to floating button */}
        {!isConciergeOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setIsConciergeOpen(true)}
            className="hidden md:flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#090D16]/90 border border-[#00F0FF]/40 text-xs font-telemetry text-white/90 shadow-[0_0_20px_rgba(0,240,255,0.2)] backdrop-blur-md cursor-pointer hover:border-[#00F0FF]"
          >
            <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse"></span>
            <span className="text-[#00F0FF] font-bold">AI TELEMETRY LOCK:</span>
            <span className="text-white font-orbitron font-semibold">{selectedBike.shortName}</span>
          </motion.div>
        )}

        <div className="relative">
          <button
            onClick={() => setIsConciergeOpen(!isConciergeOpen)}
            className="w-14 h-14 bg-[#00F0FF] rounded-full flex items-center justify-center text-black shadow-[0_0_25px_rgba(0,240,255,0.5)] hover:scale-105 transition-transform cursor-pointer"
            aria-label="Toggle Telemetry AI"
          >
            <Bot className="h-7 w-7" />
          </button>
          <div className="absolute -top-1 -right-1 bg-[#FF0055] text-[9px] font-orbitron font-bold px-2 py-0.5 rounded-full border border-[#0B0F19] text-white shadow-[0_0_10px_rgba(255,0,85,0.5)]">
            AI
          </div>
        </div>
      </div>

      {/* Floating Concierge Chat Panel */}
      <FloatingConcierge
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
        currentBike={selectedBike}
        allBikes={SUPERBIKES}
        onSelectBike={setSelectedBike}
      />

      {/* Bike Details Full Spec Modal */}
      <AnimatePresence>
        {detailModalBike && (
          <BikeDetailModal
            bike={detailModalBike}
            onClose={() => setDetailModalBike(null)}
            onLaunchTelemetry={handleLaunchTelemetry}
          />
        )}
      </AnimatePresence>

      {/* Pilot Auth & Garage Modal */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <AuthAndProfileModal
            userProfile={userProfile}
            onUpdateProfile={setUserProfile}
            allBikes={SUPERBIKES}
            onClose={() => setIsAuthModalOpen(false)}
            onSelectBike={(b) => {
              setSelectedBike(b);
              setActiveTab('hud');
            }}
          />
        )}
      </AnimatePresence>

      {/* Global Real-Life Superbike Soundboard Studio */}
      <AnimatePresence>
        {isSoundboardModalOpen && (
          <RealSoundboardModal
            isOpen={isSoundboardModalOpen}
            onClose={() => setIsSoundboardModalOpen(false)}
            initialBike={selectedBike}
          />
        )}
      </AnimatePresence>

      {/* High-Tech Telemetry Footer */}
      <Footer />

    </div>
  );
}
