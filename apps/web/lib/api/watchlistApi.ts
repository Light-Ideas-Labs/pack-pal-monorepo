import { api } from "../store/api";

export type WatchItem = { _id: string; title?: string; labels?: string[]; isMuted?: boolean; [k: string]: any };

export const watchlistApi = api.injectEndpoints({
  endpoints: (build) => ({
    addToWatchlist: build.mutation<{ success: boolean; dataItem: WatchItem }, { targetId: string }>({
      query: (body) => ({ url: "/watchlist", method: "POST", body }),
      invalidatesTags: ["Watchlist"],
    }),
    removeFromWatchlistByTarget: build.mutation<{ success: boolean; dataItem: any }, { targetId: string }>({
      query: (body) => ({ url: "/watchlist/target", method: "DELETE", body }),
      invalidatesTags: ["Watchlist"],
    }),
    removeFromWatchlistById: build.mutation<{ success: boolean; dataItem: any }, string>({
      query: (watchlistId) => ({ url: `/watchlist/${watchlistId}`, method: "DELETE" }),
      invalidatesTags: ["Watchlist"],
    }),

    getWatchlist: build.query<{
      success: boolean;
      dataList: WatchItem[];
      meta?: any;
    }, {
      targetKind?: "Project" | "Trips" | "Places" | "Flights" | "Countries";
      isMuted?: boolean;
      page?: number;
      limit?: number;
      sortBy?: string; // e.g. "createdAt:desc"
      populate?: boolean;
    } | void>({
      query: (q) => {
        const params = new URLSearchParams();
        if (!q) q = {};
        if (q.targetKind) params.set("targetKind", q.targetKind);
        if (q.isMuted != null) params.set("isMuted", String(q.isMuted));
        if (q.page) params.set("page", String(q.page));
        if (q.limit) params.set("limit", String(q.limit));
        if (q.sortBy) params.set("sortBy", q.sortBy);
        if (q.populate != null) params.set("populate", String(q.populate));
        const suffix = params.toString() ? `?${params}` : "";
        return { url: `/watchlist${suffix}`, method: "GET" };
      },
      providesTags: ["Watchlist"],
    }),
    getWatchlistItem: build.query<{ success: boolean; dataItem: WatchItem }, { watchlistId: string; populate?: boolean }>({
      query: ({ watchlistId, populate }) => ({
        url: `/watchlist/${watchlistId}${populate ? `?populate=${populate}` : ""}`,
        method: "GET",
      }),
      providesTags: (_r, _e, { watchlistId }) => [{ type: "Watchlist", id: watchlistId }],
    }),
    updateWatchlistItem: build.mutation<{ success: boolean; dataItem: WatchItem }, {
      watchlistId: string;
      title?: string;
      labels?: string[];
      isMuted?: boolean;
      notifyOn?: any;
      meta?: any;
    }>({
      query: ({ watchlistId, ...body }) => ({ url: `/watchlist/${watchlistId}`, method: "PATCH", body }),
      invalidatesTags: ["Watchlist"],
    }),
    muteWatchlistItem: build.mutation<{ success: boolean; dataItem: WatchItem }, { watchlistId: string; isMuted: boolean }>({
      query: ({ watchlistId, isMuted }) => ({ url: `/watchlist/${watchlistId}/mute`, method: "PATCH", body: { isMuted } }),
      invalidatesTags: ["Watchlist"],
    }),
    updateNotifyRules: build.mutation<{ success: boolean; dataItem: WatchItem }, { watchlistId: string; rules: any }>({
      query: ({ watchlistId, rules }) => ({ url: `/watchlist/${watchlistId}/notify`, method: "PATCH", body: { rules } }),
      invalidatesTags: ["Watchlist"],
    }),
    addLabels: build.mutation<{ success: boolean; dataItem: WatchItem }, { watchlistId: string; labels: string[] }>({
      query: ({ watchlistId, labels }) => ({ url: `/watchlist/${watchlistId}/labels`, method: "POST", body: { labels } }),
      invalidatesTags: ["Watchlist"],
    }),
    removeLabel: build.mutation<{ success: boolean; dataItem: WatchItem }, { watchlistId: string; label: string }>({
      query: ({ watchlistId, label }) => ({ url: `/watchlist/${watchlistId}/labels/${encodeURIComponent(label)}`, method: "DELETE" }),
      invalidatesTags: ["Watchlist"],
    }),

    // helpers (jobs)
    getCountryWatchers: build.query<{ success: boolean; dataList: any[] }, string>({
      query: (countryCode) => ({ url: `/watchers/countries/${countryCode}`, method: "GET" }),
    }),
    getTripReminderWatchers: build.query<{ success: boolean; dataList: any[] }, string>({
      query: (tripId) => ({ url: `/watchers/trips/${tripId}`, method: "GET" }),
    }),
  }),
});

export const {
  useAddToWatchlistMutation,
  useRemoveFromWatchlistByTargetMutation,
  useRemoveFromWatchlistByIdMutation,
  useGetWatchlistQuery,
  useGetWatchlistItemQuery,
  useUpdateWatchlistItemMutation,
  useMuteWatchlistItemMutation,
  useUpdateNotifyRulesMutation,
  useAddLabelsMutation,
  useRemoveLabelMutation,
  useGetCountryWatchersQuery,
  useGetTripReminderWatchersQuery,
} = watchlistApi;
