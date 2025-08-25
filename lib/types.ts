// lib/types.ts
export type TripColor = "peach" | "lavender" | "mint" | "sun" | "ocean" | "grape";

export interface Trip {
  id: string;
  title: string;
  startDate: string; // ISO
  endDate: string;   // ISO
  color: TripColor;
  city?: string;
}

export interface ItineraryItem {
  id: string;
  tripId: string;
  time: string; // "10:30"
  title: string;
  note?: string;
  icon?: string; // lucide name
}

export interface PackingItem {
  id: string;
  tripId: string;
  text: string;
  done: boolean;
}

export interface TripDoc {
  id: string;
  tripId: string;
  name: string;
  type: "pdf" | "image" | "ticket";
  sizeKB: number;
}
