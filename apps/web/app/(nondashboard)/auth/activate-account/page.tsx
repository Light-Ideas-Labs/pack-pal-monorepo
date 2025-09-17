"use client";

import { Card } from "@/components/ui/card";
import { AccountActivationForm } from "@/components/auth/activate-account-form";


export default function ActivateAccountPage() {
  return (
    <Card className="p-6 max-w-md mx-auto">
      <AccountActivationForm />
    </Card>
  );
}

