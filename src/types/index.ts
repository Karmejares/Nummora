// src/types/index.ts

export type LenderLoanStatus = "active" | "pending" | "completed";
export type BorrowerLoanStatus = "requested" | "funded" | "active" | "repaid";

interface BaseLoan {
  id: string;
  amount: number;
  currency: string;
  interestRate: number;
  isVerified?: boolean;
  contractAddress?: string;
}

export interface LenderLoan extends BaseLoan {
  borrowerName: string;
  borrowerAvatar?: string;
  status: LenderLoanStatus;
  dueDate?: string;
  termEndDate?: string;
  paidDate?: string;
  collateral?: string;
}

export interface BorrowerLoan extends BaseLoan {
  status: BorrowerLoanStatus;
  beneficiaryId: string;
  investorId?: string;
  requestedAt?: string;
  fundedAt?: string;
  repaidAt?: string;
}