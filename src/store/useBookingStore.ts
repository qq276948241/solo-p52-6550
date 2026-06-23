import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PetType } from "@/data/services";

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  petType: PetType;
  phone: string;
  status: "pending" | "cancelled";
  createdAt: number;
}

export type CupSize = "medium" | "large" | "xlarge";
export type SugarLevel = "none" | "less" | "half" | "normal" | "extra";

export interface CartItem {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceIcon: string;
  price: number;
  cupSize: CupSize;
  sugarLevel: SugarLevel;
  quantity: number;
  addedAt: number;
}

export const CUP_SIZES: { value: CupSize; label: string; priceDelta: number }[] = [
  { value: "medium", label: "中杯", priceDelta: 0 },
  { value: "large", label: "大杯", priceDelta: 3 },
  { value: "xlarge", label: "超大杯", priceDelta: 6 },
];

export const SUGAR_LEVELS: { value: SugarLevel; label: string }[] = [
  { value: "none", label: "无糖" },
  { value: "less", label: "少糖" },
  { value: "half", label: "半糖" },
  { value: "normal", label: "标准糖" },
  { value: "extra", label: "多糖" },
];

export function getCupSizeLabel(size: CupSize): string {
  return CUP_SIZES.find((c) => c.value === size)?.label ?? "中杯";
}

export function getSugarLevelLabel(level: SugarLevel): string {
  return SUGAR_LEVELS.find((s) => s.value === level)?.label ?? "标准糖";
}

function generateCartId(): string {
  return "CT" + Date.now().toString().slice(-8) + Math.floor(Math.random() * 1000).toString().padStart(3, "0");
}

interface BookingState {
  bookings: Booking[];
  cart: CartItem[];
  addBooking: (booking: Omit<Booking, "id" | "status" | "createdAt">) => Booking;
  cancelBooking: (id: string) => void;
  addToCart: (
    item: Omit<CartItem, "id" | "quantity" | "addedAt"> & { quantity?: number }
  ) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

function generateId(): string {
  return "BK" + Date.now().toString().slice(-8) + Math.floor(Math.random() * 1000).toString().padStart(3, "0");
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookings: [],
      cart: [],
      addBooking: (data) => {
        const newBooking: Booking = {
          ...data,
          id: generateId(),
          status: "pending",
          createdAt: Date.now(),
        };
        set({ bookings: [newBooking, ...get().bookings] });
        return newBooking;
      },
      cancelBooking: (id) => {
        set({
          bookings: get().bookings.map((b) =>
            b.id === id ? { ...b, status: "cancelled" } : b
          ),
        });
      },
      addToCart: (item) => {
        const { cart } = get();
        const existingIdx = cart.findIndex(
          (c) =>
            c.serviceId === item.serviceId &&
            c.cupSize === item.cupSize &&
            c.sugarLevel === item.sugarLevel
        );
        if (existingIdx >= 0) {
          const newCart = [...cart];
          newCart[existingIdx] = {
            ...newCart[existingIdx],
            quantity: newCart[existingIdx].quantity + (item.quantity ?? 1),
          };
          set({ cart: newCart });
        } else {
          const newItem: CartItem = {
            ...item,
            id: generateCartId(),
            quantity: item.quantity ?? 1,
            addedAt: Date.now(),
          };
          set({ cart: [...cart, newItem] });
        }
      },
      removeFromCart: (id) => {
        set({ cart: get().cart.filter((c) => c.id !== id) });
      },
      clearCart: () => {
        set({ cart: [] });
      },
    }),
    {
      name: "pet-grooming-bookings",
    }
  )
);
