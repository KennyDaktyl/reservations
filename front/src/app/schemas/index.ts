import { z } from "zod";

export const LoginSchema = z.object({
	email: z.string().email({ message: "Niepoprawny adres email" }),
	password: z.string().min(1, { message: "Hasło jest wymagane" }),
});

export const RegisterSchema = z
  .object({
    email: z.string().email({ message: "Niepoprawny adres email" }),
    password: z.string().min(6, { message: "Hasło musi mieć minimum 6 znaków" }),
    re_password: z.string().min(6, { message: "Hasło musi mieć minimum 6 znaków" }),
    role: z.enum(["user", "admin"]).default("user"),
  })
  .refine(
    (data) => data.password === data.re_password,
    {
      message: "Hasła muszą być takie same",
      path: ["re_password"],
    }
  );

export const EmailSchema = z.object({
	email: z.string().email({ message: "Niepoprawny adres email" }),
});

export const AuthorizeSchema = z.object({
	username: z.string().email({ message: "Niepoprawny adres email" }),
	token: z.string(),
  role: z.string()
});

export const RoomSchema = z.object({
  name: z
      .string()
      .min(1, "The 'name' field is required.")
      .max(255, "The 'name' field must be at most 255 characters."),
  capacity: z
      .number()
      .min(0, "The 'capacity' field must be 0 or greater.")
      .int("The 'capacity' field must be an integer."),
  equipments: z.array(z.object({ value: z.number() })).optional(),
});

export type FormData = z.infer<typeof RoomSchema>;

export const EquipmentSchema = z.object({
  name: z.string().min(1, "The 'name' field is required."),
});
