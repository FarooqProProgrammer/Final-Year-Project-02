import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie"; // You can use js-cookie to get cookies easily

export const apiSlice = createApi({
  reducerPath: "api", // The key in the Redux state
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      // Get the auth token from cookies (assuming it's stored under 'auth_token' key)
      const authToken = Cookies.get('auth_token'); // You can change the cookie name if needed

      // If there's a token, add it to the request headers
      if (authToken) {
        headers.set('Authorization', `Bearer ${authToken}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getItems: builder.query({
      query: () => "/items", // Endpoint for fetching items
    }),
    addItem: builder.mutation({
      query: (newItem) => ({
        url: "/items",
        method: "POST",
        body: newItem,
      }),
    }),

    createProject: builder.mutation({
      query: (newItem) => ({
        url: "/create-project",
        method: "POST",
        body: newItem,
      }),
    }),
    registerForm: builder.mutation({
      query: (newItem) => ({
        url: "/auth/register",
        method: "POST",
        body: newItem,
      }),
    }),

    loginForm: builder.mutation({
      query: (newItem) => ({
        url: "/auth/login",
        method: "POST",
        body: newItem,
      }),
    }),

    getAllUsers: builder.query({
      query: () => ({
        url: "/auth/get-all-users",
      }),
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useGetItemsQuery,
  useAddItemMutation,
  useRegisterFormMutation,
  useLoginFormMutation,
  useGetAllUsersQuery,
} = apiSlice;
