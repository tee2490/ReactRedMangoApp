import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrlAPI } from "../Common/SD";

const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrlAPI,
  }),
  endpoints: (builder) => ({
    initiatePayment: builder.mutation({
      query: (userId) => ({
        url: "payment",
        method: "POST",
        params: {
          userId: userId,
        },
      }),
    }),
  }),
});

export const { useInitiatePaymentMutation } = paymentApi;
export default paymentApi;