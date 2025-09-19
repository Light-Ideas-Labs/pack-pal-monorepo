import { createApi, fetchBaseQuery, FetchArgs, BaseQueryApi } from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";
import type { RootState } from "./StoreProvider";
import type { ApiEnvelope } from "@/types";


type FetchMethod = "GET"|"POST"|"PATCH"|"PUT"|"DELETE";
const isMutating = (m?: string) => (["POST","PATCH","PUT","DELETE"] as FetchMethod[]).includes((m||"GET").toUpperCase() as FetchMethod)

const baseUrl = process.env.NEXT_PUBLIC_API_BASE;
console.log("[api] baseUrl:", baseUrl);

/** public endpoints that should Never trigger refresh */
const PUBLIC_AUTH_PATHS = [
  "/auth/signin",
  "/auth/signup",
  "/auth/activate-account",
  "/auth/verify-email",
  "/auth/forgot-password",
  "/auth/new-password",
  "/auth/change-password",       // in case you use this variant
  "/auth/refresh-token",         // avoid loops
];

function isPublicAuthUrl(url: string) {
  try {
    // args.url can be relative; we want the pathname only - normalize
    const path  = url.startsWith("http") ? new URL(url).pathname : url;
    return PUBLIC_AUTH_PATHS.some((p) => path.includes(p));
  } catch {
    return PUBLIC_AUTH_PATHS.some((p) => url.includes(p));
  }
}

/** helpers for toast and API messages */
const canToast = () => typeof window !== "undefined";

// minimal runtime guards
const isObject = (x: unknown): x is Record<string, unknown> => {
  return typeof x === "object" && x !== null;
};

const getApiMessage = (x: unknown): string | undefined => {
  if (!isObject(x)) return;
  const m = x["message"];
  return typeof m === "string" && m.trim() ? m : undefined;
}

export function handleApiSuccess(data: unknown, method?: string, url?: string) {
  if (!canToast()) return;
  if (url?.includes("/auth/refresh-token")) return; // skip auth refresh endpoints

  // 1. prefer sever message if present
  const msg = getApiMessage(data);
  if (msg) {toast.success(msg); return;}

  // 2. generic success for mutating methods
  toast.success(isMutating(method) ? "Saved" : "Success");
}

export function handleApiError(err: any) {
  const msg = err?.data?.message || err?.error || (typeof err === "string" ? err : "Request failed");
  toast.error(msg);
}

/** Attach token + cookies; try refresh on 401 exactly once */
const rawBase = fetchBaseQuery({
  baseUrl,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const { user } = (getState() as RootState).global;
    const token = (getState() as any).auth?.token as string | null;  // adjust to your actual slice property
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    } else if (user?.guestId) {
      headers.set("x-guest-id", user.guestId); // backend: map to requireUserOrGuest
    }
    return headers;
  },
});

const customBaseQuery = async (args: string | FetchArgs, api: BaseQueryApi, extra: object) => {
  const method = typeof args === "string" ? undefined : args.method;
  const url = (typeof args === "string" ? args : args.url) || "";

  let res = await rawBase(args, api, extra);

  // Only consider refresh if:
  // - we got a 401
  // - the original request is NOT a public auth endpoint
  // - we appear to have a logged-in session (e.g., we store a refresh token or are “authenticated” in state)
  // - we are not already calling refresh-token (avoid loops)
  const state = api.getState() as any;
  const token = state?.auth?.token as string | null;
  const looksLoggedIn = Boolean(token);

  if (res.error?.status === 401 && !isPublicAuthUrl(url) && looksLoggedIn) {
    const refresh = await rawBase({ url: "/auth/refresh-token", method: "POST" }, api, extra);
    if (!refresh.error) {
      res = await rawBase(args, api, extra);
    }
  }

  // toasts for all APIs
 if (res.error) {
    const isRefreshCall = isPublicAuthUrl(url) || url.includes("/auth/refresh-token");
    if (!isRefreshCall) handleApiError(res.error);
  } else {
    // If you want the data typed, narrow to the envelope here:
    const data = res.data as ApiEnvelope;      // <— typed, not any
    console.log("[api] success:", method, url, data);
    handleApiSuccess(data, method, url);
  }

  return res;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,
  tagTypes: ["Auth", "Users", "Plans", "Subscriptions", "FeatureMatrix", "Watchlist", "Trips", "TripDays", "TravelRequirements"],
  endpoints: () => ({}),
});
