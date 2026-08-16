"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@/app/generated/prisma/client";
import { registerSchema } from "@/lib/validation";
import {
  createSession,
  destroySession,
  hashPassword,
  prisma,
  verifyPassword,
} from "@/lib/auth";

export type RegisterFormState = {
  errors: {
    name?: string;
    email?: string;
    password?: string;
  };
};

export async function register(
  _prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const result = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    return {
      errors: {
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      },
    };
  }

  const { name, email, password } = result.data;
  const passwordHash = await hashPassword(password);

  let userId: string;
  try {
    const user = await prisma.user.create({
      data: { name, email, passwordHash, role: "user" },
    });
    userId = user.id;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        errors: { email: "Пользователь с таким email уже существует" },
      };
    }
    throw error;
  }

  await createSession(userId);
  redirect("/account");
}

export type LoginFormState = {
  error?: string;
};

const invalidCredentials: LoginFormState = {
  error: "Неверный email или пароль",
};

export async function login(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return invalidCredentials;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  const passwordMatches = user
    ? await verifyPassword(password, user.passwordHash)
    : false;

  if (!user || !passwordMatches) {
    return invalidCredentials;
  }

  await createSession(user.id);
  redirect("/account");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/");
}
