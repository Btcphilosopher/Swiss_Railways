/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { ArrowLeftRight, Calendar, Search, MapPin } from "lucide-react";
import { Station } from "../types";
import { STATIONS } from "../data";

interface SearchFormProps {
  fromStation: string;
  setFromStation: (station: string) => void;
  toStation: string;
  setToStation: (station: string) => void;
  departTime: string;
  setDepartTime: (time: string) => void;
  onSearch: () => void;
}

export default function SearchForm({
  fromStation,
  setFromStation,
  toStation,
  setToStation,
  departTime,
  setDepartTime,
  onSearch,
}: SearchFormProps) {
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);
  const [fromQuery, setFromQuery] = useState(fromStation);
  const [toQuery, setToQuery] = useState(toStation);
  const [isRotating, setIsRotating] = useState(false);

  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  // Sync state if changed externally (e.g. clicking on map node)
  useEffect(() => {
    setFromQuery(fromStation);
  }, [fromStation]);

  useEffect(() => {
    setToQuery(toStation);
  }, [toStation]);

  // Handle outside clicks
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (fromRef.current && !fromRef.current.contains(event.target as Node)) {
        setIsFromOpen(false);
        setFromQuery(fromStation); // reset to validated value
      }
      if (toRef.current && !toRef.current.contains(event.target as Node)) {
        setIsToOpen(false);
        setToQuery(toStation); // reset to validated value
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [fromStation, toStation]);

  const handleSwap = () => {
    setIsRotating(true);
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
    setFromQuery(toStation);
    setToQuery(temp);
    setTimeout(() => setIsRotating(false), 300);
  };

  const filteredFromStations = STATIONS.filter(
    (s) =>
      s.name.toLowerCase().includes(fromQuery.toLowerCase()) &&
      s.name !== toStation
  );

  const filteredToStations = STATIONS.filter(
    (s) =>
      s.name.toLowerCase().includes(toQuery.toLowerCase()) &&
      s.name !== fromStation
  );

  return (
    <div className="glass p-6 rounded-2xl space-y-4 shadow-2xl">
      {/* Inputs row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative">
        
        {/* From Station */}
        <div ref={fromRef} className="col-span-1 md:col-span-4 relative">
          <label className="absolute left-4 top-2.5 text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider">
            From
          </label>
          <div className="flex items-center bg-white/[0.02] border border-white/10 hover:border-white/20 focus-within:border-[#EB0000] focus-within:bg-white/[0.05] rounded-xl pt-6 pb-2 px-4 transition-all duration-200">
            <input
              type="text"
              id="from-station-input"
              value={fromQuery}
              onChange={(e) => {
                setFromQuery(e.target.value);
                setIsFromOpen(true);
              }}
              onFocus={() => setIsFromOpen(true)}
              className="w-full bg-transparent border-none outline-none text-sm font-semibold text-white placeholder-slate-500 font-sans"
              placeholder="Origin Station"
            />
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
          </div>

          {/* From Suggestions Dropdown */}
          {isFromOpen && filteredFromStations.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 bg-[#0a0a0a]/95 border border-white/10 rounded-xl shadow-2xl z-30 max-h-48 overflow-y-auto py-1 backdrop-blur-md">
              {filteredFromStations.map((station) => (
                <button
                  key={station.id}
                  onClick={() => {
                    setFromStation(station.name);
                    setFromQuery(station.name);
                    setIsFromOpen(false);
                  }}
                  className="w-full px-4 py-2 text-xs font-sans font-medium text-left text-slate-300 hover:bg-white/5 flex justify-between items-center"
                >
                  <span>{station.name}</span>
                  <span className="text-[10px] font-mono text-slate-400">{station.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Swap Button (Absolute/Relative placement for seamless overlapping) */}
        <div className="col-span-1 md:col-span-1 flex justify-center z-10 -my-2 md:my-0">
          <button
            onClick={handleSwap}
            className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 text-slate-300 hover:text-white transition-all shadow-lg shrink-0"
          >
            <ArrowLeftRight 
              className={`w-4 h-4 transition-transform duration-300 ${isRotating ? "rotate-180 text-[#EB0000]" : ""}`} 
            />
          </button>
        </div>

        {/* To Station */}
        <div ref={toRef} className="col-span-1 md:col-span-4 relative">
          <label className="absolute left-4 top-2.5 text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider">
            To
          </label>
          <div className="flex items-center bg-white/[0.02] border border-white/10 hover:border-white/20 focus-within:border-[#EB0000] focus-within:bg-white/[0.05] rounded-xl pt-6 pb-2 px-4 transition-all duration-200">
            <input
              type="text"
              id="to-station-input"
              value={toQuery}
              onChange={(e) => {
                setToQuery(e.target.value);
                setIsToOpen(true);
              }}
              onFocus={() => setIsToOpen(true)}
              className="w-full bg-transparent border-none outline-none text-sm font-semibold text-white placeholder-slate-500 font-sans"
              placeholder="Destination Station"
            />
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
          </div>

          {/* To Suggestions Dropdown */}
          {isToOpen && filteredToStations.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 bg-[#0a0a0a]/95 border border-white/10 rounded-xl shadow-2xl z-30 max-h-48 overflow-y-auto py-1 backdrop-blur-md">
              {filteredToStations.map((station) => (
                <button
                  key={station.id}
                  onClick={() => {
                    setToStation(station.name);
                    setToQuery(station.name);
                    setIsToOpen(false);
                  }}
                  className="w-full px-4 py-2 text-xs font-sans font-medium text-left text-slate-300 hover:bg-white/5 flex justify-between items-center"
                >
                  <span>{station.name}</span>
                  <span className="text-[10px] font-mono text-slate-400">{station.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Departure Time */}
        <div className="col-span-1 md:col-span-2 relative">
          <label className="absolute left-4 top-2.5 text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider">
            Depart
          </label>
          <div className="flex items-center bg-white/[0.02] border border-white/10 hover:border-white/20 focus-within:border-[#EB0000] focus-within:bg-white/[0.05] rounded-xl pt-6 pb-2 px-4 transition-all duration-200">
            <input
              type="text"
              id="departure-time-input"
              value={departTime}
              onChange={(e) => setDepartTime(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-sm font-semibold text-white placeholder-slate-500 font-sans"
              placeholder="Departure Time"
            />
            <Calendar className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
          </div>
        </div>

        {/* Search Action */}
        <div className="col-span-1 md:col-span-1">
          <button
            onClick={onSearch}
            className="w-full h-[52px] bg-[#EB0000] hover:bg-[#C30000] text-white rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg"
          >
            <Search className="w-5 h-5 shrink-0" />
            <span className="md:hidden font-sans font-semibold text-sm">Search</span>
          </button>
        </div>
      </div>
    </div>
  );
}
