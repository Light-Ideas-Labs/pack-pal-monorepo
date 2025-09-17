"use client";

import { Card } from "@/components/ui/card";
import UserResetPasswordForm from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {


  return (
    <Card className="p-6 max-w-md mx-auto">
      <UserResetPasswordForm />
    </Card>
  );
}
