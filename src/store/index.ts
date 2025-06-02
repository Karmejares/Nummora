import { configureStore } from "@reduxjs/toolkit";
import walletReducer from "./walletSlice";
import userReducer from "./userSlice";
import loansReducer from "./loansSlice";
import transactionsReducer from "./transactionsSlice";
import uiReducer from "./uiSlice";
import borrowersReducer from "./borrowersSlice";

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    user: userReducer,
    loans: loansReducer,
    transactions: transactionsReducer,
    ui: uiReducer,
    borrowers: borrowersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
