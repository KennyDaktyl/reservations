"use server";

import axios, { AxiosError, isAxiosError } from "axios";
import * as z from "zod";
import { LoginSchema } from "@/app/schemas";

interface LoginResponse {
  access_token: string;
  role: string;
}

export const login = async (values: z.infer<typeof LoginSchema>) => {
  console.log("Rozpoczęcie logowania:", values);

  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Niepoprawne dane logowania.", details: validatedFields.error.errors };
  }

  const url = `${process.env.AUTH_API_URL}/login`;

  try {
    const response = await axios.post<LoginResponse>(url, validatedFields.data, {
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    });
    if (response.status === 200) {
      return { success: true, data: response.data };
    }

    return { error: "Coś poszło nie tak podczas logowania." };
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Błąd API:", error.response?.data || error.message);

      if (error.response?.status === 401) {
        return { error: "Niepoprawny login lub hasło." };
      }

      return { error: "Błąd serwera. Spróbuj ponownie później." };
    }

    console.error("Nieznany błąd:", error);
    return { error: "Wystąpił nieznany błąd. Spróbuj ponownie później." };
  }
};
