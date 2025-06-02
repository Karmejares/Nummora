import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type BorrowerStatus = "activo" | "inactivo" | "moroso";

export interface Borrower {
  id: string;
  fullName: string;
  status: BorrowerStatus;
  createdAt: string;
}

interface BorrowersState {
  all: Borrower[];
}

const initialState: BorrowersState = {
  all: [],
};

const borrowersSlice = createSlice({
  name: "borrowers",
  initialState,
  reducers: {
    setBorrowers(state, action: PayloadAction<Borrower[]>) {
      state.all = action.payload;
    },
    addBorrower(state, action: PayloadAction<Borrower>) {
      state.all.push(action.payload);
    },
    updateBorrowerStatus(
      state,
      action: PayloadAction<{ id: string; status: BorrowerStatus }>
    ) {
      const borrower = state.all.find((b) => b.id === action.payload.id);
      if (borrower) {
        borrower.status = action.payload.status;
      }
    },
    editBorrower(
      state,
      action: PayloadAction<{ id: string; data: Partial<Borrower> }>
    ) {
      const borrower = state.all.find((b) => b.id === action.payload.id);
      if (borrower) {
        Object.assign(borrower, action.payload.data);
      }
    },
    clearBorrowers(state) {
      state.all = [];
    },
  },
});

export const {
  setBorrowers,
  addBorrower,
  updateBorrowerStatus,
  editBorrower,
  clearBorrowers,
} = borrowersSlice.actions;

export default borrowersSlice.reducer;
