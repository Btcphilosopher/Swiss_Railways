/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Sparkles, 
  Coins, 
  Coffee, 
  Gift, 
  ChevronRight, 
  Check, 
  QrCode, 
  History, 
  ArrowUpRight, 
  TrendingUp,
  X,
  Compass,
  Zap,
  CheckCircle2
} from "lucide-react";
import { RewardItem, WalletState, TokenTransaction } from "../types";
import { REWARD_ITEMS, INITIAL_TRANSACTIONS } from "../data";

interface TokenRewardsProps {
  wallet: WalletState;
  setWallet: React.Dispatch<React.SetStateAction<WalletState>>;
  transactions: TokenTransaction[];
  setTransactions: React.Dispatch<React.SetStateAction<TokenTransaction[]>>;
}

export default function TokenRewards({
  wallet,
  setWallet,
  transactions,
  setTransactions,
}: TokenRewardsProps) {
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [redeemedVoucher, setRedeemedVoucher] = useState<{ item: RewardItem; hash: string } | null>(null);
  const [floatingPoints, setFloatingPoints] = useState<{ id: number; x: number; y: number }[]>([]);
  const [floatingId, setFloatingId] = useState(0);

  // Handle clicking the physical SBB Web3 Coin to mine/faucet some tokens!
  const handleCoinClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Increment SBB Token Balance by 10
    setWallet((prev) => ({
      ...prev,
      tokenBalance: prev.tokenBalance + 10,
    }));

    // Add faucet transaction
    const newTx: TokenTransaction = {
      id: `t-faucet-${Date.now()}`,
      timestamp: "Just now",
      description: "Eco-Tap Token Reward",
      amount: 10,
      type: "earn",
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Create a floating text "+10" where clicked
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setFloatingPoints((prev) => [...prev, { id: floatingId, x, y }]);
    setFloatingId((prev) => prev + 1);

    // Remove floating point after 1s
    setTimeout(() => {
      setFloatingPoints((prev) => prev.filter((p) => p.id !== floatingId));
    }, 1000);
  };

  const handleRedeem = (item: RewardItem) => {
    if (!wallet.isConnected) {
      alert("Please connect your Web3 wallet in the top bar to authenticate on SBB Chain first!");
      return;
    }
    if (wallet.tokenBalance < item.cost) {
      alert("Insufficient SBB Tokens. Click the glowing SBB Coin to earn more free tokens!");
      return;
    }

    // Deduct tokens
    setWallet((prev) => ({
      ...prev,
      tokenBalance: prev.tokenBalance - item.cost,
    }));

    // Generate transaction
    const newTx: TokenTransaction = {
      id: `t-spend-${Date.now()}`,
      timestamp: "Just now",
      description: `Redeemed ${item.title}`,
      amount: -item.cost,
      type: "spend",
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Set success voucher
    const mockHash = "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    setRedeemedVoucher({ item, hash: mockHash });
    setSelectedReward(null);
  };

  return (
    <div className="glass rounded-3xl p-6 relative overflow-hidden group">
      {/* Background radial accent */}
      <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-[#EB0000]/5 rounded-full blur-2xl group-hover:bg-[#EB0000]/10 transition-colors pointer-events-none" />

      {/* Beta badge */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-[#EB0000]/20 text-[#EB0000] rounded-full uppercase tracking-wider">
            Beta
          </span>
          <h3 className="text-sm font-sans font-extrabold text-white mt-1 flex items-center gap-1">
            <Coins className="w-4 h-4 text-[#EB0000]" />
            SBB Token Rewards
          </h3>
          <p className="text-[10px] font-sans text-slate-500 font-medium mt-0.5">
            Travel. Earn. Redeem.
          </p>
        </div>
        
        {/* Toggle Ledger Button */}
        <button
          onClick={() => setIsLedgerOpen(true)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
          title="View ledger history"
        >
          <History className="w-4 h-4" />
        </button>
      </div>

      {/* Main card representation with 3D glowing coin */}
      <div className="grid grid-cols-12 gap-4 items-center mt-2 relative z-10">
        
        {/* Balance */}
        <div className="col-span-7">
          <span className="text-[9px] font-sans font-bold text-slate-500 uppercase tracking-wider block">
            You have
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-4xl font-sans font-extrabold text-white tracking-tight">
              {wallet.tokenBalance}
            </span>
            <span className="text-xs font-sans font-bold text-[#EB0000]">
              SBB TOK
            </span>
          </div>
          <span className="text-[9.5px] font-mono font-medium text-emerald-500 flex items-center gap-1 mt-2">
            <Zap className="w-3 h-3 text-amber-500 animate-pulse fill-amber-500" />
            Minting active on SBB-Chain
          </span>
        </div>

        {/* 3D Interactive SBB Token Coin */}
        <div className="col-span-5 flex justify-end">
          <div
            onClick={handleCoinClick}
            className="w-20 h-20 bg-gradient-to-tr from-[#EB0000] to-[#9B0000] rounded-full flex items-center justify-center cursor-pointer shadow-lg shadow-[#EB0000]/30 hover:shadow-[#EB0000]/40 transition-all active:scale-90 select-none relative group/coin"
          >
            {/* Spinning/rotating glass circle effect */}
            <div className="absolute inset-1 rounded-full border border-white/30 bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center animate-[spin_10s_linear_infinite]" />
            
            {/* SBB Cross Arrow symbol inside */}
            <svg viewBox="0 0 100 100" className="w-9 h-9 text-white fill-current transform group-hover/coin:scale-110 transition-transform">
              <path d="M10,43 L80,43 L65,28 L72,20 L100,50 L72,80 L65,72 L80,57 L10,57 L10,43 Z" />
              <path d="M90,57 L20,57 L35,72 L28,80 L0,50 L28,20 L35,28 L20,43 L90,43 L90,57 Z" className="opacity-80" />
            </svg>

            {/* Glowing ring */}
            <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover/coin:border-white/20 animate-pulse pointer-events-none" />

            {/* Tap helper text */}
            <span className="absolute -bottom-1 bg-neutral-950 text-white border border-white/10 font-mono text-[7px] font-extrabold px-1 py-0.5 rounded uppercase tracking-widest scale-75 whitespace-nowrap animate-bounce">
              Tap to Earn
            </span>

            {/* Floating numbers on click */}
            {floatingPoints.map((pt) => (
              <span
                key={pt.id}
                style={{ left: pt.x, top: pt.y - 15 }}
                className="absolute text-emerald-400 font-mono font-extrabold text-xs animate-[ping_0.8s_ease-out_forwards] pointer-events-none"
              >
                +10
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Rewards Marketplace action */}
      <button
        onClick={() => setIsMarketplaceOpen(true)}
        className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-sans text-xs font-bold text-white transition-all flex items-center justify-center gap-1 shadow-lg cursor-pointer"
      >
        <span>View Rewards Marketplace</span>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </button>

      {/* ========================================================
          MARKETPLACE OVERLAY MODAL
         ======================================================== */}
      {isMarketplaceOpen && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-[#0a0a0a]/95 backdrop-blur-md rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-white/10 flex flex-col relative animate-scale-up text-white">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02] sticky top-0 z-10">
              <div>
                <h3 className="text-base font-sans font-extrabold text-white flex items-center gap-2">
                  <Gift className="w-5 h-5 text-[#EB0000]" />
                  Web3 SBB Rewards Marketplace
                </h3>
                <span className="text-xs font-sans text-slate-400 font-medium mt-1 block">
                  Redeem on-chain tokens for exclusive Swiss traveling utility
                </span>
              </div>
              <button
                onClick={() => {
                  setIsMarketplaceOpen(false);
                  setRedeemedVoucher(null);
                }}
                className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              
              {/* Wallet header */}
              <div className="p-4 bg-white/5 border border-white/10 text-white rounded-2xl flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider block">Connected Ledger</span>
                  <span className="text-xs font-mono font-semibold text-emerald-400 mt-1 block">
                    {wallet.isConnected ? wallet.address : "Offline / Not Connected"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider block">Token Balance</span>
                  <span className="text-lg font-mono font-bold text-amber-400 flex items-center gap-1 justify-end">
                    {wallet.tokenBalance} TOK
                  </span>
                </div>
              </div>

              {/* Success claim ticket */}
              {redeemedVoucher && (
                <div className="bg-emerald-950/20 border border-emerald-500/20 p-5 rounded-2xl text-center space-y-4 animate-fade-in">
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-sans font-bold text-white">Reward NFT Redeemed Successfully!</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      A smart voucher has been minted on-chain to your address.
                    </p>
                  </div>

                  {/* QR Code section */}
                  <div className="bg-white p-4 rounded-xl max-w-[150px] mx-auto flex flex-col items-center shadow-lg">
                    <QrCode className="w-24 h-24 text-slate-800" />
                    <span className="text-[8px] font-mono font-extrabold text-[#EB0000] uppercase tracking-widest mt-2 block">
                      {redeemedVoucher.item.id.toUpperCase()}-{wallet.tokenBalance}
                    </span>
                  </div>

                  <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1.5 text-left text-[10px] font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Voucher</span>
                      <span className="text-white font-bold">{redeemedVoucher.item.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Mint Tx Hash</span>
                      <span className="text-slate-300 font-bold max-w-[120px] truncate">{redeemedVoucher.hash}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status</span>
                      <span className="text-emerald-400 font-bold">Verifiable / Unused</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setRedeemedVoucher(null)}
                    className="px-4 py-2 bg-white/10 text-white rounded-lg text-xs font-bold hover:bg-white/20 transition-colors border border-white/10"
                  >
                    Redeem another
                  </button>
                </div>
              )}

              {/* Items List */}
              {!redeemedVoucher && (
                <div className="space-y-3">
                  {REWARD_ITEMS.map((item) => {
                    const canAfford = wallet.tokenBalance >= item.cost;
                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 ${
                          canAfford
                            ? "border-white/5 bg-white/[0.02] hover:border-[#EB0000]/30 hover:shadow-lg"
                            : "border-white/5 bg-white/[0.01] opacity-50"
                        }`}
                      >
                        {/* Icon and metadata */}
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            canAfford ? "bg-[#EB0000]/20 text-[#EB0000]" : "bg-white/5 text-slate-500"
                          }`}>
                            {item.iconName === "TrendingUp" && <TrendingUp className="w-5 h-5" />}
                            {item.iconName === "Coffee" && <Coffee className="w-5 h-5" />}
                            {item.iconName === "CupSoda" && <Coffee className="w-5 h-5" />}
                            {item.iconName === "Sparkles" && <Sparkles className="w-5 h-5" />}
                            {item.iconName === "Compass" && <Compass className="w-5 h-5" />}
                          </div>
                          <div>
                            <span className="text-[9px] font-sans font-bold bg-white/10 text-slate-300 px-1.5 py-0.5 rounded uppercase tracking-wider block w-fit">
                              {item.category}
                            </span>
                            <span className="text-xs font-sans font-extrabold text-white mt-1 block">
                              {item.title}
                            </span>
                            <span className="text-[10px] font-sans text-slate-400 mt-0.5 block leading-normal">
                              {item.description}
                            </span>
                          </div>
                        </div>

                        {/* Cost & Button */}
                        <div className="text-right shrink-0">
                          <span className="text-sm font-mono font-extrabold text-white block">
                            {item.cost} TOK
                          </span>
                          <button
                            onClick={() => handleRedeem(item)}
                            disabled={!canAfford}
                            className={`mt-2 px-3 py-1.5 rounded-lg text-[10px] font-sans font-bold transition-all cursor-pointer ${
                              canAfford
                                ? "bg-[#EB0000] text-white hover:bg-[#C30000] hover:scale-105 active:scale-95"
                                : "bg-white/5 text-slate-600 cursor-not-allowed"
                            }`}
                          >
                            Redeem
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TRANSACTIONS LEDGER OVERLAY MODAL
         ======================================================== */}
      {isLedgerOpen && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a0a]/95 backdrop-blur-md rounded-3xl max-w-md w-full shadow-2xl border border-white/10 flex flex-col relative animate-scale-up text-white">
            
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02] sticky top-0 z-10">
              <div>
                <h3 className="text-base font-sans font-extrabold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-[#EB0000]" />
                  On-Chain Mobility Ledger
                </h3>
                <span className="text-xs font-sans text-slate-400 font-medium block mt-1">
                  Private, zero-knowledge travel rewards ledger.
                </span>
              </div>
              <button
                onClick={() => setIsLedgerOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="p-6 space-y-3 overflow-y-auto max-h-[60vh]">
              {transactions.map((tx) => {
                const isEarn = tx.type === "earn";
                return (
                  <div
                    key={tx.id}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-sans font-medium text-slate-500 block">
                        {tx.timestamp}
                      </span>
                      <span className="text-xs font-sans font-bold text-white mt-0.5 block">
                        {tx.description}
                      </span>
                    </div>
                    <span className={`text-xs font-mono font-bold ${
                      isEarn ? "text-emerald-400" : "text-rose-400"
                    }`}>
                      {isEarn ? "+" : ""}{tx.amount} TOK
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
