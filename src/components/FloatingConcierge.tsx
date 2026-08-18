import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  Zap, 
  ChevronDown, 
  Loader2,
  Search,
  Check,
  Radio,
  Gauge,
  SlidersHorizontal,
  Flame,
  ArrowRight
} from 'lucide-react';
import { Superbike } from '../types';
import { SUPERBIKES } from '../data/superbikes';
import { findBestSuperbike, filterSuperbikes } from '../utils/bikeMatcher';

interface Message {
  id: string;
  sender: 'ai' | 'user' | 'system';
  text: string;
  timestamp: string;
  bikeFocus?: string;
  bikeCard?: Superbike;
}

interface FloatingConciergeProps {
  isOpen: boolean;
  onClose: () => void;
  currentBike?: Superbike;
  allBikes?: Superbike[];
  onSelectBike?: (bike: Superbike) => void;
}

export const FloatingConcierge: React.FC<FloatingConciergeProps> = ({
  isOpen,
  onClose,
  currentBike: propBike,
  allBikes = SUPERBIKES,
  onSelectBike,
}) => {
  const currentBike = propBike || allBikes[0] || SUPERBIKES[0];
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Apex Telemetry Chief Engineer online. Live telemetry link active for ${currentBike?.name || 'Superbike'}. Ask me about ECU throttle mapping, lean angle physics, winglet aero downforce, or compare real-time dyno telemetry across all 63 superbikes.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      bikeFocus: currentBike?.name,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isBikePickerOpen, setIsBikePickerOpen] = useState(false);
  const [bikeFilterSearch, setBikeFilterSearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const prevBikeIdRef = useRef<string>(currentBike?.id);

  // Dynamic telemetry preset questions based on active machine & popular short forms
  const presetQuestions = [
    `How does the ${currentBike?.shortName || 'superbike'} generate ${currentBike?.metrics?.downforceAt300KmhKg || 18} kg downforce at 300 km/h?`,
    `Compare Busa vs Ninja H2R vs BMW S1K`,
    `What is the ${currentBike?.shortName} 0-100 km/h (${currentBike?.metrics?.acceleration0to100}s) launch strategy?`,
    `Switch to Ducati Panigale V4 R`,
    `Show KTM Super Duke 1390 specs`,
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, loading]);

  // Detect when currentBike changes externally (e.g. from search bar, carousel, or grid)
  useEffect(() => {
    if (currentBike && currentBike.id !== prevBikeIdRef.current) {
      prevBikeIdRef.current = currentBike.id;
      setMessages((prev) => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          sender: 'system',
          text: `⚡ Active Telemetry Focus Synced: [${currentBike.manufacturer.toUpperCase()}] ${currentBike.name} (${currentBike.metrics.powerHp} HP • ${currentBike.displacementCc}cc • Top Speed ${currentBike.metrics.topSpeedKmh} km/h). Sensors & dyno curves loaded.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          bikeFocus: currentBike.name,
        },
      ]);
    }
  }, [currentBike?.id]);

  // Quick bike selector handler
  const handleSelectSpecificBike = (bike: Superbike) => {
    if (onSelectBike) {
      onSelectBike(bike);
    }
    setIsBikePickerOpen(false);
    setBikeFilterSearch('');
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    // Check if the prompt explicitly mentions a bike (full name, short form, slang, or alias) to auto-focus immediately
    const promptDetectedBike = findBestSuperbike(query, allBikes);
    let activeTargetBike = promptDetectedBike || currentBike;

    if (promptDetectedBike) {
      activeTargetBike = promptDetectedBike;
      if (onSelectBike) {
        onSelectBike(promptDetectedBike);
      }
    }

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          currentBike: {
            name: activeTargetBike.name,
            manufacturer: activeTargetBike.manufacturer,
            powerHp: activeTargetBike.metrics.powerHp,
            dryWeightKg: activeTargetBike.metrics.dryWeightKg,
            topSpeedKmh: activeTargetBike.metrics.topSpeedKmh,
            acceleration0to100: activeTargetBike.metrics.acceleration0to100,
            engineType: activeTargetBike.engineCylinders,
            aeroDownforceKg: activeTargetBike.metrics.downforceAt300KmhKg,
          },
        }),
      });

      const data = await response.json();
      const aiReply = data.reply || `Telemetry link active for ${activeTargetBike.name}. Dyno & aerodynamic curves nominal.`;

      // Auto-choose the bike if the AI picked or recommended one (supports short forms)
      let chosenBike: Superbike | null = null;
      if (data.chosenBikeQuery) {
        chosenBike = findBestSuperbike(data.chosenBikeQuery, allBikes);
      } else if (promptDetectedBike) {
        chosenBike = promptDetectedBike;
      } else {
        chosenBike = findBestSuperbike(aiReply, allBikes);
      }

      if (chosenBike) {
        activeTargetBike = chosenBike;
        if (onSelectBike) {
          onSelectBike(chosenBike);
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          bikeFocus: activeTargetBike.name,
          bikeCard: chosenBike || activeTargetBike,
        },
      ]);
    } catch (err) {
      console.error('Concierge request failed:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: `Telemetry telemetry link operational for ${activeTargetBike.name}. Power output: ${activeTargetBike.metrics.powerHp} HP @ ${activeTargetBike.metrics.rpmRedline} RPM. Top speed: ${activeTargetBike.metrics.topSpeedKmh} km/h.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          bikeFocus: activeTargetBike.name,
          bikeCard: activeTargetBike,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPickerBikes = React.useMemo(() => {
    if (!bikeFilterSearch.trim()) return allBikes;
    return filterSuperbikes(bikeFilterSearch, allBikes);
  }, [bikeFilterSearch, allBikes]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-lg px-3 sm:px-0">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        className="w-full rounded-2xl bg-[#090D16]/95 backdrop-blur-xl border border-[#00F0FF]/40 shadow-[0_0_40px_rgba(0,240,255,0.2)] overflow-hidden flex flex-col h-[580px] max-h-[85vh]"
      >
        {/* Header */}
        <div className="p-3.5 bg-[#060910]/90 border-b border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#00F0FF]/15 border border-[#00F0FF]/40 flex items-center justify-center text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.3)] flex-shrink-0">
              <Bot className="w-5 h-5" />
            </div>

            {/* Active Telemetry Focus Pill Dropdown Trigger */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-orbitron font-extrabold text-white tracking-wider">APEX TELEMETRY AI</span>
                <span className="inline-block w-2 h-2 rounded-full bg-[#00FF88] animate-pulse"></span>
              </div>

              {/* Interactive Machine Switcher Pill */}
              <button
                onClick={() => setIsBikePickerOpen(!isBikePickerOpen)}
                className="mt-0.5 flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-white/[0.05] hover:bg-white/10 border border-[#00F0FF]/30 text-[11px] font-telemetry text-white/90 transition-colors group cursor-pointer max-w-full truncate"
                title="Click to switch or search active superbike telemetry focus"
              >
                <span className="text-[#00F0FF] font-bold">FOCUS:</span>
                <span className="truncate text-white font-semibold">{currentBike.shortName}</span>
                <span className="text-white/40 text-[9px]">({currentBike.metrics.powerHp} HP)</span>
                <ChevronDown className={`w-3 h-3 text-[#00F0FF] transition-transform ${isBikePickerOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <button
              onClick={() => setIsBikePickerOpen(!isBikePickerOpen)}
              className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-[#00F0FF]/20 border border-white/10 text-white/60 hover:text-[#00F0FF] transition-colors cursor-pointer"
              title="Search and switch machine focus"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 border border-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
              aria-label="Close AI Concierge"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Machine Switcher Search Popover (When Open) */}
        <AnimatePresence>
          {isBikePickerOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[#060910] border-b border-white/10 p-3 space-y-2.5 z-20 shadow-xl overflow-hidden"
            >
              <div className="flex items-center justify-between text-[11px] font-orbitron font-bold text-[#00F0FF]">
                <div className="flex items-center space-x-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>SELECT ACTIVE MACHINE FOR TELEMETRY AI ({allBikes.length} BIKES)</span>
                </div>
                <span className="text-white/40 text-[10px] font-telemetry">Auto-syncs HUD & Carousel</span>
              </div>

              {/* Search bar inside picker */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-white/40" />
                <input
                  type="text"
                  value={bikeFilterSearch}
                  onChange={(e) => setBikeFilterSearch(e.target.value)}
                  placeholder="Search bike (e.g. Hayabusa, Panigale, H2R, BMW, Ninja)..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/15 text-xs font-inter text-white placeholder:text-white/40 focus:outline-none focus:border-[#00F0FF]"
                  autoFocus
                />
              </div>

              {/* Scrollable list of bikes */}
              <div className="max-h-40 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {filteredPickerBikes.slice(0, 15).map((bike) => {
                  const isCurrent = bike.id === currentBike.id;
                  return (
                    <button
                      key={bike.id}
                      onClick={() => handleSelectSpecificBike(bike)}
                      className={`w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between text-xs transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-[#00F0FF]/20 border border-[#00F0FF]/50 text-white font-bold'
                          : 'hover:bg-white/[0.08] text-white/70 border border-transparent hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: bike.accentColor }}></span>
                        <span className="font-orbitron font-semibold text-[11px] truncate">{bike.name}</span>
                        <span className="text-[10px] font-telemetry text-white/40 hidden sm:inline">
                          ({bike.metrics.powerHp} HP • {bike.displacementCc}cc)
                        </span>
                      </div>
                      {isCurrent ? (
                        <Check className="w-3.5 h-3.5 text-[#00F0FF] flex-shrink-0" />
                      ) : (
                        <span className="text-[10px] font-telemetry text-[#00F0FF] flex-shrink-0">LOCK FOCUS</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs custom-scrollbar">
          {messages.map((msg) => {
            if (msg.sender === 'system') {
              return (
                <div key={msg.id} className="py-1 px-3 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-[11px] font-telemetry flex items-start space-x-2">
                  <Radio className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 animate-pulse text-[#00F0FF]" />
                  <div className="flex-1 leading-snug">{msg.text}</div>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-xl p-3 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-white rounded-br-none shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                      : 'bg-[#101524] border border-white/10 text-white/90 rounded-bl-none shadow-md'
                  }`}
                >
                  <div className="whitespace-pre-line text-xs sm:text-[13px] font-inter font-normal">
                    {msg.text}
                  </div>

                  {/* Auto-selected Superbike Card inside AI Message */}
                  {msg.bikeCard && msg.sender === 'ai' && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-black/50 border border-[#00F0FF]/30 space-y-2">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-14 h-10 rounded-lg overflow-hidden bg-black/60 border border-white/10 flex-shrink-0 relative">
                          <img
                            src={msg.bikeCard.heroImage}
                            alt={msg.bikeCard.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[9px] font-bold font-orbitron px-1.5 py-0.2 rounded uppercase bg-[#FF0055]/20 text-[#FF0055]">
                              {msg.bikeCard.manufacturer}
                            </span>
                            <span className="text-[10px] font-telemetry text-emerald-400 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                              TELEMETRY ACTIVE
                            </span>
                          </div>
                          <h4 className="text-xs font-orbitron font-bold text-white truncate">
                            {msg.bikeCard.name}
                          </h4>
                        </div>
                      </div>

                      {/* Quick Telemetry Spec Bar */}
                      <div className="grid grid-cols-3 gap-1.5 text-center bg-white/[0.03] p-1.5 rounded-lg border border-white/5 font-telemetry text-[10px]">
                        <div>
                          <div className="text-white/40 text-[8px]">POWER</div>
                          <div className="text-[#00F0FF] font-bold">{msg.bikeCard.metrics.powerHp} HP</div>
                        </div>
                        <div>
                          <div className="text-white/40 text-[8px]">TOP SPEED</div>
                          <div className="text-white font-bold">{msg.bikeCard.metrics.topSpeedKmh} KM/H</div>
                        </div>
                        <div>
                          <div className="text-white/40 text-[8px]">0-100 KM/H</div>
                          <div className="text-[#00FF88] font-bold">{msg.bikeCard.metrics.acceleration0to100}s</div>
                        </div>
                      </div>

                      {/* Switch focus button */}
                      <button
                        onClick={() => {
                          if (onSelectBike && msg.bikeCard) {
                            onSelectBike(msg.bikeCard);
                          }
                        }}
                        className="w-full py-1.5 rounded-lg bg-[#00F0FF]/20 hover:bg-[#00F0FF] text-[#00F0FF] hover:text-black border border-[#00F0FF]/40 text-[11px] font-orbitron font-bold tracking-wider transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>SWITCH ACTIVE HUD TO {msg.bikeCard.shortName.toUpperCase()}</span>
                      </button>
                    </div>
                  )}

                  <div className="text-[9px] font-telemetry text-white/40 mt-1.5 flex items-center justify-between gap-2 border-t border-white/5 pt-1">
                    <span>{msg.sender === 'ai' ? 'CHIEF TELEMETRY ENGINEER' : 'PILOT'}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-[#101524] border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-telemetry w-max shadow-lg">
              <Loader2 className="w-4 h-4 animate-spin text-[#00F0FF]" />
              <span>Analyzing live {currentBike.shortName} telemetry & aero maps...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Preset Prompt Chips */}
        <div className="px-3 py-2 bg-[#060910] border-t border-white/10 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              disabled={loading}
              className="flex-shrink-0 px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-[#00F0FF]/15 border border-white/10 hover:border-[#00F0FF]/40 text-[11px] font-inter text-white/80 hover:text-[#00F0FF] whitespace-nowrap transition-colors disabled:opacity-50 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-[#060910] border-t border-white/10 flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about ${currentBike.shortName} specs, setup, aero or any of 63 superbikes...`}
            disabled={loading}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-xs font-inter text-white focus:outline-none focus:border-[#00F0FF] placeholder:text-white/40"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2.5 rounded-xl bg-[#00F0FF] hover:bg-white text-black font-bold disabled:opacity-30 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.4)]"
            aria-label="Send telemetry question"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};
