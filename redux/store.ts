import { configureStore } from "@reduxjs/toolkit";
import { clientsApi } from "./clientsApi";
import { invoicesApi } from "./invoicesApi";
import { challansApi } from "./challansApi";
import { balesApi } from "./BalesApi";

export const store = configureStore({
    reducer: {
        [clientsApi.reducerPath]: clientsApi.reducer,
        [invoicesApi.reducerPath]: invoicesApi.reducer,
        [challansApi.reducerPath]: challansApi.reducer,
        [balesApi.reducerPath]: balesApi.reducer

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(clientsApi.middleware).concat(invoicesApi.middleware).concat(challansApi.middleware).concat(balesApi.middleware),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
