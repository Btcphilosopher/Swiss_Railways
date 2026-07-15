/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, Wallet, ShieldAlert, CheckCircle2, RefreshCw } from "lucide-react";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectSuccess: (address: string, walletName: string) => void;
}

export default function WalletModal({
  isOpen,
  onClose,
  onConnectSuccess,
}: WalletModalProps) {
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const [statusText, setStatusText] = useState("");

  if (!isOpen) return null;

  const walletProviders = [
    {
      name: "MetaMask",
      desc: "Connect using your browser extension",
      icon: "🦊",
    },
    {
      name: "WalletConnect",
      desc: "Scan a QR code with your mobile device",
      icon: "🔌",
    },
    {
      name: "Coinbase Wallet",
      desc: "Connect using Coinbase crypto ledger",
      icon: "🔵",
    },
    {
      name: "Phantom",
      desc: "Multi-chain Solana & EVM wallet",
      icon: "👻",
    },
  ];

  const handleWalletSelect = (walletName: string) => {
    setConnectingWallet(walletName);
    
    // Simulate connection steps
    setStatusText("Requesting wallet authorization...");
    setTimeout(() => {
      setStatusText("Verifying cryptographic signature on SBB Chain...");
      setTimeout(() => {
        // Generate a random mock address
        const characters = "0123456789abcdef";
        let mockAddress = "0x";
        for (let i = 0; i < 40; i++) {
          mockAddress += characters[Math.floor(Math.random() * 16)];
        }
        
        onConnectSuccess(mockAddress, walletName);
        setConnectingWallet(null);
        onClose();
      }, 1000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-neutral-950/95 backdrop-blur-md rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-white/10 flex flex-col relative animate-scale-up text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {connectingWallet ? (
          /* Connecting State */
          <div className="py-10 text-center space-y-6">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-[#EB0000] border-t-transparent rounded-full animate-spin"></div>
              <Wallet className="w-6 h-6 text-[#EB0000]" />
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-sans font-extrabold text-white">
                Connecting to {connectingWallet}
              </h4>
              <p className="text-xs text-slate-400 font-sans leading-relaxed animate-pulse">
                {statusText}
              </p>
            </div>
            
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-[10px] font-sans text-slate-400 flex items-center gap-2 max-w-xs mx-auto">
              <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Make sure you confirm the signature request in your browser prompt. No gas fees are charged.</span>
            </div>
          </div>
        ) : (
          /* Wallet Selection List */
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#EB0000]/20 text-[#EB0000] rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-base font-sans font-extrabold text-white">
                Connect a Web3 Wallet
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Link your Web3 address to buy smart NFT tickets and claim on-chain carbon rewards
              </p>
            </div>

            {/* Providers */}
            <div className="space-y-2">
              {walletProviders.map((provider) => (
                <button
                  key={provider.name}
                  onClick={() => handleWalletSelect(provider.name)}
                  className="w-full p-3.5 rounded-2xl border border-white/5 bg-white/[0.01] hover:border-[#EB0000]/30 hover:bg-white/[0.04] transition-all text-left flex items-center gap-4 group cursor-pointer"
                >
                  <span className="text-2xl">{provider.icon}</span>
                  <div className="flex-1">
                    <span className="text-xs font-sans font-extrabold text-white group-hover:text-[#EB0000] transition-colors block">
                      {provider.name}
                    </span>
                    <span className="text-[10px] font-sans text-slate-400 block mt-0.5">
                      {provider.desc}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Disclaimer */}
            <div className="text-center">
              <span className="text-[9px] font-sans font-medium text-slate-500 leading-normal">
                By connecting, you agree to the SBB Decentralized Travel Agreement. Data is cryptographically secure.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
