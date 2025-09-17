"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getJSON } from "@/lib/auth-client";
import { Card } from "@/components/ui/card";
import { AuthHeader } from "@/components/auth/auth-header";

export default function VerifyEmailPage() {
  const sp = useSearchParams();
  const [status, setStatus] = useState<"idle"|"ok"|"error">("idle");
  const [msg, setMsg] = useState<string>("Verifying…");

  useEffect(() => {
    const token = sp.get("token");
    if (!token) {
      setStatus("error");
      setMsg("Missing verification token.");
      return;
    }
    getJSON(`/api/v1/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(() => {
        setStatus("ok");
        setMsg("Email verified! You can now sign in.");
      })
      .catch((e) => {
        setStatus("error");
        setMsg(e?.message || "Verification failed.");
      });
  }, [sp]);

  return (
    <Card className="p-6">
      <AuthHeader title="Email Verification" />
      <p className={status === "error" ? "text-red-600" : "text-muted-foreground"}>{msg}</p>
    </Card>
  );
}
