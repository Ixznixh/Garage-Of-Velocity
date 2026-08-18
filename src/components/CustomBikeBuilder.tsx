import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Wrench, 
  Zap, 
  Weight, 
  Gauge, 
  Flame, 
  Save, 
  Sparkles, 
  Check, 
  Layers, 
  ShieldCheck,
  Award
} from 'lucide-react';
import { Superbike, CustomBuild, UserProfile } from '../types';

interface CustomBikeBuilderProps {
  allBikes: Superbike[];
  userProfile: UserProfile;
  onSaveCustomBuild: (build: CustomBuild) => void;
}

export const CustomBikeBuilder: React.FC<CustomBikeBuilderProps> = ({
  allBikes,
  userProfile,
  onSaveCustomBuild,
}) => {
  const safeAllBikes = Array.isArray(allBikes) && allBikes.length > 0 ? allBikes : [];
  const [selectedBaseBikeId, setSelectedBaseBikeId] = useState<string>(() => safeAllBikes[0]?.id || '');
  const selectedBaseBike = safeAllBikes.find((b) => b.id === selectedBaseBikeId) || safeAllBikes[0];
  const [buildName, setBuildName] = useState<string>('Apex Track Prototype V1');
  const [selectedLivery, setSelectedLivery] = useState<string>('Carbon Stealth Matte');

  // Exhaust options
  const exhaustOptions = [
    { name: 'Stock OEM Titanium / Cat Silencer', hpGain: 0, weightSavingKg: 0, price: 0 },
    { name: 'Akrapovič Full Titanium WSBK Race Exhaust', hpGain: 14, weightSavingKg: 6.8, price: 4200 },
    { name: 'SC-Project MotoGP CRT Dual Megaphone', hpGain: 18, weightSavingKg: 7.5, price: 4600 },
    { name: 'Termignoni 4-Exit Titanium Racing System', hpGain: 16, weightSavingKg: 7.0, price: 4400 },
  ];
  const [selectedExhaust, setSelectedExhaust] = useState(exhaustOptions[1]);

  // Wheel options
  const wheelOptions = [
    { name: 'Stock Forged Alloy Wheels', weightSavingKg: 0, price: 0 },
    { name: 'BST Carbon Fiber Ultra-Light High-Modulus', weightSavingKg: 3.8, price: 4100 },
    { name: 'OZ Racing Cattiva Magnesium Wheels', weightSavingKg: 3.2, price: 3800 },
    { name: 'Rotobox Boost Convex Carbon Wheels', weightSavingKg: 4.2, price: 4500 },
  ];
  const [selectedWheel, setSelectedWheel] = useState(wheelOptions[1]);

  // Brake options
  const brakeOptions = [
    { name: 'Stock Brembo Stylema Radial Calipers', stoppingPowerGainPct: 0, price: 0 },
    { name: 'Brembo GP4-RR Monobloc Billet Titanium Pistons', stoppingPowerGainPct: 18, price: 3400 },
    { name: 'Nissin WSBK Billet Racing Calipers', stoppingPowerGainPct: 15, price: 2900 },
  ];
  const [selectedBrake, setSelectedBrake] = useState(brakeOptions[1]);

  // ECU Tune options
  const ecuOptions = [
    { name: 'Factory Homologation Map', hpGain: 0, revLimitIncrease: 0, price: 0 },
    { name: 'Stage 1 Factory Race Flash (Fuel & Ignition Remap)', hpGain: 8, revLimitIncrease: 300, price: 1200 },
    { name: 'Stage 2 WorldSBK Telemetry Custom Map & Quickshifter Cal', hpGain: 15, revLimitIncrease: 600, price: 2500 },
  ];
  const [selectedEcu, setSelectedEcu] = useState(ecuOptions[2]);

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!selectedBaseBike || !selectedBaseBike.id) {
    return null;
  }

  // Dynamic calculations
  const totalHpGain = selectedExhaust.hpGain + selectedEcu.hpGain;
  const calculatedHp = (selectedBaseBike.metrics?.powerHp || 200) + totalHpGain;
  const totalWeightSaving = parseFloat((selectedExhaust.weightSavingKg + selectedWheel.weightSavingKg).toFixed(1));
  const calculatedWeight = Math.round((selectedBaseBike.metrics?.dryWeightKg || 180) - totalWeightSaving);
  const calculatedPowerToWeight = parseFloat((calculatedHp / calculatedWeight).toFixed(3));
  const calculatedTopSpeed = (selectedBaseBike.metrics?.topSpeedKmh || 300) + (totalHpGain > 20 ? 8 : totalHpGain > 10 ? 5 : 0);
  const calculated0to100 = parseFloat((Math.max(2.1, (selectedBaseBike.metrics?.acceleration0to100 || 3.0) - (totalHpGain * 0.015) - (totalWeightSaving * 0.01))).toFixed(2));
  const totalModPrice = selectedExhaust.price + selectedWheel.price + selectedBrake.price + selectedEcu.price;

  const handleSave = () => {
    const newBuild: CustomBuild = {
      id: `build-${Date.now()}`,
      baseBikeId: selectedBaseBike.id,
      buildName: buildName || `${selectedBaseBike.shortName} Custom Spec`,
      livery: selectedLivery,
      exhaust: {
        name: selectedExhaust.name,
        hpGain: selectedExhaust.hpGain,
        weightSavingKg: selectedExhaust.weightSavingKg,
      },
      wheels: {
        name: selectedWheel.name,
        weightSavingKg: selectedWheel.weightSavingKg,
      },
      brakes: {
        name: selectedBrake.name,
        stoppingPowerGainPct: selectedBrake.stoppingPowerGainPct,
      },
      ecuTune: {
        name: selectedEcu.name,
        hpGain: selectedEcu.hpGain,
        revLimitIncrease: selectedEcu.revLimitIncrease,
      },
      createdAt: new Date().toLocaleDateString(),
    };

    onSaveCustomBuild(newBuild);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Top Banner */}
      <div className="p-5 sm:p-6 rounded-2xl liquid-card border border-white/10 flex flex-wrap items-center justify-between gap-4 shadow-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-[#00F0FF]" />
            <h2 className="text-xl sm:text-2xl font-orbitron font-extrabold text-white">
              APEX CUSTOM LAB & WSBK WORKSHOP
            </h2>
          </div>
          <p className="text-xs font-inter text-white/50 mt-1">
            Configure bespoke racing upgrades with real-time dynamic telemetry recalculation
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#00F0FF] text-black font-orbitron font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:bg-white cursor-pointer"
          >
            {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'SAVED TO MY GARAGE!' : 'SAVE CUSTOM BUILD'}</span>
          </button>
        </div>
      </div>

      {/* Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Build Configuration Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Base Bike & Build Name */}
          <div className="liquid-card rounded-2xl p-5 sm:p-6 border border-white/10 space-y-4">
            <div className="text-xs font-orbitron font-bold text-[#00F0FF]">
              1. SELECT BASE PLATFORM & PROTOTYPE NAME
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-inter text-white/50 block mb-1">Base Superbike</label>
                <select
                  value={selectedBaseBike.id}
                  onChange={(e) => {
                    const bike = safeAllBikes.find((b) => b.id === e.target.value);
                    if (bike) setSelectedBaseBikeId(bike.id);
                  }}
                  className="w-full px-3 py-2 rounded-xl liquid-glass border border-white/15 text-xs font-orbitron font-bold text-white focus:outline-none focus:border-[#00F0FF] cursor-pointer"
                >
                  {safeAllBikes.map((b) => (
                    <option key={b.id} value={b.id} className="bg-[#0B0F19] text-white">
                      {b.name} ({b.metrics?.powerHp || 200} HP OEM)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-inter text-white/50 block mb-1">Prototype Build Name</label>
                <input
                  type="text"
                  value={buildName}
                  onChange={(e) => setBuildName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl liquid-glass border border-white/15 text-xs font-inter text-white focus:outline-none focus:border-[#00F0FF] placeholder:text-white/30"
                  placeholder="e.g. V4 R Corse Speciale"
                />
              </div>
            </div>
          </div>

          {/* Titanium Exhaust Upgrade */}
          <div className="liquid-card rounded-2xl p-5 sm:p-6 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-orbitron font-bold text-[#FFB800]">2. TITANIUM RACING EXHAUST SYSTEM</span>
              <span className="text-xs font-telemetry text-emerald-400">+{selectedExhaust.hpGain} HP / -{selectedExhaust.weightSavingKg} KG</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {exhaustOptions.map((opt) => (
                <button
                  key={opt.name}
                  onClick={() => setSelectedExhaust(opt)}
                  className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                    selectedExhaust.name === opt.name
                      ? 'bg-[#FFB800]/15 border-[#FFB800] text-white shadow-[0_0_15px_rgba(255,184,0,0.2)]'
                      : 'liquid-glass border-white/10 text-white/50 hover:text-white hover:border-white/20'
                  }`}
                >
                  <div className="text-xs font-orbitron font-bold text-white">{opt.name}</div>
                  <div className="text-[11px] font-telemetry text-[#FFB800] mt-1">
                    {opt.hpGain > 0 ? `+${opt.hpGain} HP | -${opt.weightSavingKg} kg` : 'Standard Stock Output'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Carbon Fiber Wheel Upgrade */}
          <div className="liquid-card rounded-2xl p-5 sm:p-6 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-orbitron font-bold text-[#00F0FF]">3. ULTRA-LIGHTWEIGHT WHEELSET</span>
              <span className="text-xs font-telemetry text-emerald-400">-{selectedWheel.weightSavingKg} KG UNSPRUNG WEIGHT</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {wheelOptions.map((opt) => (
                <button
                  key={opt.name}
                  onClick={() => setSelectedWheel(opt)}
                  className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                    selectedWheel.name === opt.name
                      ? 'bg-[#00F0FF]/15 border-[#00F0FF] text-white shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                      : 'liquid-glass border-white/10 text-white/50 hover:text-white hover:border-white/20'
                  }`}
                >
                  <div className="text-xs font-orbitron font-bold text-white">{opt.name}</div>
                  <div className="text-[11px] font-telemetry text-[#00F0FF] mt-1">
                    {opt.weightSavingKg > 0 ? `-${opt.weightSavingKg} kg rotational mass` : 'Factory Stock Wheels'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ECU Racing Remap */}
          <div className="liquid-card rounded-2xl p-5 sm:p-6 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-orbitron font-bold text-[#FF0055]">4. ECU RACING TELEMETRY FLASH</span>
              <span className="text-xs font-telemetry text-[#FF0055]">+{selectedEcu.hpGain} HP / +{selectedEcu.revLimitIncrease} RPM</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {ecuOptions.map((opt) => (
                <button
                  key={opt.name}
                  onClick={() => setSelectedEcu(opt)}
                  className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                    selectedEcu.name === opt.name
                      ? 'bg-[#FF0055]/15 border-[#FF0055] text-white shadow-[0_0_15px_rgba(255,0,85,0.2)]'
                      : 'liquid-glass border-white/10 text-white/50 hover:text-white hover:border-white/20'
                  }`}
                >
                  <div className="text-xs font-orbitron font-bold text-white">{opt.name}</div>
                  <div className="text-[11px] font-telemetry text-[#FF0055] mt-1">
                    {opt.hpGain > 0 ? `+${opt.hpGain} HP ignition advance, +${opt.revLimitIncrease} RPM redline shift` : 'Standard Factory Calibration'}
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Live Dynamic Telemetry Recalculation Cockpit (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          <div className="liquid-card rounded-2xl p-6 border border-white/10 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-orbitron text-[#00F0FF] uppercase tracking-wider font-bold">CALCULATED SPECIFICATIONS</span>
                <h3 className="text-xl font-orbitron font-extrabold text-white">{buildName}</h3>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-400/20 border border-emerald-400/40 text-xs font-orbitron font-bold text-emerald-400">
                STAGE 2 TRACK SPEC
              </span>
            </div>

            {/* Recalculated 4-Quadrant High Output Grid */}
            <div className="grid grid-cols-2 gap-3">
              
              {/* Recalculated Horsepower */}
              <div className="p-4 rounded-xl liquid-glass border border-white/10 text-center">
                <span className="text-[10px] font-inter uppercase text-white/40 block">TOTAL HORSEPOWER</span>
                <div className="text-3xl font-orbitron font-extrabold text-[#FFB800] mt-1">
                  {calculatedHp} <span className="text-xs text-white/40">HP</span>
                </div>
                <span className="text-[10px] font-telemetry text-emerald-400 block mt-0.5 font-bold">
                  (+{totalHpGain} HP GAIN)
                </span>
              </div>

              {/* Recalculated Dry Weight */}
              <div className="p-4 rounded-xl liquid-glass border border-white/10 text-center">
                <span className="text-[10px] font-inter uppercase text-white/40 block">DRY WEIGHT</span>
                <div className="text-3xl font-orbitron font-extrabold text-emerald-400 mt-1">
                  {calculatedWeight} <span className="text-xs text-white/40">KG</span>
                </div>
                <span className="text-[10px] font-telemetry text-[#00F0FF] block mt-0.5 font-bold">
                  (-{totalWeightSaving} KG REDUCED)
                </span>
              </div>

              {/* Recalculated Power-to-Weight */}
              <div className="p-4 rounded-xl liquid-glass border border-white/10 text-center">
                <span className="text-[10px] font-inter uppercase text-white/40 block">POWER-TO-WEIGHT</span>
                <div className="text-3xl font-orbitron font-extrabold text-[#00F0FF] mt-1">
                  {calculatedPowerToWeight}
                </div>
                <span className="text-[10px] font-inter text-white/40 block mt-0.5">
                  HP / KG RATIO
                </span>
              </div>

              {/* Recalculated 0-100 */}
              <div className="p-4 rounded-xl liquid-glass border border-white/10 text-center">
                <span className="text-[10px] font-inter uppercase text-white/40 block">0-100 SPRINT</span>
                <div className="text-3xl font-orbitron font-extrabold text-[#FF0055] mt-1">
                  {calculated0to100}s
                </div>
                <span className="text-[10px] font-telemetry text-white/50 block mt-0.5">
                  V-MAX: {calculatedTopSpeed} KM/H
                </span>
              </div>

            </div>

            {/* Total Build Investment Estimate */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs font-telemetry">
              <div className="flex justify-between text-white/50">
                <span>BASE BIKE MSRP:</span>
                <span className="text-white font-orbitron">${selectedBaseBike.priceUsd.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-white/50">
                <span>RACING UPGRADES PACKAGE:</span>
                <span className="text-[#00F0FF] font-orbitron">+${totalModPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10 text-sm font-bold text-white font-orbitron">
                <span>ESTIMATED TOTAL BUILD:</span>
                <span className="text-[#FFB800]">${(selectedBaseBike.priceUsd + totalModPrice).toLocaleString()}</span>
              </div>
            </div>

            {/* Save to Garage Callout */}
            <button
              onClick={handleSave}
              className="w-full py-3.5 rounded-xl bg-[#00F0FF] hover:bg-white text-black font-orbitron font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(0,240,255,0.35)] cursor-pointer flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>COMMIT BUILD TO GARAGE</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
