/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import SearchForm from "./components/SearchForm";
import JourneySelector from "./components/JourneySelector";
import LiveMap from "./components/LiveMap";
import LiveDepartures from "./components/LiveDepartures";
import TokenRewards from "./components/TokenRewards";
import BottomBanner from "./components/BottomBanner";
import WalletModal from "./components/WalletModal";
import TicketMintModal from "./components/TicketMintModal";

import { Journey, WalletState, TokenTransaction } from "./types";
import { INITIAL_JOURNEYS, INITIAL_TRANSACTIONS, REWARD_ITEMS, STATIONS } from "./data";
import { 
  Sparkles, 
  Ticket as TicketIcon, 
  MapPin, 
  CheckCircle2, 
  Coins, 
  QrCode, 
  Info, 
  ShieldCheck, 
  FileText, 
  Search,
  Train,
  ArrowRight
} from "lucide-react";

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState("timetable");
  const [activeHeaderTab, setActiveHeaderTab] = useState("timetable");

  // Wallet and Web3 State
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: 0.15, // ETH
    tokenBalance: 320, // Initial SBB tokens matching mock
    network: "SBB Swiss L2 Mainnet",
  });
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  // Transactions ledger state
  const [transactions, setTransactions] = useState<TokenTransaction[]>(INITIAL_TRANSACTIONS);

  // Journeys & Search State
  const [fromStation, setFromStation] = useState("Zürich HB");
  const [toStation, setToStation] = useState("Lugano");
  const [departTime, setDepartTime] = useState("Today, 10:24");
  const [journeys, setJourneys] = useState<Journey[]>(INITIAL_JOURNEYS);
  const [selectedJourney, setSelectedJourney] = useState<Journey>(INITIAL_JOURNEYS[1]); // IR 90 initially
  
  // Dynamic User Bookings State
  const [mintedTickets, setMintedTickets] = useState<Journey[]>([]);
  const [activeBookingJourney, setActiveBookingJourney] = useState<Journey | null>(null);

  // Wallet login handler
  const handleConnectSuccess = (address: string, walletName: string) => {
    // Add welcome bonus of 50 SBB tokens
    setWallet((prev) => ({
      ...prev,
      isConnected: true,
      address,
      tokenBalance: prev.tokenBalance + 50,
    }));

    // Register transaction
    const bonusTx: TokenTransaction = {
      id: `t-bonus-${Date.now()}`,
      timestamp: "Just now",
      description: `Signed in via ${walletName} (Welcome Bonus)`,
      amount: 50,
      type: "earn",
    };
    setTransactions((prev) => [bonusTx, ...prev]);
  };

  // Ticket Booking Trigger
  const handleBookTicket = (journey: Journey) => {
    if (!wallet.isConnected) {
      // Prompt wallet login first
      setIsWalletModalOpen(true);
    } else {
      // Trigger Ticket Minting
      setActiveBookingJourney(journey);
    }
  };

  // Ticket mint success callback
  const handleMintComplete = (co2Saved: number) => {
    if (!activeBookingJourney) return;

    // Add to booked tickets
    setMintedTickets((prev) => [activeBookingJourney, ...prev]);

    // Give carbon-savings tokens reward!
    const tokensGained = Math.round(co2Saved);
    setWallet((prev) => ({
      ...prev,
      tokenBalance: prev.tokenBalance + tokensGained,
    }));

    // Log transaction
    const mintTx: TokenTransaction = {
      id: `t-mint-${Date.now()}`,
      timestamp: "Just now",
      description: `Minted Ticket: ${activeBookingJourney.fromStation} → ${activeBookingJourney.toStation}`,
      amount: tokensGained,
      type: "earn",
    };
    setTransactions((prev) => [mintTx, ...prev]);
  };

  // Handle station query search & dynamically update alternative lines
  const handleSearch = () => {
    // Check if valid stations
    const validFrom = STATIONS.some((s) => s.name.toLowerCase() === fromStation.toLowerCase());
    const validTo = STATIONS.some((s) => s.name.toLowerCase() === toStation.toLowerCase());

    if (!validFrom || !validTo) {
      alert("Please specify valid Swiss stations from the suggestions list (e.g. Zürich HB, Lugano, Basel SBB, Bern, Genève).");
      return;
    }

    // Generate custom journeys based on selection
    const randomizedJourneys: Journey[] = [
      {
        id: `j-rand-1`,
        type: "IC 8",
        typeColor: "bg-red-600 text-white border-red-600",
        direction: toStation,
        fromStation,
        toStation,
        departureTime: "12:02",
        arrivalTime: "14:33",
        duration: "2h 31m",
        price: 29.00,
        platform: "4",
        occupancy: "Low",
        co2Saving: 22.4,
        stops: [
          { station: fromStation, time: "12:02", passed: true },
          { station: "Arth-Goldau", time: "12:44", passed: false },
          { station: "Bellinzona", time: "13:58", passed: false },
          { station: toStation, time: "14:33", passed: false },
        ],
      },
      {
        id: `j-rand-2`,
        type: "IR 90",
        typeColor: "bg-red-600 text-white border-red-600",
        direction: toStation,
        fromStation,
        toStation,
        departureTime: "12:32",
        arrivalTime: "15:03",
        duration: "2h 31m",
        price: 34.50,
        platform: "12",
        occupancy: "Medium",
        co2Saving: 24.1,
        stops: [
          { station: fromStation, time: "12:32", passed: true },
          { station: "Arth-Goldau", time: "13:14", passed: true },
          { station: "Bellinzona", time: "14:28", passed: false },
          { station: toStation, time: "15:03", passed: false },
        ],
      },
      {
        id: `j-rand-3`,
        type: "S 24",
        typeColor: "bg-slate-700 text-white border-slate-700",
        direction: toStation,
        fromStation,
        toStation,
        departureTime: "13:02",
        arrivalTime: "15:33",
        duration: "2h 31m",
        price: 29.00,
        platform: "7",
        occupancy: "Low",
        co2Saving: 21.9,
        stops: [
          { station: fromStation, time: "13:02", passed: false },
          { station: "Arth-Goldau", time: "13:44", passed: false },
          { station: "Bellinzona", time: "14:58", passed: false },
          { station: toStation, time: "15:33", passed: false },
        ],
      },
    ];

    setJourneys(randomizedJourneys);
    setSelectedJourney(randomizedJourneys[1]); // Default to second selection
  };

  return (
    <div className="flex bg-[#050505] min-h-screen text-slate-300 antialiased overflow-x-hidden">
      
      {/* 1. Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        wallet={wallet}
        onConnectWallet={() => setIsWalletModalOpen(true)}
        onDisconnectWallet={() => setWallet((prev) => ({ ...prev, isConnected: false, address: null }))}
      />

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        {/* Top Header */}
        <Header
          activeHeaderTab={activeHeaderTab}
          setActiveHeaderTab={(tab) => {
            setActiveHeaderTab(tab);
            if (tab === "timetable" || tab === "tickets") {
              setActiveTab(tab);
            }
          }}
          wallet={wallet}
          onConnectWallet={() => setIsWalletModalOpen(true)}
        />

        {/* 3. Render dynamic content based on activeTab */}
        <main className="p-8 space-y-6 max-w-7xl w-full mx-auto flex-1 pb-16">
          
          {activeTab === "timetable" && (
            <div className="space-y-6 animate-fade-in">
              {/* Introduction Banner explaining the Web3 Proposal */}
              <div className="p-6 bg-gradient-to-r from-[#EB0000]/10 via-transparent to-white/[0.01] border border-white/5 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-sans font-extrabold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#EB0000] animate-bounce" />
                    SBB Smart Mobility: Decentralized Swiss Traveling Proposal
                  </h2>
                  <p className="text-xs text-slate-400 font-sans mt-1 leading-relaxed max-w-2xl">
                    Welcome to the next generation Swiss rail network proposal. Search routes, connect a Web3 wallet to earn carbon offset tokens, and mint on-chain smart tickets instantly. Tap the spinning token or purchase tickets to grow your balance!
                  </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-2xl border border-white/10 shadow-lg shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-sans font-bold text-slate-300">SBB L2 Core Active</span>
                </div>
              </div>

              {/* Journey Search Form */}
              <SearchForm
                fromStation={fromStation}
                setFromStation={setFromStation}
                toStation={toStation}
                setToStation={setToStation}
                departTime={departTime}
                setDepartTime={setDepartTime}
                onSearch={handleSearch}
              />

              {/* Main Dashboard Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Side: Journey Rows & Current Card */}
                <div className="lg:col-span-8">
                  <JourneySelector
                    journeys={journeys}
                    selectedJourney={selectedJourney}
                    setSelectedJourney={setSelectedJourney}
                    wallet={wallet}
                    onBookTicket={handleBookTicket}
                  />
                </div>

                {/* Right Side: Map, Departures, Rewards Faucet */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Switzerland Live Network Map */}
                  <LiveMap
                    selectedJourney={selectedJourney}
                    fromStation={fromStation}
                    setFromStation={setFromStation}
                    toStation={toStation}
                    setToStation={setToStation}
                  />

                  {/* Zürich HB Live Departures */}
                  <LiveDepartures currentStation={fromStation} />

                  {/* SBB Web3 Reward Coin & Marketplace */}
                  <TokenRewards
                    wallet={wallet}
                    setWallet={setWallet}
                    transactions={transactions}
                    setTransactions={setTransactions}
                  />
                </div>
              </div>

              {/* Swiss Vision bottom cards */}
              <BottomBanner />
            </div>
          )}

          {activeTab === "journeys" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-xl font-sans font-extrabold text-white">My Saved Journeys & Tickets</h2>
                <p className="text-xs text-slate-400 font-sans mt-1">
                  View and manage your minted Web3 travel passes and historical bookings.
                </p>
              </div>

              {mintedTickets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mintedTickets.map((ticket, idx) => (
                    <div 
                      key={`minted-t-${idx}`}
                      className="bg-[#0a0a0a]/90 backdrop-blur-md text-white rounded-3xl p-5 border border-white/10 shadow-2xl relative overflow-hidden"
                    >
                      <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#EB0000]/10 rounded-full blur-xl" />
                      
                      {/* Ticket Header */}
                      <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
                        <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-[#EB0000] text-white rounded uppercase tracking-wider">
                          {ticket.type} Pass
                        </span>
                        <span className="text-[9px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          VERIFIED NFT
                        </span>
                      </div>

                      {/* Ticket Stations */}
                      <div className="py-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">From</span>
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">To</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-sans font-extrabold">{ticket.fromStation}</span>
                          <span className="text-xs text-slate-500 px-2 font-mono">→</span>
                          <span className="text-sm font-sans font-extrabold">{ticket.toStation}</span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-neutral-800/60 text-[10px] text-slate-300">
                          <div>
                            <span className="text-[8px] text-slate-500 block">Depart</span>
                            <span className="font-bold">{ticket.departureTime}</span>
                          </div>
                          <div>
                            <span className="text-[8px] text-slate-500 block">Platform</span>
                            <span className="font-bold">{ticket.platform}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[8px] text-slate-500 block">Price</span>
                            <span className="font-mono font-bold text-amber-400">CHF {ticket.price.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Ticket QR Code section */}
                      <div className="bg-white p-3 rounded-xl flex items-center justify-between gap-3 border border-neutral-800">
                        <QrCode className="w-12 h-12 text-slate-900 shrink-0" />
                        <div className="flex-1 text-left">
                          <span className="text-[8px] font-mono text-slate-400 block uppercase">Serial ID</span>
                          <span className="text-[9px] font-mono font-bold text-slate-800 block break-all">
                            SBB-NFT-{(idx + 1) * 3829}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center glass rounded-3xl space-y-4 max-w-md mx-auto mt-6">
                  <div className="w-12 h-12 bg-[#EB0000]/20 text-[#EB0000] rounded-2xl flex items-center justify-center mx-auto">
                    <TicketIcon className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-sans font-extrabold text-white">No active tickets booked yet</h3>
                    <p className="text-xs text-slate-400 font-sans mt-1 px-4 leading-relaxed">
                      Find a route inside the Timetable, connect your Web3 wallet, and click 'Book Smart Ticket' to mint your first Swiss travel NFT.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("timetable")}
                    className="px-4 py-2 bg-[#EB0000] hover:bg-[#C30000] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                  >
                    Go to Timetable
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "map" && (
            <div className="space-y-6 animate-fade-in h-[75vh] flex flex-col">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-xl font-sans font-extrabold text-white">Full-Screen Live Switzerland Map</h2>
                <p className="text-xs text-slate-400 font-sans mt-1">
                  Trace routes, verify Swiss validators, and select stations directly on the coordinates grid.
                </p>
              </div>

              <div className="flex-1 min-h-[500px]">
                <LiveMap
                  selectedJourney={selectedJourney}
                  fromStation={fromStation}
                  setFromStation={setFromStation}
                  toStation={toStation}
                  setToStation={setToStation}
                />
              </div>
            </div>
          )}

          {activeTab === "tickets" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-xl font-sans font-extrabold text-white">My NFT Ticket Wallet</h2>
                <p className="text-xs text-slate-400 font-sans mt-1">
                  On-chain immutable smart tickets verifiable globally. Contains {mintedTickets.length} active ERC-721 records.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Seed default ticket record */}
                <div className="bg-gradient-to-br from-[#1E293B]/20 to-neutral-950 text-white rounded-3xl p-5 border border-white/10 shadow-lg relative">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                    <span className="px-2 py-0.5 text-[8px] font-mono bg-[#EB0000] text-white rounded font-bold uppercase">
                      IR 90 Segment
                    </span>
                    <span className="text-[8px] font-mono text-slate-400 font-bold">HISTORIC NFT</span>
                  </div>
                  <div className="py-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-sans font-bold">Zürich HB</span>
                      <span className="text-slate-500">→</span>
                      <span className="text-xs font-sans font-bold">Bern</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-sans">
                      Used on June 12, 2026. Accounted for 21.4 kg carbon offset.
                    </p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center justify-between gap-3 text-slate-300">
                    <QrCode className="w-10 h-10 shrink-0 opacity-80" />
                    <div className="flex-1 text-left text-[8px] font-mono">
                      <span>CONTRACT: 0x98bA...3e9d</span>
                    </div>
                  </div>
                </div>

                {/* Show current minted tickets as well */}
                {mintedTickets.map((ticket, idx) => (
                  <div 
                    key={`ticket-card-${idx}`}
                    className="bg-gradient-to-br from-neutral-900/80 to-[#0a0a0a]/90 text-white rounded-3xl p-5 border border-white/10 shadow-lg relative"
                  >
                    <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
                      <span className="px-2 py-0.5 text-[8px] font-mono bg-red-600 text-white rounded font-bold uppercase">
                        {ticket.type} Pass
                      </span>
                      <span className="text-[8px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                        ACTIVE
                      </span>
                    </div>
                    <div className="py-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-sans font-bold">{ticket.fromStation}</span>
                        <span className="text-slate-600">→</span>
                        <span className="text-xs font-sans font-bold">{ticket.toStation}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-sans">
                        Valid for travel today. Platform {ticket.platform}. Price CHF {ticket.price.toFixed(2)}.
                      </p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center justify-between gap-3 text-slate-300">
                      <QrCode className="w-10 h-10 shrink-0" />
                      <div className="flex-1 text-left text-[8px] font-mono">
                        <span className="block text-slate-400">ID: SBB-{(idx+1)*8892}</span>
                        <span className="block text-slate-400">TX: 0x931a...{idx}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "swisspass" && (
            <div className="space-y-6 animate-fade-in max-w-xl mx-auto">
              <div className="border-b border-white/10 pb-4 text-center">
                <h2 className="text-xl font-sans font-extrabold text-white">Web3 SBB Swiss Pass</h2>
                <p className="text-xs text-slate-400 font-sans mt-1">
                  Your primary Swiss transit identity NFT. Verifiable on-chain.
                </p>
              </div>

              {wallet.isConnected ? (
                <div className="bg-gradient-to-br from-red-600 via-[#EB0000] to-neutral-900 text-white p-6 rounded-3xl shadow-2xl relative overflow-hidden border border-red-500">
                  {/* Glowing background circles */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                  
                  {/* SBB Logo inside SwissPass */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-white flex items-center justify-center rounded-lg">
                        <svg viewBox="0 0 100 100" className="w-6 h-6 text-[#EB0000] fill-current">
                          <path d="M10,43 L80,43 L65,28 L72,20 L100,50 L72,80 L65,72 L80,57 L10,57 L10,43 Z" />
                          <path d="M90,57 L20,57 L35,72 L28,80 L0,50 L28,20 L35,28 L20,43 L90,43 L90,57 Z" className="opacity-80" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-xs font-sans font-extrabold tracking-wider">SWISSPASS</h4>
                        <span className="text-[8px] font-mono tracking-widest text-red-200 uppercase font-bold">
                          Decentralized Identity
                        </span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 text-[8px] font-mono bg-white/20 text-white border border-white/30 rounded uppercase font-bold">
                      HALF-FARE ON-CHAIN
                    </span>
                  </div>

                  {/* Avatar and Info */}
                  <div className="mt-8 flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-3xl select-none shadow">
                      🇨🇭
                    </div>
                    <div className="space-y-1 text-left">
                      <span className="text-[10px] font-sans font-bold text-red-200 uppercase tracking-wide block">Card Holder</span>
                      <span className="text-sm font-sans font-extrabold block">Swiss Travel Citizen</span>
                      <span className="text-[9px] font-mono text-red-100 block opacity-90 break-all">
                        {wallet.address}
                      </span>
                    </div>
                  </div>

                  {/* Carbon saving stats & Token balances */}
                  <div className="grid grid-cols-2 gap-4 mt-8 pt-4 border-t border-white/10 text-xs">
                    <div>
                      <span className="text-[9px] text-red-200 block">SBB Token Balance</span>
                      <span className="font-mono font-extrabold text-base text-amber-300">{wallet.tokenBalance} TOK</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-red-200 block">EVM Gas Balance</span>
                      <span className="font-mono font-bold">{wallet.balance.toFixed(2)} ETH</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center glass rounded-3xl space-y-4 max-w-md mx-auto">
                  <div className="w-12 h-12 bg-[#EB0000]/20 text-[#EB0000] rounded-2xl flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6 animate-spin" style={{ animationDuration: "6s" }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-sans font-extrabold text-white">Swiss Pass is Offline</h3>
                    <p className="text-xs text-slate-400 font-sans mt-1 px-4 leading-relaxed">
                      Connect your Ethereum address or Web3 passport wallet using the top 'Connect Wallet' button to unlock your decentralized Swiss Pass.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsWalletModalOpen(true)}
                    className="px-5 py-2.5 bg-[#EB0000] hover:bg-[#C30000] text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    Connect Wallet
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "freight" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-xl font-sans font-extrabold text-white">SBB Cargo Web3 Freight Logistics</h2>
                <p className="text-xs text-slate-400 font-sans mt-1">
                  Decentralized cargo load ledger tracking shipping containers across the Swiss alpine corridor.
                </p>
              </div>

              <div className="glass rounded-3xl p-6 shadow-2xl space-y-6 max-w-3xl mx-auto">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-sans font-bold text-slate-400 uppercase tracking-wider">
                    ACTIVE FREIGHT CARGO LOADS
                  </span>
                  <span className="px-2 py-0.5 text-[9px] font-mono bg-white/10 text-slate-300 rounded">
                    Network: Gotthard Tunnel Node
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { id: "c-103", route: "Basel Cargo Term. → Chiasso Smistamento", status: "Transiting Gotthard Tunnel", weight: "420 Tons", hash: "0xc839...4e3" },
                    { id: "c-104", route: "Zürich Limmattal → Geneve Cargo Term.", status: "Departing in 12 mins", weight: "180 Tons", hash: "0xd294...8b2" },
                    { id: "c-105", route: "St. Gallen Cargo → Lugano Vedeggio", status: "Loaded & Verified on SBB-Chain", weight: "310 Tons", hash: "0xe904...1c9" },
                  ].map((cargo) => (
                    <div 
                      key={cargo.id}
                      className="p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-neutral-800 text-white rounded">
                            ID: {cargo.id}
                          </span>
                          <span className="text-xs font-sans font-extrabold text-white">
                            {cargo.route}
                          </span>
                        </div>
                        <p className="text-[10px] font-sans text-slate-400">
                          Weight: {cargo.weight} | Block validation signature: <span className="font-mono text-slate-500">{cargo.hash}</span>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-sans font-bold text-[#EB0000] block">
                          {cargo.status}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400">
                          Active telemetry
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* 4. Overlays & Modals */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnectSuccess={handleConnectSuccess}
      />

      {activeBookingJourney && (
        <TicketMintModal
          isOpen={!!activeBookingJourney}
          onClose={() => setActiveBookingJourney(null)}
          journey={activeBookingJourney}
          wallet={wallet}
          onMintComplete={handleMintComplete}
        />
      )}
    </div>
  );
}
