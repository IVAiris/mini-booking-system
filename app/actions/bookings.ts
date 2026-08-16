"use server";

import { getCurrentUser } from "@/lib/auth";
import {
  cancelBooking,
  confirmBooking,
  createBooking,
} from "@/lib/bookings";

function toErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export async function createBookingAction(slotId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Требуется вход в систему." };
  }

  try {
    const booking = await createBooking(user.id, slotId);
    return { booking };
  } catch (error) {
    return { error: toErrorMessage(error, "Не удалось создать бронь.") };
  }
}

export async function confirmBookingAction(bookingId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Требуется вход в систему." };
  }

  try {
    const booking = await confirmBooking(bookingId);
    return { booking };
  } catch (error) {
    return { error: toErrorMessage(error, "Не удалось подтвердить бронь.") };
  }
}

export async function cancelBookingAction(bookingId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Требуется вход в систему." };
  }

  try {
    const booking = await cancelBooking(bookingId);
    return { booking };
  } catch (error) {
    return { error: toErrorMessage(error, "Не удалось отменить бронь.") };
  }
}
