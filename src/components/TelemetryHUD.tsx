import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gauge, 
  Zap, 
  Wind, 
  ShieldAlert, 
  Flame, 
  RotateCcw, 
  Play, 
  Square, 
  Sliders, 
  Cpu, 
  Compass, 
  Crosshair,
  ArrowRight,
  TrendingUp,
  Radio,
  Sparkles,
  Activity,
  History,
  BookOpen,
  Award,
  Layers,
  ShieldCheck,
  Volume2,
  VolumeX,
  Volume1,
  FastForward,
  Rewind
} from 'lucide-react';
import { Superbike, RiderAids } from '../types';
import { SUPERBIKES } from '../data/superbikes';
import { engineAudio, getAcousticProfileForBike, RealAudioClip } from '../utils/engineSound';
import { RealSoundboardModal } from './RealSoundboardModal';

interface TelemetryHUDProps {
  bike?: Superbike;
  allBikes?: Superbike[];
  onSelectBike?: (bike: Superbike) => void;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({ bike: propBike }) => {
  const bike = propBike || SUPERBIKES[0];

  // Live Simulation States
  const [throttle, setThrottle] = useState<number>(0); // 0 to 100%
  const [gear, setGear] = useState<number>(1);
  const [rpm, setRpm] = useState<number>(1400); // Idle RPM
  const [speedKmh, setSpeedKmh] = useState<number>(0);
  const [leanAngle, setLeanAngle] = useState<number>(0); // -65 to +65 deg
  const [gForceLat, setGForceLat] = useState<number>(0);
  const [gForceLong, setGForceLong] = useState<number>(0);
  const [isDynoRunning, setIsDynoRunning] = useState<boolean>(false);

  // Engine Audio States
  const [isAudioOn, setIsAudioOn] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(85);
  const [shiftEvent, setShiftEvent] = useState<{ type: 'up' | 'down' | 'blip' | 'limiter'; text: string; id: number } | null>(null);
  const [isHoldingThrottle, setIsHoldingThrottle] = useState<boolean>(false);
  const [activeRealClipId, setActiveRealClipId] = useState<string | null>(null);
  const [isSoundboardModalOpen, setIsSoundboardModalOpen] = useState<boolean>(false);

  const [activeAids, setActiveAids] = useState<RiderAids>(() => bike?.electronics?.defaultAids || {
    tractionControl: 3,
    wheelieControl: 2,
    engineBrake: 2,
    corneringAbs: 1,
    quickshifter: true,
    launchControl: true,
    slideControl: 2,
    pitLaneLimiter: true,
  });

  const acousticProfile = getAcousticProfileForBike(bike.id, bike.name);

  // Gear ratios & top speeds per gear approximation
  const gearRatios = [
    { gear: 1, maxSpeed: Math.round(bike.metrics.topSpeedKmh * 0.42), maxRpm: bike?.metrics?.rpmRedline || 15000 },
    { gear: 2, maxSpeed: Math.round(bike.metrics.topSpeedKmh * 0.58), maxRpm: bike?.metrics?.rpmRedline || 15000 },
    { gear: 3, maxSpeed: Math.round(bike.metrics.topSpeedKmh * 0.72), maxRpm: bike?.metrics?.rpmRedline || 15000 },
    { gear: 4, maxSpeed: Math.round(bike.metrics.topSpeedKmh * 0.84), maxRpm: bike?.metrics?.rpmRedline || 15000 },
    { gear: 5, maxSpeed: Math.round(bike.metrics.topSpeedKmh * 0.93), maxRpm: bike?.metrics?.rpmRedline || 15000 },
    { gear: 6, maxSpeed: bike?.metrics?.topSpeedKmh || 320, maxRpm: bike?.metrics?.rpmRedline || 15000 },
  ];

  // Stop audio on component unmount
  useEffect(() => {
    return () => {
      engineAudio.stop();
    };
  }, []);

  // Update active aids & reset simulation when selected bike changes
  useEffect(() => {
    if (bike?.electronics?.defaultAids) {
      setActiveAids(bike.electronics.defaultAids);
    }
    setRpm(1400);
    setSpeedKmh(0);
    setGear(1);
    setThrottle(0);
    setLeanAngle(0);

    if (isAudioOn) {
      engineAudio.start(undefined, bike.engine?.configuration || 'V4', bike.id, bike.name);
      engineAudio.updateRpm(1400, bike.metrics.rpmRedline, undefined, bike.id, 0);
    }
  }, [bike?.id]);

  // Toggle Audio Engine
  const toggleAudio = useCallback(() => {
    if (isAudioOn) {
      engineAudio.stop();
      setIsAudioOn(false);
    } else {
      engineAudio.start(undefined, bike.engine?.configuration || 'V4', bike.id, bike.name);
      engineAudio.setVolume(volume / 100);
      engineAudio.updateRpm(rpm, bike.metrics.rpmRedline, undefined, bike.id, throttle);
      setIsAudioOn(true);
    }
  }, [isAudioOn, bike, rpm, throttle, volume]);

  // Handle Volume Change
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    engineAudio.setVolume(newVol / 100);
  };

