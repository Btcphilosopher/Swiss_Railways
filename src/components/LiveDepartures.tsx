/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Train, Clock, Search, ArrowUpRight } from "lucide-react";
import { Departure } from "../types";
import { INITIAL_DEPARTURES } from "../data";

interface LiveDeparturesProps {
  currentStation: string;
}

export default function LiveDepartures({ currentStation }: LiveDeparturesProps) {
  const [departures, setDepartures] = useState<Departure[]>(INITIAL_DEPARTURES);
  const [filterQuery, setFilterQuery] = useState("");

  // Periodically simulate small live updates to delays/platform changes
  useEffect(() => {
    const interval = setInterval(() => {
      setDepartures((prev) =>
        prev.map((dep) => {
          // 15% chance of changing status or delay slightly
          if (Math.random() < 0.15) {
            const isDelayNow = Math.random() > 0.5;
            if (isDelayNow) {
              return {
                ...dep,
                status: "delay",
                delayMinutes: Math.floor(Math.random() * 4) + 1,
              };
            } else {
              return {
                ...dep,
                status: "on-time",
                delayMinutes: undefined,
              };
            }
          }
          return dep;
        })
      );
    }, 15000); // every 15s

    return () => clearInterval(interval);
  }, []);

  const filteredDepartures = departures.filter((dep) =>
    dep.destination.toLowerCase().includes(filterQuery.toLowerCase()) ||
    dep.type.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="glass rounded-3xl p-5 shadow-2xl flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-sm font-sans font-extrabold text-white flex items-center gap-2">
            <Train className="w-4 h-4 text-[#EB0000]" />
            Live Departures
          </h3>
          <span className="text-[10px] font-mono text-slate-500 font-semibold block mt-1 uppercase">
            Station: <span className="text-white">{currentStation}</span>
          </span>
        </div>
        <button className="text-[11px] font-sans font-bold text-slate-500 hover:text-white flex items-center gap-0.5 transition-colors">
          <span>View all</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Search */}
      <div className="flex items-center bg-white/[0.02] border border-white/10 hover:border-white/20 focus-within:border-[#EB0000] rounded-xl px-3 py-1.5 mb-4 transition-all duration-200">
        <Search className="w-3.5 h-3.5 text-slate-500 shrink-0 mr-2" />
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Filter departures..."
          className="w-full bg-transparent text-xs font-sans font-medium text-white placeholder-slate-500 outline-none border-none"
        />
      </div>

      {/* Departures List */}
      <div className="space-y-3 flex-1 overflow-y-auto max-h-[250px] pr-1">
        {filteredDepartures.length > 0 ? (
          filteredDepartures.map((dep) => {
            const isDelay = dep.status === "delay";
            return (
              <div
                key={dep.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 transition-all duration-200"
              >
                {/* Time and Train Type */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-extrabold text-white">
                    {dep.time}
                  </span>
                  <span className="px-2 py-0.5 text-[9px] font-bold font-mono bg-red-600 text-white rounded">
                    {dep.type}
                  </span>
                </div>

                {/* Destination and Platform */}
                <div className="flex-1 px-4 text-left">
                  <span className="text-xs font-sans font-bold text-white block">
                    {dep.destination}
                  </span>
                  <span className="text-[10px] font-sans text-slate-400">
                    Platform {dep.platform}
                  </span>
                </div>

                {/* Live Status Indicator */}
                <div className="text-right flex items-center gap-2">
                  <span className={`text-[10px] font-sans font-bold ${
                    isDelay ? "text-amber-500" : "text-emerald-500"
                  }`}>
                    {isDelay ? `+ ${dep.delayMinutes} min` : "On time"}
                  </span>
                  <span className={`w-2 h-2 rounded-full relative flex`}>
                    {isDelay && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    )}
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${
                      isDelay ? "bg-amber-500" : "bg-emerald-500"
                    }`}></span>
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-xs font-sans text-slate-500 font-medium">
            No matching departures.
          </div>
        )}
      </div>
    </div>
  );
}
