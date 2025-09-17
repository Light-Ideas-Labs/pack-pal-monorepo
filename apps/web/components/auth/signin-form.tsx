// components/auth/signin-form.tsx
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, } from "@/components/ui/form";

import { useSignInMutation } from "@/lib/api/authApi";
import { AuthHeader } from "@/components/auth/auth-header";
import { signInSchema, SignInFormValues } from "@/lib/validation/auth";
import GoogleSignInButton from "../social-buttons/google-auth-button";

function roleToPath(role?: string | null) {
  const r = (role ?? "").toLowerCase();
  if (r === "admin") return "/admin/overview";
  if (r === "customer") return "/account";
  if (r === "vendor") return "/vendor";
  if (r === "guest") return "/guest";
  return "/account";
}

export function SignInForm({className, ...props}: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next") || "";

  const [email, setEmail] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);


  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {email: "", password: ""},
    mode: "onTouched",
  });

  const [signIn, { isLoading }] = useSignInMutation();

  const onSubmit = async (values: SignInFormValues) => {
    try {
      const res = await signIn(values).unwrap();
      // ^ expect { user: { role, ... }, accessToken: string, ... }
      const roleRaw = res?.user?.role ?? "customer";
      const role = String(roleRaw);

      toast.success(res?.message || "Login successful");

      // If middleware provided ?next=..., respect it; otherwise role home
      const target = nextParam || roleToPath(role);

      // Use replace to avoid going back to login on back nav
      router.replace(target);
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || "Login failed";
      toast.error(msg);
    }
  }

  return (
    <>
        <AuthHeader
          title="Sign in to your account"
          subtitle="Enter your email below to sign in to your account"
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="m@example.com"
                    autoComplete="email"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <FormLabel>Password</FormLabel>
                  <a
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      disabled={isLoading}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute inset-y-0 right-2"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in…" : "Login"}
            </Button>
          </div>

          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <a href="/auth/sign-up" className="underline underline-offset-4">
              Sign up
            </a>
          </div>
          </form>
        </Form>
        <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <GoogleSignInButton />
    </>
  );
}
