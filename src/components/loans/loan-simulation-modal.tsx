
"use client";

import { useState } from 'react';
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
import { PlusCircle, Loader2 } from "lucide-react";
import { getLoanContract } from '@/lib/blockchain'; // Simulated
import { useToast } from "@/hooks/use-toast";

// A dummy contract address for simulation
const SIMULATED_CONTRACT_ADDRESS = "0xNummoraLoanSimContract";

export function LoanSimulationModal({ onLoanSimulated }: { onLoanSimulated: (newLoanId: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [borrowerAddress, setBorrowerAddress] = useState("0xUserSimAddress");
  const [amount, setAmount] = useState("");
  const [interestRate, setInterestRate] = useState("5"); // Default 5%
  const [termDays, setTermDays] = useState("30"); // Default 30 days
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const loanContract = getLoanContract(SIMULATED_CONTRACT_ADDRESS);
    try {
      const numAmount = parseFloat(amount);
      const numInterestRate = parseFloat(interestRate);
      const numTermDays = parseInt(termDays, 10);

      if (isNaN(numAmount) || numAmount <= 0) {
        toast({ title: "Error", description: "Por favor ingrese un monto válido.", status: "error" });
        setIsLoading(false);
        return;
      }

      const result = await loanContract.initiateLoan(borrowerAddress, numAmount, numInterestRate, numTermDays);
      if (result) {
        toast({ title: "Éxito (Simulado)", description: `Préstamo ${result.loanId} iniciado. Hash: ${result.transactionHash.substring(0,10)}...` });
        onLoanSimulated(result.loanId); // Callback to update UI or state
        setIsOpen(false); // Close modal on success
        // Reset form
        setAmount("");
      } else {
        toast({ title: "Fallo en Simulación", description: "No se pudo iniciar el préstamo (simulado).", status: "error" });
      }
    } catch (error) {
      console.error("Simulation error:", error);
      toast({ title: "Error", description: "Ocurrió un error durante la simulación.", status: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Simular Nuevo Préstamo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Simular Nuevo Préstamo</DialogTitle>
          <DialogDescription>
            Ingrese los detalles para simular la creación de un nuevo préstamo en la blockchain (simulado).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="borrowerAddress" className="text-right">
                Prestatario
              </Label>
              <Input
                id="borrowerAddress"
                value={borrowerAddress}
                onChange={(e) => setBorrowerAddress(e.target.value)}
                className="col-span-3"
                placeholder="0x..."
                disabled={isLoading}
              />
            </div>
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
                placeholder="Ej: 100000"
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="interestRate" className="text-right">
                Tasa Interés (%)
              </Label>
              <Input
                id="interestRate"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="col-span-3"
                placeholder="Ej: 5.5"
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
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Simular Préstamo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
