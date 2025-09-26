"use client";

import { useEffect} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage, } from "@/components/ui/form";

import { AuthHeader } from "@/components/auth/auth-header";
import { InputOTP, InputOTPGroup,InputOTPSlot, InputOTPSeparator, } from "@/components/ui/input-otp";
import { useActivateAccountMutation } from "@/lib/api/authApi";
import { activateAccountSchema, type ActivateAccountInput } from "@/lib/validation/auth";

export function AccountActivationForm() {
  const router = useRouter();
  const sp = useSearchParams();

  // prefer the query param (your Ventiqo style), fallback to sessionStorage
  const tokenFromUrl = sp.get("token") || "";
  const tokenFromSession = typeof window !== "undefined" ? sessionStorage.getItem("activation_token") : null;
  const activation_token = tokenFromUrl || tokenFromSession || "";

  const form = useForm<ActivateAccountInput>({
    resolver: zodResolver(activateAccountSchema),
    defaultValues: { activation_token: "", activation_code: "" },
    mode: "onChange",
  });

  useEffect(() => {
    if (activation_token) {
      form.setValue("activation_token", activation_token, {
        shouldValidate: true,
      });
    }
  }, [activation_token, form]);

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
      <AuthHeader
        title="Activate your account"
        subtitle="Enter the 6-digit code we emailed you."
      />
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
                <FormItem className="space-y-1 ">
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      value={field.value}
                      onChange={(v) =>
                        field.onChange((v as string).replace(/\D/g, ""))
                      }
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

            {!activation_token && (
              <p className="text-xs text-amber-600">
                We couldn’t find an activation token. Please sign up again, or
                open the link from your email on this device.
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !activation_token}
          >
            {isLoading ? "Activating..." : "Activate Account"}
          </Button>
        </form>
      </Form>
    </>
  );
}
