"use server";

import { registerSchema } from "@/lib/validation";

export type RegisterFormState = {
  errors: {
    name?: string;
    email?: string;
    password?: string;
  };
};

export async function validateRegisterInput(
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

  return { errors: {} };
}