  // Trigger transient shift notification
  const triggerShiftFeedback = (type: 'up' | 'down' | 'blip' | 'limiter', text: string) => {
    setShiftEvent({ type, text, id: Date.now() });
    setTimeout(() => {
      setShiftEvent((prev) => (prev?.text === text ? null : prev));
    }, 700);
  };

  // Real-time Gear Shift Up (Quickshifter with ignition cut pop)
  const handleGearShiftUp = useCallback(() => {
    if (gear >= 6) return;
    const nextGear = gear + 1;
    const currentRedline = bike.metrics.rpmRedline;
    // Next gear RPM drop ratio (~72% - 76%)
    const targetRpm = Math.max(2200, Math.round(rpm * 0.73));

    if (isAudioOn) {
      engineAudio.shiftUp(rpm, targetRpm, currentRedline, nextGear, bike.id);
    }

    setGear(nextGear);
    setRpm(targetRpm);
    triggerShiftFeedback('up', `💥 QUICKSHIFTER IGNITION CUT POP (-${acousticProfile.shiftUpCutDurationMs}ms) → GEAR ${nextGear}`);
  }, [gear, rpm, bike, isAudioOn, acousticProfile]);

  // Real-time Gear Shift Down (Autoblipper with rev-match blip & overrun crackles)
  const handleGearShiftDown = useCallback(() => {
    if (gear <= 1) return;
    const nextGear = gear - 1;
    const currentRedline = bike.metrics.rpmRedline;
    // Next gear RPM raise ratio (~128% - 132%)
    const targetRpm = Math.min(currentRedline - 200, Math.round(rpm * 1.32));

    if (isAudioOn) {
      engineAudio.shiftDown(rpm, targetRpm, currentRedline, nextGear, bike.id);
    }

    setGear(nextGear);
    setRpm(targetRpm);
    triggerShiftFeedback('down', `⚡ AUTOBIPPER REV-MATCH BLIP (+600 RPM) & OVERRUN CRACKLES → GEAR ${nextGear}`);
  }, [gear, rpm, bike, isAudioOn]);

  // Real-time Rev Blip (Manual throttle blip)
  const handleRevBlip = useCallback(() => {
    const targetRpm = Math.round(bike.metrics.rpmRedline * 0.75);
    if (isAudioOn) {
      engineAudio.blipThrottle(undefined, bike.id, targetRpm, bike.metrics.rpmRedline);
    }
    setRpm(targetRpm);
    triggerShiftFeedback('blip', `⚡ THROTTLE BLIP POP & EXHAUST BURBLE`);
    setTimeout(() => {
      setRpm(1400 + Math.round((throttle / 100) * (bike.metrics.rpmRedline - 1400)));
    }, 350);
  }, [bike, isAudioOn, throttle]);

  // Handle Play Real Soundboard Clip
  const handlePlayRealClip = (clipId: string) => {
    if (activeRealClipId === clipId) {
      engineAudio.stopRealClip();
      setActiveRealClipId(null);
    } else {
      setActiveRealClipId(clipId);
      setIsAudioOn(true);
      engineAudio.playRealClip(bike.id, clipId, () => {
        setActiveRealClipId(null);
      });
    }
  };

  // Continuous Simulation & Sound Loop
  useEffect(() => {
    let currentRpm = rpm;
    let currentSpeed = speedKmh;
    let currentGear = gear;

    const interval = setInterval(() => {
      if (isDynoRunning) {
        // Automatic full dyno sweep mode
        currentRpm += 380;
        if (currentRpm >= bike.metrics.rpmRedline) {
          if (currentGear < 6) {
            const nextGear = currentGear + 1;
            const targetRpm = Math.floor(bike.metrics.rpmRedline * 0.72);
            if (isAudioOn) {
              engineAudio.shiftUp(currentRpm, targetRpm, bike.metrics.rpmRedline, nextGear, bike.id);
            }
            currentGear = nextGear;
            currentRpm = targetRpm;
            triggerShiftFeedback('up', `💥 DYNO AUTO-QUICKSHIFT → GEAR ${nextGear}`);
          } else {
            currentRpm = bike.metrics.rpmRedline;
            if (isAudioOn) {
              engineAudio.updateRpm(currentRpm, bike.metrics.rpmRedline, undefined, bike.id, 100);
            }
          }
        } else if (isAudioOn) {
          engineAudio.updateRpm(currentRpm, bike.metrics.rpmRedline, undefined, bike.id, 100);
        }

        const gearInfo = gearRatios[currentGear - 1];
        const rpmPct = (currentRpm - 1400) / (bike.metrics.rpmRedline - 1400);
        currentSpeed = Math.round(rpmPct * gearInfo.maxSpeed);

        setGear(currentGear);
        setRpm(currentRpm);
        setSpeedKmh(currentSpeed);
        setThrottle(100);
        setGForceLong(Math.min(1.45, 0.4 + rpmPct * 1.0));
      } else if (isHoldingThrottle || throttle > 0) {
        // Manual throttle response
        const activeThrottle = isHoldingThrottle ? 100 : throttle;
        const targetRpm = 1400 + (activeThrottle / 100) * (bike.metrics.rpmRedline - 1400);
        
        setRpm((prev) => {
          const next = prev + (targetRpm - prev) * 0.28;
          const nextRpm = Math.round(next);
          if (isAudioOn) {
            engineAudio.updateRpm(nextRpm, bike.metrics.rpmRedline, undefined, bike.id, activeThrottle);
          }
          return nextRpm;
        });

        const currentGearInfo = gearRatios[gear - 1];
        const rpmRatio = (rpm - 1400) / (bike.metrics.rpmRedline - 1400);
        const targetSpeed = Math.round(rpmRatio * currentGearInfo.maxSpeed);
        setSpeedKmh((prev) => Math.round(prev + (targetSpeed - prev) * 0.22));
        setGForceLong(parseFloat(((activeThrottle / 100) * 1.25).toFixed(2)));
      } else {
        // Idle deceleration
        setRpm((prev) => {
          const next = Math.max(1400, prev - 360);
          if (isAudioOn) {
            engineAudio.updateRpm(next, bike.metrics.rpmRedline, undefined, bike.id, 0);
          }
          return next;
        });
        setSpeedKmh((prev) => Math.max(0, prev - 7));
        setGForceLong((prev) => Math.max(0, prev - 0.1));
      }
    }, 45);

    return () => clearInterval(interval);
  }, [isDynoRunning, throttle, isHoldingThrottle, gear, bike, isAudioOn]);

