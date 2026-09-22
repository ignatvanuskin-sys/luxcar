"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { BookingModal } from "@/components/booking/booking-modal";

type BookingContextValue = {
  /** Opens the booking dialog, optionally pre-selecting a service. */
  openBooking: (serviceId?: string) => void;
  closeBooking: () => void;
  isOpen: boolean;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ open: boolean; serviceId?: string }>({
    open: false,
  });

  const openBooking = useCallback((serviceId?: string) => {
    setState({ open: true, serviceId });
  }, []);

  const closeBooking = useCallback(() => {
    setState((current) => ({ ...current, open: false }));
  }, []);

  const value = useMemo<BookingContextValue>(
    () => ({ openBooking, closeBooking, isOpen: state.open }),
    [openBooking, closeBooking, state.open],
  );

  return (
    <BookingContext.Provider value={value}>
      {children}
      {state.open ? (
        <BookingModal
          initialServiceId={state.serviceId}
          onClose={closeBooking}
        />
      ) : null}
    </BookingContext.Provider>
  );
}

export function useBooking(): BookingContextValue {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used inside <BookingProvider>");
  }
  return context;
}
