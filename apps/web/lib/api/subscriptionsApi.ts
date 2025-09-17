import { api } from "../store/api";

export type Subscription = { _id: string; plan: string; status: string; [k: string]: any };

export const subscriptionsApi = api.injectEndpoints({
  endpoints: (build) => ({
    createSubscription: build.mutation<Subscription, {
      userId: string;
      plan: string;
      provider: "apple" | "google" | "stripe" | string;
      productId: string;
      purchaseToken: string;
    }>({
      query: (body) => ({ url: "/subscriptions", method: "POST", body }),
      invalidatesTags: ["Subscriptions"],
    }),
    cancelSubscription: build.mutation<Subscription, string>({
      query: (id) => ({ url: `/subscriptions/${id}`, method: "DELETE" }),
      invalidatesTags: ["Subscriptions"],
    }),
    expireSubscription: build.mutation<Subscription, string>({
      query: (id) => ({ url: `/subscriptions/${id}/expire`, method: "PATCH" }),
      invalidatesTags: ["Subscriptions"],
    }),
    getEntitlement: build.query<any, string>({
      query: (userId) => ({ url: `/subscriptions/${userId}/entitlement` }),
      providesTags: ["Subscriptions"],
    }),
    verifySubscription: build.mutation<any, {
      provider: string;
      productId: string;
      purchaseToken: string;
    }>({
      query: (body) => ({ url: "/subscriptions/verify", method: "POST", body }),
    }),
  }),
});

export const {
  useCreateSubscriptionMutation,
  useCancelSubscriptionMutation,
  useExpireSubscriptionMutation,
  useGetEntitlementQuery,
  useVerifySubscriptionMutation,
} = subscriptionsApi;
