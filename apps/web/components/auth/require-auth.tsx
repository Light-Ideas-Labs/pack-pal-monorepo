"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/store/StoreProvider";
import { selectToken } from "@/lib/store/authSlice";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = useAppSelector(selectToken);
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSearch(window.location.search || "");
    }
  }, []);

  useEffect(() => {
    if (!token) {
      const next = pathname + (search || "");
      router.replace(`/auth/sign-in?next=${encodeURIComponent(next)}`);
    }
  }, [token, pathname, search, router]);

  if (!token) return null;
  return children;
}
