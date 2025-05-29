
import type { Loan } from '@/types';

export const mockLoans: Loan[] = [
  {
    id: 'loan-1',
    borrowerName: 'Alice Wonderland',
    borrowerAvatar: 'https://placehold.co/40x40.png',
    amount: 150000,
    currency: 'COP',
    interestRate: 5.5,
    status: 'active',
    isVerified: true,
    termEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    collateral: 'ETH',
    contractAddress: '0xSimContractActive1',
  },
  {
    id: 'loan-2',
    borrowerName: 'Bob The Builder',
    amount: 75000,
    currency: 'COP',
    interestRate: 7.0,
    status: 'pending',
    isVerified: false,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    contractAddress: '0xSimContractPending1',
  },
  {
    id: 'loan-3',
    borrowerName: 'Charlie Brown',
    borrowerAvatar: 'https://placehold.co/40x40.png',
    amount: 200000,
    currency: 'COP',
    interestRate: 4.0,
    status: 'completed',
    isVerified: true,
    paidDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    contractAddress: '0xSimContractCompleted1',
  },
  {
    id: 'loan-4',
    borrowerName: 'Diana Prince',
    amount: 300000,
    currency: 'COP',
    interestRate: 6.2,
    status: 'active',
    isVerified: true,
    termEndDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
    borrowerAvatar: 'https://placehold.co/40x40.png',
    collateral: 'BTC',
  },
  {
    id: 'loan-5',
    borrowerName: 'Edward Scissorhands',
    borrowerAvatar: 'https://placehold.co/40x40.png',
    amount: 50000,
    currency: 'COP',
    interestRate: 8.5,
    status: 'pending',
    isVerified: false,
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
  },
  {
    id: 'loan-6',
    borrowerName: 'Fiona Gallagher',
    amount: 120000,
    currency: 'COP',
    interestRate: 5.0,
    status: 'completed',
    isVerified: true,
    paidDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
  },
];