  // Global Keyboard Controls (W, S, E, Q, Space, M)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing inside input fields
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'e' || e.key === 'E' || e.key === '.') {
        e.preventDefault();
        handleGearShiftUp();
      } else if (e.key === 'q' || e.key === 'Q' || e.key === ',') {
        e.preventDefault();
        handleGearShiftDown();
      } else if (e.key === ' ') {
        e.preventDefault();
        handleRevBlip();
      } else if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
        setIsHoldingThrottle(true);
      } else if (e.key === 'm' || e.key === 'M') {
        toggleAudio();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
        setIsHoldingThrottle(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleGearShiftUp, handleGearShiftDown, handleRevBlip, toggleAudio]);

  // Handle Dyno Run Trigger
  const toggleDynoRun = () => {
    if (isDynoRunning) {
      setIsDynoRunning(false);
      setThrottle(0);
    } else {
      if (!isAudioOn) {
        toggleAudio();
      }
      setIsDynoRunning(true);
    }
  };

  const handleManualThrottleChange = (val: number) => {
    if (isDynoRunning) setIsDynoRunning(false);
    setThrottle(val);
  };

  // Calculate live dynamic horsepower & torque output
  const rpmNormalized = Math.max(0, (rpm - 1400) / (bike.metrics.rpmRedline - 1400));
  const currentHp = Math.round(bike.metrics.powerHp * Math.pow(rpmNormalized, 1.15));
  const currentTorque = Math.round(bike.metrics.torqueNm * Math.sin(Math.min(Math.PI * 0.95, rpmNormalized * Math.PI * 0.85)));
  const currentDownforce = Math.round((speedKmh / 300) * (speedKmh / 300) * bike.metrics.downforceAt300KmhKg);

  // Shift light thresholds
  const redlineRatio = rpm / bike.metrics.rpmRedline;
  const shiftLightLevel = Math.min(10, Math.floor(redlineRatio * 10));

  return (
    <div className="w-full space-y-6">
      
      {/* Top Banner with Active Bike & Shift Indicator Bar */}
      <div className="rounded-2xl glass-card p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-[#00F0FF] animate-ping"></div>
            <div>
              <span className="text-[10px] font-orbitron tracking-widest text-[#00F0FF] uppercase font-bold">
                LIVE TELEMETRY & ENGINE ACOUSTICS // 125 Hz
              </span>
              <h2 className="text-2xl sm:text-3xl font-orbitron font-extrabold text-white mt-0.5">
                {bike.name}
              </h2>
            </div>
          </div>

          {/* Quick Actions: Audio Toggle & Dyno Run Button */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Audio Toggle Button */}
            <button
              onClick={toggleAudio}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-sm font-orbitron font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border ${
                isAudioOn
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                  : 'bg-white/5 border-white/15 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              title="Toggle Live Superbike Engine Audio (M)"
            >
              {isAudioOn ? <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
              <span>{isAudioOn ? 'ENGINE AUDIO ON' : 'START ENGINE SOUND'}</span>
            </button>

            {/* Quick Dyno Run Button */}
            <button
              onClick={toggleDynoRun}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-sm font-orbitron font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                isDynoRunning
                  ? 'bg-[#FF0055] text-white shadow-[0_0_20px_rgba(255,0,85,0.5)] animate-pulse'
                  : 'bg-white text-black hover:bg-[#00F0FF] hover:text-black shadow-[0_0_20px_rgba(0,240,255,0.35)]'
              }`}
            >
              {isDynoRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isDynoRunning ? 'ABORT DYNO SWEEP' : 'START AUTO DYNO SWEEP'}</span>
            </button>
          </div>
        </div>

        {/* Transient Shift Popup Notification */}
        <AnimatePresence>
          {shiftEvent && (
            <motion.div
              key={shiftEvent.id}
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={`mt-3 py-2 px-4 rounded-lg font-orbitron text-xs font-bold tracking-wider flex items-center justify-between border ${
                shiftEvent.type === 'up'
                  ? 'bg-[#FF0055]/20 border-[#FF0055] text-[#FF0055] shadow-[0_0_20px_rgba(255,0,85,0.4)]'
                  : shiftEvent.type === 'down'
                  ? 'bg-[#00F0FF]/20 border-[#00F0FF] text-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                  : 'bg-[#FFB800]/20 border-[#FFB800] text-[#FFB800] shadow-[0_0_20px_rgba(255,184,0,0.4)]'
              }`}
            >
              <span>{shiftEvent.text}</span>
              <span className="text-[10px] font-telemetry opacity-75 uppercase">REAL-TIME ACOUSTIC TRIGGER</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MotoGP Style LED Shift Lights */}
        <div className="pt-4 flex flex-col space-y-2">
          <div className="flex items-center justify-between text-[11px] font-telemetry text-white/50">
            <span className="font-orbitron font-semibold text-xs text-white/70">SHIFT LIGHTS PROTOCOL</span>
            <span className={redlineRatio > 0.92 ? 'text-[#FF0055] font-bold font-orbitron animate-bounce' : 'text-white/50 font-telemetry'}>
              {redlineRatio > 0.95 ? '⚠️ SHIFT UP NOW ⚠️' : `REDLINE: ${bike.metrics.rpmRedline.toLocaleString()} RPM`}
            </span>
          </div>

          <div className="grid grid-cols-10 gap-1.5 h-3.5 sm:h-4 w-full bg-black/60 rounded-sm p-1 border border-white/10">
            {Array.from({ length: 10 }).map((_, idx) => {
              const active = shiftLightLevel >= idx + 1;
              let colorClass = 'bg-emerald-400';
              if (idx >= 6 && idx < 8) colorClass = 'bg-[#FFB800]';
              if (idx >= 8) colorClass = 'bg-[#FF0055] animate-pulse';

              return (
                <div
                  key={idx}
                  className={`h-full rounded-xs transition-all duration-75 ${
                    active ? `${colorClass} shadow-md` : 'bg-white/5'
                  }`}
                ></div>
              );
            })}
          </div>
        </div>

        {/* Dedicated Acoustic Architecture & Soundbar Strip */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-telemetry">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] font-orbitron font-bold text-[11px]">
              {acousticProfile.architecture}
            </span>
            <span className="text-white/70 font-inter text-[11px]">
              {acousticProfile.name}
            </span>
          </div>

          {/* Volume Slider & Animated Sound Waves */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 h-3.5">
              {[0.4, 0.8, 0.6, 1.0, 0.5, 0.9, 0.3].map((height, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: isAudioOn ? `${Math.max(3, height * 14 * (rpm / bike.metrics.rpmRedline))}px` : '3px',
                    opacity: isAudioOn ? 1 : 0.2
                  }}
                  transition={{ duration: 0.15, repeat: Infinity, repeatType: 'reverse' }}
                  className="w-1 bg-[#00F0FF] rounded-full"
                />
              ))}
            </div>

            <div className="flex items-center space-x-1.5 text-white/50 text-[11px]">
              <span>VOL</span>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-16 sm:w-20 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
              />
              <span className="font-orbitron text-white/70 w-7 text-right">{volume}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Gauges Cockpit Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Radial Gauge 1: Tachometer / RPM & Shifter Console */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-telemetry text-white/50">
            <span className="flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-[#00F0FF]" />
              <span className="font-orbitron font-semibold text-white/70">TACHOMETER & TRANSMISSION</span>
            </span>
            <span className="text-[#00F0FF] font-orbitron font-bold">GEAR: {gear}</span>
          </div>

          {/* Center Digital LCD RPM Display */}
          <div className="my-5 text-center relative">
            <div className="text-4xl sm:text-5xl font-orbitron font-extrabold text-white text-glow-cyan tracking-wider">
              {rpm.toLocaleString()}
            </div>
            <div className="text-xs font-orbitron font-semibold tracking-widest text-white/40 uppercase mt-1">
              REVOLUTIONS PER MINUTE // {((rpm / 60) * acousticProfile.basePulseRatio).toFixed(0)} Hz FIRING
            </div>
          </div>

          {/* RPM Arc Bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-black/60 rounded-full h-3 overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-[#FFB800] to-[#FF0055] transition-all duration-75"
                style={{ width: `${Math.min(100, (rpm / bike.metrics.rpmRedline) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] font-telemetry text-white/40">
              <span>0 RPM</span>
              <span>{(bike.metrics.rpmRedline / 2).toLocaleString()}</span>
              <span className="text-[#FF0055] font-bold">{bike.metrics.rpmRedline.toLocaleString()} MAX</span>
            </div>
          </div>

          {/* Real-time Shifting & Downshifting Action Controls */}
          <div className="flex items-center justify-between pt-4 mt-3 border-t border-white/10 gap-2">
            <button
              onClick={handleGearShiftDown}
              disabled={gear === 1}
              className="flex-1 py-2 px-2.5 rounded-lg glass hover:bg-white/10 text-xs font-orbitron font-bold text-white/80 disabled:opacity-30 cursor-pointer border border-white/15 transition-all flex items-center justify-center space-x-1 active:scale-95"
              title="Autoblipper Downshift with Rev-Match Blip (Q)"
            >
              <Rewind className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>- DOWN [Q]</span>
            </button>

            <div className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/15 text-center min-w-[55px]">
              <span className="text-xs font-orbitron font-extrabold text-[#FFB800]">N / {gear}</span>
            </div>

            <button
              onClick={handleGearShiftUp}
              disabled={gear === 6}
              className="flex-1 py-2 px-2.5 rounded-lg bg-[#00F0FF]/15 hover:bg-[#00F0FF]/25 text-xs font-orbitron font-bold text-[#00F0FF] disabled:opacity-30 border border-[#00F0FF]/40 cursor-pointer transition-all flex items-center justify-center space-x-1 active:scale-95 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
              title="Quickshifter Upshift with Spark-Cut Pop (E)"
            >
              <span>+ UP [E]</span>
              <FastForward className="w-3.5 h-3.5 text-[#00F0FF]" />
            </button>
          </div>
        </div>

        {/* Radial Gauge 2: Speedometer (KM/H & MPH) */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-telemetry text-white/50">
            <span className="flex items-center space-x-1.5">
              <Gauge className="w-4 h-4 text-[#00F0FF]" />
              <span className="font-orbitron font-semibold text-white/70">DIGITAL VELOCITY</span>
            </span>
            <span className="text-emerald-400 font-orbitron font-bold">GPS TELEMETRY</span>
          </div>

          {/* Center Digital Speedometer */}
          <div className="my-5 text-center">
            <div className="text-5xl sm:text-6xl font-orbitron font-extrabold text-white text-glow-cyan tracking-wider">
              {speedKmh}
            </div>
            <div className="flex items-center justify-center space-x-2 text-xs font-orbitron font-semibold tracking-widest text-white/40 uppercase mt-1">
              <span className="text-white">KM/H</span>
              <span className="text-white/20">|</span>
              <span className="text-[#00F0FF]">{Math.round(speedKmh * 0.621371)} MPH</span>
            </div>
          </div>

          {/* Acceleration Vector & Downforce Info */}
          <div className="grid grid-cols-2 gap-2 text-xs font-telemetry bg-black/40 p-3 rounded-lg border border-white/10">
            <div>
              <span className="text-white/40 block text-[10px] uppercase font-inter">LONGITUDINAL G</span>
              <strong className="text-white font-orbitron">+{gForceLong} G</strong>
            </div>
            <div>
              <span className="text-white/40 block text-[10px] uppercase font-inter">WINGLET DOWNFORCE</span>
              <strong className="text-[#00F0FF] font-orbitron">{currentDownforce} KG</strong>
            </div>
          </div>

          {/* Speed Bar */}
          <div className="mt-3 space-y-1">
            <div className="w-full bg-black/60 rounded-full h-2 overflow-hidden border border-white/10">
              <div
                className="h-full bg-[#00F0FF] transition-all duration-75 glow-cyan"
                style={{ width: `${Math.min(100, (speedKmh / bike.metrics.topSpeedKmh) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] font-telemetry text-white/40">
              <span>0 KM/H</span>
              <span className="text-[#00F0FF]">V-MAX: {bike.metrics.topSpeedKmh} KM/H</span>
            </div>
          </div>
        </div>

        {/* Gauge 3: Dynamic Power & Torque Curves with Real-time Throttle Grip */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-telemetry text-white/50">
            <span className="flex items-center space-x-1.5">
              <TrendingUp className="w-4 h-4 text-[#FFB800]" />
              <span className="font-orbitron font-semibold text-white/70">DYNO POWER & TORQUE</span>
            </span>
            <span className="text-[#FFB800] font-orbitron font-bold">{currentHp} / {bike.metrics.powerHp} HP</span>
          </div>

          {/* Live Dyno Readouts */}
          <div className="my-3 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg glass border border-white/10 text-center">
              <span className="text-[10px] font-inter uppercase text-white/40 block">OUTPUT POWER</span>
              <div className="text-2xl sm:text-3xl font-orbitron font-bold text-[#FFB800] mt-0.5">
                {currentHp}
              </div>
              <span className="text-[10px] font-inter text-white/50 uppercase">BRAKE HP</span>
            </div>

            <div className="p-3 rounded-lg glass border border-white/10 text-center">
              <span className="text-[10px] font-inter uppercase text-white/40 block">CRANK TORQUE</span>
              <div className="text-2xl sm:text-3xl font-orbitron font-bold text-[#FF0055] mt-0.5">
                {currentTorque}
              </div>
              <span className="text-[10px] font-inter text-white/50 uppercase">NM @ WHEEL</span>
            </div>
          </div>

          {/* Throttle Controls & Rev Blip Action */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-orbitron font-bold text-white/70">
              <span className="flex items-center space-x-1.5">
                <Flame className="w-3.5 h-3.5 text-[#FF0055]" />
                <span>THROTTLE TWIST</span>
              </span>
              <span className="text-[#00F0FF] font-telemetry">{isHoldingThrottle ? 100 : throttle}%</span>
            </div>
            
            <input
              type="range"
              min="0"
              max="100"
              value={isHoldingThrottle ? 100 : throttle}
              onChange={(e) => handleManualThrottleChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
            />

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onMouseDown={() => setIsHoldingThrottle(true)}
                onMouseUp={() => setIsHoldingThrottle(false)}
                onTouchStart={() => setIsHoldingThrottle(true)}
                onTouchEnd={() => setIsHoldingThrottle(false)}
                className={`py-2 px-2.5 rounded-lg text-xs font-orbitron font-bold transition-all cursor-pointer border select-none ${
                  isHoldingThrottle
                    ? 'bg-[#FF0055] text-white border-[#FF0055] shadow-[0_0_15px_rgba(255,0,85,0.6)]'
                    : 'bg-white/5 hover:bg-white/10 text-white/80 border-white/10'
                }`}
                title="Hold W or ArrowUp to twist throttle"
              >
                🔥 HOLD REV [W]
              </button>

              <button
                onClick={handleRevBlip}
                className="py-2 px-2.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-orbitron font-bold transition-all cursor-pointer active:scale-95 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                title="Trigger Instant Exhaust Bark & Crackle (Space)"
              >
                ⚡ REV BLIP [SPC]
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Embedded Real-Life Exhaust Soundboard Studio & Acoustic Profile */}
      <div className="liquid-card rounded-2xl p-5 sm:p-7 border border-white/15 shadow-2xl relative overflow-hidden space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[#00F0FF]">
              <Volume2 className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-orbitron font-bold text-[#00F0FF] uppercase tracking-widest">
                  ACOUSTIC LAB // 24-BIT PCM WAVETABLES
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-orbitron font-bold">
                  STUDIO GRADE
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-orbitron font-extrabold text-white mt-0.5">
                REAL-LIFE EXHAUST RECORDINGS & DYNO SOUNDBOARD
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSoundboardModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-orbitron text-xs font-bold transition-all border border-white/20 flex items-center space-x-2 cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4 text-[#00F0FF]" />
              <span>EXPLORE ALL SUPERBIKE SOUNDS</span>
            </button>
          </div>
        </div>

        {/* Hardware Exhaust Specification Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-black/40 p-4 rounded-xl border border-white/10 text-xs font-telemetry">
          <div>
            <span className="text-white/40 block text-[10px] uppercase font-inter">EXHAUST SYSTEM</span>
            <strong className="text-[#00F0FF] font-orbitron text-sm">{acousticProfile.exhaustSystem}</strong>
          </div>
          <div>
            <span className="text-white/40 block text-[10px] uppercase font-inter">FIRING CADENCE ORDER</span>
            <strong className="text-[#FF0055] font-orbitron text-sm">{acousticProfile.firingOrder}</strong>
          </div>
          <div>
            <span className="text-white/40 block text-[10px] uppercase font-inter">DYNAMIC RESONANCES</span>
            <strong className="text-amber-400 font-orbitron text-sm">
              {acousticProfile.exhaustResonance1Hz} Hz (Header) • {acousticProfile.exhaustResonance2Hz} Hz (Canister)
            </strong>
          </div>
        </div>

        {/* 5 Real Scenario Audio Triggers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          {acousticProfile.realClips.map((clip) => {
            const isPlaying = activeRealClipId === clip.id;
            return (
              <button
                key={clip.id}
                onClick={() => handlePlayRealClip(clip.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden group ${
                  isPlaying
                    ? 'bg-[#00F0FF]/15 border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.35)]'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/25 hover:bg-white/[0.05]'
                }`}
              >
                {/* Visualizer bars inside button */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-orbitron font-bold uppercase px-2 py-0.5 rounded ${
                    isPlaying ? 'bg-[#FF0055] text-white' : 'bg-white/10 text-white/60'
                  }`}>
                    {clip.durationSec}s SAMPLE
                  </span>

                  <div className="flex items-center space-x-1 h-3">
                    {[0.4, 0.9, 0.6, 1.0, 0.5].map((h, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          height: isPlaying ? `${Math.max(3, h * 12)}px` : '3px',
                          backgroundColor: isPlaying ? '#00F0FF' : 'rgba(255,255,255,0.2)'
                        }}
                        transition={{ duration: 0.15, repeat: isPlaying ? Infinity : 0, repeatType: 'reverse' }}
                        className="w-0.5 rounded-full"
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-orbitron font-bold text-white group-hover:text-[#00F0FF] transition-colors leading-tight">
                    {clip.title}
                  </div>
                  <div className="text-[10px] font-inter text-white/50 line-clamp-2 leading-relaxed">
                    {clip.description}
                  </div>
                </div>

                <div className={`w-full py-1.5 px-2.5 rounded-lg text-[10px] font-orbitron font-bold text-center flex items-center justify-center space-x-1.5 transition-all ${
                  isPlaying
                    ? 'bg-[#FF0055] text-white shadow-md'
                    : 'bg-white/10 text-white group-hover:bg-[#00F0FF] group-hover:text-black'
                }`}>
                  {isPlaying ? (
                    <>
                      <Square className="w-3 h-3 text-white" />
                      <span>STOP</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" />
                      <span>PLAY REAL SOUND</span>
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Second Row: Lean Angle Gyroscope & Rider Aids Electronic Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Lean Angle & G-Force Gyroscope (5 Cols) */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-telemetry text-white/50 pb-3 border-b border-white/10">
            <span className="flex items-center space-x-1.5">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span className="font-orbitron font-semibold text-white/70">6-AXIS IMU GYROSCOPE</span>
            </span>
            <span className="text-emerald-400 font-orbitron font-bold">
              {Math.abs(leanAngle)}° {leanAngle > 0 ? 'RIGHT' : leanAngle < 0 ? 'LEFT' : 'UPRIGHT'}
            </span>
          </div>

          {/* Interactive Bike Visual Tilt */}
          <div className="relative h-44 my-4 flex items-center justify-center bg-black/50 rounded-lg border border-white/10 overflow-hidden">
            {/* Horizon indicator line */}
            <div className="absolute w-full h-[1px] bg-white/10"></div>
            <div className="absolute h-full w-[1px] bg-white/10"></div>

            {/* Tilt graphic */}
            <motion.div
              animate={{ rotate: leanAngle }}
              transition={{ type: 'spring', damping: 15, stiffness: 120 }}
              className="relative flex flex-col items-center"
            >
              <div className="w-20 h-28 rounded-sm bg-gradient-to-t from-[#00F0FF]/20 to-[#FF0055]/20 border border-[#00F0FF] flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                <span className="font-orbitron font-extrabold text-xs text-white">APEX</span>
              </div>
              {/* Virtual knee puck indicator */}
              {Math.abs(leanAngle) >= 50 && (
                <div className={`absolute -bottom-2 ${leanAngle > 0 ? 'right-[-12px]' : 'left-[-12px]'} px-2 py-0.5 rounded bg-[#FF0055] text-white text-[9px] font-orbitron font-bold animate-pulse shadow-[0_0_10px_rgba(255,0,85,0.5)]`}>
                  KNEE DOWN
                </div>
              )}
            </motion.div>

            {/* Lean arc ticks */}
            <div className="absolute bottom-2 text-[10px] font-telemetry text-white/40 flex justify-between w-full px-4">
              <span>-65°</span>
              <span>-45°</span>
              <span>0°</span>
              <span>+45°</span>
              <span>+65°</span>
            </div>
          </div>

          {/* Lean Angle Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-orbitron font-bold text-white/70 mb-1">
              <span>LEAN SIMULATION ANGLE</span>
              <span className="text-emerald-400 font-telemetry">{leanAngle}°</span>
            </div>
            <input
              type="range"
              min="-65"
              max="65"
              value={leanAngle}
              onChange={(e) => setLeanAngle(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>
        </div>

        {/* Electronic Rider Aids Matrix (7 Cols) */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-telemetry text-white/50 pb-3 border-b border-white/10">
            <span className="flex items-center space-x-1.5">
              <Cpu className="w-4 h-4 text-[#00F0FF]" />
              <span className="font-orbitron font-semibold text-white/70">ELECTRONIC RIDER AIDS CALIBRATION</span>
            </span>
            <span className="text-[#00F0FF] font-orbitron font-bold">{bike.electronics.imu}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
            
            {/* Traction Control */}
            <div className="p-3 rounded-lg glass border border-white/10">
              <div className="text-[10px] font-orbitron font-bold text-white/60">TRACTION (DTC)</div>
              <div className="text-lg font-orbitron font-bold text-[#00F0FF] my-1">
                LVL {activeAids.tractionControl} / 8
              </div>
              <div className="flex space-x-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveAids({ ...activeAids, tractionControl: i + 1 })}
                    className={`flex-1 h-2 rounded-xs cursor-pointer ${
                      i < activeAids.tractionControl ? 'bg-[#00F0FF]' : 'bg-white/10'
                    }`}
                  ></button>
                ))}
              </div>
            </div>

            {/* Wheelie Control */}
            <div className="p-3 rounded-lg glass border border-white/10">
              <div className="text-[10px] font-orbitron font-bold text-white/60">WHEELIE (DWC)</div>
              <div className="text-lg font-orbitron font-bold text-[#FFB800] my-1">
                LVL {activeAids.wheelieControl} / 4
              </div>
              <div className="flex space-x-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveAids({ ...activeAids, wheelieControl: i + 1 })}
                    className={`flex-1 h-2 rounded-xs cursor-pointer ${
                      i < activeAids.wheelieControl ? 'bg-[#FFB800]' : 'bg-white/10'
                    }`}
                  ></button>
                ))}
              </div>
            </div>

            {/* Engine Brake */}
            <div className="p-3 rounded-lg glass border border-white/10">
              <div className="text-[10px] font-orbitron font-bold text-white/60">ENGINE BRAKE (EBC)</div>
              <div className="text-lg font-orbitron font-bold text-[#FF0055] my-1">
                LVL {activeAids.engineBrake} / 3
              </div>
              <div className="flex space-x-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveAids({ ...activeAids, engineBrake: i + 1 })}
                    className={`flex-1 h-2 rounded-xs cursor-pointer ${
                      i < activeAids.engineBrake ? 'bg-[#FF0055]' : 'bg-white/10'
                    }`}
                  ></button>
                ))}
              </div>
            </div>

            {/* Slide Control */}
            <div className="p-3 rounded-lg glass border border-white/10">
              <div className="text-[10px] font-orbitron font-bold text-white/60">SLIDE CONTROL (DSC)</div>
              <div className="text-lg font-orbitron font-bold text-emerald-400 my-1">
                LVL {activeAids.slideControl} / 3
              </div>
              <div className="flex space-x-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveAids({ ...activeAids, slideControl: i + 1 })}
                    className={`flex-1 h-2 rounded-xs cursor-pointer ${
                      i < activeAids.slideControl ? 'bg-emerald-400' : 'bg-white/10'
                    }`}
                  ></button>
                ))}
              </div>
            </div>

          </div>

          {/* Toggle Switches for Quickshifter, Launch Control, Pit Limiter */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs font-telemetry">
            <button
              onClick={() => setActiveAids({ ...activeAids, quickshifter: !activeAids.quickshifter })}
              className={`px-3 py-1.5 rounded-sm border font-orbitron text-xs font-bold transition-all cursor-pointer ${
                activeAids.quickshifter ? 'bg-[#00F0FF]/20 border-[#00F0FF] text-[#00F0FF]' : 'glass border-white/10 text-white/40'
              }`}
            >
              QUICKSHIFTER AUTO-BLIP: {activeAids.quickshifter ? 'ON' : 'OFF'}
            </button>

            <button
              onClick={() => setActiveAids({ ...activeAids, launchControl: !activeAids.launchControl })}
              className={`px-3 py-1.5 rounded-sm border font-orbitron text-xs font-bold transition-all cursor-pointer ${
                activeAids.launchControl ? 'bg-[#FF0055]/20 border-[#FF0055] text-[#FF0055]' : 'glass border-white/10 text-white/40'
              }`}
            >
              LAUNCH CONTROL: {activeAids.launchControl ? 'ARMED' : 'STANDBY'}
            </button>

            <button
              onClick={() => setActiveAids({ ...activeAids, pitLaneLimiter: !activeAids.pitLaneLimiter })}
              className={`px-3 py-1.5 rounded-sm border font-orbitron text-xs font-bold transition-all cursor-pointer ${
                activeAids.pitLaneLimiter ? 'bg-[#FFB800]/20 border-[#FFB800] text-[#FFB800]' : 'glass border-white/10 text-white/40'
              }`}
            >
              PIT LIMITER (60 KM/H): {activeAids.pitLaneLimiter ? 'ACTIVE' : 'OFF'}
            </button>
          </div>
        </div>

      </div>

      {/* Row 3: Technical Heritage, Racing Lineage & WSBK Engineering Dossier */}
      <div className="liquid-card rounded-2xl p-6 border border-white/10 shadow-2xl relative overflow-hidden space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-[#00F0FF]" />
            <span className="font-orbitron font-bold text-sm uppercase tracking-wider text-white">
              {bike.name} // TECHNICAL HERITAGE & HOMOLOGATION DOSSIER
            </span>
          </div>
          <div className="flex items-center space-x-2 text-[11px] font-telemetry">
            <span className="text-white/40">CATEGORY:</span>
            <span className="px-2.5 py-0.5 rounded bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[#00F0FF] font-bold font-orbitron">
              {bike.category}
            </span>
            <span className="px-2.5 py-0.5 rounded bg-[#FF0055]/15 border border-[#FF0055]/30 text-[#FF0055] font-bold font-orbitron">
              {bike.originCountry.toUpperCase()} HOMOLOGATION
            </span>
          </div>
        </div>

        {/* Overview & Engineering Philosophy */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10">
              <h4 className="text-xs font-orbitron font-bold text-[#00F0FF] uppercase tracking-wider mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Engineering Overview & Track Origin
              </h4>
              <p className="text-sm font-inter text-white/80 leading-relaxed">
                {bike.overview}
              </p>
            </div>

            {/* Key Innovations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {bike.keyFeatures.map((feat, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-white/[0.02] border border-white/5 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#00FF88] mt-0.5 flex-shrink-0" />
                  <span className="text-xs font-inter text-white/90">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lineage & Racing Pedigree Sidebar */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
              <div className="text-[11px] font-orbitron font-bold text-[#FFB800] uppercase flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                Factory Racing Credentials
              </div>
              <div className="space-y-2 text-xs font-telemetry">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-white/40">Power Output:</span>
                  <span className="text-white font-bold">{bike.metrics.powerHp} HP @ {bike.metrics.rpmRedline} RPM</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-white/40">Torque:</span>
                  <span className="text-white font-bold">{bike.metrics.torqueNm} Nm</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-white/40">Dry Weight:</span>
                  <span className="text-white font-bold">{bike.metrics.dryWeightKg} kg</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-white/40">Power-to-Weight:</span>
                  <span className="text-[#00F0FF] font-bold">{(bike.metrics.powerHp / (bike.metrics.dryWeightKg || 180)).toFixed(3)} HP/kg</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-white/40">Aero Downforce:</span>
                  <span className="text-[#FF0055] font-bold">{bike.metrics.downforceAt300KmhKg} kg @ 300 km/h</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <div className="text-[11px] font-orbitron font-bold text-[#00F0FF] uppercase mb-1">
                Manufacturer Lineage
              </div>
              <p className="text-xs font-inter text-white/60">
                Crafted in {bike.originCountry} with precision WSBK and MotoGP derived telemetry and chassis geometry.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Full Real Exhaust Soundboard Modal */}
      <RealSoundboardModal
        isOpen={isSoundboardModalOpen}
        onClose={() => setIsSoundboardModalOpen(false)}
        initialBike={bike}
      />

    </div>
  );
};
