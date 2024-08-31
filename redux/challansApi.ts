import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = '/api'; // Base URL for the API endpoints


export const challansApi = createApi({
    reducerPath: 'challansApi',
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (builder) => ({
        getChallans: builder.query({
            query: () => '/challans'
        }),
        getChallanById: builder.query({
            query: (id) => `/challans/${id}`,
        }),
        createChallan: builder.mutation({
            query: (client) => ({
                url: '/challans',
                method: 'POST',
                body: client
            })
        }),
        updateChallan: builder.mutation({
            query: ({ id, data }) => ({
                url: `/challans/${id}`,
                method: 'PUT',
                body: data,
            }),
        }),
        deleteChallan: builder.mutation({
            query: (id) => ({
                url: `/challans/${id}`,
                method: 'DELETE',
            }),
        }),
    })
})

export const { useGetChallansQuery, useGetChallanByIdQuery, useCreateChallanMutation, useDeleteChallanMutation } = challansApi