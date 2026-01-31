"use client";

/**
 * Payment Data Prefetch Utility
 * 
 * Prefetches payment page data BEFORE navigation to eliminate
 * the data fetching waterfall on the payment page.
 * 
 * Usage:
 * - Call prefetchPaymentData() when user is likely to navigate to payment
 * - Data is cached in sessionStorage for instant retrieval
 */

import { getPlacesByIds } from "@/app/actions/search";

interface PrefetchedPaymentData {
  hotelData: any | null;
  attractionsData: any[];
  timestamp: number;
}

const PREFETCH_CACHE_KEY = "payment_prefetch_data";
const PREFETCH_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Prefetch data for payment page
 * Call this before navigating to /payment
 */
export async function prefetchPaymentData(
  selectedPlaceIds: string[],
  selectedHotelId: string | null
): Promise<void> {
  try {
    // Combine all IDs
    const allIds = [...selectedPlaceIds];
    if (selectedHotelId) {
      allIds.push(selectedHotelId);
    }

    if (allIds.length === 0) return;

    // Fetch data in background
    const result = await getPlacesByIds(allIds);
    
    if (result.success && result.data) {
      const placesData = result.data as any[];
      
      // Separate hotel and attractions
      const hotelData = selectedHotelId 
        ? placesData.find((p) => p.id === selectedHotelId) || null
        : null;
      
      const attractionsData = placesData.filter(
        (p) => selectedPlaceIds.includes(p.id)
      );

      // Cache in sessionStorage
      const prefetchData: PrefetchedPaymentData = {
        hotelData,
        attractionsData,
        timestamp: Date.now(),
      };

      sessionStorage.setItem(PREFETCH_CACHE_KEY, JSON.stringify(prefetchData));
      console.log("[Prefetch] Payment data prefetched successfully");
    }
  } catch (error) {
    console.error("[Prefetch] Error prefetching payment data:", error);
    // Silently fail - payment page will fetch on its own
  }
}

/**
 * Get prefetched payment data if available and fresh
 */
export function getPrefetchedPaymentData(): PrefetchedPaymentData | null {
  try {
    const cached = sessionStorage.getItem(PREFETCH_CACHE_KEY);
    if (!cached) return null;

    const data: PrefetchedPaymentData = JSON.parse(cached);
    
    // Check if cache is still fresh
    if (Date.now() - data.timestamp > PREFETCH_CACHE_TTL) {
      sessionStorage.removeItem(PREFETCH_CACHE_KEY);
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

/**
 * Clear prefetched data (call after payment is completed)
 */
export function clearPrefetchedPaymentData(): void {
  sessionStorage.removeItem(PREFETCH_CACHE_KEY);
}
