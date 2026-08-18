import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Gauge, 
  Flame, 
  Weight, 
  GitCompare, 
  Heart, 
  Eye, 
  Search,
  BookOpen,
  IndianRupee,
  Layers,
  Sparkles,
  X
} from 'lucide-react';
import { Superbike } from '../types';
import { filterSuperbikes, SHORT_FORM_DICTIONARY } from '../utils/bikeMatcher';

interface SuperbikeGridProps {
  bikes: Superbike[];
  selectedBike?: Superbike;
  onSelectBike: (bike: Superbike) => void;
  onOpenDetails: (bike: Superbike) => void;
  onToggleCompare: (bike: Superbike) => void;
  isCompared: (bikeId: string) => boolean;
  onToggleFavorite: (bikeId: string) => void;
  isFavorite: (bikeId: string) => boolean;
  onLaunchTelemetry: (bike: Superbike) => void;
  selectedManufacturer: string;
  setSelectedManufacturer: (mfg: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const SuperbikeGrid: React.FC<SuperbikeGridProps> = ({
  bikes,
  selectedBike,
  onSelectBike,
  onOpenDetails,
  onToggleCompare,
  isCompared,
  onToggleFavorite,
  isFavorite,
  onLaunchTelemetry,
  selectedManufacturer,
  setSelectedManufacturer,
  searchQuery,
  setSearchQuery,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const manufacturers = [
    'All',
    'Kawasaki',
    'Ducati',
    'BMW',
    'Suzuki',
    'Yamaha',
    'Aprilia',
    'Honda',
    'Triumph',
    'KTM',
    'MV Agusta',
    'Harley-Davidson',
    'Royal Enfield'
  ];

  const categories = [
    'All',
    'WSBK Homologation',
    'MotoGP-Derived',
    'Hypernaked',
    'Supersport',
    'Power Cruiser',
    'Neo-Retro',
    'Adventure'
  ];

  const filteredBikes = React.useMemo(() => {
    // If there is an active search query, search across ALL bikes so manufacturer filter doesn't block cross-brand queries
    if (searchQuery.trim()) {
      const searched = filterSuperbikes(searchQuery, bikes);
      if (selectedCategory !== 'All') {
        return searched.filter((b) => b.category.toLowerCase().includes(selectedCategory.toLowerCase()));
      }
      return searched;
    }

    let list = bikes;
    
    // Apply manufacturer filter when not searching
    if (selectedManufacturer !== 'All') {
      list = list.filter((b) => b.manufacturer.toLowerCase() === selectedManufacturer.toLowerCase());
    }

    // Apply category filter
    if (selectedCategory !== 'All') {
      list = list.filter((b) => b.category.toLowerCase().includes(selectedCategory.toLowerCase()));
    }

    return list;
  }, [bikes, selectedManufacturer, selectedCategory, searchQuery]);

  // When filteredBikes changes from a search query, auto-select the top result
  React.useEffect(() => {
    if (searchQuery.trim().length >= 1 && filteredBikes.length > 0) {
      if (selectedBike?.id !== filteredBikes[0].id) {
        onSelectBike(filteredBikes[0]);
      }
    }
  }, [searchQuery, filteredBikes, selectedBike?.id, onSelectBike]);

  const quickAliases = [
    { label: 'Busa', query: 'busa' },
    { label: 'S1K / S1000RR', query: 's1k' },
    { label: 'V4 R', query: 'v4r' },
    { label: 'Ninja H2R', query: 'h2r' },
    { label: 'Fireblade', query: 'fireblade' },
    { label: '10R', query: '10r' },
    { label: 'R1M', query: 'r1m' },
    { label: 'Super Duke 1390', query: '1390' },
    { label: 'RSV4 Factory', query: 'rsv4' },
    { label: 'Rocket 3', query: 'rocket' },
    { label: 'F4 RR', query: 'f4' },
  ];

  return (
    <div className="w-full space-y-6">
      
      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl liquid-card border border-white/10 space-y-3">
        
        {/* Top line: Search & Count */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center justify-center sm:justify-start space-x-2 flex-wrap gap-y-1.5 text-center sm:text-left">
            <Layers className="w-4 h-4 text-[#00F0FF] flex-shrink-0" />
            <span className="text-xs font-orbitron font-bold text-white uppercase tracking-wider whitespace-nowrap">
              Popular Superbikes in India
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[11px] font-telemetry text-[#00F0FF] font-bold whitespace-nowrap flex-shrink-0 inline-flex items-center">
              {filteredBikes.length} of {bikes.length} Models
            </span>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Hayabusa, H2R, Panigale, Triumph..."
              className="w-full pl-9 pr-8 py-2 rounded-xl liquid-glass border border-white/15 text-xs font-inter text-white focus:outline-none focus:border-[#00F0FF] placeholder:text-white/30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-white/40 hover:text-white transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Manufacturer Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar border-t border-white/5 pt-3">
          {manufacturers.map((mfg) => (
            <button
              key={mfg}
              onClick={() => setSelectedManufacturer(mfg)}
              className={`px-3 py-1.5 rounded-xl text-xs font-orbitron font-bold whitespace-nowrap transition-all border cursor-pointer ${
                selectedManufacturer === mfg
                  ? 'liquid-tab-active shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                  : 'liquid-glass text-white/50 border-white/10 hover:text-white hover:border-white/20'
              }`}
            >
              {mfg}
            </button>
          ))}
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[10px] font-orbitron text-white/40 uppercase whitespace-nowrap mr-1">Class:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-inter whitespace-nowrap transition-all border cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white/20 text-white border-white/40 font-medium'
                  : 'bg-black/30 text-white/40 border-white/5 hover:text-white/70 hover:border-white/15'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Quick Acronym / Slang Superbike Tags */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar border-t border-white/5 pt-2 text-[10px]">
          <span className="font-telemetry text-[#00F0FF]/60 whitespace-nowrap mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#00F0FF]" />
            FAST SEARCH:
          </span>
          {quickAliases.map((qa) => (
            <button
              key={qa.query}
              onClick={() => setSearchQuery(qa.query)}
              className="px-2 py-0.5 rounded bg-white/[0.04] hover:bg-[#00F0FF]/20 border border-white/10 hover:border-[#00F0FF]/50 text-white/70 hover:text-[#00F0FF] whitespace-nowrap transition-colors font-orbitron font-semibold cursor-pointer"
            >
              {qa.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Superbike Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBikes.map((bike) => {
          const isSelected = selectedBike?.id === bike.id;
          return (
            <motion.div
              key={bike.id}
              whileHover={{ y: -4 }}
              onClick={() => onSelectBike(bike)}
              className={`liquid-card rounded-2xl overflow-hidden border transition-all cursor-pointer flex flex-col justify-between group ${
                isSelected
                  ? 'border-[#00F0FF] shadow-[0_0_25px_rgba(0,240,255,0.25)] ring-1 ring-[#00F0FF]/50'
                  : 'border-white/10 hover:border-white/25 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]'
              }`}
            >
              {/* Top Image Banner */}
              <div className="relative h-56 w-full bg-black/60 overflow-hidden">
                <img
                  src={bike.heroImage}
                  alt={bike.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-orbitron font-bold text-[#00F0FF]">
                  {bike.category}
                </div>

                {/* Quick Favorite & Compare Buttons */}
                <div className="absolute top-3 right-3 flex items-center space-x-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(bike.id);
                    }}
                    className={`p-2 rounded-lg backdrop-blur-md border transition-colors cursor-pointer ${
                      isFavorite(bike.id)
                        ? 'bg-[#FF0055]/30 border-[#FF0055] text-[#FF0055] shadow-[0_0_10px_rgba(255,0,85,0.4)]'
                        : 'bg-black/70 border-white/15 text-white/50 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFavorite(bike.id) ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleCompare(bike);
                    }}
                    className={`p-2 rounded-lg backdrop-blur-md border transition-colors cursor-pointer ${
                      isCompared(bike.id)
                        ? 'bg-[#00F0FF]/30 border-[#00F0FF] text-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                        : 'bg-black/70 border-white/15 text-white/50 hover:text-white'
                    }`}
                    title="Toggle comparison"
                  >
                    <GitCompare className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Price In India & USD Strip */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-1">
                  <div className="px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md text-[11px] font-orbitron font-bold text-amber-400 border border-amber-400/30 flex items-center space-x-1">
                    <span>₹{bike.priceInrLakh > 0 ? `${bike.priceInrLakh.toFixed(2)} Lakh` : 'TBA'}</span>
                    <span className="text-[9px] text-white/40 font-inter font-normal">Ex-Showroom</span>
                  </div>
                  <div className="px-2 py-1 rounded-lg bg-black/85 backdrop-blur-md text-[10px] font-telemetry text-white/70 border border-white/15">
                    {bike.displacementCc}cc | {bike.originCountry}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: bike.accentColor }}></span>
                    <span className="text-[11px] font-orbitron font-bold text-white/50 uppercase tracking-wider">
                      {bike.manufacturer} • {bike.engineCylinders}
                    </span>
                  </div>
                  <h3 className="text-xl font-orbitron font-extrabold text-white mt-1">{bike.shortName}</h3>
                  <p className="text-xs font-inter text-white/50 line-clamp-1 mt-0.5">{bike.tagline}</p>
                </div>

                {/* 4-Metric Mini HUD */}
                <div className="grid grid-cols-4 gap-2 bg-black/40 p-2.5 rounded-xl border border-white/10 text-center">
                  <div>
                    <span className="text-[9px] font-inter text-white/40 block">POWER</span>
                    <strong className="text-xs font-orbitron text-[#FFB800]">{bike.metrics.powerHp}</strong>
                    <span className="text-[8px] text-white/40 block font-inter">HP</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-inter text-white/40 block">V-MAX</span>
                    <strong className="text-xs font-orbitron text-[#00F0FF]">{bike.metrics.topSpeedKmh}</strong>
                    <span className="text-[8px] text-white/40 block font-inter">KM/H</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-inter text-white/40 block">0-100</span>
                    <strong className="text-xs font-orbitron text-[#FF0055]">{bike.metrics.acceleration0to100}s</strong>
                    <span className="text-[8px] text-white/40 block font-inter">SEC</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-inter text-white/40 block">WEIGHT</span>
                    <strong className="text-xs font-orbitron text-emerald-400">{bike.metrics.dryWeightKg}</strong>
                    <span className="text-[8px] text-white/40 block font-inter">KG</span>
                  </div>
                </div>

                {/* Actions: Launch HUD, History & Details */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLaunchTelemetry(bike);
                    }}
                    className="flex-1 py-2 rounded-lg bg-[#00F0FF]/15 hover:bg-[#00F0FF]/25 border border-[#00F0FF]/40 text-[#00F0FF] font-orbitron font-bold text-[11px] uppercase tracking-wider transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Gauge className="w-3.5 h-3.5" />
                    <span>Launch HUD</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDetails(bike);
                    }}
                    className="px-3 py-2 rounded-lg liquid-glass hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer flex items-center space-x-1"
                    title="Explore Heritage & Full Specs"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#00F0FF]" />
                    <span className="text-[10px] font-orbitron font-bold hidden sm:inline">HISTORY</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDetails(bike);
                    }}
                    className="p-2 rounded-lg liquid-glass hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                    title="Full Engineering Details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};
