import React, { useState } from 'react';
import { 
  GitCompare, 
  X, 
  Zap, 
  Gauge, 
  Weight, 
  Flame, 
  Wind, 
  DollarSign, 
  Check, 
  Trophy,
  ArrowRight,
  ShieldCheck,
  Cpu,
  History,
  BookOpen
} from 'lucide-react';
import { Superbike } from '../types';

interface SpecComparatorProps {
  allBikes: Superbike[];
  comparisonBikes: Superbike[];
  onRemoveBike: (bikeId: string) => void;
  onAddBike: (bike: Superbike) => void;
  onClose?: () => void;
}

export const SpecComparator: React.FC<SpecComparatorProps> = ({
  allBikes,
  comparisonBikes,
  onRemoveBike,
  onAddBike,
  onClose,
}) => {
  const safeAllBikes = Array.isArray(allBikes) && allBikes.length > 0 ? allBikes : [];
  const validComparisonBikes = (comparisonBikes || []).filter((b): b is Superbike => Boolean(b && b.id && b.metrics));
  
  const bike1 = validComparisonBikes[0] || safeAllBikes[0];
  const bike2 = validComparisonBikes[1] || safeAllBikes[1] || safeAllBikes[0];
  const bike3 = validComparisonBikes[2] || null;

  const activeBikes = [bike1, bike2, bike3].filter((b): b is Superbike => Boolean(b && b.id && b.metrics));

  // Helper to determine winner for a numeric metric
  const getWinner = (metricKey: keyof Superbike['metrics'], isLowerBetter = false) => {
    let bestVal = isLowerBetter ? Infinity : -Infinity;
    let winnerId = '';

    activeBikes.forEach((b) => {
      if (!b || !b.metrics) return;
      const val = b.metrics[metricKey] as number;
      if (typeof val === 'number') {
        if (isLowerBetter ? val < bestVal : val > bestVal) {
          bestVal = val;
          winnerId = b.id;
        }
      }
    });
    return winnerId;
  };

  const hpWinner = getWinner('powerHp');
  const speedWinner = getWinner('topSpeedKmh');
  const accelWinner = getWinner('acceleration0to100', true);
  const weightWinner = getWinner('dryWeightKg', true);
  const ptwWinner = getWinner('powerToWeight');
  const redlineWinner = getWinner('rpmRedline');
  const downforceWinner = getWinner('downforceAt300KmhKg');

  return (
    <div className="w-full space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl liquid-card border border-white/10">
        <div>
          <div className="flex items-center space-x-2">
            <GitCompare className="w-5 h-5 text-[#00F0FF]" />
            <h2 className="text-xl sm:text-2xl font-orbitron font-extrabold text-white">
              SIDE-BY-SIDE SPEC COMPARATOR MATRIX
            </h2>
          </div>
          <p className="text-xs font-inter text-white/50 mt-1">
            Real-time telemetry delta analysis, engineering advantages & brand provenance
          </p>
        </div>

        {/* Add more bikes to compare dropdown */}
        <div className="flex items-center space-x-3">
          <select
            onChange={(e) => {
              const selected = allBikes.find((b) => b.id === e.target.value);
              if (selected && !activeBikes.some((b) => b.id === selected.id)) {
                onAddBike(selected);
              }
            }}
            value=""
            className="px-3 py-2 rounded-xl liquid-glass border border-white/15 text-xs font-orbitron font-bold text-white focus:outline-none focus:border-[#00F0FF] cursor-pointer"
          >
            <option value="" disabled className="bg-[#0B0F19] text-white">+ Add Superbike to Matrix</option>
            {allBikes.map((b) => (
              <option key={b.id} value={b.id} disabled={activeBikes.some((ab) => ab.id === b.id)} className="bg-[#0B0F19] text-white">
                {b.name} ({b.metrics.powerHp} HP)
              </option>
            ))}
          </select>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl liquid-glass hover:bg-white/10 text-white/50 hover:text-white cursor-pointer border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Comparison Bike Card Headers */}
      <div className={`grid grid-cols-1 md:grid-cols-${activeBikes.length} gap-6`}>
        {activeBikes.map((bike, idx) => (
          <div
            key={bike.id}
            className="liquid-card rounded-2xl p-5 sm:p-6 border relative overflow-hidden flex flex-col justify-between"
            style={{ borderColor: `${bike.accentColor}40` }}
          >
            {/* Remove button if more than 2 */}
            {activeBikes.length > 2 && (
              <button
                onClick={() => onRemoveBike(bike.id)}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-[#FF0055]/20 hover:bg-[#FF0055]/40 text-[#FF0055] text-xs cursor-pointer border border-[#FF0055]/30"
                title="Remove from comparison"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: bike.accentColor }}></span>
                <span className="text-[11px] font-orbitron font-bold text-white/50 uppercase tracking-widest">
                  SLOT {idx + 1} // {bike.manufacturer}
                </span>
              </div>
              <h3 className="text-xl font-orbitron font-extrabold text-white mt-1">{bike.shortName}</h3>
              <p className="text-xs font-inter text-[#00F0FF]">{bike.tagline}</p>

              {/* Mini Image */}
              <div className="w-full h-36 rounded-xl overflow-hidden bg-black mt-4 relative border border-white/10">
                <img
                  src={bike.heroImage}
                  alt={bike.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-lg bg-black/80 text-[10px] font-telemetry text-white/80 border border-white/10">
                  {bike.displacementCc}cc {bike.engineCylinders}
                </div>
              </div>
            </div>

            {/* Pricing & Origin Provenance */}
            <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-inter text-white/50 block">INDIA EX-SHOWROOM:</span>
                <span className="text-sm font-orbitron font-bold text-amber-400">
                  {bike.priceInrLakh > 0 ? `₹${bike.priceInrLakh.toFixed(2)} Lakh` : 'On Request'}
                </span>
                <span className="text-[9px] text-white/40 block font-inter">${bike.priceUsd.toLocaleString()} Global MSRP</span>
              </div>
              <div className="px-2.5 py-1 rounded-lg liquid-glass border border-white/15 text-[10px] font-orbitron font-bold text-[#00F0FF] flex items-center space-x-1">
                <span>{bike.originCountry}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Metric Comparison Matrix Table */}
      <div className="liquid-card rounded-2xl p-6 border border-white/10 overflow-x-auto shadow-2xl">
        <h3 className="text-sm font-orbitron font-bold text-[#00F0FF] tracking-wider mb-4 flex items-center space-x-2">
          <Trophy className="w-4 h-4 text-[#FFB800]" />
          <span>HEAD-TO-HEAD TELEMETRY BENCHMARKS</span>
        </h3>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[11px] font-orbitron text-white/50">
              <th className="py-3 px-4">METRIC</th>
              {activeBikes.map((bike) => (
                <th key={bike.id} className="py-3 px-4 font-bold text-white">
                  {bike.shortName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-sm font-inter">
            
            {/* Peak Horsepower */}
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="py-3.5 px-4 font-semibold text-white/80 flex items-center space-x-2 font-orbitron text-xs">
                <Zap className="w-4 h-4 text-[#FFB800]" />
                <span>Peak Horsepower</span>
              </td>
              {activeBikes.map((bike) => {
                const isWin = bike.id === hpWinner;
                return (
                  <td key={bike.id} className="py-3.5 px-4">
                    <span className={`font-orbitron font-bold text-base ${isWin ? 'text-[#FFB800]' : 'text-white'}`}>
                      {bike.metrics.powerHp} HP
                    </span>
                    {isWin && (
                      <span className="ml-2 px-1.5 py-0.5 rounded-xs bg-[#FFB800]/20 border border-[#FFB800]/40 text-[10px] font-orbitron font-bold text-[#FFB800]">
                        LEADER
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Top Speed */}
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="py-3.5 px-4 font-semibold text-white/80 flex items-center space-x-2 font-orbitron text-xs">
                <Gauge className="w-4 h-4 text-[#00F0FF]" />
                <span>Top Speed (V-Max)</span>
              </td>
              {activeBikes.map((bike) => {
                const isWin = bike.id === speedWinner;
                return (
                  <td key={bike.id} className="py-3.5 px-4">
                    <span className={`font-orbitron font-bold text-base ${isWin ? 'text-[#00F0FF]' : 'text-white'}`}>
                      {bike.metrics.topSpeedKmh} KM/H
                    </span>
                    {isWin && (
                      <span className="ml-2 px-1.5 py-0.5 rounded-xs bg-[#00F0FF]/20 border border-[#00F0FF]/40 text-[10px] font-orbitron font-bold text-[#00F0FF]">
                        FASTEST
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* 0-100 KM/H Acceleration */}
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="py-3.5 px-4 font-semibold text-white/80 flex items-center space-x-2 font-orbitron text-xs">
                <Flame className="w-4 h-4 text-[#FF0055]" />
                <span>0-100 KM/H Acceleration</span>
              </td>
              {activeBikes.map((bike) => {
                const isWin = bike.id === accelWinner;
                return (
                  <td key={bike.id} className="py-3.5 px-4">
                    <span className={`font-orbitron font-bold text-base ${isWin ? 'text-[#FF0055]' : 'text-white'}`}>
                      {bike.metrics.acceleration0to100}s
                    </span>
                    {isWin && (
                      <span className="ml-2 px-1.5 py-0.5 rounded-xs bg-[#FF0055]/20 border border-[#FF0055]/40 text-[10px] font-orbitron font-bold text-[#FF0055]">
                        QUICKEST
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Dry Weight */}
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="py-3.5 px-4 font-semibold text-white/80 flex items-center space-x-2 font-orbitron text-xs">
                <Weight className="w-4 h-4 text-emerald-400" />
                <span>Dry Weight</span>
              </td>
              {activeBikes.map((bike) => {
                const isWin = bike.id === weightWinner;
                return (
                  <td key={bike.id} className="py-3.5 px-4">
                    <span className={`font-orbitron font-bold text-base ${isWin ? 'text-emerald-400' : 'text-white'}`}>
                      {bike.metrics.dryWeightKg} KG
                    </span>
                    {isWin && (
                      <span className="ml-2 px-1.5 py-0.5 rounded-xs bg-emerald-400/20 border border-emerald-400/40 text-[10px] font-orbitron font-bold text-emerald-400">
                        LIGHTEST
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Power to Weight Ratio */}
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="py-3.5 px-4 font-semibold text-white/80 flex items-center space-x-2 font-orbitron text-xs">
                <Trophy className="w-4 h-4 text-[#FFB800]" />
                <span>Power-to-Weight Ratio</span>
              </td>
              {activeBikes.map((bike) => {
                const isWin = bike.id === ptwWinner;
                return (
                  <td key={bike.id} className="py-3.5 px-4">
                    <span className={`font-orbitron font-bold text-base ${isWin ? 'text-[#FFB800]' : 'text-white'}`}>
                      {bike.metrics.powerToWeight} HP/KG
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Redline RPM */}
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="py-3.5 px-4 font-semibold text-white/80 flex items-center space-x-2 font-orbitron text-xs">
                <Zap className="w-4 h-4 text-[#00F0FF]" />
                <span>Maximum RPM Redline</span>
              </td>
              {activeBikes.map((bike) => {
                const isWin = bike.id === redlineWinner;
                return (
                  <td key={bike.id} className="py-3.5 px-4">
                    <span className={`font-orbitron font-bold text-base ${isWin ? 'text-[#00F0FF]' : 'text-white'}`}>
                      {bike.metrics.rpmRedline.toLocaleString()} RPM
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Aerodynamic Downforce */}
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="py-3.5 px-4 font-semibold text-white/80 flex items-center space-x-2 font-orbitron text-xs">
                <Wind className="w-4 h-4 text-blue-400" />
                <span>Aero Downforce @ 300 KM/H</span>
              </td>
              {activeBikes.map((bike) => {
                const isWin = bike.id === downforceWinner;
                return (
                  <td key={bike.id} className="py-3.5 px-4">
                    <span className={`font-orbitron font-bold text-base ${isWin ? 'text-blue-400' : 'text-white'}`}>
                      {bike.metrics.downforceAt300KmhKg} KG
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Front Suspension & Brakes */}
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="py-3.5 px-4 font-semibold text-white/80 flex items-center space-x-2 font-orbitron text-xs">
                <ShieldCheck className="w-4 h-4 text-white/50" />
                <span>Chassis Hardware</span>
              </td>
              {activeBikes.map((bike) => (
                <td key={bike.id} className="py-3.5 px-4 text-xs text-white/80 leading-relaxed">
                  <div className="font-semibold text-white">{bike.chassis.frontSuspension}</div>
                  <div className="text-white/50 mt-0.5">{bike.chassis.frontBrakes}</div>
                </td>
              ))}
            </tr>

            {/* Electronics Suite */}
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="py-3.5 px-4 font-semibold text-white/80 flex items-center space-x-2 font-orbitron text-xs">
                <Cpu className="w-4 h-4 text-white/50" />
                <span>Inertial Platform & Suite</span>
              </td>
              {activeBikes.map((bike) => (
                <td key={bike.id} className="py-3.5 px-4 text-xs text-white/80">
                  <div className="font-semibold text-[#00F0FF]">{bike.electronics.imu}</div>
                  <div className="text-[11px] text-white/50 mt-0.5">{bike.electronics.modes.join(', ')}</div>
                </td>
              ))}
            </tr>

          </tbody>
        </table>
      </div>

    </div>
  );
};
