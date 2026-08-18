import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Zap, 
  Gauge, 
  ShieldCheck, 
  Wind, 
  Cpu, 
  Layers, 
  Flame, 
  Weight, 
  CheckCircle2,
  DollarSign,
  History,
  BookOpen,
  Trophy,
  Award,
  Flag,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Square
} from 'lucide-react';
import { Superbike } from '../types';
import { BRAND_HERITAGES } from '../data/superbikes';
import { engineAudio, getAcousticProfileForBike, RealAudioClip } from '../utils/engineSound';

interface BikeDetailModalProps {
  bike: Superbike;
  onClose: () => void;
  onLaunchTelemetry: (bike: Superbike) => void;
}

export const BikeDetailModal: React.FC<BikeDetailModalProps> = ({
  bike,
  onClose,
  onLaunchTelemetry,
}) => {
  const [activeTab, setActiveTab] = useState<'specs' | 'history'>('specs');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [activeClipId, setActiveClipId] = useState<string | null>(null);
  const brandHeritage = BRAND_HERITAGES[bike.manufacturer];
  const acousticProfile = getAcousticProfileForBike(bike.id, bike.name);

  // Stop audio when modal closes or changes
  useEffect(() => {
    return () => {
      engineAudio.stop();
      engineAudio.stopRealClip();
      setIsPlayingAudio(false);
      setActiveClipId(null);
    };
  }, [bike.id]);

  const handlePlayClip = (clip: RealAudioClip) => {
    if (activeClipId === clip.id) {
      engineAudio.stopRealClip();
      setActiveClipId(null);
    } else {
      setActiveClipId(clip.id);
      setIsPlayingAudio(false);
      engineAudio.playRealClip(bike.id, clip.id, () => {
        setActiveClipId(null);
      });
    }
  };

  const handleRevAudio = () => {
    if (isPlayingAudio) {
      engineAudio.stop();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      engineAudio.start(undefined, bike.engine?.configuration || 'V4', bike.id, bike.name);
      engineAudio.setVolume(0.85);
      engineAudio.blipThrottle(
        undefined, 
        bike.id, 
        Math.round(bike.metrics.rpmRedline * 0.78), 
        bike.metrics.rpmRedline
      );
      setTimeout(() => {
        if (engineAudio.getIsPlaying()) {
          engineAudio.updateRpm(1400, bike.metrics.rpmRedline, undefined, bike.id, 0);
        }
      }, 950);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl liquid-card border border-white/10 p-5 sm:p-8 shadow-2xl space-y-6"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl liquid-glass hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 pr-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: bike.accentColor }}></span>
              <span className="text-[11px] font-orbitron font-bold text-white/50 uppercase tracking-widest">
                {bike.manufacturer} // {bike.category}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-orbitron font-extrabold text-white mt-1">
              {bike.name}
            </h2>
            <p className="text-xs sm:text-sm font-inter text-[#00F0FF]">
              {bike.tagline}
            </p>
          </div>

          <div className="text-right">
            <div className="text-xl sm:text-2xl font-orbitron font-extrabold text-amber-400">
              ₹{bike.priceInrLakh > 0 ? `${bike.priceInrLakh.toFixed(2)} Lakh` : 'Price on Request'}
            </div>
            <span className="text-[10px] font-inter text-white/50 block">India Ex-Showroom • ${bike.priceUsd.toLocaleString()} Global MSRP</span>
          </div>
        </div>

        {/* Navigation Mode Tabs: Specs vs History */}
        <div className="flex items-center space-x-2 border-b border-white/10 pb-2">
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-4 py-2 rounded-xl text-xs font-orbitron font-bold uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'specs'
                ? 'liquid-tab-active'
                : 'liquid-glass text-white/50 hover:text-white border-white/10'
            }`}
          >
            <Gauge className="w-4 h-4" />
            <span>ENGINEERING & SPECS</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-orbitron font-bold uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'liquid-tab-active'
                : 'liquid-glass text-white/50 hover:text-white border-white/10'
            }`}
          >
            <History className="w-4 h-4 text-[#00F0FF]" />
            <span>BIKE & BRAND HISTORY</span>
          </button>
        </div>

        {/* Tab Content 1: Specs */}
        {activeTab === 'specs' && (
          <div className="space-y-6">
            {/* Hero Visual Image */}
            <div className="w-full h-56 sm:h-72 rounded-xl overflow-hidden bg-black relative border border-white/10">
              <img
                src={bike.heroImage}
                alt={bike.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-xs font-telemetry text-white/80 flex items-center space-x-2">
                <Zap className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>{bike.displacementCc}cc {bike.engineCylinders} | {bike.metrics.powerHp} HP @ {bike.metrics.rpmRedline} RPM</span>
              </div>
            </div>

            {/* Overview Bio */}
            <div className="p-4 sm:p-5 rounded-xl liquid-glass border border-white/10">
              <h3 className="text-xs font-orbitron font-bold text-[#00F0FF] uppercase tracking-wider mb-2">
                ENGINEERING OVERVIEW & HOMOLOGATION PURPOSE
              </h3>
              <p className="text-sm font-inter text-white/80 leading-relaxed">
                {bike.overview}
              </p>
            </div>

            {/* 4-Quadrant Key Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl liquid-glass border border-white/10 text-center">
                <span className="text-[10px] font-inter uppercase text-white/40">PEAK POWER</span>
                <div className="text-xl font-orbitron font-bold text-[#FFB800] mt-1">{bike.metrics.powerHp} HP</div>
                <span className="text-[10px] text-white/40 font-telemetry">Race kit: {bike.metrics.powerWithRaceKitHp || bike.metrics.powerHp} HP</span>
              </div>

              <div className="p-3.5 rounded-xl liquid-glass border border-white/10 text-center">
                <span className="text-[10px] font-inter uppercase text-white/40">TOP SPEED</span>
                <div className="text-xl font-orbitron font-bold text-[#00F0FF] mt-1">{bike.metrics.topSpeedKmh} KM/H</div>
                <span className="text-[10px] text-white/40 font-telemetry">{Math.round(bike.metrics.topSpeedKmh * 0.621371)} MPH</span>
              </div>

              <div className="p-3.5 rounded-xl liquid-glass border border-white/10 text-center">
                <span className="text-[10px] font-inter uppercase text-white/40">0-100 ACCEL</span>
                <div className="text-xl font-orbitron font-bold text-[#FF0055] mt-1">{bike.metrics.acceleration0to100}s</div>
                <span className="text-[10px] text-white/40 font-telemetry">1/4 Mile: {bike.metrics.quarterMileSec}s</span>
              </div>

              <div className="p-3.5 rounded-xl liquid-glass border border-white/10 text-center">
                <span className="text-[10px] font-inter uppercase text-white/40">DRY WEIGHT</span>
                <div className="text-xl font-orbitron font-bold text-emerald-400 mt-1">{bike.metrics.dryWeightKg} KG</div>
                <span className="text-[10px] text-white/40 font-telemetry">Ratio: {bike.metrics.powerToWeight} hp/kg</span>
              </div>
            </div>

            {/* Chassis, Aero, and Electronics Deep Specs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Chassis Section */}
              <div className="p-4 rounded-xl liquid-glass border border-white/10 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-orbitron font-bold text-[#00F0FF] pb-1 border-b border-white/10">
                  <ShieldCheck className="w-4 h-4" />
                  <span>CHASSIS & SUSPENSION</span>
                </div>
                <div className="text-xs space-y-2 text-white/80 font-inter">
                  <div>
                    <strong className="text-white block font-orbitron text-[11px]">Frame:</strong>
                    <span className="text-white/50">{bike.chassis.frame}</span>
                  </div>
                  <div>
                    <strong className="text-white block font-orbitron text-[11px]">Front Forks:</strong>
                    <span className="text-white/50">{bike.chassis.frontSuspension}</span>
                  </div>
                  <div>
                    <strong className="text-white block font-orbitron text-[11px]">Front Brakes:</strong>
                    <span className="text-white/50">{bike.chassis.frontBrakes}</span>
                  </div>
                </div>
              </div>

              {/* Aero Section */}
              <div className="p-4 rounded-xl liquid-glass border border-white/10 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-orbitron font-bold text-blue-400 pb-1 border-b border-white/10">
                  <Wind className="w-4 h-4" />
                  <span>AERODYNAMICS</span>
                </div>
                <div className="text-xs space-y-2 text-white/80 font-inter">
                  <div>
                    <strong className="text-white block font-orbitron text-[11px]">Winglets:</strong>
                    <span className="text-white/50">{bike.aero.wingletsType}</span>
                  </div>
                  <div>
                    <strong className="text-white block font-orbitron text-[11px]">Downforce @ 300 km/h:</strong>
                    <span className="text-[#00F0FF] font-bold">{bike.aero.downforceKg} KG</span>
                  </div>
                  <div>
                    <strong className="text-white block font-orbitron text-[11px]">Drag Coefficient:</strong>
                    <span className="text-white/50">{bike.aero.dragCoefficient} Cd</span>
                  </div>
                </div>
              </div>

              {/* Electronics Section */}
              <div className="p-4 rounded-xl liquid-glass border border-white/10 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-orbitron font-bold text-emerald-400 pb-1 border-b border-white/10">
                  <Cpu className="w-4 h-4" />
                  <span>ELECTRONICS & TELEMETRY</span>
                </div>
                <div className="text-xs space-y-2 text-white/80 font-inter">
                  <div>
                    <strong className="text-white block font-orbitron text-[11px]">Inertial Unit:</strong>
                    <span className="text-white/50">{bike.electronics.imu}</span>
                  </div>
                  <div>
                    <strong className="text-white block font-orbitron text-[11px]">Riding Modes:</strong>
                    <span className="text-white/50">{bike.electronics.modes.join(', ')}</span>
                  </div>
                  <div>
                    <strong className="text-white block font-orbitron text-[11px]">Data Logger:</strong>
                    <span className="text-white/50">{bike.electronics.telemetryLogger}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Features Checklist */}
            <div className="p-4 rounded-xl liquid-glass border border-white/10 space-y-2">
              <h4 className="text-xs font-orbitron font-bold text-white uppercase tracking-wider">
                FACTORY HIGHLIGHTS & RACE TECHNOLOGIES
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-white/80 font-inter">
                {bike.keyFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Real-Life Exhaust Soundboard Studio in Modal */}
            <div className="p-4 sm:p-5 rounded-xl liquid-card border border-white/15 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-[#00F0FF] animate-pulse" />
                  <h4 className="text-xs sm:text-sm font-orbitron font-bold text-white uppercase tracking-wider">
                    REAL-LIFE EXHAUST RECORDINGS ({acousticProfile.realClips.length} SCENARIOS)
                  </h4>
                </div>
                <span className="text-[11px] font-telemetry text-[#00F0FF]">
                  {acousticProfile.exhaustSystem}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {acousticProfile.realClips.map((clip) => {
                  const isPlaying = activeClipId === clip.id;
                  return (
                    <button
                      key={clip.id}
                      onClick={() => handlePlayClip(clip)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2.5 ${
                        isPlaying
                          ? 'bg-[#00F0FF]/20 border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                          : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-orbitron font-bold text-[#FFB800] uppercase">
                          {clip.type.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-telemetry text-white/40">
                          {clip.durationSec}s
                        </span>
                      </div>

                      <div>
                        <div className="text-xs font-orbitron font-bold text-white">
                          {clip.title}
                        </div>
                        <div className="text-[10px] font-inter text-white/50 line-clamp-2 mt-0.5">
                          {clip.description}
                        </div>
                      </div>

                      <div className={`w-full py-1 rounded text-[10px] font-orbitron font-bold text-center flex items-center justify-center space-x-1 transition-all ${
                        isPlaying ? 'bg-[#FF0055] text-white' : 'bg-white/10 text-white'
                      }`}>
                        {isPlaying ? <Square className="w-3 h-3 text-white" /> : <Play className="w-3 h-3 text-[#00F0FF]" />}
                        <span>{isPlaying ? 'STOP CLIP' : 'PLAY RECORDING'}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 2: Bike & Brand History */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            {/* Bike Lineage Story */}
            <div className="p-5 rounded-xl liquid-glass border border-white/10 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-orbitron font-bold text-[#00F0FF]">
                <BookOpen className="w-4 h-4" />
                <span>{bike.name} // GENESIS & RACING EVOLUTION</span>
              </div>
              <p className="text-sm font-inter text-white/80 leading-relaxed">
                {bike.overview}
              </p>
              <div className="pt-2 border-t border-white/10 text-xs font-telemetry text-white/60">
                Origin: <strong className="text-white">{bike.originCountry}</strong> | Category: <strong className="text-[#00F0FF]">{bike.category}</strong>
              </div>
            </div>

            {/* Brand Heritage Summary */}
            {brandHeritage && (
              <div className="p-5 rounded-xl liquid-glass border border-white/10 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center space-x-3">
                    <span 
                      className="px-2.5 py-1 rounded-lg text-xs font-orbitron font-bold uppercase"
                      style={{ backgroundColor: `${brandHeritage.badgeColor}25`, color: brandHeritage.badgeColor }}
                    >
                      FOUNDED {brandHeritage.founded}
                    </span>
                    <h3 className="text-base font-orbitron font-bold text-white">
                      {brandHeritage.manufacturer} HERITAGE
                    </h3>
                  </div>
                  <span className="text-xs font-inter text-white/50">
                    {brandHeritage.country}
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-inter text-white/70 italic border-l-2 pl-3" style={{ borderColor: brandHeritage.badgeColor }}>
                  "{brandHeritage.philosophy}"
                </p>

                {/* Championship Count Trophies */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-black/40 border border-white/10 text-center">
                    <Trophy className="w-4 h-4 text-[#FFB800] mx-auto mb-1" />
                    <div className="text-xl font-orbitron font-bold text-white">
                      {brandHeritage.racingPedigree.motogpChampionships}
                    </div>
                    <span className="text-[9px] font-orbitron text-white/40 uppercase">
                      MotoGP Titles
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-black/40 border border-white/10 text-center">
                    <Award className="w-4 h-4 text-[#00F0FF] mx-auto mb-1" />
                    <div className="text-xl font-orbitron font-bold text-white">
                      {brandHeritage.racingPedigree.wsbkChampionships}
                    </div>
                    <span className="text-[9px] font-orbitron text-white/40 uppercase">
                      WorldSBK Titles
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-black/40 border border-white/10 text-center">
                    <Flag className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                    <div className="text-xl font-orbitron font-bold text-white">
                      {brandHeritage.racingPedigree.isleOfManTtWins}
                    </div>
                    <span className="text-[9px] font-orbitron text-white/40 uppercase">
                      Isle of Man TT
                    </span>
                  </div>
                </div>

                {/* Milestones Mini List */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-orbitron font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                    <History className="w-3.5 h-3.5 text-[#00F0FF]" />
                    <span>Brand Milestones & Racing Evolution</span>
                  </h4>
                  <div className="space-y-2">
                    {brandHeritage.milestones.map((ms, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-xs">
                        <div className="flex items-center space-x-2 font-orbitron font-bold text-[#00F0FF]">
                          <span>{ms.year}</span>
                          <span className="text-white/40">/</span>
                          <span className="text-white">{ms.title}</span>
                        </div>
                        <p className="text-white/70 font-inter mt-1 leading-relaxed">{ms.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[#00F0FF] text-[10px] font-orbitron font-bold uppercase">
              {acousticProfile.architecture}
            </span>
            <button
              onClick={handleRevAudio}
              className={`px-3 py-1.5 rounded-lg border text-xs font-orbitron font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-[#FF0055]/20 border-[#FF0055] text-[#FF0055] shadow-[0_0_15px_rgba(255,0,85,0.4)]'
                  : 'liquid-glass border-white/20 text-[#FFB800] hover:border-[#FFB800] hover:bg-[#FFB800]/10'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isPlayingAudio ? 'BLIPPING REV...' : '⚡ HEAR ENGINE SOUND'}</span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg liquid-glass hover:bg-white/10 text-white/60 hover:text-white font-orbitron text-xs cursor-pointer border border-white/10"
            >
              Close
            </button>

            <button
              onClick={() => {
                onClose();
                onLaunchTelemetry(bike);
              }}
              className="px-6 py-2.5 rounded-lg bg-[#00F0FF] hover:bg-white text-black font-orbitron font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.4)] cursor-pointer transition-all"
            >
              Launch Telemetry HUD
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
