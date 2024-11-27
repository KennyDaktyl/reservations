"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/app/schemas";
import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { login } from "@/app/auth/login/actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "../atoms/form-error";
import { FormSuccess } from "../atoms/form-success";
import { CardWrapper } from "./card-wrapper";
import { z } from "zod";

export const LoginForm = () => {
  const router = useRouter();
  const [success, setSuccess] = useState<string | undefined>("");
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      const response = await login(values);
      if (response.error) {
        console.error("Błąd logowania:", response.error);
        setError(response.error);
      } else {
        console.log("Sukces logowania:", response.data);

        await signIn("credentials", {
          username: values.email,
          password: values.password,
          token: response.data?.access_token,
          role: response.data?.role,
          redirect: false,
        });

        setSuccess("Logowanie zakończone sukcesem!");
        router.push("/");
        form.reset();
      }
    });
  };

  return (
    <CardWrapper
      headerLabel="Witaj spowrotem"
      backButtonLabel="Nie masz konta?"
      backButtonHref="/auth/register"
      forgotButtonLabel="Przywróć hasło"
      forgotButtonHref="/auth/forgot-password"
      showSocials={true}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="jan.kowalski@gmail.com"
                      type="email"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hasło</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="*****" type="password" disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="submit" className="w-full" variant="default" disabled={isPending}>
            Zaloguj
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
