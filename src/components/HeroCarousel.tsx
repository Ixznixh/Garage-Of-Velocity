import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Zap, 
  Gauge, 
  Wind, 
  Flame, 
  Weight, 
  GitCompare, 
  Eye, 
  Heart, 
  Cpu, 
  ShieldCheck, 
  Award,
  BookOpen,
  Volume2,
  VolumeX,
  Sparkles
} from 'lucide-react';
import { Superbike } from '../types';
import { SUPERBIKES } from '../data/superbikes';
import { engineAudio, getAcousticProfileForBike } from '../utils/engineSound';

interface HeroCarouselProps {
  bikes: Superbike[];
  selectedBike: Superbike;
  onSelectBike: (bike: Superbike) => void;
  onOpenDetails: (bike: Superbike) => void;
  onToggleCompare: (bike: Superbike) => void;
  isCompared: (bikeId: string) => boolean;
  onToggleFavorite: (bikeId: string) => void;
  isFavorite: (bikeId: string) => boolean;
  onLaunchTelemetry: (bike: Superbike) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  bikes,
  selectedBike,
  onSelectBike,
  onOpenDetails,
  onToggleCompare,
  isCompared,
  onToggleFavorite,
  isFavorite,
  onLaunchTelemetry,
}) => {
  const safeBikes = Array.isArray(bikes) && bikes.length > 0 ? bikes : SUPERBIKES;
  const currentBike = selectedBike || safeBikes[0] || SUPERBIKES[0];
  const currentIndex = Math.max(0, safeBikes.findIndex((b) => b && b.id === currentBike?.id));

  const [isPlayingSound, setIsPlayingSound] = useState<boolean>(false);
  const acousticProfile = getAcousticProfileForBike(currentBike?.id || '', currentBike?.name);

  // Stop audio on unmount or slide change
  useEffect(() => {
    return () => {
      engineAudio.stop();
      setIsPlayingSound(false);
    };
  }, [currentBike?.id]);

  const handlePrev = () => {
    engineAudio.stop();
    setIsPlayingSound(false);
    const nextIdx = (currentIndex - 1 + safeBikes.length) % safeBikes.length;
    onSelectBike(safeBikes[nextIdx]);
  };

  const handleNext = () => {
    engineAudio.stop();
    setIsPlayingSound(false);
    const nextIdx = (currentIndex + 1) % safeBikes.length;
    onSelectBike(safeBikes[nextIdx]);
  };

  const handleRevEngineSound = () => {
    if (isPlayingSound) {
      engineAudio.stop();
      setIsPlayingSound(false);
    } else {
      setIsPlayingSound(true);
      engineAudio.start(undefined, currentBike.engine?.configuration || 'V4', currentBike.id, currentBike.name);
      engineAudio.setVolume(0.85);
      
      // Perform a realistic throttle rev blip sequence
      engineAudio.blipThrottle(
        undefined, 
        currentBike.id, 
        Math.round(currentBike.metrics.rpmRedline * 0.78), 
        currentBike.metrics.rpmRedline
      );

      // Auto shutoff after rev preview or let user listen
      setTimeout(() => {
        if (engineAudio.getIsPlaying()) {
          engineAudio.updateRpm(1400, currentBike.metrics.rpmRedline, undefined, currentBike.id, 0);
        }
      }, 950);
    }
  };

  if (!currentBike || !currentBike.id) {
    return null;
  }

  return (
    <div className="relative w-full rounded-2xl liquid-card p-4 sm:p-8 lg:p-10 overflow-hidden shadow-2xl">
      {/* Background Watermark Typography */}
      <div className="font-orbitron font-extrabold text-[80px] sm:text-[140px] lg:text-[180px] text-white/[0.02] absolute -top-6 sm:-top-10 -left-4 sm:-left-6 tracking-tighter select-none pointer-events-none uppercase">
        {currentBike.manufacturer}
      </div>

      {/* Ambient Glow */}
      <div 
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-15 transition-colors duration-700"
        style={{ backgroundColor: currentBike.accentColor || '#00F0FF' }}
      ></div>

      {/* Header bar of the Hero Carousel */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6 pb-3 sm:pb-4 border-b border-white/10">
        
        {/* Left Side: Category & Engineering Spec Tags */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <span className="px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-orbitron font-bold tracking-wider uppercase bg-[#FF0055]/15 text-[#FF0055] border border-[#FF0055]/40 shadow-[0_0_12px_rgba(255,0,85,0.2)] flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF0055] animate-pulse"></span>
            <span>{currentBike.category} // {currentBike.year}</span>
          </span>

          <span className="text-[11px] sm:text-xs font-telemetry text-white/70 bg-black/40 px-2.5 py-1 rounded-md border border-white/10 whitespace-nowrap">
            ENGINE: <strong className="text-[#00F0FF] font-orbitron">{currentBike.displacementCc}cc {currentBike.engineCylinders}</strong>
          </span>
        </div>

        {/* Right Side: Action Controls & Pagination Stepper */}
        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-2.5 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(currentBike.id)}
              className={`p-2 rounded-lg border transition-all cursor-pointer flex-shrink-0 ${
                isFavorite(currentBike.id)
                  ? 'bg-[#FF0055]/20 border-[#FF0055] text-[#FF0055] shadow-[0_0_12px_rgba(255,0,85,0.3)]'
                  : 'liquid-glass border-white/10 text-white/50 hover:text-white hover:border-white/30'
              }`}
              title="Add to Favorite Garage"
            >
              <Heart className={`w-4 h-4 ${isFavorite(currentBike.id) ? 'fill-current text-[#FF0055]' : ''}`} />
            </button>

            <button
              onClick={() => onToggleCompare(currentBike)}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-[11px] sm:text-xs font-orbitron font-bold border transition-all cursor-pointer flex-shrink-0 whitespace-nowrap ${
                isCompared(currentBike.id)
                  ? 'bg-[#00F0FF]/20 border-[#00F0FF] text-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                  : 'liquid-glass border-white/10 text-white/70 hover:text-white hover:border-white/30'
              }`}
              title="Compare with other superbikes"
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>{isCompared(currentBike.id) ? 'IN MATRIX' : '+ COMPARE'}</span>
            </button>
          </div>

          {/* Stepper Navigation */}
          <div className="flex items-center p-1 rounded-lg bg-black/50 border border-white/15 backdrop-blur-md flex-shrink-0 whitespace-nowrap">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-md hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer flex-shrink-0"
              aria-label="Previous Superbike"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="px-2.5 sm:px-3 text-xs font-orbitron font-bold tracking-wider select-none whitespace-nowrap flex items-center justify-center space-x-1 min-w-[65px] sm:min-w-[70px]">
              <span className="text-[#00F0FF]">{String(currentIndex + 1).padStart(2, '0')}</span>
              <span className="text-white/30 font-normal">/</span>
              <span className="text-[#00F0FF]">{String(safeBikes.length).padStart(2, '0')}</span>
            </div>

            <button
              onClick={handleNext}
              className="p-1.5 rounded-md hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer flex-shrink-0"
              aria-label="Next Superbike"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Main Split Layout */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Model Info & Primary Telemetry Data */}
        <div className="lg:col-span-5 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBike.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div>
                <p className="text-xs font-orbitron tracking-widest text-[#00F0FF] font-semibold uppercase">
                  {currentBike.manufacturer} RACING DIVISION
                </p>
                <h1 className="font-orbitron text-3xl sm:text-5xl lg:text-6xl font-bold italic tracking-tighter leading-tight uppercase text-white mt-1">
                  {currentBike.manufacturer}<br/>
                  <span className="text-[#FF0055]">
                    {currentBike.name.replace(currentBike.manufacturer, '').trim() || currentBike.name}
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-white/60 font-inter font-medium mt-1">
                  {currentBike.tagline}
                </p>
              </div>

              <p className="text-sm text-white/70 line-clamp-3 leading-relaxed font-inter">
                {currentBike.overview}
              </p>

              {/* Primary 4-Metric High Impact Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                
                {/* Horsepower */}
                <div className="p-3.5 rounded-lg glass border border-white/10 hover:border-[#00F0FF]/40 transition-colors">
                  <div className="text-white/40 text-[10px] tracking-widest uppercase font-inter">
                    PEAK POWER
                  </div>
                  <div className="text-2xl font-orbitron font-bold text-[#00F0FF] mt-0.5">
                    {currentBike.metrics.powerHp} <small className="text-xs font-normal text-white/50">HP</small>
                  </div>
                  <div className="text-[10px] font-telemetry text-white/40">
                    @{currentBike.metrics.rpmRedline?.toLocaleString()} RPM
                  </div>
                </div>

                {/* Top Speed */}
                <div className="p-3.5 rounded-lg glass border border-white/10 hover:border-[#00F0FF]/40 transition-colors">
                  <div className="text-white/40 text-[10px] tracking-widest uppercase font-inter">
                    TOP SPEED
                  </div>
                  <div className="text-2xl font-orbitron font-bold text-white mt-0.5">
                    {currentBike.metrics.topSpeedKmh} <small className="text-xs font-normal text-white/50">KM/H</small>
                  </div>
                  <div className="text-[10px] font-telemetry text-[#00F0FF]">
                    {Math.round(currentBike.metrics.topSpeedKmh * 0.621371)} MPH
                  </div>
                </div>

                {/* 0-100 Acceleration */}
                <div className="p-3.5 rounded-lg glass border border-white/10 hover:border-[#FF0055]/40 transition-colors">
                  <div className="text-white/40 text-[10px] tracking-widest uppercase font-inter">
                    0-100 KM/H
                  </div>
                  <div className="text-2xl font-orbitron font-bold text-[#FF0055] mt-0.5">
                    {currentBike.metrics.acceleration0to100} <small className="text-xs font-normal text-white/50">SEC</small>
                  </div>
                  <div className="text-[10px] font-telemetry text-white/40">
                    1/4: {currentBike.metrics.quarterMileSec}s
                  </div>
                </div>

                {/* Dry Weight */}
                <div className="p-3.5 rounded-lg glass border border-white/10 hover:border-[#FFB800]/40 transition-colors">
                  <div className="text-white/40 text-[10px] tracking-widest uppercase font-inter">
                    DRY WEIGHT
                  </div>
                  <div className="text-2xl font-orbitron font-bold text-[#FFB800] mt-0.5">
                    {currentBike.metrics.dryWeightKg} <small className="text-xs font-normal text-white/50">KG</small>
                  </div>
                  <div className="text-[10px] font-telemetry text-white/40">
                    {currentBike.metrics.powerToWeight} hp/kg
                  </div>
                </div>

              </div>

              {/* Acoustic Architecture Badge */}
              <div className="flex items-center space-x-2 pt-1">
                <span className="px-2.5 py-1 rounded bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[#00F0FF] text-[10px] font-orbitron font-bold uppercase tracking-wider">
                  {acousticProfile.architecture}
                </span>
                <span className="text-white/50 text-[11px] font-inter">
                  {acousticProfile.name}
                </span>
              </div>

              {/* Action Buttons: Live HUD & History / Specs Dossier */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onLaunchTelemetry(currentBike)}
                  className="flex-1 min-w-[140px] bg-[#00F0FF] text-black py-3 px-5 rounded-lg font-orbitron text-xs font-bold tracking-[0.2em] hover:bg-[#38f4ff] transition-all shadow-[0_0_20px_rgba(0,240,255,0.35)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Gauge className="w-4 h-4" />
                  <span>LAUNCH HUD</span>
                </button>

                <button
                  onClick={handleRevEngineSound}
                  className={`flex-1 min-w-[150px] py-3 px-4 rounded-lg font-orbitron text-xs font-bold tracking-[0.15em] transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                    isPlayingSound
                      ? 'bg-[#FF0055]/20 border-[#FF0055] text-[#FF0055] shadow-[0_0_15px_rgba(255,0,85,0.4)]'
                      : 'liquid-glass border-white/20 text-white hover:border-[#FFB800] hover:text-[#FFB800]'
                  }`}
                  title="Fire up engine sound and rev blip"
                >
                  {isPlayingSound ? (
                    <Volume2 className="w-4 h-4 text-[#FF0055] animate-pulse" />
                  ) : (
                    <Zap className="w-4 h-4 text-[#FFB800]" />
                  )}
                  <span>{isPlayingSound ? 'BLIPPING REV...' : '⚡ REV ENGINE'}</span>
                </button>

                <button
                  onClick={() => onOpenDetails(currentBike)}
                  className="liquid-glass border border-white/20 text-white hover:border-[#00F0FF] hover:text-[#00F0FF] py-3 px-4 rounded-lg font-orbitron text-xs font-bold tracking-[0.15em] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  title="Explore Full Engineering & Racing Heritage"
                >
                  <BookOpen className="w-4 h-4 text-[#00F0FF]" />
                  <span className="hidden sm:inline">HISTORY</span>
                </button>

                <button
                  onClick={() => onOpenDetails(currentBike)}
                  className="liquid-glass border border-white/20 text-white hover:border-white/40 hover:text-[#00F0FF] p-3 rounded-lg transition-colors cursor-pointer"
                  title="View Deep Engineering Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column: Hero Visual with Dynamic Aero Telemetry */}
        <div className="lg:col-span-7 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBike.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.35 }}
              className="relative w-full rounded-xl overflow-hidden glass border border-white/10 p-2 sm:p-3 group"
            >
              {/* Bike Image */}
              <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={currentBike.heroImage}
                  alt={currentBike.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />

                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent opacity-85"></div>

                {/* Telemetry Overlays Floating on Visual */}
                <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex flex-col space-y-1 sm:space-y-1.5 max-w-[70%] sm:max-w-none">
                  <div className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-md bg-black/80 backdrop-blur-md border border-[#00F0FF]/40 text-[9px] sm:text-[10px] font-orbitron text-[#00F0FF] flex items-center space-x-1 sm:space-x-1.5 truncate">
                    <Wind className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00F0FF] flex-shrink-0" />
                    <span className="truncate">AERO DOWNFORCE: {currentBike.metrics.downforceAt300KmhKg} KG @ 300 KM/H</span>
                  </div>
                  <div className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-md bg-black/80 backdrop-blur-md border border-emerald-400/40 text-[9px] sm:text-[10px] font-orbitron text-emerald-300 flex items-center space-x-1 sm:space-x-1.5 truncate">
                    <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 flex-shrink-0" />
                    <span className="truncate">MAX LEAN ANGLE: {currentBike.metrics.maxLeanAngleDeg}° KNEE-DOWN</span>
                  </div>
                </div>

                {/* Manufacturer Price Stamp */}
                <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 text-right bg-black/80 backdrop-blur-md p-1.5 sm:p-2 rounded-lg border border-white/15">
                  <span className="text-[9px] sm:text-[10px] font-inter text-amber-400 tracking-wider uppercase font-semibold block">INDIA EX-SHOWROOM</span>
                  <div className="text-base sm:text-xl font-orbitron font-extrabold text-white">
                    {currentBike.priceInrLakh > 0 ? `₹${currentBike.priceInrLakh.toFixed(2)} Lakh` : 'On Request'}
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-inter text-white/50 block">${currentBike.priceUsd?.toLocaleString()} Global MSRP</span>
                </div>
              </div>

              {/* Bottom Quick Mini Thumbs */}
              <div className="flex items-center space-x-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
                {safeBikes.map((bike) => (
                  <button
                    key={bike.id}
                    onClick={() => onSelectBike(bike)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-sm text-xs font-orbitron font-bold flex items-center space-x-2 transition-all border cursor-pointer ${
                      bike.id === currentBike.id
                        ? 'bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                        : 'glass text-white/50 border-white/10 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: bike.accentColor }}
                    ></span>
                    <span>{bike.shortName}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
