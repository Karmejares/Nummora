import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WalletState {
  address: string | null;
  simulatedBalance: number;
  balance: string | null;
  connected: boolean;
  error: string | null;
  loading: boolean; // ✅ nuevo
  txHash: string | null; // ✅ nuevo
}

const initialState: WalletState = {
  address: null,
  simulatedBalance: 0,
  balance: null,
  connected: false,
  error: null,
  loading: false, // ✅ inicializado
  txHash: null, // ✅ inicializado
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    connectWallet(state, action: PayloadAction<string>) {
      state.address = action.payload;
      state.connected = true;
      state.error = null;
    },
    disconnectWallet(state) {
      state.address = null;
      state.connected = false;
      state.balance = null;
      state.simulatedBalance = 0;
      state.error = null;
      state.loading = false;
      state.txHash = null;
    },
    setBalance(state, action: PayloadAction<string>) {
      state.balance = action.payload;
    },
    setSimulatedBalance(state, action: PayloadAction<number>) {
      state.simulatedBalance = action.payload;
    },
    simulateWithdraw(state, action: PayloadAction<number>) {
      state.simulatedBalance -= action.payload;
    },
    setWalletError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setTransactionHash(state, action: PayloadAction<string | null>) {
      state.txHash = action.payload;
    },
  },
});

export const {
  connectWallet,
  disconnectWallet,
  setBalance,
  setSimulatedBalance,
  simulateWithdraw,
  setWalletError,
  setLoading,
  setTransactionHash,
} = walletSlice.actions;

export default walletSlice.reducer;
