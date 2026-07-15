/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Station {
  id: string;
  name: string;
  code: string;
  coordinates: { x: number; y: number }; // Relative percentage coordinates for the map
}

export interface RouteStop {
  station: string;
  time: string;
  passed: boolean;
}

export interface Journey {
  id: string;
  type: string; // e.g. "IR 90", "IC 8", "IC 81", "IR 13"
  typeColor: string; // e.g. "red", "blue", "gray"
  direction: string;
  fromStation: string;
  toStation: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  platform: string;
  occupancy: "Low" | "Medium" | "High";
  co2Saving: number; // in kg
  stops: RouteStop[];
}

export interface Departure {
  id: string;
  time: string;
  type: string; // e.g. "IC 5", "IR 90", "S 24", "IR 37", "IC 1"
  typeColor: string;
  destination: string;
  platform: string;
  status: "on-time" | "delay";
  delayMinutes?: number;
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  cost: number;
  category: "Class Upgrade" | "Food & Drink" | "Lounge Access" | "Partner Offer";
  iconName: string;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: number; // in ETH or CHF
  tokenBalance: number; // SBB tokens (defaults to 320)
  network: string;
}

export interface TokenTransaction {
  id: string;
  timestamp: string;
  description: string;
  amount: number; // positive or negative
  type: "earn" | "spend";
}
