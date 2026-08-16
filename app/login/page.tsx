import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Вход | Mini Booking System",
};

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <main className="flex w-full max-w-sm flex-col gap-6">
        <h1 className="text-2xl font-semibold tracking-tight">Вход</h1>
        <form method="post" className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="rounded-md border border-black/[.08] px-3 py-2 dark:border-white/[.145] dark:bg-black"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium">
              Пароль
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className="rounded-md border border-black/[.08] px-3 py-2 dark:border-white/[.145] dark:bg-black"
            />
          </div>

          <button
            type="submit"
            className="mt-2 h-11 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Войти
          </button>
        </form>
      </main>
    </div>
  );
}
