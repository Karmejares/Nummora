"use client";

import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Paper,
  Box,
  Divider,
} from "@mui/material";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import { getSafeEthereumProvider } from "@/utils/ethereum";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import NumTokenABI from "@/lib/abi/NumToken.json"; // Asegúrate de que la ruta sea correcta
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSimulatedBalance } from "@/store/walletSlice";

export default function Withdraw() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const Toast = useToast();
  const dispatch = useAppDispatch();
  const simulatedBalance = useAppSelector(
    (state) => state.wallet.simulatedBalance
  );

  async function handleWithdraw() {
    const numericAmount = Number(amount);

    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      Toast.toast({ title: "Monto inválido", status: "error" });
      return;
    }

    if (numericAmount > simulatedBalance) {
      Toast.toast({
        title: "Fondos insuficientes",
        description: `Tu saldo actual es ${simulatedBalance} NUM`,
        status: "error",
      });
      return;
    }

    setLoading(true);

    try {
      // Simula el retiro sin llamar a MetaMask ni al contrato
      dispatch(setSimulatedBalance(simulatedBalance - numericAmount));

      Toast.toast({
        title: "Retiro simulado exitoso",
        description: `Se retiraron ${numericAmount} NUM`,
        status: "success",
      });

      setAmount("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error desconocido";
      Toast.toast({
        title: "Error al procesar el retiro",
        description: message,
        status: "error",
      });
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  }
  return (
    <Paper
      elevation={6}
      className="max-w-md mx-auto p-8 rounded-2xl bg-white/80 backdrop-blur-md"
      sx={{
        borderRadius: "24px",
        border: "1px solid rgba(0,0,0,0.1)",
      }}
    >
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        className="font-semibold text-gray-900"
        sx={{ fontWeight: 700 }}
      >
        Withdraw Funds
      </Typography>

      <Box mb={4}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Saldo disponible: <strong>{simulatedBalance} NUM</strong>
        </Typography>

        <TextField
          label="Cantidad a retirar (NUM)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          disabled={loading}
          variant="outlined"
          aria-label="Cantidad a retirar"
          slotProps={{
            input: {
              inputProps: { step: "1000", className: "bg-white rounded-xl" },
            },
          }}
        />
      </Box>

      <Divider sx={{ mt: 7, mb: 3 }} />

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogTrigger asChild>
          <Button
            variant="contained"
            fullWidth
            size="large"
            disabled={loading || !amount}
            className="rounded-xl shadow-md transition-all duration-300 font-semibold"
            sx={{
              backgroundColor: "#1e293b", // azul oscuro tipo slate-800
              color: "#fff",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#0f172a", // slate-900
                boxShadow: "0 4px 15px rgba(15, 23, 42, 0.4)", // sombra suave oscura
              },
              "&:active": {
                transform: "scale(0.97)",
              },
            }}
          >
            {loading ? "Procesando..." : "Retirar"}
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Retiro</DialogTitle>
          </DialogHeader>
          <Typography>
            ¿Estás seguro de que deseas retirar <strong>{amount} NUM</strong>?
          </Typography>
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button
              onClick={() => setConfirmOpen(false)}
              variant="outlined"
              color="secondary"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button onClick={handleWithdraw} disabled={loading}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Paper>
  );
}
