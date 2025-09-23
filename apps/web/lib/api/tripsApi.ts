import { api } from "../store/api";
import { Trip, TripDay } from "../../types";

type Paginated<T> = {
  data: T[];
  _links: any;
  _meta: any
};


export const tripsApi = api.injectEndpoints({
  endpoints: (build) => ({
    createTrip: build.mutation<{ success: boolean; data: Trip }, 
    {title: string; destination?: string; startDate: string; endDate: string; coverColor?: string; invites?: string[], visibility?: "private" | "public" | "friends"}>({
      query: (body) => ({ url: "/trips/create", method: "POST", body }),
        async onQueryStarted(arg, { queryFulfilled }) {
    console.log("[RTKQ] createTrip fired with:", arg);
    try {
      const { data } = await queryFulfilled;
      console.log("[RTKQ] createTrip success:", data);
    } catch (e) {
      console.error("[RTKQ] createTrip error:", e);
    }
  },
      invalidatesTags: ["Trips"],
    }),
    listTrips: build.query<{ success: boolean; data: Paginated<Trip> }, { page?: number; limit?: number } | void>({
      query: (q) => {
        const params = new URLSearchParams();
        if (q?.page) params.set("page", String(q.page));
        if (q?.limit) params.set("limit", String(q.limit));
        const suffix = params.toString() ? `?${params}` : "";
        return { url: `/trips/list${suffix}`, method: "GET" };
      },
      providesTags: (res) =>
        res?.data.data
          ? [
              { type: "Trips", id: "LIST" },
              ...res.data.data.map((t) => ({ type: "Trips" as const, id: t._id })),
            ]
          : [{ type: "Trips", id: "LIST" }],
    }),
    getTrip: build.query<{ success: boolean; data: Trip }, string>({
      query: (id) => ({ url: `/trips/${id}/trip`, method: "GET" }),
      providesTags: (_r, _e, id) => [{ type: "Trips", id }],
    }),
    updateTrip: build.mutation<{ success: boolean; data: Trip }, { id: string; updates: Partial<Trip> }>({
      query: ({ id, updates }) => ({ url: `/trips/${id}`, method: "PUT", body: updates }),
      invalidatesTags: (_r, _e, { id }) => ["Trips", { type: "Trips", id }],
    }),

    // Documents
    addDocument: build.mutation<{ success: boolean; data: any }, { id: string; name: string; url: string; size?: number; mimeType?: string }>({
      query: ({ id, ...body }) => ({ url: `/trips/${id}/documents`, method: "POST", body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Trips", id }],
    }),
    removeDocument: build.mutation<void, { id: string; documentId: string }>({
      query: ({ id, documentId }) => ({ url: `/trips/${id}/documents/${documentId}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Trips", id }],
    }),

    // Packing
    addPackingItem: build.mutation<{ success: boolean; data: any }, { id: string; name: string; quantity?: number; category?: string }>({
      query: ({ id, ...body }) => ({ url: `/trips/${id}/packing-items`, method: "POST", body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Trips", id }],
    }),
    togglePackingChecked: build.mutation<{ success: boolean; data: any }, { id: string; itemId: string; checked: boolean }>({
      query: ({ id, itemId, checked }) => ({
        url: `/trips/${id}/packing-items/${itemId}/toggle`,
        method: "PATCH",
        body: { checked },
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Trips", id }],
    }),

    // Collaborators
    setCollaborator: build.mutation<{ success: boolean; data: any }, { id: string; userId: string; role: string; status?: string }>({
      query: ({ id, ...body }) => ({ url: `/trips/${id}/collaborators`, method: "POST", body }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Trips", id }],
    }),

    // Days
    addDay: build.mutation<{ success: boolean; data: any }, { id: string; date: string; activities?: any[] }>({
      query: ({ id, ...body }) => ({ url: `/trips/${id}/days`, method: "POST", body }),
      invalidatesTags: (_r, _e, { id }) => ["TripDays", { type: "Trips", id }],
    }),
    reorderDays: build.mutation<{ success: boolean }, { id: string; dayOrder: string[] }>({
      query: ({ id, dayOrder }) => ({ url: `/trips/${id}/days/reorder`, method: "PATCH", body: { dayOrder } }),
      invalidatesTags: (_r, _e, { id }) => ["TripDays", { type: "Trips", id }],
    }),
    removeDay: build.mutation<void, { id: string; /* controller uses POST /:id/remove/day */ }>({
      query: ({ id }) => ({ url: `/trips/${id}/remove/day`, method: "POST" }),
      invalidatesTags: (_r, _e, { id }) => ["TripDays", { type: "Trips", id }],
    }),

    listTripDays: build.query<{ success: boolean; data: TripDay[] }, string>({
      query: (tripId) => ({ url: `/trips/${encodeURIComponent(tripId)}/days` }),
      providesTags: (res, _e, id) =>
        res?.data?.length
          ? [{ type: "TripDays" as const, id }, ...res.data.map(d => ({ type: "TripDays" as const, id: d._id }))]
          : [{ type: "TripDays" as const, id }],
    }),


  }),
});

export const {
  useCreateTripMutation,
  useListTripsQuery,
  useGetTripQuery,
  useUpdateTripMutation,
  useAddDocumentMutation,
  useRemoveDocumentMutation,
  useAddPackingItemMutation,
  useTogglePackingCheckedMutation,
  useSetCollaboratorMutation,
  useAddDayMutation,
  useReorderDaysMutation,
  useRemoveDayMutation,
  useListTripDaysQuery,
} = tripsApi;
