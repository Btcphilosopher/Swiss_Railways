/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Plus, Minus, Compass, Landmark, Network } from "lucide-react";
import { Station, Journey } from "../types";
import { STATIONS } from "../data";

interface LiveMapProps {
  selectedJourney: Journey;
  fromStation: string;
  setFromStation: (stationName: string) => void;
  toStation: string;
  setToStation: (stationName: string) => void;
}

export default function LiveMap({
  selectedJourney,
  fromStation,
  setFromStation,
  toStation,
  setToStation,
}: LiveMapProps) {
  const [zoom, setZoom] = useState(1);
  const [hoveredStation, setHoveredStation] = useState<Station | null>(null);

  // Swiss rail network edge connections for visualization
  const edges = [
    { from: "geneve", to: "bern" },
    { from: "basel", to: "bern" },
    { from: "basel", to: "zuerich" },
    { from: "bern", to: "zuerich" },
    { from: "zuerich", to: "st_gallen" },
    { from: "zuerich", to: "arth_goldau" },
    { from: "arth_goldau", to: "chur" },
    { from: "arth_goldau", to: "bellinzona" },
    { from: "bellinzona", to: "lugano" },
  ];

  // Helper to find a station's coordinate by name
  const getCoordinatesByName = (name: string) => {
    const station = STATIONS.find((s) => s.name === name);
    return station ? station.coordinates : { x: 50, y: 50 };
  };

  // Determine if an edge is part of the selected journey's stops path
  const isEdgeInSelectedJourney = (fromId: string, toId: string) => {
    const fromStationObj = STATIONS.find((s) => s.id === fromId);
    const toStationObj = STATIONS.find((s) => s.id === toId);
    if (!fromStationObj || !toStationObj) return false;

    // Check if both stations exist as stops in our selected journey sequence
    const stopNames = selectedJourney.stops.map((s) => s.station);
    const fromIdx = stopNames.indexOf(fromStationObj.name);
    const toIdx = stopNames.indexOf(toStationObj.name);

    if (fromIdx !== -1 && toIdx !== -1) {
      // Are they adjacent in the journey path?
      return Math.abs(fromIdx - toIdx) === 1;
    }
    return false;
  };

  const handleNodeClick = (station: Station) => {
    if (fromStation === station.name) {
      // Clear or swap
      return;
    }
    
    // Simple setter: set as destination if source is filled, otherwise set as source
    if (!fromStation || fromStation === "Zürich HB" && toStation === "Lugano") {
      setFromStation(station.name);
    } else {
      setToStation(station.name);
    }
  };
  return (
    <div className="glass rounded-3xl p-5 shadow-2xl flex flex-col h-full relative overflow-hidden group">
      {/* Map Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col">
          <h3 className="text-sm font-sans font-extrabold text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#EB0000] animate-spin" style={{ animationDuration: "12s" }} />
            Live Network Map
          </h3>
          <span className="text-[10px] font-mono font-semibold text-slate-500 mt-1 uppercase">
            Active: Zürich HB ↔ Lugano (IR 90 Segment)
          </span>
        </div>
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
          <span className="text-[9px] font-mono font-bold text-slate-400 pr-1">L2 Node</span>
        </div>
      </div>

      {/* SVG Container representing Switzerland map */}
      <div className="relative bg-black/40 border border-white/5 rounded-2xl flex-1 flex items-center justify-center min-h-[300px] overflow-hidden">
        {/* Dynamic Switzerland Stylized Map SVG */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full p-4 transition-transform duration-300"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Grayscale stylized Switzerland border shape */}
          <path
            d="M 12 60 
               C 5 50, 10 35, 18 30 
               C 22 25, 30 20, 38 18 
               C 44 14, 52 16, 58 14 
               C 66 12, 75 12, 82 18 
               C 88 22, 92 28, 95 32 
               C 98 42, 96 50, 92 56 
               C 88 64, 85 70, 80 75 
               C 74 82, 68 85, 62 88 
               C 55 90, 48 85, 42 85 
               C 34 85, 26 88, 20 84 
               C 15 80, 15 72, 12 60 Z"
            fill="rgba(255, 255, 255, 0.01)"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="0.8"
            className="transition-colors duration-300 group-hover:fill-white/[0.02]"
          />

          {/* Abstract Alpine Mountains Lines for decoration */}
          <path
            d="M 25 72 L 35 62 L 45 74 M 40 76 L 50 64 L 62 78 M 55 78 L 70 60 L 82 76"
            fill="none"
            stroke="rgba(255, 255, 255, 0.03)"
            strokeWidth="0.5"
            strokeLinecap="round"
          />

          {/* Grid lines for coordinate mapping look */}
          <g stroke="rgba(255, 255, 255, 0.02)" strokeWidth="0.1" strokeDasharray="2 2">
            <line x1="20" y1="0" x2="20" y2="100" />
            <line x1="40" y1="0" x2="40" y2="100" />
            <line x1="60" y1="0" x2="60" y2="100" />
            <line x1="80" y1="0" x2="80" y2="100" />
            <line x1="0" y1="20" x2="100" y2="20" />
            <line x1="0" y1="40" x2="100" y2="40" />
            <line x1="0" y1="60" x2="100" y2="60" />
            <line x1="0" y1="80" x2="100" y2="80" />
          </g>

          {/* Standard Rail Edges (Grey Connections) */}
          {edges.map((edge, idx) => {
            const start = STATIONS.find((s) => s.id === edge.from)?.coordinates || { x: 0, y: 0 };
            const end = STATIONS.find((s) => s.id === edge.to)?.coordinates || { x: 0, y: 0 };
            const isHighlighted = isEdgeInSelectedJourney(edge.from, edge.to);

            return (
              <g key={`edge-${idx}`}>
                {/* Background shadow for edges */}
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke={isHighlighted ? "#EB0000" : "rgba(255, 255, 255, 0.15)"}
                  strokeWidth={isHighlighted ? "2" : "0.7"}
                  strokeLinecap="round"
                  className={isHighlighted ? "drop-shadow-[0_0_4px_rgba(235,0,0,0.5)]" : "opacity-40"}
                />
                
                {/* Dynamic flow dots traveling on active routes */}
                {isHighlighted && (
                  <circle r="1" fill="#FFF">
                    <animateMotion
                      dur="3s"
                      repeatCount="indefinite"
                      path={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
                    />
                  </circle>
                )}
              </g>
            );
          })}

          {/* Station Nodes */}
          {STATIONS.map((station) => {
            const isSelectedOrigin = fromStation === station.name;
            const isSelectedDest = toStation === station.name;
            const isPartOfJourney = selectedJourney.stops.some((s) => s.station === station.name);
            const isHovered = hoveredStation?.id === station.id;

            return (
              <g
                key={station.id}
                onClick={() => handleNodeClick(station)}
                onMouseEnter={() => setHoveredStation(station)}
                onMouseLeave={() => setHoveredStation(null)}
                className="cursor-pointer group/node"
              >
                {/* Outer pulsing ring for selected nodes */}
                {(isSelectedOrigin || isSelectedDest) && (
                  <circle
                    cx={station.coordinates.x}
                    cy={station.coordinates.y}
                    r="4.5"
                    fill="none"
                    stroke={isSelectedOrigin ? "#EB0000" : "#10b981"}
                    strokeWidth="1.5"
                    className="animate-pulse"
                  />
                )}

                {/* Main Node Point */}
                <circle
                  cx={station.coordinates.x}
                  cy={station.coordinates.y}
                  r={isHovered ? "3" : isSelectedOrigin || isSelectedDest ? "2.5" : isPartOfJourney ? "2" : "1.5"}
                  fill={isSelectedOrigin ? "#EB0000" : isSelectedDest ? "#10b981" : isPartOfJourney ? "#ffffff" : "#475569"}
                  stroke="rgba(0,0,0,0.4)"
                  strokeWidth="0.5"
                  className="transition-all duration-200 shadow-sm"
                />

                {/* Station Label */}
                <text
                  x={station.coordinates.x}
                  y={station.coordinates.y - 4}
                  textAnchor="middle"
                  className={`font-sans font-extrabold select-none pointer-events-none transition-all duration-200 ${
                    isSelectedOrigin || isSelectedDest
                      ? "text-[3.5px] fill-white"
                      : isHovered
                      ? "text-[3.5px] fill-[#EB0000]"
                      : "text-[2.2px] fill-slate-400 font-semibold"
                  }`}
                >
                  {station.name === "Zürich HB" ? "Zürich" : station.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Information Overlay Card */}
        {hoveredStation && (
          <div className="absolute top-2 left-2 bg-neutral-955/95 text-white p-3 rounded-xl shadow-lg border border-neutral-850 text-[10px] space-y-1 z-20 font-sans max-w-[150px] animate-fade-in backdrop-blur-md">
            <div className="font-extrabold flex items-center justify-between">
              <span>{hoveredStation.name}</span>
              <span className="text-[8px] font-mono text-slate-400 font-bold px-1 bg-neutral-800 rounded">
                {hoveredStation.code}
              </span>
            </div>
            <p className="text-slate-400 leading-normal">
              Swiss L2 validator node. Smart ticket scanning enabled.
            </p>
            <div className="pt-1 flex items-center justify-between text-[8px] font-mono border-t border-neutral-800">
              <span className="text-emerald-400">● 100% Active</span>
              <span className="text-slate-500">Block #189k</span>
            </div>
          </div>
        )}

        {/* Map UI Floating Controls */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-1 z-20">
          <button
            onClick={() => setZoom(Math.min(zoom + 0.25, 2.5))}
            className="w-8 h-8 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-slate-300 hover:text-white transition-colors shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(Math.max(zoom - 0.25, 0.75))}
            className="w-8 h-8 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-slate-300 hover:text-white transition-colors shadow-lg cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
