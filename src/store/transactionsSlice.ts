import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TransactionType = "topup" | "loan-fund" | "loan-payback";

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  from?: string; // optional user ID
  to?: string; // optional user ID
  timestamp: string; // ISO string
}

interface TransactionsState {
  ledger: Transaction[];
}

const initialState: TransactionsState = {
  ledger: [],
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactions(state, action: PayloadAction<Transaction[]>) {
      state.ledger = action.payload;
    },
    addTransaction(state, action: PayloadAction<Transaction>) {
      state.ledger.push(action.payload);
    },
    clearTransactions(state) {
      state.ledger = [];
    },
  },
});

export const { setTransactions, addTransaction, clearTransactions } =
  transactionsSlice.actions;
export default transactionsSlice.reducer;
