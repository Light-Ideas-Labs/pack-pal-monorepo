"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/store/StoreProvider";
import { selectToken } from "@/lib/store/authSlice";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = useAppSelector(selectToken);
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams()?.toString();

  useEffect(() => {
    if (!token) {
      const next = pathname + (search ? `?${search}` : "");
      router.replace(`/auth/sign-in?next=${encodeURIComponent(next)}`);
    }
  }, [token, pathname, search, router]);

  if (!token) return null; // or a skeleton
  return children;
}
