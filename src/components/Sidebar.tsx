/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Train, 
  MapPin, 
  Map, 
  Ticket, 
  CreditCard, 
  Briefcase, 
  LogIn,
  LogOut,
  Sparkles,
  Link2
} from "lucide-react";
import { WalletState } from "../types";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  wallet: WalletState;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  wallet,
  onConnectWallet,
  onDisconnectWallet
}: SidebarProps) {
  const menuItems = [
    { id: "timetable", label: "Timetable", icon: Train },
    { id: "journeys", label: "My Journeys", icon: MapPin, badge: wallet.isConnected ? "3" : undefined },
    { id: "map", label: "Live Map", icon: Map },
    { id: "tickets", label: "Tickets", icon: Ticket },
    { id: "swisspass", label: "Swiss Pass", icon: CreditCard, isWeb3: true },
    { id: "freight", label: "Freight", icon: Briefcase },
  ];

  return (
    <aside className="w-64 bg-[#050505] border-r border-white/10 flex flex-col justify-between h-screen sticky top-0 shrink-0 z-20">
      {/* Top Header */}
      <div className="flex flex-col">
        {/* Brand Logo */}
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-12 h-12 bg-[#EB0000] flex items-center justify-center rounded-sm shrink-0">
            {/* High-fidelity SBB SVG logo */}
            <svg viewBox="0 0 100 100" className="w-8 h-8 text-white fill-current">
              <path d="M10,43 L80,43 L65,28 L72,20 L100,50 L72,80 L65,72 L80,57 L10,57 L10,43 Z" />
              <path d="M90,57 L20,57 L35,72 L28,80 L0,50 L28,20 L35,28 L20,43 L90,43 L90,57 Z" className="opacity-80" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-extrabold tracking-wider text-xl text-white leading-none">
              SBB CFF FFS
            </span>
            <span className="text-[9px] font-mono tracking-widest text-[#EB0000] font-bold mt-1 uppercase">
              Smart Mobility
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1 mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-item-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-sans text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-white/5 text-white font-semibold border-l-4 border-[#EB0000] rounded-l-none"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? "text-[#EB0000]" : "text-slate-400 group-hover:scale-105"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-mono font-bold bg-[#EB0000]/20 text-[#EB0000] rounded-full border border-[#EB0000]/30">
                    {item.badge}
                  </span>
                )}
                {item.isWeb3 && (
                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-mono font-bold bg-[#EB0000]/20 text-[#EB0000] rounded-md tracking-wider border border-[#EB0000]/30">
                    <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-pulse" />
                    NFT
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile / Wallet Status */}
      <div className="p-4 border-t border-white/10 bg-white/[0.02]">
        {wallet.isConnected ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#EB0000] to-neutral-800 flex items-center justify-center text-white text-xs font-bold font-mono">
                  {wallet.address?.substring(2, 4).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white font-mono">
                    {wallet.address?.substring(0, 6)}...{wallet.address?.substring(38)}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                    {wallet.network}
                  </span>
                </div>
              </div>
              <button 
                onClick={onDisconnectWallet}
                title="Disconnect Wallet"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
            <div className="glass p-2.5 rounded-lg flex justify-between items-center text-xs">
              <span className="text-slate-400 font-sans">Token Balance</span>
              <span className="font-mono font-bold text-white flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-[#EB0000] text-white flex items-center justify-center text-[8px] font-bold">S</span>
                {wallet.tokenBalance} TOK
              </span>
            </div>
          </div>
        ) : (
          <button
            onClick={onConnectWallet}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-black rounded-xl font-sans text-sm font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <LogIn className="w-4 h-4 text-slate-700" />
            <span>Sign In / Connect</span>
          </button>
        )}
      </div>
    </aside>
  );
}
