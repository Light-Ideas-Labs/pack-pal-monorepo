"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useSignUpMutation } from "@/lib/api/authApi";
import { AuthHeader } from "@/components/auth/auth-header";
import { signUpSchema, type SignUpInput } from "@/lib/validation/auth";
import GoogleSignInButton from "../social-buttons/google-auth-button";
import Link from "next/link";

type Props = React.ComponentProps<"form"> & { redirectTo?: string };

export function SignUpForm({ redirectTo, ...formProps }: Props) {
  const router = useRouter();
  const sp = useSearchParams();
  const next = redirectTo ?? sp.get("next") ?? "/auth/activate-account";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [signUp, { isLoading, error }] = useSignUpMutation();

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { 
      firstName: "", 
      lastName: "",
      email: "", 
      password: "", 
      confirm: "" 
    },
  });

  const onSubmit: SubmitHandler<SignUpInput> = async (values) => {
    try {
      const res = await signUp({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        username: `${values.firstName.trim()} ${values.lastName.trim()}`.trim(),
      }).unwrap();

      const token = res?.activationToken as string | undefined;

      if (token) {
        sessionStorage.setItem("activationToken", token);
        router.push(`${next}?token=${encodeURIComponent(token)}`);
      } else {
        toast.info("Account created. Check your email for an activation link/code.");
        router.push("/auth/sign-in");
      }
    } catch (e: any) {
      const msg = e?.data?.message || e?.error || e?.message || "Sign up failed";
      toast.error(msg);
    }
  };

  const apiErr = (error as any)?.data?.message || (error as any)?.error;

  return (
    <>
      <AuthHeader
        title="Create an account"
        subtitle="Start your free trial, no credit card required."
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6" {...formProps}>
          <div className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input placeholder="Ada" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input placeholder="Lovelace" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" autoComplete="email" {...field} />
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
                    <Input type="password" autoComplete="new-password" {...field} />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute inset-y-0 right-2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </Button>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" {...field} />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute inset-y-0 right-2"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </Button>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          <div className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create account"}
            </Button>
            {apiErr ? <p className="text-sm text-destructive">{apiErr}</p> : null}
          </div>

          <div className="mt-2 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="underline underline-offset-4">
              Sign in
            </Link>
          </div>
        </form>
      </Form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <GoogleSignInButton />
    </>
  );
}

export default SignUpForm;
