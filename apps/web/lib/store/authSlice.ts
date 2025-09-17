import { createSlice, PayloadAction } from "@reduxjs/toolkit"

// ---- Types kept minimal & compatible with your code ----
export type UserInfo = {
  id?: string
  role?: string
  status?: string
  email?: string
  userName?: string
}

export type AuthState = {
  token: string | null
  user: UserInfo | null
  initialized: boolean
}

// ---- cookie helpers (client only) ----
const readCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null
  const m = document.cookie.split("; ").find((r) => r.startsWith(name + "="))
  return m ? decodeURIComponent(m.split("=")[1]) : null
}

const writeCookie = (name: string, value: string, maxAgeSec = 60 * 60) => {
  if (typeof document === "undefined") return
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    "SameSite=Lax",
    process.env.NODE_ENV === "production" ? "Secure" : "",
    `Max-Age=${maxAgeSec}`,
  ].filter(Boolean)
  document.cookie = parts.join("; ")
}

const clearCookie = (name: string) => {
  if (typeof document === "undefined") return
  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`
}

// ---- initial state (rehydrate token from cookie if on client) ----
const initialState: AuthState = {
  token: typeof document !== "undefined" ? readCookie("accessToken") : null,
  user: null,
  initialized: false,
}

const authSlice = createSlice({name: "auth", initialState,
  reducers: {
    /** Save access token and optional user profile */
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string; user?: UserInfo }>
    ) => {
      state.token = action.payload.accessToken
      state.user = action.payload.user ?? state.user ?? null
      writeCookie("accessToken", action.payload.accessToken)
    },

    /** Update only the user info (e.g., after /me or profile edit) */
    setUser: (state, action: PayloadAction<UserInfo | null>) => {
      state.user = action.payload
    },

    /** Clear everything */
    signOut: (state) => {
      state.token = null
      state.user = null
      clearCookie("accessToken")
    },

    /** Optional: call once on app boot to mark slice as ready and pick up cookie */
    initFromCookie: (state) => {
      if (typeof document !== "undefined" && !state.token) {
        state.token = readCookie("accessToken")
      }
      state.initialized = true
    },
  },
})

export const { setCredentials, setUser, signOut, initFromCookie } = authSlice.actions
export default authSlice.reducer

// ---- selectors ----
export const selectAuth = (s: { auth: AuthState }) => s.auth
export const selectToken = (s: { auth: AuthState }) => s.auth.token
export const selectCurrentUser = (s: { auth: AuthState }) => s.auth.user
export const selectIsAuthenticated = (s: { auth: AuthState }) => !!s.auth.token
export const selectAuthInitialized = (s: { auth: AuthState }) => s.auth.initialized
