"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "../ui/use-toast";
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
import { sign } from "crypto";
import { signIn } from "next-auth/react";

const formSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type UserFormValues = z.infer<typeof formSchema>;
const SignInFrom = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const defaultValues: UserFormValues = {
    username: "",
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

    signIn("credentials", {
      ...data,
      redirect: false,
    }).then((callback) => {
      setLoading(false);
      if (callback?.ok) {
        resetForm();
        router.push("/dashboard");
        router.refresh();
        toast({
          variant: "success",
          title: "Success",
          description: "User logged in successfully",
        });
      }

      if (callback?.error) {
        setError(callback.error);
        toast({
          variant: "destructive",
          title: "Error",
          description: callback.error,
        });
        setError("");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your username and password to enter our system
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
                Do you not have an account?{" "}
                <UnderlineLink href="/sign-up">Sign Up</UnderlineLink>
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
                    Login
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

export default SignInFrom;
