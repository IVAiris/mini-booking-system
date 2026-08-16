"use server";

import { getCurrentUser } from "@/lib/auth";
import {
  cancelBooking,
  confirmBooking,
  createBooking,
  type Actor,
} from "@/lib/bookings";

function toErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

async function requireActor(): Promise<Actor | null> {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }
  return { id: user.id, role: user.role };
}

export async function createBookingAction(slotId: string) {
  const actor = await requireActor();
  if (!actor) {
    return { error: "Требуется вход в систему." };
  }

  try {
    const booking = await createBooking(actor, slotId);
    return { booking };
  } catch (error) {
    return { error: toErrorMessage(error, "Не удалось создать бронь.") };
  }
}

export async function confirmBookingAction(bookingId: string) {
  const actor = await requireActor();
  if (!actor) {
    return { error: "Требуется вход в систему." };
  }

  try {
    const booking = await confirmBooking(actor, bookingId);
    return { booking };
  } catch (error) {
    return { error: toErrorMessage(error, "Не удалось подтвердить бронь.") };
  }
}

export async function cancelBookingAction(bookingId: string) {
  const actor = await requireActor();
  if (!actor) {
    return { error: "Требуется вход в систему." };
  }

  try {
    const booking = await cancelBooking(actor, bookingId);
    return { booking };
  } catch (error) {
    return { error: toErrorMessage(error, "Не удалось отменить бронь.") };
  }
}
