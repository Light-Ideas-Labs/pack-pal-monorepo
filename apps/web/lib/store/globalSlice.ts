import { createSlice, PayloadAction } from "@reduxjs/toolkit"

/* ---------- Types ---------- */

type Role = "ADMIN" | "STAFF" | "CUSTOMER" | "GUEST" | null
type Status = "ACTIVE" | "INACTIVE" | "PENDING" | null

type LoginPayload = {
  accessToken: string
  refreshToken: string
  role: Exclude<Role, "GUEST" | null>
  status: Exclude<Status, null>
  email: string
  username: string
}

type MePayload = {
  role: "Admin" | "Staff" | "Customer"
  status: "active" | "inactive" | "pending"
  email: string
  username: string
}

interface InitialStateTypes {
  user: {
    isAuthenticated: boolean
    role: Role
    status: Status
    accessToken: string | null
    refreshToken: string | null
    email: string
    username: string
    guestId: string | null
  }
  ui: {
    isSidebarOpen: boolean
    isThemeDark: boolean
  }
  shop: {
    cartCount: number
    wishlistCount: number
  }
  analytics: {
    totalUsers: number
    totalTransactions: number
    revenue: number
  }
}

/* ---------- Cookie helpers ---------- */

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

const toRole = (r: "Admin" | "Staff" | "Customer"): Exclude<Role, "GUEST" | null> =>
  r.toUpperCase() as Exclude<Role, "GUEST" | null>

const toStatus = (s: "active" | "inactive" | "pending"): Exclude<Status, null> =>
  s.toUpperCase() as Exclude<Status, null>

/* ---------- Guest helpers ---------- */

const makeGuestId = () => {
  // Prefer cryptographically strong id if available
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID() as string
  }
  return `g_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

const GUEST_COOKIE = "guestId"          // readable by server for /requireUserOrGuest
const ACCESS_COOKIE = "accessToken"     // short-lived, for SSR guards

/* ---------- Initial state ---------- */

const initialState: InitialStateTypes = {
  user: {
    isAuthenticated: false,
    role: "GUEST",
    status: null,
    accessToken: null,
    refreshToken: null,
    email: "",
    username: "",
    guestId: null,
  },
  ui: { isSidebarOpen: true, isThemeDark: false },
  shop: { cartCount: 0, wishlistCount: 0 },
  analytics: { totalUsers: 0, totalTransactions: 0, revenue: 0 },
}

/* ---------- Slice ---------- */

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    // Ensure there is a guest identity (call once on app boot)
    ensureGuest: (state) => {
      if (!state.user.guestId) {
        const id = makeGuestId()
        state.user.guestId = id
        state.user.role = "GUEST"
        state.user.isAuthenticated = false
        writeCookie(GUEST_COOKIE, id, 60 * 60 * 24 * 14) // 14 days
      }
    },

    loginSuccess: (state, action: PayloadAction<LoginPayload>) => {
      const { accessToken, refreshToken, role, status, email, username } = action.payload
      state.user.isAuthenticated = true
      state.user.accessToken = accessToken
      state.user.refreshToken = refreshToken
      state.user.role = role
      state.user.status = status
      state.user.email = email
      state.user.username = username

      // promote guest → user (backend can merge guest cart with user here)
      state.user.guestId = state.user.guestId ?? null
      writeCookie(ACCESS_COOKIE, accessToken) // short-lived token for SSR
    },

    setUserInfo: (state, action: PayloadAction<MePayload>) => {
      state.user.role = toRole(action.payload.role)
      state.user.status = toStatus(action.payload.status)
      state.user.email = action.payload.email
      state.user.username = action.payload.username
      state.user.isAuthenticated = true
    },

    // Optional: refresh access token
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.user.accessToken = action.payload
      if (action.payload) writeCookie(ACCESS_COOKIE, action.payload)
      else clearCookie(ACCESS_COOKIE)
    },

    // Logout back into a guest session (keeps/creates guestId)
    logoutToGuest: (state) => {
      clearCookie(ACCESS_COOKIE)
      state.user.isAuthenticated = false
      state.user.accessToken = null
      state.user.refreshToken = null
      state.user.role = "GUEST"
      state.user.status = null
      state.user.email = ""
      state.user.username = ""
      if (!state.user.guestId) {
        const id = makeGuestId()
        state.user.guestId = id
        writeCookie(GUEST_COOKIE, id, 60 * 60 * 24 * 14)
      }
    },

    // Hard logout (also removes guest id)
    logout: (state) => {
      clearCookie(ACCESS_COOKIE)
      clearCookie(GUEST_COOKIE)
      state.user = {
        isAuthenticated: false,
        role: "GUEST",
        status: null,
        accessToken: null,
        refreshToken: null,
        email: "",
        username: "",
        guestId: null,
      }
    },

    // UI
    toggleSidebar: (state) => {
      state.ui.isSidebarOpen = !state.ui.isSidebarOpen
    },
    toggleTheme: (state) => {
      state.ui.isThemeDark = !state.ui.isThemeDark
    },

    // SHOP badges
    setCartCount: (state, action: PayloadAction<number>) => {
      state.shop.cartCount = Math.max(0, action.payload)
    },
    setWishlistCount: (state, action: PayloadAction<number>) => {
      state.shop.wishlistCount = Math.max(0, action.payload)
    },

    // ANALYTICS
    setAnalytics: (
      state,
      action: PayloadAction<{ totalUsers: number; totalTransactions: number; revenue: number }>
    ) => {
      state.analytics = action.payload
    },
  },
})

export const {
  ensureGuest,
  loginSuccess,
  setUserInfo,
  setAccessToken,
  logoutToGuest,
  logout,
  toggleSidebar,
  toggleTheme,
  setCartCount,
  setWishlistCount,
  setAnalytics,
} = globalSlice.actions

export default globalSlice.reducer

/* ---------- Selectors ---------- */
export const selectUser = (s: { global: InitialStateTypes }) => s.global.user
export const selectToken = (s: { global: InitialStateTypes }) => s.global.user.accessToken
export const selectIsAuthed = (s: { global: InitialStateTypes }) => s.global.user.isAuthenticated
export const selectIsGuest = (s: { global: InitialStateTypes }) => s.global.user.role === "GUEST" && !s.global.user.isAuthenticated
export const selectGuestId = (s: { global: InitialStateTypes }) => s.global.user.guestId
export const selectShopBadges = (s: { global: InitialStateTypes }) => s.global.shop
