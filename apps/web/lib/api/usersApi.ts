import { api } from "../store/api";

export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  [k: string]: unknown;
};

export const usersApi = api.injectEndpoints({
  endpoints: (build) => ({
    createUser: build.mutation<{ message: string; data: User }, Partial<User> & { password: string }>({
      query: (body) => ({ url: "/users", method: "POST", body }),
      invalidatesTags: ["Users"],
    }),
    listUsers: build.query<{ message: string; data: User[] }, void>({
      query: () => ({ url: "/users", method: "GET" }),
      providesTags: ["Users"],
    }),
    getUser: build.query<{ success: boolean; message: string; data: User }, string>({
      query: (userId) => ({ url: `/users/${userId}`, method: "GET" }),
      providesTags: (_r, _e, id) => [{ type: "Users", id }],
    }),
    updateUser: build.mutation<{ message: string; data: User }, { userId: string; update: Partial<User> }>({
      query: ({ userId, update }) => ({ url: `/users/${userId}`, method: "PUT", body: update }),
      invalidatesTags: (_r, _e, { userId }) => ["Users", { type: "Users", id: userId }],
    }),
    deleteUser: build.mutation<{ message: string }, string>({
      query: (userId) => ({ url: `/users/${userId}`, method: "DELETE" }),
      invalidatesTags: ["Users"],
    }),
    promoteUserRole: build.mutation<{ message: string; data: User }, { userId: string; role: string }>({
      query: ({ userId, role }) => ({ url: `/users/${userId}/promote`, method: "POST", body: { role } }),
      invalidatesTags: (_r, _e, { userId }) => ["Users", { type: "Users", id: userId }],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useListUsersQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  usePromoteUserRoleMutation,
} = usersApi;
