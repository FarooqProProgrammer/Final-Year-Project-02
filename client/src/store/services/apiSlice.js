import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
    reducerPath: "api", // The key in the Redux state
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
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
                url: "/auth/get-all-users"
            })
        })

    }),
});

export const {
    useGetItemsQuery,
    useAddItemMutation,
    useRegisterFormMutation,
    useLoginFormMutation,
    useGetAllUsersQuery
} = apiSlice;
