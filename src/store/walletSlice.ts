import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WalletState {
  address: string | null;
  simulatedBalance: number;
  connected: boolean;
  error: string | null;
}

const initialState: WalletState = {
  address: null,
  simulatedBalance: 0,
  connected: false,
  error: null,
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
      state.simulatedBalance = 0;
      state.error = null;
    },
    setSimulatedBalance(state, action: PayloadAction<number>) {
      state.simulatedBalance = action.payload;
    },
    setWalletError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  connectWallet,
  disconnectWallet,
  setSimulatedBalance,
  setWalletError,
} = walletSlice.actions;

export default walletSlice.reducer;
