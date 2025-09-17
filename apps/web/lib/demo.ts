// lib/demo.ts
import { Trip, ItineraryItem, PackingItem, TripDoc } from "../types";

export const trips: Trip[] = [
  {
    id: "rome-2026",
    title: "Rome, Italy",
    startDate: "2026-07-21",
    endDate: "2026-07-25",
    color: "lavender",
    city: "Rome",
    coverUrl: null, // <- added so TripCard can choose image vs color
    placesCount: 12,
  },
  {
    id: "lisbon-2025",
    title: "Lisbon, Portugal",
    startDate: "2025-10-12",
    endDate: "2025-10-18",
    color: "peach",
    city: "Lisbon",
    coverUrl: null,
    placesCount: 12,
  },
  {
    id: "reykjavik",
    title: "Reykjavík, Iceland",
    startDate: "2025-12-05",
    endDate: "2025-12-11",
    color: "ocean",
    city: "Reykjavík",
    coverUrl: null,
    placesCount: 12,
  },
];

export const itinerary: ItineraryItem[] = [
  { id: "i1", tripId: "rome-2026", time: "10:21", title: "Colosseum", note: "Prebook tickets" },
  { id: "i2", tripId: "rome-2026", time: "12:30", title: "Roman Forum", note: "Lunch nearby" },
  { id: "i3", tripId: "rome-2026", time: "15:40", title: "Trattoria Pizzeria Luzzi", note: "Try carbonara" },
];

export const packing: PackingItem[] = [
  { id: "p1", tripId: "rome-2026", text: "Passport", done: true },
  { id: "p2", tripId: "rome-2026", text: "White sneakers", done: false },
  { id: "p3", tripId: "rome-2026", text: "Sunglasses", done: false },
];

export const docs: TripDoc[] = [
  { id: "d1", tripId: "rome-2026", name: "Train to Rome.pdf", type: "ticket", sizeKB: 320 },
  { id: "d2", tripId: "rome-2026", name: "Airbnb booking.png", type: "image", sizeKB: 820 },
];
