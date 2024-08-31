import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = '/api'; // Base URL for the API endpoints


export const balesApi = createApi({
    reducerPath: 'balesApi',
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (builder) => ({
        getBales: builder.query({
            query: () => '/bales'
        }),
        getBaleById: builder.query({
            query: (id) => `/bales/${id}`,
        }),
        createBale: builder.mutation({
            query: (client) => ({
                url: '/bales',
                method: 'POST',
                body: client
            })
        }),
        updateBale: builder.mutation({
            query: ({ id, data }) => ({
                url: `/bales/${id}`,
                method: 'PUT',
                body: data,
            }),
        }),
        createBaleAndChallan: builder.mutation({
            query: (payload) => ({
                url: '/bale-and-challan',
                method: 'POST',
                body: payload,
            }),
        }),
        fetchBaleAndChallan: builder.mutation({
            query: (payload) => ({
                url: '/fetch-bale-and-challan',
                method: 'POST',
                body: payload,
            }),
        }),

        deleteBale: builder.mutation({
            query: (id) => ({
                url: `/bales/${id}`,
                method: 'DELETE',
            }),
        }),
    })
})

export const { useGetBalesQuery, useGetBaleByIdQuery, useCreateBaleMutation, useCreateBaleAndChallanMutation, useFetchBaleAndChallanMutation, useDeleteBaleMutation } = balesApi