import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { logout } from "@/app/actions/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Аккаунт | Mini Booking System",
};

const roleLabels: Record<string, string> = {
  user: "Пользователь",
  admin: "Администратор",
  super_admin: "Супер-администратор",
};

function ActionCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-md border border-black/[.08] p-4 dark:border-white/[.145]">
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
    </div>
  );
}

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const isAdmin = user.role === "admin" || user.role === "super_admin";

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <main className="flex w-full max-w-lg flex-col gap-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Аккаунт</h1>
            <p className="mt-1 text-zinc-600 dark:text-zinc-400">
              {user.name}
            </p>
            <p className="text-zinc-600 dark:text-zinc-400">{user.email}</p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="h-9 shrink-0 rounded-full border border-black/[.08] px-4 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.06]"
            >
              Выйти
            </button>
          </form>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Тип доступа
            </span>
            <span>{roleLabels[user.role] ?? user.role}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Уровень доступа
            </span>
            <span>{user.role}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Быстрые действия
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <ActionCard
              title="Доступные слоты"
              description="Здесь появится список слотов для записи."
            />
            <ActionCard
              title="Мои записи"
              description="здесь будут ваши записи"
            />
            {isAdmin && (
              <>
                <ActionCard
                  title="Слоты администратора"
                  description="Здесь появится управление слотами."
                />
                <ActionCard
                  title="Записи администратора"
                  description="Здесь появится список всех записей."
                />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
