import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WalletState {
  address: string | null;
  simulatedBalance: number;
  balance: string | null; // <-- Agregado
  connected: boolean;
  error: string | null;
}

const initialState: WalletState = {
  address: null,
  simulatedBalance: 0,
  balance: null, // <-- Agregado
  connected: false,
  error: null,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setBalance(state, action: PayloadAction<string | null>) {
      state.balance = action.payload;
    },

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
  setBalance, // <-- Agregado
} = walletSlice.actions;

export default walletSlice.reducer;
