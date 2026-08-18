import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Square, 
  X, 
  Flame, 
  Zap, 
  Activity, 
  Sparkles, 
  Radio, 
  Award, 
  Gauge,
  Sliders,
  RotateCcw
} from 'lucide-react';
import { Superbike } from '../types';
import { SUPERBIKES } from '../data/superbikes';
import { engineAudio, getAcousticProfileForBike, RealAudioClip, RealAudioClipType } from '../utils/engineSound';

interface RealSoundboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBike?: Superbike;
}

export const RealSoundboardModal: React.FC<RealSoundboardModalProps> = ({
  isOpen,
  onClose,
  initialBike,
}) => {
  const [selectedBike, setSelectedBike] = useState<Superbike>(initialBike || SUPERBIKES[0]);
  const [activeClipId, setActiveClipId] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(85);
  const [activeCategory, setActiveCategory] = useState<RealAudioClipType | 'all'>('all');

  const acousticProfile = getAcousticProfileForBike(selectedBike.id, selectedBike.name);

  // Sync selected bike if prop changes
  useEffect(() => {
    if (initialBike) {
      setSelectedBike(initialBike);
    }
  }, [initialBike]);

  // Clean up audio on close or unmount
  useEffect(() => {
    if (!isOpen) {
      engineAudio.stopRealClip();
      setActiveClipId(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePlayClip = (clip: RealAudioClip) => {
    if (activeClipId === clip.id) {
      engineAudio.stopRealClip();
      setActiveClipId(null);
    } else {
      setActiveClipId(clip.id);
      engineAudio.playRealClip(selectedBike.id, clip.id, () => {
        setActiveClipId(null);
      });
    }
  };

  const handleStopAll = () => {
    engineAudio.stopRealClip();
    setActiveClipId(null);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    engineAudio.setVolume(newVol / 100);
  };

  const filteredClips = activeCategory === 'all' 
    ? acousticProfile.realClips 
    : acousticProfile.realClips.filter(c => c.type === activeCategory);

  const getCategoryBadge = (type: RealAudioClipType) => {
    switch (type) {
      case 'dyno_pull':
        return { label: 'DYNO WOT PULL', color: 'text-[#00F0FF] bg-[#00F0FF]/15 border-[#00F0FF]/30' };
      case 'track_flyby':
        return { label: 'TRACK FLYBY', color: 'text-[#FF0055] bg-[#FF0055]/15 border-[#FF0055]/30' };
      case 'rev_blip':
        return { label: 'REV BLIP & CRACKLE', color: 'text-amber-400 bg-amber-400/15 border-amber-400/30' };
      case 'cold_start_idle':
        return { label: 'COLD START & IDLE', color: 'text-emerald-400 bg-emerald-400/15 border-emerald-400/30' };
      case 'limiter_flames':
        return { label: 'LIMITER LAUNCH FLAMES', color: 'text-purple-400 bg-purple-400/15 border-purple-400/30' };
      default:
        return { label: 'REAL EXHAUST', color: 'text-white/70 bg-white/10 border-white/20' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl liquid-card border border-white/15 p-5 sm:p-8 shadow-2xl space-y-6"
      >
        {/* Close Button */}
        <button
          onClick={() => {
            handleStopAll();
            onClose();
          }}
          className="absolute top-4 right-4 p-2.5 rounded-xl liquid-glass hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Live Audio Visualizer */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5 pr-10">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#00F0FF] animate-ping"></div>
              <span className="text-[11px] font-orbitron font-bold text-[#00F0FF] uppercase tracking-widest">
                REAL-LIFE STUDIO RECORDINGS & EXHAUST SOUNDBOARD
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-orbitron font-extrabold text-white flex items-center gap-3">
              <span>{selectedBike.name}</span>
            </h2>
            <p className="text-xs sm:text-sm font-inter text-white/70">
              Authentic high-fidelity audio captured on dynamometers and Grand Prix circuits.
            </p>
          </div>

          {/* Master Controls: Stop & Volume */}
          <div className="flex items-center space-x-3 bg-black/50 p-2.5 rounded-xl border border-white/10">
            <button
              onClick={handleStopAll}
              disabled={!activeClipId}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-red-500/20 text-white text-xs font-orbitron font-bold disabled:opacity-30 border border-white/15 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 text-red-400" />
              <span>STOP ALL</span>
            </button>

            <div className="flex items-center space-x-2 text-xs font-telemetry text-white/70 pl-2 border-l border-white/10">
              <Volume2 className="w-4 h-4 text-[#00F0FF]" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-20 sm:w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
              />
              <span className="w-7 text-right text-[11px]">{volume}%</span>
            </div>
          </div>
        </div>

        {/* Superbike Selector Strip */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-orbitron font-bold text-white/50">
            <span>SELECT SUPERBIKE ARCHITECTURE</span>
            <span className="text-[#00F0FF]">{SUPERBIKES.length} MACHINES LOADED</span>
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin">
            {SUPERBIKES.map((b) => {
              const isSelected = b.id === selectedBike.id;
              return (
                <button
                  key={b.id}
                  onClick={() => {
                    handleStopAll();
                    setSelectedBike(b);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-orbitron font-bold whitespace-nowrap transition-all flex items-center space-x-2 border cursor-pointer ${
                    isSelected
                      ? 'liquid-tab-active shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                      : 'liquid-glass text-white/60 hover:text-white border-white/10 hover:border-white/30'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: b.accentColor }}></span>
                  <span>{b.shortName || b.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Bike Acoustic Architecture Card */}
        <div className="p-4 sm:p-5 rounded-xl bg-white/[0.02] border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-inter uppercase text-white/40 block">ENGINE ARCHITECTURE</span>
            <div className="text-sm font-orbitron font-bold text-[#00F0FF]">
              {acousticProfile.architecture}
            </div>
            <p className="text-xs font-inter text-white/70">
              {acousticProfile.name}
            </p>
          </div>

          <div className="space-y-1 sm:border-l sm:border-white/10 sm:pl-4">
            <span className="text-[10px] font-inter uppercase text-white/40 block">EXHAUST HARDWARE SYSTEM</span>
            <div className="text-sm font-orbitron font-bold text-amber-400">
              {acousticProfile.exhaustSystem}
            </div>
            <p className="text-xs font-telemetry text-white/60">
              Resonances: {acousticProfile.exhaustResonance1Hz} Hz & {acousticProfile.exhaustResonance2Hz} Hz
            </p>
          </div>

          <div className="space-y-1 sm:border-l sm:border-white/10 sm:pl-4">
            <span className="text-[10px] font-inter uppercase text-white/40 block">FIRING INTERVAL CADENCE</span>
            <div className="text-sm font-orbitron font-bold text-[#FF0055]">
              {acousticProfile.firingOrder}
            </div>
            <p className="text-xs font-telemetry text-white/60">
              Sub-harmonic bass weight: {(acousticProfile.subHarmonicWeight * 100).toFixed(0)}%
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
          <span className="text-xs font-orbitron font-semibold text-white/40 mr-1">SCENARIO:</span>
          {(['all', 'dyno_pull', 'track_flyby', 'rev_blip', 'cold_start_idle', 'limiter_flames'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-orbitron font-bold transition-all cursor-pointer border ${
                activeCategory === cat
                  ? 'bg-white text-black border-white shadow-md'
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat === 'all' ? 'ALL SCENARIOS' : cat.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>

        {/* Real Soundboard Clips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredClips.map((clip) => {
            const isPlaying = activeClipId === clip.id;
            const badge = getCategoryBadge(clip.type);

            return (
              <div
                key={clip.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between space-y-4 ${
                  isPlaying
                    ? 'liquid-card border-[#00F0FF] shadow-[0_0_25px_rgba(0,240,255,0.25)] bg-[#00F0FF]/5'
                    : 'glass-card border-white/10 hover:border-white/20'
                }`}
              >
                {/* Active Playing Animated Aura */}
                {isPlaying && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#00F0FF]/15 blur-2xl rounded-full pointer-events-none -mr-10 -mt-10 animate-pulse"></div>
                )}

                {/* Top Clip Info */}
                <div className="space-y-2 relative z-10">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-orbitron font-bold border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-[11px] font-telemetry text-white/50">
                      {clip.durationSec}s SAMPLE
                    </span>
                  </div>

                  <h3 className="text-base font-orbitron font-bold text-white">
                    {clip.title}
                  </h3>

                  <p className="text-xs font-inter text-white/70 leading-relaxed">
                    {clip.description}
                  </p>
                </div>

                {/* Exhaust Setup Tag & Animated Waveform Spectrum */}
                <div className="space-y-3 relative z-10 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between text-[11px] font-telemetry">
                    <span className="text-white/40">Exhaust Spec:</span>
                    <span className="text-white/80 font-semibold">{clip.exhaustSetup}</span>
                  </div>

                  {/* Animated Waveform Visualizer */}
                  <div className="flex items-center justify-between gap-1 h-6 bg-black/40 px-3 rounded-lg border border-white/5 overflow-hidden">
                    {Array.from({ length: 28 }).map((_, i) => {
                      const heights = [0.3, 0.6, 0.9, 0.4, 0.8, 1.0, 0.5, 0.7, 0.3, 0.85, 0.6, 0.95, 0.4, 0.75];
                      const height = heights[i % heights.length];
                      return (
                        <motion.div
                          key={i}
                          animate={{
                            height: isPlaying ? `${Math.max(4, height * 20)}px` : '4px',
                            backgroundColor: isPlaying ? '#00F0FF' : 'rgba(255, 255, 255, 0.2)',
                          }}
                          transition={{
                            duration: 0.2 + (i % 5) * 0.05,
                            repeat: isPlaying ? Infinity : 0,
                            repeatType: 'reverse',
                          }}
                          className="w-1 rounded-full"
                        />
                      );
                    })}
                  </div>

                  {/* Play / Stop Action Button */}
                  <button
                    onClick={() => handlePlayClip(clip)}
                    className={`w-full py-2.5 px-4 rounded-xl font-orbitron text-xs font-bold tracking-wider transition-all flex items-center justify-center space-x-2 cursor-pointer border ${
                      isPlaying
                        ? 'bg-[#FF0055] text-white border-[#FF0055] shadow-[0_0_15px_rgba(255,0,85,0.4)] animate-pulse'
                        : 'bg-[#00F0FF]/15 hover:bg-[#00F0FF]/25 text-[#00F0FF] border-[#00F0FF]/40 hover:shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Square className="w-4 h-4" />
                        <span>STOP SAMPLE</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>PLAY REAL RECORDING</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] font-telemetry text-white/40 gap-2">
          <span>🎧 For the most realistic acoustic experience, use high quality headphones or studio monitors.</span>
          <span className="text-[#00F0FF]">NIXH REAL AUDIO LAB // 24-BIT PCM WAVETABLES</span>
        </div>
      </motion.div>
    </div>
  );
};
