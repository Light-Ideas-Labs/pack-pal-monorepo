
"use client";

import { Card } from "@/components/ui/card";
import { SignUpForm } from "@/components/auth/signup-form";

export default function SignUpPage() {

  return (
    <Card className="p-6 max-w-md mx-auto">
      <SignUpForm />
    </Card>
  );
}


