import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../app/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  const name = process.env.SEED_SUPER_ADMIN_NAME;
  const email = process.env.SEED_SUPER_ADMIN_EMAIL;
  const password = process.env.SEED_SUPER_ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error(
      "SEED_SUPER_ADMIN_NAME, SEED_SUPER_ADMIN_EMAIL, SEED_SUPER_ADMIN_PASSWORD должны быть заданы в .env"
    );
  }

  const existing = await prisma.user.findFirst({
    where: { role: "super_admin" },
  });

  if (existing) {
    console.log("super_admin уже существует, пропускаю создание.");
  } else {
    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: { name, email, passwordHash, role: "super_admin" },
    });

    console.log("super_admin создан.");
  }

  await seedDemoSlot();
}

async function seedDemoSlot() {
  const demoSlotStart = new Date("2026-09-01T10:00:00.000Z");
  const demoSlotEnd = new Date("2026-09-01T11:00:00.000Z");

  const existingSlot = await prisma.slot.findFirst({
    where: { startTime: demoSlotStart },
  });

  if (existingSlot) {
    console.log("Демо-слот уже существует, пропускаю создание.");
    return;
  }

  await prisma.slot.create({
    data: { startTime: demoSlotStart, endTime: demoSlotEnd },
  });

  console.log("Демо-слот создан.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
