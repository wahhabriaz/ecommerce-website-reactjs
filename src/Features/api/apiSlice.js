import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL || "http://localhost:5001",
  }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/api/products",
    }),
    getProductById: builder.query({
      query: (id) => `/api/products/${id}`,
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery } = apiSlice;
