"use client";

import Link from "next/link";

type Props = {
  username?: string | null;
  role?: string | null; // "Admin" | "Pro" | "Teams" | "Traveler" | "Guest" | ...
  message?: string;    /** centered copy; override per page/campaign */
};

function roleToPath(role?: string | null) {
  const r = (role ?? "").toLowerCase();
  if (r === "admin") return "/admin/overview";
  if (r === "teams" || r === "team") return "/teams";
  if (r === "guest") return "/signin";
  // "pro", "traveler", or anything else -> app dashboard
  return "/app";
}

export function AnnouncementBar({
  username,
  role = "Guest",
  message = "✈️ Plan trips, pack smart — Try PackPal Pro free for 7 days!",
}: Props) {
  const displayName = username?.trim() || role || "Guest";
  const roleHref = roleToPath(role);

  return (
    <div className="w-full bg-primary text-primary-foreground text-[11px] sm:text-xs">
      <div className="relative mx-auto max-w-7xl px-4 py-2">
        {/* Centered announcement */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center">
          <span className="font-medium">{message}</span>
        </div>

        {/* Right-aligned greeting + role link */}
        <div className="ml-auto flex items-center justify-end gap-2">
          <span className="hidden sm:inline max-w-[50%] truncate font-medium">
            Welcome back, {displayName}!
          </span>
          <span className="hidden sm:inline opacity-70">|</span>
          <Link
            href={roleHref}
            prefetch
            className="hidden sm:inline underline-offset-4 hover:underline font-medium"
          >
            {role?.toString() || "Account"}
          </Link>
        </div>
      </div>
    </div>
  );
}
