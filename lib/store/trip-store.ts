import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types
export interface PlaceData {
  id: string;
  name: string;
  description?: string;
  type: string;
  rating?: number;
  address?: string;
  image: string;
  price?: string;
  duration?: string;
  priceLevel?: string;
  lat?: number;
  lng?: number;
  metadata?: any;
}

// Activity type for itinerary
export interface ActivityData {
  id: string;
  title: string;
  time?: string;
  startTime?: string;
  endTime?: string;
  cost?: string;
  place?: PlaceData;
  period: "morning" | "afternoon" | "evening";
}

// Activities organized by day and period
export type ActivitiesMap = Record<number, Record<string, ActivityData[]>>;

// Step in the planning flow
export type PlanStep =
  | "search"
  | "places"
  | "hotels"
  | "trips"
  | "demo"
  | "payment";

export interface TripState {
  // Trip Info
  destination: string;
  startDate: string | null;
  endDate: string | null;
  people: number;
  budget: string;
  style: string;

  // Flow tracking
  currentStep: PlanStep;
  completedSteps: PlanStep[];

  // Selections
  selectedPlaceIds: string[];
  selectedHotelId: string | null;

  // Cached data (for display without re-fetching)
  placesData: PlaceData[];
  hotelData: PlaceData | null;

  // Itinerary activities
  activities: ActivitiesMap;

  // Actions
  setTripInfo: (
    info: Partial<
      Pick<
        TripState,
        "destination" | "startDate" | "endDate" | "people" | "budget" | "style"
      >
    >,
  ) => void;

  // Step management
  setStep: (step: PlanStep) => void;
  completeStep: (step: PlanStep) => void;
  canAccessStep: (step: PlanStep) => boolean;

  // Places
  addPlace: (placeId: string, placeData?: PlaceData) => void;
  removePlace: (placeId: string) => void;
  togglePlace: (placeId: string, placeData?: PlaceData) => void;
  setPlaces: (placeIds: string[], placesData?: PlaceData[]) => void;

  // Hotel
  setHotel: (hotelId: string | null, hotelData?: PlaceData | null) => void;

  // Activities
  setActivities: (activities: ActivitiesMap) => void;
  addActivity: (day: number, period: string, activity: ActivityData) => void;
  removeActivity: (day: number, period: string, activityId: string) => void;
  updateActivity: (
    day: number,
    period: string,
    activityId: string,
    updates: Partial<ActivityData>,
  ) => void;

  // Utilities
  clearTrip: () => void;
  hydrateFromUrl: (params: URLSearchParams) => void;
  toUrlParams: () => URLSearchParams;
}

// Step order for validation
const STEP_ORDER: PlanStep[] = [
  "search",
  "places",
  "hotels",
  "trips",
  "demo",
  "payment",
];

const initialState = {
  destination: "",
  startDate: null as string | null,
  endDate: null as string | null,
  people: 2,
  budget: "",
  style: "",
  currentStep: "search" as PlanStep,
  completedSteps: [] as PlanStep[],
  selectedPlaceIds: [] as string[],
  selectedHotelId: null as string | null,
  placesData: [] as PlaceData[],
  hotelData: null as PlaceData | null,
  activities: {} as ActivitiesMap,
};

