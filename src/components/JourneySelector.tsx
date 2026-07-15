/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Clock, 
  Sparkles, 
  ChevronRight, 
  Info, 
  Train, 
  Leaf, 
  Coins, 
  ArrowRight,
  TrendingUp,
  UserCheck
} from "lucide-react";
import { Journey, WalletState } from "../types";

interface JourneySelectorProps {
  journeys: Journey[];
  selectedJourney: Journey;
  setSelectedJourney: (journey: Journey) => void;
  wallet: WalletState;
  onBookTicket: (journey: Journey) => void;
}

export default function JourneySelector({
  journeys,
  selectedJourney,
  setSelectedJourney,
  wallet,
  onBookTicket,
}: JourneySelectorProps) {
  const timeFilters = [
    { label: "Earlier", id: "earlier" },
    { label: "Now", id: "now" },
    { label: "12:00", id: "12" },
    { label: "14:00", id: "14" },
    { label: "16:00", id: "16" },
    { label: "18:00", id: "18" },
    { label: "Later", id: "later" },
  ];
  const [activeFilter, setActiveFilter] = useState("now");

  return (
    <div className="space-y-6">
      {/* Time Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-white/10">
        <div className="flex flex-wrap items-center gap-2">
          {timeFilters.map((filter) => {
            const isNow = filter.id === "now";
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold font-sans transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#EB0000] text-white font-bold shadow-sm"
                    : isNow
                    ? "bg-[#EB0000]/20 text-[#EB0000] border border-[#EB0000]/30 hover:bg-[#EB0000]/30"
                    : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold font-sans text-slate-300 hover:text-white border border-white/10 bg-white/5 rounded-xl transition-all shadow-sm">
          <span>Filters</span>
          <span className="w-1.5 h-1.5 bg-[#EB0000] rounded-full"></span>
        </button>
      </div>

      {/* Main Selected Journey Highlight Card (Dark Slate Theme) */}
      <div className="bg-neutral-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden border border-neutral-800">
        {/* Subtle glowing ambient gradient for Web3 look */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-red-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        {/* Card Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-xs font-bold font-mono bg-red-600 text-white rounded-md uppercase tracking-wider">
              {selectedJourney.type}
            </span>
            <span className="text-sm font-sans font-medium text-slate-300">
              Direction <span className="text-white font-bold">{selectedJourney.direction}</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono font-medium text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {selectedJourney.duration}
            </span>
            <button className="p-1.5 rounded-lg bg-neutral-800 text-slate-400 hover:text-white hover:bg-neutral-700 transition-colors">
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Route Timeline */}
        <div className="grid grid-cols-12 gap-2 items-center my-8">
          {/* Times */}
          <div className="col-span-3 text-left">
            <div className="text-4xl font-sans font-extrabold tracking-tight text-white">
              {selectedJourney.departureTime}
            </div>
            <div className="text-sm font-sans font-medium text-slate-400 mt-1">
              {selectedJourney.fromStation}
            </div>
          </div>

          {/* Graphical timeline track */}
          <div className="col-span-6 relative px-4 flex flex-col justify-center">
            {/* Horizontal line */}
            <div className="h-0.5 w-full bg-slate-700 relative flex justify-between items-center">
              {/* Highlight completed path in red */}
              <div className="absolute left-0 top-0 h-0.5 bg-red-500 w-1/2"></div>
              
              {/* Timeline nodes */}
              {selectedJourney.stops.map((stop, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === selectedJourney.stops.length - 1;
                return (
                  <div key={stop.station} className="relative flex flex-col items-center">
                    <span 
                      className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 z-10 ${
                        isFirst || idx <= 1
                          ? "bg-red-500 border-red-500 ring-4 ring-red-500/20"
                          : "bg-neutral-900 border-slate-600"
                      }`} 
                    />
                    <span className="absolute top-5 text-[9px] font-sans font-semibold text-slate-400 whitespace-nowrap tracking-wider">
                      {isFirst ? "Via" : isLast ? stop.station : stop.station.split("-")[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Arrival */}
          <div className="col-span-3 text-right">
            <div className="text-4xl font-sans font-extrabold tracking-tight text-white">
              {selectedJourney.arrivalTime}
            </div>
            <div className="text-sm font-sans font-medium text-slate-400 mt-1">
              {selectedJourney.toStation}
            </div>
          </div>
        </div>

        {/* Bottom Status panel and CTA */}
        <div className="mt-10 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-4 gap-4 w-full sm:w-auto">
            <div className="flex flex-col">
              <span className="text-[10px] font-sans font-bold text-slate-500 uppercase tracking-wider">Platform</span>
              <span className="text-sm font-sans font-bold text-white mt-0.5">{selectedJourney.platform}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-sans font-bold text-slate-500 uppercase tracking-wider">Occupancy</span>
              <span className={`text-sm font-sans font-bold mt-0.5 ${
                selectedJourney.occupancy === "Low" ? "text-emerald-400" : selectedJourney.occupancy === "Medium" ? "text-amber-400" : "text-rose-400"
              }`}>{selectedJourney.occupancy}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-sans font-bold text-slate-500 uppercase tracking-wider">CO₂ Saving</span>
              <span className="text-sm font-sans font-bold text-emerald-400 mt-0.5 flex items-center gap-0.5">
                <Leaf className="w-3.5 h-3.5" />
                {selectedJourney.co2Saving} kg
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-sans font-bold text-slate-500 uppercase tracking-wider">Price</span>
              <span className="text-sm font-sans font-extrabold text-white mt-0.5">CHF {selectedJourney.price.toFixed(2)}</span>
            </div>
          </div>

          {/* Web3 ticket booking button */}
          <button
            onClick={() => onBookTicket(selectedJourney)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-sans font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg shadow-red-600/20 shrink-0"
          >
            {wallet.isConnected ? (
              <>
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                <span>Book Smart Ticket (Mint NFT)</span>
              </>
            ) : (
              <>
                <span>View Journey</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alternative Journeys List */}
      <div className="space-y-3">
        <h3 className="text-xs font-sans font-bold text-slate-400 uppercase tracking-wider mb-2">Alternative Timetable Rows</h3>
        {journeys.map((journey) => {
          const isSelected = selectedJourney.id === journey.id;
          return (
            <div
              key={journey.id}
              onClick={() => setSelectedJourney(journey)}
              className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between ${
                isSelected
                  ? "border-[#EB0000] bg-red-950/20 shadow-lg text-white"
                  : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:shadow-lg text-slate-300"
              }`}
            >
              {/* Departure and Code */}
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-sm font-sans font-extrabold text-white">
                    {journey.departureTime}
                  </span>
                  <span className="text-[10px] font-sans font-medium text-slate-400 mt-0.5">
                    {journey.fromStation}
                  </span>
                </div>

                <span className={`px-2 py-0.5 text-[10px] font-bold font-mono rounded border uppercase ${
                  isSelected ? "bg-red-600 text-white border-red-600" : "bg-white/5 text-slate-300 border-white/10"
                }`}>
                  {journey.type}
                </span>
              </div>

              {/* Graphical mini stop indicator */}
              <div className="hidden sm:flex items-center gap-4 text-[10px] font-sans font-semibold text-slate-500">
                <span className="w-1.5 h-1.5 bg-slate-600 rounded-full"></span>
                <span>{journey.stops[1].station}</span>
                <span className="w-1.5 h-1.5 bg-slate-600 rounded-full"></span>
                <span>{journey.stops[2].station}</span>
                <span className="w-1.5 h-1.5 bg-slate-600 rounded-full"></span>
              </div>

              {/* Arrival and Info */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-sm font-sans font-extrabold text-white">
                    {journey.arrivalTime}
                  </span>
                  <span className="text-[10px] font-sans font-medium text-slate-400 block mt-0.5">
                    {journey.toStation}
                  </span>
                </div>

                <div className="text-right hidden md:block">
                  <span className="text-xs font-sans font-medium text-slate-400">
                    {journey.duration}
                  </span>
                  <span className="text-xs font-mono font-bold text-white block mt-0.5">
                    CHF {journey.price.toFixed(2)}
                  </span>
                </div>

                <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? "text-[#EB0000] translate-x-1" : "text-slate-500"}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
