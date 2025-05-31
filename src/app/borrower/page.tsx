"use client";

import { useState, useMemo, useEffect } from "react";
import type { Loan } from "@/types";
import { mockLoans } from "@/data/mock-loans";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { LoadingDot } from "@/components/ui/loadingDot";

// ⚠️ Simulamos un usuario logueado:
const CURRENT_BORROWER_ID = "borrower-123";

const STATUSES: Loan["status"][] = ["requested", "funded", "active", "repaid"];

export default function BorrowersPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [currentStatus, setCurrentStatus] = useState<Loan["status"]>("active");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga inicial de préstamos del prestatario
    setTimeout(() => {
      const borrowerLoans = mockLoans.filter(
        (loan) => loan.beneficiaryId === CURRENT_BORROWER_ID
      );
      setLoans(borrowerLoans);
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => loan.status === currentStatus);
  }, [loans, currentStatus]);

  const PageTitle = () => {
    switch (currentStatus) {
      case "requested":
        return "Solicitudes Pendientes";
      case "funded":
        return "Préstamos Aprobados";
      case "active":
        return "Préstamos Activos";
      case "repaid":
        return "Préstamos Finalizados";
      default:
        return "Mis Préstamos";
    }
  };

  const handleRequestLoan = () => {
    // Aquí puedes abrir un modal o redirigir a un formulario
    alert("Funcionalidad para solicitar préstamo pendiente.");
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-foreground">
          <PageTitle />
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <div className="flex gap-2">
            {STATUSES.map((status) => (
              <Button
                key={status}
                variant={status === currentStatus ? "default" : "outline"}
                onClick={() => setCurrentStatus(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
          <Button onClick={handleRequestLoan} variant="secondary">
            Solicitar préstamo
          </Button>
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
            Actualmente no tienes préstamos en la categoría '{currentStatus}'.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// 🔧 Reutilizamos estos componentes internos para estructura
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
}) => <div className={`flex items-center p-6 ${className}`}>{children}</div>;

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

// Puedes reutilizar LoanCard si ya soporta el campo "beneficiaryId" en el mock
import { LoanCard } from "@/components/loans/loan-card";