export const useTripStore = create<TripState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setTripInfo: (info) => set((state) => ({ ...state, ...info })),

      // Step management
      setStep: (step) => set({ currentStep: step }),

      completeStep: (step) =>
        set((state) => ({
          completedSteps: state.completedSteps.includes(step)
            ? state.completedSteps
            : [...state.completedSteps, step],
        })),

      canAccessStep: (step) => {
        const state = get();
        const stepIndex = STEP_ORDER.indexOf(step);

        // First step is always accessible
        if (stepIndex === 0) return true;

        // Can access if previous step is completed
        const prevStep = STEP_ORDER[stepIndex - 1];
        return state.completedSteps.includes(prevStep);
      },

      addPlace: (placeId, placeData) =>
        set((state) => {
          if (state.selectedPlaceIds.includes(placeId)) return state;
          return {
            selectedPlaceIds: [...state.selectedPlaceIds, placeId],
            placesData:
              placeData && !state.placesData.find((p) => p.id === placeId)
                ? [...state.placesData, placeData]
                : state.placesData,
          };
        }),

      removePlace: (placeId) =>
        set((state) => ({
          selectedPlaceIds: state.selectedPlaceIds.filter(
            (id) => id !== placeId,
          ),
          placesData: state.placesData.filter((p) => p.id !== placeId),
        })),

      togglePlace: (placeId, placeData) => {
        const state = get();
        if (state.selectedPlaceIds.includes(placeId)) {
          get().removePlace(placeId);
        } else {
          get().addPlace(placeId, placeData);
        }
      },

      setPlaces: (placeIds, placesData) =>
        set({
          selectedPlaceIds: placeIds,
          placesData: placesData || [],
        }),

      setHotel: (hotelId, hotelData) =>
        set({
          selectedHotelId: hotelId,
          hotelData: hotelData || null,
        }),

      // Activities management
      setActivities: (activities) => set({ activities }),

      addActivity: (day, period, activity) =>
        set((state) => {
          const dayActivities = state.activities[day] || {};
          const periodActivities = dayActivities[period] || [];
          return {
            activities: {
              ...state.activities,
              [day]: {
                ...dayActivities,
                [period]: [...periodActivities, activity],
              },
            },
          };
        }),

      removeActivity: (day, period, activityId) =>
        set((state) => {
          const dayActivities = state.activities[day] || {};
          const periodActivities = dayActivities[period] || [];
          return {
            activities: {
              ...state.activities,
              [day]: {
                ...dayActivities,
                [period]: periodActivities.filter((a) => a.id !== activityId),
              },
            },
          };
        }),

      updateActivity: (day, period, activityId, updates) =>
        set((state) => {
          const dayActivities = state.activities[day] || {};
          const periodActivities = dayActivities[period] || [];
          return {
            activities: {
              ...state.activities,
              [day]: {
                ...dayActivities,
                [period]: periodActivities.map((a) =>
                  a.id === activityId ? { ...a, ...updates } : a,
                ),
              },
            },
          };
        }),

      clearTrip: () => set(initialState),

      // Hydrate store from URL params (for backward compatibility)
      hydrateFromUrl: (params) => {
        const destination = params.get("destination") || "";
        const startDate = params.get("startDate");
        const endDate = params.get("endDate");
        const people = parseInt(params.get("people") || "2");
        const budget = params.get("budget") || "";
        const style = params.get("style") || "";
        const placesStr = params.get("places");
        const hotelId = params.get("hotel");

        set({
          destination,
          startDate,
          endDate,
          people,
          budget,
          style,
          selectedPlaceIds: placesStr
            ? placesStr.split(",").filter(Boolean)
            : [],
          selectedHotelId: hotelId || null,
        });
      },

      // Convert store state to URL params
      toUrlParams: () => {
        const state = get();
        const params = new URLSearchParams();

        if (state.destination) params.set("destination", state.destination);
        if (state.startDate) params.set("startDate", state.startDate);
        if (state.endDate) params.set("endDate", state.endDate);
        if (state.people !== 2) params.set("people", state.people.toString());
        if (state.budget) params.set("budget", state.budget);
        if (state.style) params.set("style", state.style);
        if (state.selectedPlaceIds.length > 0) {
          params.set("places", state.selectedPlaceIds.join(","));
        }
        if (state.selectedHotelId) {
          params.set("hotel", state.selectedHotelId);
        }

        return params;
      },
    }),
    {
      name: "trip-cart-storage",
      // Only persist certain fields
      partialize: (state) => ({
        destination: state.destination,
        startDate: state.startDate,
        endDate: state.endDate,
        people: state.people,
        budget: state.budget,
        style: state.style,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
        selectedPlaceIds: state.selectedPlaceIds,
        selectedHotelId: state.selectedHotelId,
        placesData: state.placesData,
        hotelData: state.hotelData,
        activities: state.activities,
      }),
    },
  ),
);

// Hook to sync URL params with store (for pages that need it)
export function useSyncTripFromUrl() {
  const hydrateFromUrl = useTripStore((state) => state.hydrateFromUrl);
  return hydrateFromUrl;
}
