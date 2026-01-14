import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5001";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl, credentials: "omit",prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  }, }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    // List products (your API returns {items,total,page,pages})
    getProducts: builder.query({
      query: ({ page = 1, limit = 12 } = {}) => `/api/products?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map((p) => ({ type: "Product", id: p._id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    // Create product
    createProduct: builder.mutation({
      query: (body) => ({
        url: "/api/products",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    // Upload images (multer) - MUST be FormData
    uploadImages: builder.mutation({
      query: (formData) => ({
        url: "/api/uploads",
        method: "POST",
        body: formData,
      }),
    }),
    getProductById: builder.query({
  query: (id) => `/api/products/${id}`,
  providesTags: (res, err, id) => [{ type: "Product", id }],
}),

updateProduct: builder.mutation({
  query: ({ id, body }) => ({
    url: `/api/products/${id}`,
    method: "PUT",
    body,
  }),
  invalidatesTags: (res, err, { id }) => [
    { type: "Product", id },
    { type: "Product", id: "LIST" },
  ],
}),

deleteProduct: builder.mutation({
  query: (id) => ({
    url: `/api/products/${id}`,
    method: "DELETE",
  }),
  invalidatesTags: [{ type: "Product", id: "LIST" }],
}),
login: builder.mutation({
  query: (body) => ({ url: "/api/auth/login", method: "POST", body }),
}),
register: builder.mutation({
  query: (body) => ({ url: "/api/auth/register", method: "POST", body }),
}),
me: builder.query({
  query: () => ({ url: "/api/auth/me" }),
}),

  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadImagesMutation,
  useLoginMutation, useMeQuery,useRegisterMutation,

} = apiSlice;

