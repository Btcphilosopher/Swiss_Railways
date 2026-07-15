/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Globe, Menu, Wallet, Check, ChevronDown, Bell, Settings } from "lucide-react";
import { WalletState } from "../types";

interface HeaderProps {
  activeHeaderTab: string;
  setActiveHeaderTab: (tab: string) => void;
  wallet: WalletState;
  onConnectWallet: () => void;
}

export default function Header({
  activeHeaderTab,
  setActiveHeaderTab,
  wallet,
  onConnectWallet
}: HeaderProps) {
  const tabs = ["Timetable", "Tickets", "Station info", "Offers", "Freight"];
  const languages = ["EN", "DE", "FR", "IT"];
  const [selectedLang, setSelectedLang] = useState("EN");
  const [isLangOpen, setIsLangOpen] = useState(false);

  return (
    <header className="h-20 bg-[#050505] border-b border-white/10 px-8 flex items-center justify-between sticky top-0 z-10">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-8 h-full">
        {tabs.map((tab) => {
          const isActive = activeHeaderTab.toLowerCase() === tab.toLowerCase();
          return (
            <button
              key={tab}
              id={`header-tab-${tab.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setActiveHeaderTab(tab.toLowerCase())}
              className={`relative h-full flex items-center text-sm font-semibold font-sans transition-colors cursor-pointer ${
                isActive ? "text-[#EB0000]" : "text-slate-400 hover:text-white"
              }`}
            >
              <span>{tab}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#EB0000]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Actions (Right) */}
      <div className="flex items-center gap-4">
        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold font-sans text-slate-300 hover:bg-white/5 rounded-xl transition-colors border border-white/10"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>{selectedLang}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
          
          {isLangOpen && (
            <div className="absolute right-0 mt-2 w-28 bg-[#0a0a0a]/95 border border-white/10 rounded-xl shadow-2xl py-1 z-50 backdrop-blur-md">
              {languages.map((lang) => (
                <button
                   key={lang}
                   onClick={() => {
                     setSelectedLang(lang);
                     setIsLangOpen(false);
                   }}
                   className="w-full px-3 py-2 text-xs text-left font-sans font-medium text-slate-300 hover:bg-white/5 flex items-center justify-between"
                >
                  <span>{lang}</span>
                  {selectedLang === lang && <Check className="w-3.5 h-3.5 text-[#EB0000]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications (Mock) */}
        <button className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-white/10 relative transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#EB0000] rounded-full ring-2 ring-[#050505]"></span>
        </button>

        {/* Connect Wallet Button */}
        <button
          onClick={onConnectWallet}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full font-sans text-sm font-bold transition-all duration-300 shadow-sm cursor-pointer ${
            wallet.isConnected
              ? "bg-white/10 border border-emerald-500/30 text-white hover:bg-white/20"
              : "bg-white text-black hover:bg-slate-200 hover:scale-[1.02] active:scale-[0.98]"
          }`}
        >
          {wallet.isConnected ? (
            <>
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shrink-0"></span>
              <span className="font-mono text-xs">{wallet.address?.substring(0, 6)}...{wallet.address?.substring(34)}</span>
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4 text-emerald-500" />
              <span>Connect Wallet</span>
            </>
          )}
        </button>

        {/* Mobile Menu Icon */}
        <button className="lg:hidden p-2 rounded-xl text-slate-400 hover:bg-white/5 border border-white/10">
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
