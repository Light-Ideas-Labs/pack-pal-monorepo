"use client";

import { Card } from "@/components/ui/card";
import UserForgotPasswordForm from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {


  return (
    <Card className="p-6 max-w-md mx-auto">
      <UserForgotPasswordForm />
    </Card>
  );
}
