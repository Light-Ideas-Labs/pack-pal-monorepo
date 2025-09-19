import { api } from "../store/api"
import { loginSuccess, setAccessToken, logoutToGuest } from "../store/globalSlice"
import { setCredentials, setUser } from "../store/authSlice"

type ForgotPasswordResponse = {
  success: boolean;
  message?: string;
  token?: string;
};

// what backend returns in your current controller
type SignUpResponse = {
  success: boolean;
  message?: string;
  activationToken?: string; // <-- important!
};

type SignInBody = { email: string; password: string }
type SignUpBody = { 
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    avatar?: string;
}
type ActivateBody = {
    activation_token: string;
    activation_code: string;
}

type ChangePwdBody = { oldPassword: string; newPassword: string }
type NewPwdBody = { token: string; newPassword: string }

type AuthPayload = {
  success?: boolean;
  message?: string;
  accessToken: string;
  refreshToken: string;
  user: {
    role: string; // "admin" | "traveler" (lowercase from API)
    email: string
    username: string
    status: string;   // "ACTIVE" | "INACTIVE" | "PENDING"
    id?: string;
    _id?: string;
  }
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation<SignUpResponse, SignUpBody>({
      query: (body) => ({ url: "/auth/signup", method: "POST", body }),
    }),

    activateAccount: builder.mutation<{ success: boolean; message?: string }, ActivateBody>({
      query: (body) => ({ url: "/auth/activate-account", method: "POST", body }),
    }),

    signIn: builder.mutation<AuthPayload, SignInBody>({
      query: (body) => ({ url: "/auth/signin", method: "POST", body }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled

        const roleU = String(data.user.role || "customer").toUpperCase() as | "ADMIN" | "TRAVELER";
        
        const statusU = (data.user.status ? String(data.user.status) : "ACTIVE").toUpperCase() as "ACTIVE" | "INACTIVE" | "PENDING";
        
        // Write a simple 'role' cookie for the middleware (lowercase is fine)
        if (typeof document !== "undefined") {
          document.cookie = [
            `role=${encodeURIComponent(roleU.toLowerCase())}`,
            "Path=/",
            "SameSite=Lax",
            process.env.NODE_ENV === "production" ? "Secure" : "",
            "Max-Age=3600",
          ].filter(Boolean).join("; ");
        }

    dispatch(loginSuccess({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      role: roleU,
      status: statusU,
      email: data.user.email,
      username: data.user.username,
    }));
    
    // ✅ authSlice (used by api.ts → Authorization header + writes access_token cookie)
    dispatch(setCredentials({ accessToken: data.accessToken, user: {
      id: data.user.id ?? data.user._id,
      role: data.user.role,
      status: data.user.status,
      email: data.user.email,
      userName: data.user.username 
    }}));
  },
      invalidatesTags: ["Auth", "Users", "Plans", "FeatureMatrix", "Watchlist", "Trips", "TripDays", "TravelRequirements"],
    }),


    me: builder.query<{ success: boolean; data: { id: string; email: string; username: string; role: string; status: string; avatarUrl?: string | null } }, void>({
      query: () => ({ url: "/auth/me", method: "GET" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        // hydrate slices if you want
        dispatch(setUser({
          id: data.data.id,
          email: data.data.email,
          userName: data.data.username,
          role: data.data.role,
          status: data.data.status,
          avatarUrl: data.data.avatarUrl ?? undefined,
        }));
      },
      providesTags: ["Auth"],
    }),


    signOut: builder.mutation<{ success: boolean }, void>({
      query: () => ({ url: "/auth/signout", method: "POST" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled
        dispatch(logoutToGuest())
      },
      invalidatesTags: ["Auth", "Users", "Plans", "FeatureMatrix", "Watchlist", "Trips", "TripDays", "TravelRequirements"],
    }),

    refreshToken: builder.mutation<{ accessToken: string }, void>({
      query: () => ({ url: "/auth/refresh-token", method: "POST" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled
        dispatch(setAccessToken(data.accessToken))
      },
      invalidatesTags: ["Auth"],
    }),

    sendVerificationEmail: builder.mutation<{ success: boolean }, { email: string }>({
      query: (body) => ({ url: "/auth/verification-email/send", method: "POST", body }),
    }),

    verifyEmail: builder.query<{ success: boolean }, { token: string }>({
      query: ({ token }) => ({ url: `/auth/verify-email?token=${encodeURIComponent(token)}` }),
    }),

    forgotPassword: builder.mutation<ForgotPasswordResponse, { email: string }>({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
    }),

    setNewPassword: builder.mutation<{ success: boolean; message?: string }, NewPwdBody>({
      query: ({ token, newPassword }) => ({
        url: `/auth/new-password/${encodeURIComponent(token)}`,
        method: "POST",
        body: { password: newPassword },
      }),
    }),

    changePassword: builder.mutation<{ success: boolean }, ChangePwdBody>({
      query: (body) => ({ url: "/auth/change-password", method: "POST", body }),
    }),
  }),
})

export const {
  useSignUpMutation,
  useActivateAccountMutation,
  useSignInMutation,
  useMeQuery,
  useSignOutMutation,
  useRefreshTokenMutation,
  useSendVerificationEmailMutation,
  useVerifyEmailQuery,
  useForgotPasswordMutation,
  useSetNewPasswordMutation,
  useChangePasswordMutation,
} = authApi
