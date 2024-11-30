"use server";

import { RegisterSchema } from "@/app/schemas";
import { ResponseData } from "@/app/types";
import axios, { AxiosError, isAxiosError } from "axios";
import * as z from "zod";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    console.error("Walidacja nie powiodła się:", validatedFields.error.errors);
    return {
      error: "Niepoprawne dane rejestracyjne.",
      details: validatedFields.error.errors,
    };
  }

  const { re_password, ...userData } = validatedFields.data;

  try {
    const response = await axios.post<ResponseData>(
      `${process.env.NEXT_PUBLIC_AUTH_API_URL}/create_user`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      }
    );

    if (response.status === 201) {
      return { success: "Rejestracja zakończona sukcesem.", data: response.data };
    }

    console.warn("Rejestracja nie powiodła się, nieoczekiwany status:", response.status);
    return { error: "Coś poszło nie tak podczas rejestracji." };
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response) {
      const { status, data } = error.response || {};

      if (status === 400) {
        return { error: (data as { message?: string }).message || "Niepoprawne dane wejściowe." };
      }

      if (status === 409) {
        return { error: "Użytkownik z tym adresem email już istnieje." };
      }

      return { error: "Błąd serwera. Spróbuj ponownie później." };
    }

    console.error("Nieznany błąd:", error);
    return { error: "Wystąpił nieznany błąd. Spróbuj ponownie później." };
  }
};
