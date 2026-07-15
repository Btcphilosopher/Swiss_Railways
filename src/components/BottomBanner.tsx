/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Layers, Wallet, TrendingUp, Sparkles } from "lucide-react";

export default function BottomBanner() {
  const highlights = [
    {
      id: "h-1",
      title: "Multi-Modal Integration",
      description: "Trains, buses, boats & more. One seamless journey across Switzerland.",
      icon: Layers,
      color: "bg-[#EB0000]/5 text-[#EB0000]",
    },
    {
      id: "h-2",
      title: "Web3.0 Sync",
      description: "Secure, decentralized ticketing, NFT passes & automated cashbacks.",
      icon: Wallet,
      color: "bg-emerald-500/5 text-emerald-600",
    },
    {
      id: "h-3",
      title: "Real-Time Intelligence",
      description: "Live updates, delay warnings & predictive alternative route mapping.",
      icon: TrendingUp,
      color: "bg-blue-500/5 text-blue-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-slate-100 bg-white overflow-hidden shadow-sm mt-8">
      {/* Three info cards on the left */}
      <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="p-6 flex flex-col justify-between hover:bg-slate-50/50 transition-colors duration-200">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-sans font-extrabold text-slate-800 tracking-tight">
                  {item.title}
                </h4>
              </div>
              <p className="text-[11px] font-sans text-slate-500 leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Solid red block on the right */}
      <div className="lg:col-span-3 bg-gradient-to-r from-[#EB0000] to-[#C30000] p-6 text-white flex items-center justify-between relative group overflow-hidden">
        {/* Subtle geometric grid background inside the red block */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50" />
        
        <div className="flex flex-col relative z-10">
          <span className="text-[10px] font-mono tracking-widest text-red-200 font-extrabold uppercase">
            SBB Vision 2026
          </span>
          <span className="text-sm font-sans font-extrabold tracking-tight mt-1 leading-snug">
            The future of mobility.
          </span>
        </div>

        {/* Large SBB Logo symbol */}
        <div className="relative z-10 shrink-0 p-2.5 bg-white/10 rounded-xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
          <svg viewBox="0 0 100 100" className="w-8 h-8 text-white fill-current">
            <path d="M10,43 L80,43 L65,28 L72,20 L100,50 L72,80 L65,72 L80,57 L10,57 L10,43 Z" />
            <path d="M90,57 L20,57 L35,72 L28,80 L0,50 L28,20 L35,28 L20,43 L90,43 L90,57 Z" className="opacity-80" />
          </svg>
        </div>
      </div>
    </div>
  );
}
