/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { X, QrCode, Sparkles, CheckCircle2, Ticket, Printer, Download, Share2, Compass, ShieldCheck } from "lucide-react";
import { Journey, WalletState } from "../types";

interface TicketMintModalProps {
  isOpen: boolean;
  onClose: () => void;
  journey: Journey;
  wallet: WalletState;
  onMintComplete: (co2Saved: number) => void;
}

export default function TicketMintModal({
  isOpen,
  onClose,
  journey,
  wallet,
  onMintComplete,
}: TicketMintModalProps) {
  const [step, setStep] = useState<"minting" | "success">("minting");
  const [mintStatus, setMintStatus] = useState("Securing ticket seat reservation...");
  const [progress, setProgress] = useState(15);
  const [ticketHash, setTicketHash] = useState("");
  const [ticketId, setTicketId] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    
    // Reset state
    setStep("minting");
    setProgress(15);
    setMintStatus("Securing ticket seat reservation...");

    // Timers to simulate on-chain minting
    const t1 = setTimeout(() => {
      setProgress(45);
      setMintStatus("Compiling Zero-Knowledge carbon-saving proof (+23 kg CO₂)...");
    }, 1200);

    const t2 = setTimeout(() => {
      setProgress(80);
      setMintStatus("Deploying smart ticket ERC-721 contract on SBB L2...");
    }, 2400);

    const t3 = setTimeout(() => {
      setProgress(100);
      setMintStatus("Ticket Minted Successfully!");
      
      // Generate some mock blockchain hash and ticket ID
      const randomHash = "0x" + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
      const randomTicketId = `SBB-${Math.floor(Math.random() * 900000) + 100000}-NFT`;
      setTicketHash(randomHash);
      setTicketId(randomTicketId);
      
      setStep("success");
      onMintComplete(journey.co2Saving);
    }, 3600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen, journey]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-neutral-950/95 backdrop-blur-md rounded-3xl max-w-sm w-full shadow-2xl border border-white/10 relative overflow-hidden animate-scale-up text-white">
        
        {/* Top visual background ribbon */}
        <div className="h-2 bg-gradient-to-r from-[#EB0000] via-neutral-900 to-[#EB0000]" />

        {/* Header (Visible on success, dismissible on failure) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {step === "minting" ? (
          /* Minting Loading Phase */
          <div className="p-8 text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              {/* Outer pulsing neon ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#EB0000] animate-spin" style={{ animationDuration: "8s" }} />
              <div className="absolute inset-2 bg-white/5 rounded-full flex items-center justify-center">
                <Ticket className="w-8 h-8 text-[#EB0000] animate-pulse" />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-sans font-extrabold text-white">
                Minting Smart Ticket NFT
              </h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed px-4 min-h-[36px]">
                {mintStatus}
              </p>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#EB0000] to-neutral-950 transition-all duration-300 rounded-full" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500">
                {progress}% Complete
              </span>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center gap-2 justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-[9.5px] font-sans font-bold text-slate-400 text-left">
                Gas-free L2 ledger synchronization. Secured by SBB Validators.
              </span>
            </div>
          </div>
        ) : (
          /* Success Ticket Display (Stunning card matching SBB SwissPass) */
          <div className="p-6 space-y-6">
            
            <div className="text-center">
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-base font-sans font-extrabold text-white">
                Web3 Ticket Minted!
              </h3>
              <p className="text-xs text-emerald-400 font-sans font-semibold mt-1">
                +23 SBB Reward Tokens Earned
              </p>
            </div>

            {/* Beautiful Holographic SBB Ticket Card */}
            <div className="bg-gradient-to-br from-neutral-900 via-slate-800 to-neutral-950 text-white p-5 rounded-2xl shadow-xl relative overflow-hidden border border-neutral-700">
              
              {/* Dynamic decorative shapes */}
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#EB0000]/15 rounded-full blur-xl pointer-events-none" />
              
              {/* Top Banner inside Ticket */}
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 bg-[#EB0000] flex items-center justify-center rounded-sm">
                    <svg viewBox="0 0 100 100" className="w-4 h-4 text-white fill-current">
                      <path d="M10,43 L80,43 L65,28 L72,20 L100,50 L72,80 L65,72 L80,57 L10,57 L10,43 Z" />
                      <path d="M90,57 L20,57 L35,72 L28,80 L0,50 L28,20 L35,28 L20,43 L90,43 L90,57 Z" className="opacity-80" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-sans font-extrabold tracking-wider">
                    SBB SWISS PASS NFT
                  </span>
                </div>
                <span className="px-1.5 py-0.5 text-[8px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded font-bold uppercase tracking-wider">
                  VERIFIED
                </span>
              </div>

              {/* Station Details */}
              <div className="py-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[8px] text-slate-400 font-bold uppercase block tracking-wider">From</span>
                    <span className="text-sm font-sans font-extrabold text-white">{journey.fromStation}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] text-slate-400 font-bold uppercase block tracking-wider">To</span>
                    <span className="text-sm font-sans font-extrabold text-white">{journey.toStation}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-[10px]">
                  <div>
                    <span className="text-[8px] text-slate-500 block">Depart</span>
                    <span className="font-sans font-bold text-slate-200">{journey.departureTime}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-500 block">Platform</span>
                    <span className="font-sans font-bold text-slate-200">{journey.platform}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] text-slate-500 block">Seat</span>
                    <span className="font-mono font-bold text-emerald-400">12A (Car 3)</span>
                  </div>
                </div>
              </div>

              {/* Interactive QR Code scan box */}
              <div className="bg-white p-3 rounded-xl flex items-center justify-between gap-4 mt-1 border border-white/10">
                <QrCode className="w-16 h-16 text-slate-900 shrink-0" />
                <div className="flex-1 space-y-1 text-left">
                  <span className="text-[8px] font-mono font-bold text-slate-400 block uppercase">NFT ID</span>
                  <span className="text-[9px] font-mono font-extrabold text-neutral-800 break-all leading-none">
                    {ticketId}
                  </span>
                  <span className="text-[8px] font-sans text-slate-500 block leading-tight mt-0.5">
                    Scan at station gate validator. Secured by zero-knowledge travel proof.
                  </span>
                </div>
              </div>

              {/* Blockhash footer */}
              <div className="pt-3 mt-3 border-t border-white/15 flex justify-between items-center text-[7.5px] font-mono text-slate-400">
                <span>Block Tx hash</span>
                <span className="max-w-[150px] truncate font-bold text-slate-300">{ticketHash}</span>
              </div>
            </div>

            {/* Extra ticket operations */}
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => alert("Printing smart-ticket receipt to default SBB thermal terminal...")}
                className="flex flex-col items-center gap-1.5 p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span className="text-[9px] font-sans font-bold">Print Ticket</span>
              </button>
              <button 
                onClick={() => alert("Downloading ticket PDF file & JSON blockchain metadata package...")}
                className="flex flex-col items-center gap-1.5 p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span className="text-[9px] font-sans font-bold">Save PDF</span>
              </button>
              <button 
                onClick={() => alert("Sharing Web3 passport credential metadata link...")}
                className="flex flex-col items-center gap-1.5 p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-[9px] font-sans font-bold">Share NFT</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-[#EB0000] text-white rounded-xl text-xs font-bold hover:bg-[#C30000] transition-colors"
            >
              Close / View Active Journeys
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
