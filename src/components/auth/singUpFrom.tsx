"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { signIn } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import UnderlineLink from "../links/UnderlineLink";

const formSchema = z.object({
  username: z.string().refine(
    (value) => {
      if (value.length < 6) return false;
      // Al menos un número
      if (!/\d/.test(value)) return false;
      // No debe contener caracteres especiales
      if (/[^a-zA-Z0-9]/.test(value)) return false;
      return true;
    },
    {
      message:
        "Username must: minimum 6 characters, a number, no strange characters.",
    }
  ),
  email: z.string().email(),
  password: z.string().refine(
    (value) => {
      // Mínimo 6 caracteres
      if (value.length < 6) return false;
      // Al menos una mayúscula
      if (!/[A-Z]/.test(value)) return false;
      // Al menos un número
      if (!/\d/.test(value)) return false;
      return true;
    },
    {
      message:
        "Password must have: at least 6 characters, at least one number and one capital letter.",
    }
  ),
});

type UserFormValues = z.infer<typeof formSchema>;

const SingUpFrom = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const defaultValues: UserFormValues = {
    username: "",
    email: "",
    password: "",
  };

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const resetForm = () => {
    setError("");
    form.reset();
  };

  const onCancel = () => {
    resetForm();
    router.push("/");
  };

  const onSubmit = async (data: UserFormValues) => {
    setLoading(true);
    await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(() => {
        setLoading(false);
        setError("");
        signIn("credentials", {
          username: data.username,
          password: data.password,
          callbackUrl: "/",
        }).then((callback) => {
          if (callback?.ok) {
            toast({
              variant: "success",
              title: "Success",
              description: "User created successfully",
            });
          }
          if (callback?.error) {
            toast({
              variant: "destructive",
              title: "Error",
              description: callback.error,
            });
          }
        });
      })
      .catch((error) => {
        console.log(error);
        setError(error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>
          To use our system, enter a username and password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-red-500">{error}</div>
        {loading && <div className="text-sm italic">Loading...</div>}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full"
          >
            <div className="grid gap-4 pb-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="username"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="email"
                        type="email"
                        autoComplete="off"
                        {...field}
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-sm">
                Do you have an account?{" "}
                <UnderlineLink href="/sign-in">Sign In</UnderlineLink>
              </div>
              <div className="flex justify-end items-center ">
                <div className="flex gap-x-4">
                  <Button
                    variant="destructive"
                    type="button"
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                  <Button variant="secondary" disabled={loading} type="submit">
                    Register
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SingUpFrom;
