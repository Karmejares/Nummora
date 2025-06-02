import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextField, Box } from "@mui/material";
import { useState } from "react";
import {borrowerLimitNummoraCore} from "@/contracts/NummoraCore/borrowerLimitNummoraCore";
import {loanRequestNummoraCore} from "@/contracts/NummoraCore/loanRequestNummoraCore";
import {useAppDispatch} from "@/store/hooks";
import {ethers} from "ethers";

interface LoanRequestModalProps {
    onConfirm: (amount: string, installments: number) => void;
    loading?: boolean;
}

export const LoanRequestBorrowerModal = ({
                                     onConfirm,
                                     loading = false,
                                 }: LoanRequestModalProps) => {
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState<string>("");
    const [installments, setInstallments] = useState<number>(1);
    const { borrowerLimitFormatted } = borrowerLimitNummoraCore();
    const dispatch = useAppDispatch();

    const isValid =
        amount !== "" &&
        !isNaN(Number(amount)) &&
        Number(amount) > 0 &&
        installments >= 1 &&
        installments <= 4;

    const handleSubmit = async () => {
        try {
            if (!isValid) {
                console.log("Invalido");
                return;
            }

            const loanSuccess = await loanRequestNummoraCore(
                ethers.parseUnits(amount, 18).toString(),
                dispatch
            );

            if (!loanSuccess) {
                return;
            }

            // Ahora que el préstamo fue exitoso, notifica al padre
            onConfirm(amount.trim(), installments);

            setOpen(false);
            setAmount("");
            setInstallments(1);
        } catch (e) {
            console.log(e);
            return;
        }
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" onClick={() => setOpen(true)}>
                    Solicitar préstamo
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Solicitar Préstamo</DialogTitle>
                </DialogHeader>

                <Box component="form" className="space-y-4">
                    <TextField
                        label="Monto a solicitar"
                        type="number"
                        value={amount}
                        onChange={(e) => {
                            const value = e.target.value;
                            const numeric = parseFloat(value);
                            const max = parseFloat(borrowerLimitFormatted || "0");

                            if (isNaN(numeric) || numeric > max) return;

                            setAmount(value);
                        }}
                        fullWidth
                        disabled={loading}
                        inputProps={{
                            step: "0.01",
                            min: 0,
                            max: parseFloat(borrowerLimitFormatted),
                        }}
                        helperText={`Máximo disponible: ${borrowerLimitFormatted} NUM`}
                    />

                    <TextField
                        label="Número de cuotas"
                        type="number"
                        value={installments}
                        onChange={(e) => setInstallments(Number(e.target.value))}
                        fullWidth
                        disabled={loading}
                        inputProps={{ min: 1, max: 4, step: 1 }}
                    />
                </Box>

                <DialogFooter className="flex justify-end gap-2 pt-4">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading || !isValid}>
                        {loading ? "Procesando..." : "Confirmar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
