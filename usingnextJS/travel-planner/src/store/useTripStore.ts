import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Example generic Type structure for a Trip. 
// Can be customized when the AI generator solidifies its specific schema.
export interface TripPlan {
  id: string;
  from?: string; // Origin location
  destination: string; // Target location
  passengers?: string;
  days: number;
  createdAt: number;
  coverImage?: string; // Optional image URL for the card
  content: any; // The main JSON or structured response from AI
  mapCoordinates: any; // Array of points or bounding box for the map
}

interface TripStore {
  savedTrips: TripPlan[];
  saveTrip: (trip: TripPlan) => void;
  deleteTrip: (id: string) => void;
  getTripById: (id: string) => TripPlan | undefined;
}

export const useTripStore = create<TripStore>()(
  persist(
    (set, get) => ({
      savedTrips: [],

      saveTrip: (trip) =>
        set((state) => ({
          // Check if trip already exists and update it, otherwise append it
          savedTrips: state.savedTrips.some(t => t.id === trip.id)
            ? state.savedTrips.map(t => t.id === trip.id ? trip : t)
            : [...state.savedTrips, trip],
        })),

      deleteTrip: (id) =>
        set((state) => ({
          savedTrips: state.savedTrips.filter((trip) => trip.id !== id),
        })),

      getTripById: (id) => {
        return get().savedTrips.find((trip) => trip.id === id);
      },
    }),
    {
      name: 'aerostride-trips-storage', // The key used in local storage
    }
  )
);
