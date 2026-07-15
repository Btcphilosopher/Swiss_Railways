/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Station, Journey, Departure, RewardItem, TokenTransaction } from "./types";

export const STATIONS: Station[] = [
  { id: "zuerich", name: "Zürich HB", code: "ZUE", coordinates: { x: 62, y: 30 } },
  { id: "lugano", name: "Lugano", code: "LUG", coordinates: { x: 72, y: 85 } },
  { id: "bern", name: "Bern", code: "BRN", coordinates: { x: 40, y: 55 } },
  { id: "basel", name: "Basel SBB", code: "BSL", coordinates: { x: 42, y: 25 } },
  { id: "geneve", name: "Genève", code: "GVA", coordinates: { x: 10, y: 80 } },
  { id: "chur", name: "Chur", code: "CHR", coordinates: { x: 88, y: 55 } },
  { id: "arth_goldau", name: "Arth-Goldau", code: "ART", coordinates: { x: 60, y: 50 } },
  { id: "bellinzona", name: "Bellinzona", code: "BEL", coordinates: { x: 68, y: 75 } },
  { id: "st_gallen", name: "St. Gallen", code: "SGA", coordinates: { x: 82, y: 25 } },
  { id: "zug", name: "Zug", code: "ZUG", coordinates: { x: 61, y: 42 } },
];

export const INITIAL_JOURNEYS: Journey[] = [
  {
    id: "j-1002",
    type: "IC 8",
    typeColor: "bg-red-600 text-white border-red-600",
    direction: "Lugano",
    fromStation: "Zürich HB",
    toStation: "Lugano",
    departureTime: "10:02",
    arrivalTime: "12:33",
    duration: "2h 31m",
    price: 29.00,
    platform: "8",
    occupancy: "Low",
    co2Saving: 21.5,
    stops: [
      { station: "Zürich HB", time: "10:02", passed: true },
      { station: "Arth-Goldau", time: "10:44", passed: true },
      { station: "Bellinzona", time: "11:58", passed: false },
      { station: "Lugano", time: "12:33", passed: false },
    ],
  },
  {
    id: "j-1032",
    type: "IR 90",
    typeColor: "bg-red-600 text-white border-red-600",
    direction: "Lugano",
    fromStation: "Zürich HB",
    toStation: "Lugano",
    departureTime: "10:32",
    arrivalTime: "13:03",
    duration: "2h 31m",
    price: 29.00,
    platform: "12",
    occupancy: "Medium",
    co2Saving: 23.0,
    stops: [
      { station: "Zürich HB", time: "10:32", passed: true },
      { station: "Arth-Goldau", time: "11:14", passed: true },
      { station: "Bellinzona", time: "12:28", passed: false },
      { station: "Lugano", time: "13:03", passed: false },
    ],
  },
  {
    id: "j-1102",
    type: "IC 81",
    typeColor: "bg-neutral-800 text-white border-neutral-800",
    direction: "Lugano",
    fromStation: "Zürich HB",
    toStation: "Lugano",
    departureTime: "11:02",
    arrivalTime: "13:33",
    duration: "2h 31m",
    price: 29.00,
    platform: "9",
    occupancy: "Low",
    co2Saving: 21.8,
    stops: [
      { station: "Zürich HB", time: "11:02", passed: false },
      { station: "Arth-Goldau", time: "11:44", passed: false },
      { station: "Bellinzona", time: "12:58", passed: false },
      { station: "Lugano", time: "13:33", passed: false },
    ],
  },
  {
    id: "j-1132",
    type: "IR 13",
    typeColor: "bg-red-600 text-white border-red-600",
    direction: "Lugano",
    fromStation: "Zürich HB",
    toStation: "Lugano",
    departureTime: "11:32",
    arrivalTime: "14:03",
    duration: "2h 31m",
    price: 29.00,
    platform: "15",
    occupancy: "High",
    co2Saving: 24.2,
    stops: [
      { station: "Zürich HB", time: "11:32", passed: false },
      { station: "Arth-Goldau", time: "12:14", passed: false },
      { station: "Bellinzona", time: "13:28", passed: false },
      { station: "Lugano", time: "14:03", passed: false },
    ],
  },
];

export const INITIAL_DEPARTURES: Departure[] = [
  { id: "d-1", time: "10:24", type: "IC 5", typeColor: "bg-red-600 text-white", destination: "St. Gallen", platform: "8", status: "on-time" },
  { id: "d-2", time: "10:26", type: "IR 90", typeColor: "bg-red-600 text-white", destination: "Lugano", platform: "12", status: "delay", delayMinutes: 2 },
  { id: "d-3", time: "10:28", type: "S 24", typeColor: "bg-slate-700 text-white", destination: "Zug", platform: "5", status: "on-time" },
  { id: "d-4", time: "10:32", type: "IR 37", typeColor: "bg-red-600 text-white", destination: "Chur", platform: "7", status: "on-time" },
  { id: "d-5", time: "10:34", type: "IC 1", typeColor: "bg-red-600 text-white", destination: "Genève", platform: "11", status: "delay", delayMinutes: 1 },
];

export const REWARD_ITEMS: RewardItem[] = [
  {
    id: "r-1",
    title: "1st Class Upgrade Upgrade NFT",
    description: "Upgrade your single journey ticket from 2nd to 1st class. Minted on SBB Chain.",
    cost: 150,
    category: "Class Upgrade",
    iconName: "TrendingUp",
  },
  {
    id: "r-2",
    title: "SBB Lounge Access Pass",
    description: "One-time entry to SBB premium lounges in major Swiss stations, with complimentary drinks and Wi-Fi.",
    cost: 200,
    category: "Lounge Access",
    iconName: "Coffee",
  },
  {
    id: "r-3",
    title: "Eco Coffee Reward",
    description: "Claim a fresh Swiss organic coffee at any Spettacolo or station cafe with your eco-friendly traveler badge.",
    cost: 50,
    category: "Food & Drink",
    iconName: "CupSoda",
  },
  {
    id: "r-4",
    title: "Web3 Swiss Pass Skin (NFT)",
    description: "Customized holographic design for your digital Swiss Pass display, verifiable on-chain.",
    cost: 120,
    category: "Partner Offer",
    iconName: "Sparkles",
  },
  {
    id: "r-5",
    title: "Zermatt Peak Discount Voucher",
    description: "Get 20% off the Gornergrat Bahn cog railway ticket near the Matterhorn.",
    cost: 300,
    category: "Partner Offer",
    iconName: "Compass",
  },
];

export const INITIAL_TRANSACTIONS: TokenTransaction[] = [
  { id: "t-1", timestamp: "Today, 09:15", description: "Claimed Weekly Carbon-Saving Grant", amount: 150, type: "earn" },
  { id: "t-2", timestamp: "Yesterday, 14:20", description: "Completed Multi-Modal Train-to-Bus route", amount: 50, type: "earn" },
  { id: "t-3", timestamp: "3 days ago", description: "Redeemed Express Espresso at Zürich HB", amount: -50, type: "spend" },
  { id: "t-4", timestamp: "5 days ago", description: "On-Time Arrival Guarantee compensation", amount: 170, type: "earn" },
];
