import { api } from "../store/api";

export type PlanName = "free" | "pro" | "teams";
export type Plan = { _id: string; name: PlanName; [k: string]: unknown };
export type FeatureMatrix = { _id: string; [k: string]: unknown };

export const plansApi = api.injectEndpoints({
  endpoints: (build) => ({
    listPublicPlans: build.query<{ success: boolean; data: Plan[] }, void>({
      query: () => ({ url: "/plans", method: "GET" }),
      providesTags: ["Plans"],
    }),
    getPlanByName: build.query<{ success: boolean; data: Plan }, PlanName>({
      query: (planName) => ({ url: `/plans/${planName}`, method: "GET" }),
      providesTags: (_r, _e, name) => [{ type: "Plans", id: name }],
    }),

    // Admin-ish (adjust auth guards on server)
    createPlan: build.mutation<{ success: boolean; data: Plan }, Partial<Plan>>({
      query: (body) => ({ url: "/plans", method: "POST", body }),
      invalidatesTags: ["Plans"],
    }),
    upsertPlan: build.mutation<{ success: boolean; data: Plan }, Partial<Plan>>({
      query: (body) => ({ url: "/plans", method: "PUT", body }),
      invalidatesTags: ["Plans"],
    }),
    deletePlanByName: build.mutation<{ success: boolean }, PlanName>({
      query: (planName) => ({ url: `/plans/${planName}`, method: "DELETE" }),
      invalidatesTags: ["Plans"],
    }),
    deletePlanById: build.mutation<{ success: boolean }, string>({
      query: (planId) => ({ url: `/plans/id/${planId}`, method: "DELETE" }),
      invalidatesTags: ["Plans"],
    }),

    // Feature matrices
    createFeatureMatrix: build.mutation<{ success: boolean; data: FeatureMatrix }, unknown>({
      query: (body) => ({ url: "/plans/feature-matrices", method: "POST", body }),
      invalidatesTags: ["Plans", "FeatureMatrix"],
    }),
    upsertFeatureMatrix: build.mutation<{ success: boolean; data: FeatureMatrix }, unknown>({
      query: (body) => ({ url: "/plans/feature-matrices", method: "PUT", body }),
      invalidatesTags: ["Plans", "FeatureMatrix"],
    }),
    deleteFeatureMatrix: build.mutation<{ success: boolean }, string>({
      query: (matrixId) => ({ url: `/plans/feature-matrices/${matrixId}`, method: "DELETE" }),
      invalidatesTags: ["Plans", "FeatureMatrix"],
    }),
    linkFeatureMatrixToPlan: build.mutation<
      { success: boolean; data: Plan },
      { planName: PlanName; matrixId: string } // pass "null" to unlink
    >({
      query: ({ planName, matrixId }) => ({
        url: `/plans/${planName}/feature-matrix/${matrixId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Plans"],
    }),
  }),
});

export const {
  useListPublicPlansQuery,
  useGetPlanByNameQuery,
  useCreatePlanMutation,
  useUpsertPlanMutation,
  useDeletePlanByNameMutation,
  useDeletePlanByIdMutation,
  useCreateFeatureMatrixMutation,
  useUpsertFeatureMatrixMutation,
  useDeleteFeatureMatrixMutation,
  useLinkFeatureMatrixToPlanMutation,
} = plansApi;
