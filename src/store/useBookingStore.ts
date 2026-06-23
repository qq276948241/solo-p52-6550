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

interface BookingState {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, "id" | "status" | "createdAt">) => Booking;
  cancelBooking: (id: string) => void;
}

function generateId(): string {
  return "BK" + Date.now().toString().slice(-8) + Math.floor(Math.random() * 1000).toString().padStart(3, "0");
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookings: [],
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
    }),
    {
      name: "pet-grooming-bookings",
    }
  )
);
