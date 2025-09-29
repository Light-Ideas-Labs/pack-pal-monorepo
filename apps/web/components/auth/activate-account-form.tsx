"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { AuthHeader } from "@/components/auth/auth-header";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { useActivateAccountMutation } from "@/lib/api/authApi";
import { activateAccountSchema, type ActivateAccountInput } from "@/lib/validation/auth";

export function AccountActivationForm() {
  const router = useRouter();
  const [activationToken, setActivationToken] = useState<string>("");

  // Read token from URL (client) or sessionStorage, no useSearchParams needed.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const urlToken = new URLSearchParams(window.location.search).get("token") || "";
    const sessionToken = sessionStorage.getItem("activation_token") || "";
    const token = urlToken || sessionToken || "";

    setActivationToken(token);

    // keep a copy so a refresh still works
    if (urlToken) sessionStorage.setItem("activation_token", urlToken);
  }, []);

  const form = useForm<ActivateAccountInput>({
    resolver: zodResolver(activateAccountSchema),
    defaultValues: { activation_token: "", activation_code: "" },
    mode: "onChange",
  });

  // push the token into RHF when we have it
  useEffect(() => {
    if (activationToken) {
      form.setValue("activation_token", activationToken, { shouldValidate: true });
    }
  }, [activationToken, form]);

  const [activateAccount, { isLoading }] = useActivateAccountMutation();

  async function onSubmit(values: ActivateAccountInput) {
    try {
      await activateAccount({
        activation_token: values.activation_token,
        activation_code: values.activation_code,
      }).unwrap();

      toast.success("Activation successful. You can now sign in.");
      sessionStorage.removeItem("activation_token");
      router.replace("/auth/sign-in");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      toast.error(err?.data?.message || err?.message || "Activation failed. Please try again.");
    }
  }

  return (
    <>
      <AuthHeader title="Activate your account" subtitle="Enter the 6-digit code we emailed you." />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="activation_token"
              render={({ field }) => <input type="hidden" {...field} />}
            />

            <FormField
              control={form.control}
              name="activation_code"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      value={field.value}
                      onChange={(v) => field.onChange((v as string).replace(/\D/g, ""))}
                      className="justify-between"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!activationToken && (
              <p className="text-xs text-amber-600">
                We couldn’t find an activation token. Please sign up again, or open the link from your email on this device.
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !activationToken}>
            {isLoading ? "Activating..." : "Activate Account"}
          </Button>
        </form>
      </Form>
    </>
  );
}
