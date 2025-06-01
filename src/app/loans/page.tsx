"use client";

import { useState, useMemo, useEffect } from "react";
import type { Loan, LoanFilterStatus } from "@/types";
import { mockLoans as initialMockLoans } from "@/data/mock-loans";
import { LoanCard } from "@/components/loans/loan-card";
import { LoanFilters } from "@/components/loans/loan-filters";
import { LoanSimulationModal } from "@/components/loans/loan-simulation-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { LoadingDot } from "@/components/ui/loadingDot";
import {balanceOfNumusToken} from "@/contracts/numusToken/balanceOfNumusToken";

export default function LoansPage() {


  const { balanceFormatted } = balanceOfNumusToken();

  const [loans, setLoans] = useState<Loan[]>([]);
  const [currentFilter, setCurrentFilter] =
    useState<LoanFilterStatus>("active");
  const [isLoading, setIsLoading] = useState(true); // Simulate initial loading

  useEffect(() => {
    // Simulate fetching loans
    setTimeout(() => {
      setLoans(initialMockLoans);
      setIsLoading(false);
    }, 500); // Short delay to show skeleton loaders
  }, []);

  const handleFilterChange = (filter: LoanFilterStatus) => {
    setCurrentFilter(filter);
  };

  const handleLoanSimulated = (newLoanId: string) => {
    // In a real app, you'd refetch loans or add the new loan to the list.
    // For simulation, we'll add a dummy loan to the list.
    const newSimulatedLoan: Loan = {
      id: newLoanId,
      borrowerName: "Nuevo Simulado",
      borrowerAvatar: "https://placehold.co/40x40.png",
      amount: Math.floor(Math.random() * 200000) + 50000, // Random amount
      currency: "COP",
      interestRate: 5,
      status: "active", // Default to active for new simulated loans
      isVerified: false,
      termEndDate: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      contractAddress: `0xSimContract${newLoanId.slice(-4)}`,
    };
    setLoans((prevLoans) => [newSimulatedLoan, ...prevLoans]);
    // Optionally switch filter to 'active' if not already
    if (currentFilter !== "active") {
      setCurrentFilter("active");
    }
  };

  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => loan.status === currentFilter);
  }, [loans, currentFilter]);

  const PageTitle = () => {
    switch (currentFilter) {
      case "active":
        return "Mis Préstamos Activos";
      case "pending":
        return "Préstamos Pendientes de Pago";
      case "completed":
        return "Historial de Préstamos Completados";
      default:
        return "Mis Préstamos";
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div>
        Mi balance: { balanceFormatted }
      </div>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-foreground">
          <PageTitle />
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <LoanFilters
            currentFilter={currentFilter}
            onFilterChange={handleFilterChange}
          />
          <LoanSimulationModal onLoanSimulated={handleLoanSimulated} />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="relative rounded-lg border bg-card text-card-foreground shadow-sm p-0"
            >
              {/* Bolita de carga arriba a la derecha */}
              <div className="absolute top-4 right-4 z-10">
                <LoadingDot />
              </div>

              <CardHeader className="flex flex-row items-center space-x-4 pb-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-6 w-20 rounded-md" />
              </CardHeader>
              <CardContent className="flex-grow space-y-3 pt-3">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full rounded-md" />
              </CardFooter>
            </div>
          ))}
        </div>
      ) : filteredLoans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLoans.map((loan) => (
            <LoanCard key={loan.id} loan={loan} />
          ))}
        </div>
      ) : (
        <Alert className="mt-8 max-w-md mx-auto">
          <Info className="h-4 w-4" />
          <AlertTitle>No hay préstamos</AlertTitle>
          <AlertDescription>
            Actualmente no tienes préstamos en la categoría '{currentFilter}'.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// Dummy Card components for Skeleton structure
const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
  >
    {children}
  </div>
);
const CardHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
);
const CardContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;
const CardFooter = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`flex items-center p-6 pt-0 ${className}`}>{children}</div>
);
