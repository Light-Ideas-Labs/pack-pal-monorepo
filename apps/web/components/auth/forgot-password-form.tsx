"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useForgotPasswordMutation } from "@/lib/api/authApi";
import { AuthHeader } from "@/components/auth/auth-header";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validation/auth";

export default function UserForgotPasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [forgot, { isLoading, isSuccess, error }] = useForgotPasswordMutation();

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setLoading(true);
    try {
      console.log("Sending email to reset password:", data.email);

      const res = await forgot({ email: data.email }).unwrap();
      console.log("Password reset email sent successfully. Response:", res);
      if (res.token) {
        router.push(`/auth/reset-password?token=${encodeURIComponent(res.token)}`);
        
        // toast success message
        toast.success(res.message || "Password reset email sent successfully.");
      } else {
        // if you want fallback redirect when token is not returned:
        // else router.push('/auth/check-your-email');
        toast.error("No token received. Please check your email for further instructions.");
      }
    } catch (error) {
      console.error("Error sending reset link:", error)
      // toast error message
      toast.error("Failed to send password reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <AuthHeader title="Forgot your password?" subtitle="Enter your email to reset your password." />
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loading} type="submit" className="w-full">
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>
    </Form>
    </>
  );
}
