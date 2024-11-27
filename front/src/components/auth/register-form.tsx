"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardWrapperRegister } from "@/components/auth/card-wrapper-register";
import { RegisterSchema } from "@/app/schemas";
import { register } from "@/app/auth/register/actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export const RegisterForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      re_password: "",
      role: "user", 
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError(undefined);
    setSuccess(undefined);

    startTransition(() => {
      register(values)
        .then((res) => {
          if (res.error) {
            setError(res.error);
          } else {
            setSuccess("Rejestracja zakończona sukcesem.");
            form.reset(); 
            setTimeout(() => router.push("/auth/login"), 2000);
          }
        })
        .catch(() => setError("Wystąpił nieznany błąd."));
    });
  };

  return (
    <CardWrapperRegister
      headerLabel="Rejestracja użytkownika"
      backButtonLabel="Powrót do logowania"
      backButtonHref="/auth/login"
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
                    <Input
                      {...field}
                      placeholder="******"
                      type="password"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="re_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Powtórz hasło</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="******"
                      type="password"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rola użytkownika</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz rolę" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Użytkownik</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}

          <Button type="submit" className="w-full" disabled={isPending}>
            Zarejestruj
          </Button>
        </form>
      </Form>
    </CardWrapperRegister>
  );
};
