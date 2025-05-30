import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type KYCStatus = "pending" | "verified" | "failed";

interface BankAccount {
  iban: string;
  bankName: string;
}

interface UserState {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  bankAccount: BankAccount;
  kycStatus: KYCStatus;
}

const initialState: UserState = {
  id: "",
  name: "",
  email: "",
  phoneNumber: "",
  dateOfBirth: "",
  bankAccount: {
    iban: "",
    bankName: "",
  },
  kycStatus: "pending",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      return action.payload;
    },
    updateKYCStatus(state, action: PayloadAction<KYCStatus>) {
      state.kycStatus = action.payload;
    },
    updateBankAccount(state, action: PayloadAction<BankAccount>) {
      state.bankAccount = action.payload;
    },
    clearUser(state) {
      return initialState;
    },
  },
});

export const { setUser, updateKYCStatus, updateBankAccount, clearUser } =
  userSlice.actions;
export default userSlice.reducer;
