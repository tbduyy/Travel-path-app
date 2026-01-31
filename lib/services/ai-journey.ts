import { API_BASE_URL } from "@/lib/api-config";

export interface ChatInput {
  user_message: string;
  session_id?: string;
  current_location?: {
    lat: number;
    lng: number;
    name: string;
  };
  trip_status?: string;
  recent_feelings?: string;
  current_schedule?: any[];
}

export interface DailyActivity {
  time_slot: string;
  activity: string;
  location_name: string;
  estimated_cost: number;
  notes?: string;
  image?: string;
  duration_minutes?: number;
  distance_km?: number;
  location_type?: string;
}

export interface DaySchedule {
  day: number;
  date: string;
  activities: DailyActivity[];
  total_cost_day: number;
}

export interface SuggestedPlace {
  id: string;
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
  description?: string;
}

export interface ChatResponse {
  ai_message: string;
  action?: string;
  suggested_place?: SuggestedPlace;
  new_itinerary?: DaySchedule;
}

export const journeyService = {
  async chatWithAI(data: ChatInput): Promise<ChatResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/journey/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Journey AI Chat Error:", error);
      throw error;
    }
  },
};
