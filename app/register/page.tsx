import type { Metadata } from "next";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = {
  title: "Регистрация | Mini Booking System",
};

export default function RegisterPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <main className="flex w-full max-w-sm flex-col gap-6">
        <h1 className="text-2xl font-semibold tracking-tight">Регистрация</h1>
        <RegisterForm />
      </main>
    </div>
  );
}
