import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.email("Введите корректный адрес электронной почты"),
  password: z
    .string()
    .min(8, "Пароль должен содержать минимум 8 символов")
    .regex(/[A-Za-zА-Яа-яЁё]/, "Пароль должен содержать хотя бы одну букву"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
