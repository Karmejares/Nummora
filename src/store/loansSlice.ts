import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type LoanStatus = "requested" | "funded" | "active" | "repaid";

interface Loan {
  id: string;
  amount: number;
  status: LoanStatus;
  beneficiaryId: string;
  investorId?: string;
}

interface LoansState {
  all: Loan[];
}

const initialState: LoansState = {
  all: [],
};

const loansSlice = createSlice({
  name: "loans",
  initialState,
  reducers: {
    setLoans(state, action: PayloadAction<Loan[]>) {
      state.all = action.payload;
    },
    addLoan(state, action: PayloadAction<Loan>) {
      state.all.push(action.payload);
    },
    updateLoanStatus(
      state,
      action: PayloadAction<{ id: string; status: LoanStatus }>
    ) {
      const loan = state.all.find((l) => l.id === action.payload.id);
      if (loan) {
        loan.status = action.payload.status;
      }
    },
    assignInvestor(
      state,
      action: PayloadAction<{ loanId: string; investorId: string }>
    ) {
      const loan = state.all.find((l) => l.id === action.payload.loanId);
      if (loan) {
        loan.investorId = action.payload.investorId;
      }
    },
    clearLoans(state) {
      state.all = [];
    },
  },
});

export const {
  setLoans,
  addLoan,
  updateLoanStatus,
  assignInvestor,
  clearLoans,
} = loansSlice.actions;
export default loansSlice.reducer;
