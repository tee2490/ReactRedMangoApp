import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrlAPI } from "../Common/SD";

const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrlAPI,
    }),
    endpoints: (builder) => ({
        initiatePayment: builder.mutation({
            query: (orderDetails) => ({
                url: "order",
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: orderDetails,
            }),
        }),
    }),
});

export const { useInitiatePaymentMutation } = orderApi;
export default orderApi;