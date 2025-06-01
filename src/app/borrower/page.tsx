"use client";

import { useState, useMemo, useEffect } from "react";
import type { Loan } from "@/types";
import { mockLoans } from "@/data/mock-loans";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { LoadingDot } from "@/components/ui/loadingDot";
import { LoanCard } from "@/components/loans/loan-card";
import {LoanRequestBorrowerModal} from "@/components/borrower/loan-request-borrower";
import {Grid} from "@mui/system";
import {PayLoanNummoraCore} from "@/contracts/NummoraCore/PayLoanNummoraCore";
import {useAppDispatch} from "@/store/hooks";


// ⚠️ Simulamos un usuario logueado:
const CURRENT_BORROWER_ID = "borrower-123";

const STATUSES: Loan["status"][] = ["requested", "funded", "active", "repaid"];

export default function BorrowersPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [currentStatus, setCurrentStatus] = useState<Loan["status"]>("active");
  const [isLoading, setIsLoading] = useState(true);
  const [sessionLoans, setSessionLoans] = useState<any[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const raw = sessionStorage.getItem("nummora_loans");
    if (!raw) {
      setIsLoading(false);
      return;
    }

    const parsed = JSON.parse(raw);
    setSessionLoans(parsed);
    setIsLoading(false);
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

  const handleRequestLoan = async (amount: string, installments: number) => {
    console.log("Solicitar préstamo de:", amount, "cuotas:", installments);
    // Aquí va la lógica para procesar la solicitud
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
          <LoanRequestBorrowerModal onConfirm={handleRequestLoan} />
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
      ) : sessionLoans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessionLoans.map((loan) => (
                <Card
                    key={loan.loanId}
                    className="w-full max-w-sm rounded-2xl shadow-md border border-muted bg-background p-6"
                >
                  <CardContent className="space-y-4">
                    <div className="text-xl font-semibold text-primary">Detalle del Préstamo</div>

                    <div className="space-y-1">
                      <p className="text-muted-foreground text-sm">Total Prestado</p>
                      <p className="text-lg font-medium">{loan.monto}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-muted-foreground text-sm">Monto a pagar</p>
                      <p className="text-lg font-medium text-destructive">{loan.toPay}</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-muted-foreground text-sm">Prestamista</p>
                      <p className="text-base font-medium">{loan.lender}</p>
                    </div>

                    <Button onClick={ async () => await PayLoanNummoraCore(
                        loan.loanId,
                        loan.toPay,
                        dispatch
                    )} className="w-full mt-4">Pagar</Button>
                  </CardContent>
                </Card>
            ))}
          </div>
      ) : (
          <div>
            <Alert className="mt-8 max-w-md mx-auto">
              <Info className="h-4 w-4" />
              <AlertTitle>No hay préstamos</AlertTitle>
              <AlertDescription>
                Actualmente no tienes préstamos en la categoría '{currentStatus}'.
              </AlertDescription>
            </Alert>
          </div>
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
