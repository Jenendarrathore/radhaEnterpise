import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = '/api'; // Base URL for the API endpoints


export const invoicesApi = createApi({
    reducerPath: 'invoicesApi',
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (builder) => ({
        getInvoices: builder.query({
            query: () => '/invoices'
        }),
        getInvoiceById: builder.query({
            query: (id) => `/invoices/${id}`,
        }),
        createInvoice: builder.mutation({
            query: (invoice) => ({
                url: '/invoices',
                method: 'POST',
                body: invoice
            })
        }),
        updateInvoice: builder.mutation({
            query: ({ id, data }) => ({
                url: `/invoices/${id}`,
                method: 'PUT',
                body: data,
            }),
        }),
        deleteInvoice: builder.mutation({
            query: (id) => ({
                url: `/invoices/${id}`,
                method: 'DELETE',
            }),
        }),
    })
})

export const { useGetInvoicesQuery, useGetInvoiceByIdQuery, useCreateInvoiceMutation, useDeleteInvoiceMutation } = invoicesApi