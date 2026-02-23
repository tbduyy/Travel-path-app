/**
 * Payment History - localStorage based (non-persistent, lost on logout/clear)
 * 
 * Stores payment records after successful checkout.
 * Key: "travelpath_payment_history"
 */

const STORAGE_KEY = "travelpath_payment_history";

export interface PaymentRecord {
  id: string;                // Unique payment ID (generated)
  timestamp: string;         // ISO date string
  destination: string;
  startDate: string | null;
  endDate: string | null;
  duration: string;          // e.g. "5N4Đ"
  people: number;
  paymentMethod: string;     // "momo" | "vnpay" | "card"
  voucher: string | null;    // Voucher code applied
  discountAmount: number;
  subTotal: number;
  grandTotal: number;
  hotel: {
    name: string;
    price: string;
    nights: number;
    total: number;
    image?: string;
    address?: string;
  } | null;
  attractions: {
    name: string;
    price: string;
    unitPrice: number;
    total: number;
    image?: string;
  }[];
  userEmail: string | null;
  status: "completed";       // Always completed (we only save after success)
}

/** Generate a short readable payment ID */
function generatePaymentId(): string {
  const now = new Date();
  const datePart = now.toISOString().slice(2, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TP-${datePart}-${randomPart}`;
}

/** Get all payment records from localStorage */
export function getPaymentHistory(): PaymentRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as PaymentRecord[];
  } catch {
    return [];
  }
}

/** Save a new payment record */
export function savePaymentRecord(record: Omit<PaymentRecord, "id" | "timestamp" | "status">): PaymentRecord {
  const fullRecord: PaymentRecord = {
    ...record,
    id: generatePaymentId(),
    timestamp: new Date().toISOString(),
    status: "completed",
  };

  const history = getPaymentHistory();
  // Prepend (newest first)
  history.unshift(fullRecord);
  
  // Keep max 50 records to avoid bloating localStorage
  const trimmed = history.slice(0, 50);

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  }

  return fullRecord;
}

/** Clear all payment history (e.g., on logout) */
export function clearPaymentHistory(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/** Get a single payment record by ID */
export function getPaymentById(id: string): PaymentRecord | null {
  const history = getPaymentHistory();
  return history.find((r) => r.id === id) || null;
}
