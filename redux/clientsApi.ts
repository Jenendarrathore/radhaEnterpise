import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = '/api'; // Base URL for the API endpoints


export const clientsApi = createApi({
    reducerPath: 'clientsApi',
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (builder) => ({
        getClients: builder.query({
            query: () => '/clients'
        }),
        getClientById: builder.query({
            query: (id) => `/clients/${id}`,
        }),
        createClient: builder.mutation({
            query: (client) => ({
                url: '/clients',
                method: 'POST',
                body: client
            })
        }),
        updateClient: builder.mutation({
            query: ({ id, data }) => ({
                url: `/clients/${id}`,
                method: 'PUT',
                body: data,
            }),
        }),
        deleteClient: builder.mutation({
            query: (id) => ({
                url: `/clients/${id}`,
                method: 'DELETE',
            }),
        }),
    })
})

export const { useGetClientsQuery, useGetClientByIdQuery, useCreateClientMutation, useDeleteClientMutation } = clientsApi