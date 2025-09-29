import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useSetNewPasswordMutation } from "@/lib/api/authApi";
import { AuthHeader } from "@/components/auth/auth-header";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validation/auth";

export default function UserResetPasswordForm() {
  const router = useRouter();
  const [token, setToken] = useState( "");

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const [setNewPassword, { isLoading}] = useSetNewPasswordMutation();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlToken = new URLSearchParams(window.location.search).get("token") || "";
    setToken(urlToken);
  }, []);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async(values: ResetPasswordInput) => {
    if (!token) {
      toast.error("Invalid or missing token.");
      return;
    }

    try {
      const res = await setNewPassword({ token, newPassword: values.password }).unwrap();
      toast.success(res?.message || "Password reset successful.");
      router.push(`/auth/sign-in`);

    } catch (error: unknown) {
    const err = error as { data?: { message?: string } };
    console.log("Error during password reset:", error);
    toast.error(err?.data?.message || "Password reset failed. Please try again.");
    }
  }

  return (
   <>
    <AuthHeader title="Reset your password" subtitle="Enter your new password below." />
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="New password"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute inset-y-0 right-2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute inset-y-0 right-2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isLoading} type="submit" className="w-full">
          {isLoading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </Form>
    </>
  );
}
