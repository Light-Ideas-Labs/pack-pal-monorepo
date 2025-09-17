import { api } from "../store/api";

// server returns: { success, cached, data }
export type TravelReqParams = {
  to: string;
  citizenship: string;
  residence?: string;
  transit?: string[];   // will be sent as comma-separated
  ttlDays?: number;
  forceRefresh?: boolean;
};

export const travelRequirementsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getTravelRequirements: build.query<{ success: boolean; cached?: boolean; data: any }, TravelReqParams>({
      query: ({ to, citizenship, residence, transit, ttlDays, forceRefresh }) => {
        const params = new URLSearchParams();
        params.set("to", to);
        params.set("citizenship", citizenship);
        if (residence) params.set("residence", residence);
        if (transit?.length) params.set("transit", transit.join(","));
        if (ttlDays != null) params.set("ttlDays", String(ttlDays));
        if (forceRefresh) params.set("forceRefresh", "true");
        return { url: `/travel-requirements?${params.toString()}`, method: "GET" };
      },
      providesTags: ["TravelRequirements"],
    }),
  }),
});

export const { useGetTravelRequirementsQuery } = travelRequirementsApi;
