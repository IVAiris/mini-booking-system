import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Админка | Mini Booking System",
};

export default async function AdminPage() {
  await requireRole(["admin", "super_admin"]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <main className="flex w-full max-w-lg flex-col gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Админка</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Административные функции появятся на следующих шагах.
        </p>
      </main>
    </div>
  );
}
