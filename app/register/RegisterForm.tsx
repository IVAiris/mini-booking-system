"use client";

import { useActionState } from "react";
import { register, type RegisterFormState } from "@/app/actions/auth";

const initialState: RegisterFormState = { errors: {} };

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(register, initialState);

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium">
          Имя
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          className="rounded-md border border-black/[.08] px-3 py-2 dark:border-white/[.145] dark:bg-black"
        />
        {state.errors.name && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {state.errors.name}
          </p>
        )}
      </div>

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
        {state.errors.email && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {state.errors.email}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">
          Пароль
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          className="rounded-md border border-black/[.08] px-3 py-2 dark:border-white/[.145] dark:bg-black"
        />
        {state.errors.password && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {state.errors.password}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 h-11 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] disabled:opacity-60 dark:hover:bg-[#ccc]"
      >
        {pending ? "Отправка…" : "Зарегистрироваться"}
      </button>
    </form>
  );
}
