import React from 'react';
import { Zap, ShieldCheck, Cpu, Terminal, Radio, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/10 glass-card py-10 text-white/50 text-xs font-inter mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-sm bg-[#00F0FF]/15 border border-[#00F0FF]/40 flex items-center justify-center text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="font-orbitron font-extrabold text-sm text-white tracking-wider">APEX SUPERBIKE SHOWCASE</span>
              <p className="text-[11px] text-white/40 font-telemetry">TELEMETRY & ENGINEERING PLATFORM</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-telemetry text-white/60">
            <div className="flex items-center space-x-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>SERVER PROTOCOL: CLOUD RUN CONTAINER</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>AI CONCIERGE: GEMINI 3.7 FLASH</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
          <div>
            <span className="font-orbitron font-bold text-white uppercase tracking-wider block mb-2 text-[11px]">
              HOMOLOGATED MARQUES
            </span>
            <ul className="space-y-1.5 text-white/50 font-inter text-[12px]">
              <li>Ducati Corse (Borgo Panigale)</li>
              <li>Kawasaki Heavy Industries (Akashi)</li>
              <li>BMW Motorrad Motorsport (Munich)</li>
              <li>Yamaha Factory Racing (Iwata)</li>
            </ul>
          </div>

          <div>
            <span className="font-orbitron font-bold text-white uppercase tracking-wider block mb-2 text-[11px]">
              EXOTICA & GP SPEC
            </span>
            <ul className="space-y-1.5 text-white/50 font-inter text-[12px]">
              <li>MV Agusta Reparto Corse</li>
              <li>Aprilia Racing Noale</li>
              <li>Honda Racing Corporation (HRC)</li>
              <li>WSBK / MotoGP Aerodynamics</li>
            </ul>
          </div>

          <div>
            <span className="font-orbitron font-bold text-white uppercase tracking-wider block mb-2 text-[11px]">
              TELEMETRY ENGINE
            </span>
            <ul className="space-y-1.5 text-white/50 font-inter text-[12px]">
              <li>6-Axis Inertial Measurement Unit (IMU)</li>
              <li>Dynamic Dyno Acoustic Synthesis</li>
              <li>Aero Downforce & Lean Angle Simulation</li>
              <li>Spec Matrix Advantage Benchmark</li>
            </ul>
          </div>

          <div>
            <span className="font-orbitron font-bold text-white uppercase tracking-wider block mb-2 text-[11px]">
              APEX LAB
            </span>
            <ul className="space-y-1.5 text-white/50 font-inter text-[12px]">
              <li>Akrapovič & SC-Project Exhausts</li>
              <li>BST Carbon High-Modulus Wheels</li>
              <li>Brembo GP4-RR Billet Calipers</li>
              <li>Stage 2 Custom Race ECU Flash</li>
            </ul>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-between text-[11px] font-telemetry text-white/40 border-t border-white/10">
          <span>&copy; {new Date().getFullYear()} Apex Superbike Showcase. Engineered for high-octane telemetry enthusiasts.</span>
          <span className="text-[#00F0FF]/80">LATENCY: &lt;15ms | WSBK TELEMETRY V4</span>
        </div>

      </div>
    </footer>
  );
};
