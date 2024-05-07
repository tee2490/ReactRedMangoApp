import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrlAPI } from "../Common/SD";

const menuItemApi = createApi({
    reducerPath: "menuItemApi",
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrlAPI,
    }),
    tagTypes: ["MenuItems"],
    endpoints: (builder) => ({
        getMenuItems: builder.query({
            query: () => ({
                url: "menuitem",
            }),
            providesTags: ["MenuItems"],
        }),
        getMenuItemById: builder.query({
            query: (id) => ({
                url: `menuitem/${id}`,
            }),
            providesTags: ["MenuItems"],
        }),
    }),
});

export const { useGetMenuItemsQuery, useGetMenuItemByIdQuery } = menuItemApi;
export default menuItemApi;