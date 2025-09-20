export type TripColor = "peach" | "lavender" | "mint" | "sun" | "ocean" | "grape";

export type Trip = { 
  _id: string; 
  title: string;
  startDate: string; 
  endDate: string; 
  destination: string; 
  coverUrl?: string | null;
  coverColor: string | TripColor; 
  placesCount?: number; 
  itinerary?: ItineraryItem[];
  documents?: any[]; 
  packingItems?: any[]; 
  collaborations?: any[]; 
  useOfFunds?: any[]; 
  visibility: "private" | "public" | "friends"; 
  invites?: string[]; 
  createdAt: string; 
  updatedAt: string; 
  days?: number
 };


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

