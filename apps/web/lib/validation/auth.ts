"use client";

import { z } from "zod";

/* ----- Sign In Schema forms ----- */
export const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignInFormValues = z.infer<typeof signInSchema>;


/* ----- Sign Up Schema forms ----- */
export const signUpSchema = z.object({
    firstName: z.string().min(2, "First name is too short"),
    lastName: z.string().min(2, "Last name is too short"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm: z.string().min(6, "Password must be at least 6 characters"),
  }).refine((v) => v.password === v.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });
  
export type SignUpInput = z.infer<typeof signUpSchema>;


/* -----  Activate Account ----- */

export const activateAccountSchema = z.object({
  activation_code: z.string().min(6, "Enter the 6-digit code"),
  activation_token: z.string().min(1, "Missing activation token"),
});

export type ActivateAccountInput = z.infer<typeof activateAccountSchema>;


/* -----  Forgot Password ----- */

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((v) => v.password === v.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;


/* ---------- Helpers ---------- */
export type FieldErrors<T> = Partial<Record<keyof T, string>>;

/** Convert a ZodError into a field→message map for simple UIs */
export function zodErrorToFieldErrors<T>(err: z.ZodError): FieldErrors<T> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = String(issue.path[0] ?? "");
    if (!out[key]) out[key] = issue.message;
  }
  return out as FieldErrors<T>;
}
