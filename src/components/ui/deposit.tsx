"use client";

import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Paper,
  Box,
  Divider,
  CircularProgress,
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

const CONTRACT_ADDRESS = "0x8f1aba054a294FC6Faad328Fa290E4AF37F062Bc"; // Reemplaza con tu dirección de contrato

export default function Deposit() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const Toast = useToast(); // Reemplaza con la dirección del usuario

  const isAmountValid = amount && !isNaN(Number(amount)) && Number(amount) > 0;

  async function getBalance({}) {}

  async function handleDeposit() {
    if (!isAmountValid) {
      Toast.toast({ title: "Monto inválido", status: "error" });
      return;
    }

    setLoading(true);

    try {
      const ethereum = getSafeEthereumProvider();

      if (!ethereum) {
        Toast.toast({
          title: "MetaMask no encontrado",
          description: "Instala MetaMask para continuar.",
          status: "error",
        });
        return;
      }

      const provider = new ethers.BrowserProvider(ethereum);
      console.log("Provider:", provider);

      const signer = await provider.getSigner();
      console.log("Signer:", signer);

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        NumTokenABI,
        signer
      );
      console.log("Contract:", contract);
      const valueInEth = ethers.parseEther(amount);

      const symbol = await contract.symbol();
      console.log("Symbol:", symbol);

      const balance = await contract.balanceOf(signer.address);
      // Asumiendo 18 decimales
      const readable = ethers.formatUnits(balance, 18);
      console.log(`Balance del usuario: ${readable} NUM`);
      // ✅ Llamada al contrato con el ABI
      //const tx = await contract.deposit({ value: valueInEth });

      Toast.toast({
        title: "Depósito simulado",
        description: `Se intentaría depositar NUM.`,
        status: "info",
      });

      // await tx.wait();
      // Toast.toast({ title: "¡Depósito confirmado!", status: "success" });
      setAmount("");
    } catch (error) {
      console.error(error);

      Toast.toast({
        title: "Fallo en la transacción",
        description:
          error instanceof Error ? error.message : "Error desconocido",
        status: "error",
      });
    }
  }

  return (
    <Paper
      elevation={6}
      className="max-w-md mx-auto p-6 sm:p-8 bg-white/80 backdrop-blur-md"
      sx={{
        borderRadius: "24px",
        border: "1px solid rgba(0,0,0,0.1)",
      }}
    >
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{
          fontWeight: 700,
          color: "text.primary",
        }}
      >
        Depositar Fondos
      </Typography>

      {/* Input de monto */}
      <Box mb={4}>
        <TextField
          label="Monto (NUM)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          disabled={loading}
          error={amount !== "" && !isAmountValid}
          helperText={
            amount !== "" && !isAmountValid
              ? "Ingresa un monto válido (> 0)"
              : " "
          }
          variant="outlined"
          inputProps={{
            step: "1000",
            className: "bg-white rounded-xl",
          }}
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Dialog de confirmación */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="contained"
            fullWidth
            size="large"
            disabled={loading || !isAmountValid}
            className="rounded-xl shadow-md transition-all duration-300 font-semibold"
            sx={{
              backgroundColor: "#1e293b",
              color: "#fff",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#0f172a",
                boxShadow: "0 4px 15px rgba(15, 23, 42, 0.4)",
              },
              "&:active": {
                transform: "scale(0.97)",
              },
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} /> Procesando...
              </>
            ) : (
              "Depositar"
            )}
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Depósito</DialogTitle>
          </DialogHeader>
          <Typography>
            ¿Estás seguro de que deseas depositar <strong>{amount} NUM</strong>?
          </Typography>
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button variant="outlined" color="secondary" disabled={loading}>
              Cancelar
            </Button>
            <Button onClick={handleDeposit} disabled={loading}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Paper>
  );
}
