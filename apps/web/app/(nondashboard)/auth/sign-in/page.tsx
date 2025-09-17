"use client";

import { useState } from "react";

import { Card } from "@/components/ui/card";
import { SignInForm } from "@/components/auth/signin-form";


export default function SignInPage() {


  return (
    <Card className="p-6 max-w-md mx-auto">
      <SignInForm />
    </Card>
  );
}
