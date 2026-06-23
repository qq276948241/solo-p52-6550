import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PetType } from "@/data/services";
import type { SelectedOptions } from "@/data/drinkOptions";
import { DRINK_OPTION_GROUPS, getOptionLabel, getTotalPriceDelta } from "@/data/drinkOptions";

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

export interface CartItem {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceIcon: string;
  price: number;
  options: SelectedOptions;
  quantity: number;
  addedAt: number;
}

export { DRINK_OPTION_GROUPS, getOptionLabel, getTotalPriceDelta };

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

function optionsEqual(a: SelectedOptions, b: SelectedOptions): boolean {
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every((k) => a[k] === b[k]);
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
            optionsEqual(c.options, item.options)
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
