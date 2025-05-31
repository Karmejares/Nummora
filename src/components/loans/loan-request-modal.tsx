"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, FilePlus } from "lucide-react";
import { getLoanContract } from "@/lib/blockchain"; // Simulado
import { useToast } from "@/hooks/use-toast";

// Dirección de contrato ficticia para simular
const SIMULATED_CONTRACT_ADDRESS = "0xSimulatedBorrowerRequest";

export function LoanRequestModal({
  onLoanRequested,
}: {
  onLoanRequested: (newLoanId: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [interestRate, setInterestRate] = useState("5");
  const [termDays, setTermDays] = useState("30");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const contract = getLoanContract(SIMULATED_CONTRACT_ADDRESS);
    try {
      const numAmount = parseFloat(amount);
      const numInterestRate = parseFloat(interestRate);
      const numTermDays = parseInt(termDays, 10);

      if (isNaN(numAmount) || numAmount <= 0) {
        toast({
          title: "Error",
          description: "Ingrese un monto válido.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const result = await contract.initiateLoanRequest(
        numAmount,
        numInterestRate,
        numTermDays
      );

      if (result) {
        toast({
          title: "Solicitud Enviada (Simulada)",
          description: `Solicitud ${result.loanId} registrada.`,
        });
        onLoanRequested(result.loanId);
        setIsOpen(false);
        setAmount("");
      } else {
        toast({
          title: "Fallo en Solicitud",
          description: "No se pudo enviar la solicitud (simulada).",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Request error:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al enviar la solicitud.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <FilePlus className="mr-2 h-4 w-4" />
          Solicitar Crédito
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Solicitar Nuevo Crédito</DialogTitle>
          <DialogDescription>
            Ingrese los detalles para solicitar un crédito (simulado).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Monto (COP)
              </Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="col-span-3"
                placeholder="Ej: 200000"
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="interestRate" className="text-right">
                Interés (%)
              </Label>
              <Input
                id="interestRate"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="col-span-3"
                placeholder="Ej: 6"
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="termDays" className="text-right">
                Plazo (días)
              </Label>
              <Input
                id="termDays"
                type="number"
                value={termDays}
                onChange={(e) => setTermDays(e.target.value)}
                className="col-span-3"
                placeholder="Ej: 30"
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Solicitar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
