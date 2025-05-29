
export interface Loan {
  id: string;
  borrowerName: string;
  borrowerAvatar?: string; // URL to avatar image
  amount: number;
  currency: string;
  interestRate: number; // Annual percentage rate, e.g., 5 for 5%
  status: 'active' | 'pending' | 'completed';
  isVerified?: boolean;

  // Status-specific fields
  dueDate?: string; // ISO date string, for pending loans
  termEndDate?: string; // ISO date string, for active loans
  paidDate?: string; // ISO date string, for completed loans
  
  // Optional blockchain related fields (simulated)
  collateral?: string; // e.g., "ETH", "BTC"
  contractAddress?: string; // Simulated contract address
}

export type LoanFilterStatus = 'active' | 'pending' | 'completed';
