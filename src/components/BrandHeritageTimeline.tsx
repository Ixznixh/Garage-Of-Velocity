import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  History, 
  Flag, 
  Award, 
  Sparkles, 
  ChevronRight, 
  Calendar, 
  Compass, 
  Zap,
  Flame,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { BRAND_HERITAGES } from '../data/superbikes';

export const BrandHeritageTimeline: React.FC = () => {
  const brandKeys = Object.keys(BRAND_HERITAGES);
  const [selectedBrand, setSelectedBrand] = useState<string>('Ducati');
  const heritage = BRAND_HERITAGES[selectedBrand];

  return (
    <div className="w-full space-y-8">
      
      {/* Brand Switcher Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
        {brandKeys.map((brandName) => {
          const item = BRAND_HERITAGES[brandName];
          const isSelected = selectedBrand === brandName;
          return (
            <button
              key={brandName}
              onClick={() => setSelectedBrand(brandName)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl font-orbitron text-xs font-bold tracking-wider uppercase transition-all flex items-center space-x-2 border cursor-pointer ${
                isSelected
                  ? 'liquid-tab-active'
                  : 'liquid-glass text-white/50 border-white/10 hover:text-white hover:border-white/30'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.badgeColor }}></span>
              <span>{brandName}</span>
            </button>
          );
        })}
      </div>

      {/* Brand Heritage Hero Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedBrand}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="liquid-card rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Brand Identity Info */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center space-x-3">
                <span 
                  className="px-3 py-1 rounded-lg text-xs font-orbitron font-bold uppercase tracking-wider border border-white/10"
                  style={{ backgroundColor: `${heritage.badgeColor}20`, color: heritage.badgeColor }}
                >
                  FOUNDED {heritage.founded}
                </span>
                <span className="text-xs font-inter text-white/50">
                  ORIGIN: <strong className="text-white font-orbitron">{heritage.country}</strong>
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-orbitron font-extrabold text-white">
                {heritage.manufacturer} RACING HERITAGE
              </h2>

              <p className="text-sm sm:text-base font-inter text-white/80 leading-relaxed italic border-l-2 pl-4" style={{ borderColor: heritage.badgeColor }}>
                "{heritage.philosophy}"
              </p>

              {/* Racing Pedigree Trophies Grid */}
              <div className="grid grid-cols-3 gap-3 pt-3">
                <div className="p-3.5 rounded-xl liquid-glass border border-white/10 text-center">
                  <Trophy className="w-4 h-4 text-[#FFB800] mx-auto mb-1" />
                  <div className="text-2xl font-orbitron font-bold text-white">
                    {heritage.racingPedigree.motogpChampionships}
                  </div>
                  <span className="text-[10px] font-orbitron text-white/40 uppercase">
                    MotoGP Titles
                  </span>
                </div>

                <div className="p-3.5 rounded-xl liquid-glass border border-white/10 text-center">
                  <Award className="w-4 h-4 text-[#00F0FF] mx-auto mb-1" />
                  <div className="text-2xl font-orbitron font-bold text-white">
                    {heritage.racingPedigree.wsbkChampionships}
                  </div>
                  <span className="text-[10px] font-orbitron text-white/40 uppercase">
                    WorldSBK Titles
                  </span>
                </div>

                <div className="p-3.5 rounded-xl liquid-glass border border-white/10 text-center">
                  <Flag className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                  <div className="text-2xl font-orbitron font-bold text-white">
                    {heritage.racingPedigree.isleOfManTtWins}
                  </div>
                  <span className="text-[10px] font-orbitron text-white/40 uppercase">
                    Isle of Man TT
                  </span>
                </div>
              </div>
            </div>

            {/* Right Brand Predecessor Highlight */}
            <div className="lg:col-span-5 space-y-3">
              <h3 className="text-xs font-orbitron font-bold text-[#00F0FF] tracking-wider flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ICONIC PREDECESSOR LEGENDS</span>
              </h3>

              <div className="space-y-3">
                {heritage.predecessors.map((pred) => (
                  <div 
                    key={pred.name}
                    className="p-3.5 rounded-xl liquid-glass border border-white/10 flex items-center space-x-4 hover:border-white/30 transition-colors"
                  >
                    <img 
                      src={pred.image} 
                      alt={pred.name} 
                      className="w-16 h-16 rounded-lg object-cover bg-black flex-shrink-0 border border-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-orbitron font-bold text-white truncate">{pred.name}</h4>
                        <span className="text-xs font-telemetry text-[#FFB800] font-bold">{pred.year}</span>
                      </div>
                      <div className="text-[11px] font-telemetry text-[#00F0FF]">
                        {pred.displacementCc}cc | {pred.powerHp} HP
                      </div>
                      <p className="text-[11px] font-inter text-white/50 line-clamp-1 mt-0.5">{pred.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      </AnimatePresence>

      {/* Interactive Milestones Timeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-orbitron font-bold text-white tracking-wider flex items-center space-x-2">
          <History className="w-5 h-5 text-[#00F0FF]" />
          <span>CHRONOLOGICAL ENGINEERING MILESTONES</span>
        </h3>

        <div className="relative pl-6 sm:pl-8 border-l-2 border-white/10 space-y-8 my-6">
          {heritage.milestones.map((ms, idx) => (
            <motion.div
              key={`${ms.year}-${idx}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative group"
            >
              {/* Dot on the timeline line */}
              <div 
                className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 border-[#0B0F19] shadow-lg transition-transform group-hover:scale-125"
                style={{ backgroundColor: heritage.badgeColor }}
              ></div>

              <div className="p-4 sm:p-5 rounded-2xl liquid-card border border-white/10 hover:border-[#00F0FF]/40 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-orbitron font-extrabold text-white">
                      {ms.year}
                    </span>
                    <span 
                      className="px-2 py-0.5 rounded-lg text-[10px] font-orbitron font-bold uppercase tracking-wider border border-white/10"
                      style={{ backgroundColor: `${heritage.badgeColor}20`, color: heritage.badgeColor }}
                    >
                      {ms.category}
                    </span>
                  </div>
                </div>

                <h4 className="text-base font-orbitron font-bold text-[#00F0FF] mb-1">
                  {ms.title}
                </h4>

                <p className="text-sm font-inter text-white/80 leading-relaxed">
                  {ms.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};
