import { prisma } from "@/lib/auth";
import type { Booking, BookingStatus, Role } from "@/app/generated/prisma/client";

const ACTIVE_STATUSES: BookingStatus[] = ["pending", "confirmed"];

const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["cancelled"],
  cancelled: [],
};

export type Actor = { id: string; role: Role };

function isAdmin(actor: Actor): boolean {
  return actor.role === "admin" || actor.role === "super_admin";
}

export async function createBooking(actor: Actor, slotId: string) {
  if (actor.role !== "user") {
    throw new Error("Создавать бронь может только пользователь с ролью user.");
  }

  return prisma.$transaction(async (tx) => {
    const slot = await tx.slot.findUnique({ where: { id: slotId } });
    if (!slot) {
      throw new Error("Слот не найден.");
    }

    const activeBooking = await tx.booking.findFirst({
      where: { slotId, status: { in: ACTIVE_STATUSES } },
    });
    if (activeBooking) {
      throw new Error("Слот уже занят.");
    }

    const booking = await tx.booking.create({
      data: { slotId, userId: actor.id, status: "pending" },
    });

    await tx.notification.create({
      data: {
        userId: booking.userId,
        bookingId: booking.id,
        message: "Ваша бронь создана и ожидает подтверждения.",
      },
    });

    return booking;
  });
}

async function transitionBooking(
  bookingId: string,
  nextStatus: BookingStatus,
  message: string,
  authorize: (booking: Booking) => void
) {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      throw new Error("Бронь не найдена.");
    }

    authorize(booking);

    if (!ALLOWED_TRANSITIONS[booking.status].includes(nextStatus)) {
      throw new Error(`Переход из статуса "${booking.status}" в "${nextStatus}" недопустим.`);
    }

    const updated = await tx.booking.update({
      where: { id: bookingId },
      data: { status: nextStatus },
    });

    await tx.notification.create({
      data: { userId: updated.userId, bookingId: updated.id, message },
    });

    return updated;
  });
}

export async function confirmBooking(actor: Actor, bookingId: string) {
  return transitionBooking(
    bookingId,
    "confirmed",
    "Ваша бронь подтверждена администратором.",
    () => {
      if (!isAdmin(actor)) {
        throw new Error("Недостаточно прав для подтверждения брони.");
      }
    }
  );
}

export async function cancelBooking(actor: Actor, bookingId: string) {
  return transitionBooking(bookingId, "cancelled", "Ваша бронь отменена.", (booking) => {
    if (isAdmin(actor)) {
      return;
    }
    const isOwner = booking.userId === actor.id;
    if (actor.role === "user" && isOwner && booking.status === "pending") {
      return;
    }
    throw new Error("Недостаточно прав для отмены этой брони.");
  });
}
