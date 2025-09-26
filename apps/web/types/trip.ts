export type TripColor = "peach" | "lavender" | "mint" | "sun" | "ocean" | "grape";

export type ID = string;

export type Trip = { 
  _id: ID; 
  title: string;
  startDate: string; 
  endDate: string; 
  destination: string; 
  coverUrl?: string | null;
  coverColor: string | TripColor; 
  placesCount?: number; 
  itinerary?: ItineraryItem[];
  documents?: unknown[]; 
  packingItems?: unknown[]; 
  collaborations?: unknown[]; 
  useOfFunds?: unknown[]; 
  visibility: "private" | "public" | "friends"; 
  invites?: string[]; 
  createdAt: string; 
  updatedAt: string; 
  days?: number
 };

 export type TripDay = {
  _id: ID;
  tripId: ID;
  date: string; // ISO 00:00:00Z
  order: number;
  label?: string;
  activities?: { _id: ID; time?: string; title: string; description?: string; location?: string; }[];
};

export interface ItineraryItem {
  id: ID;
  tripId: ID;
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

