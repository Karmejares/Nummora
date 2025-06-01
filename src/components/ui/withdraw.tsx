"use client";

import React, { useState, useEffect } from "react";
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
import NumTokenABI from "@/lib/abi/NumToken.json"; // Ensure the correct ABI for withdrawal
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLoading, setWalletError } from "@/store/walletSlice";

const CONTRACT_ADDRESS = "0x10a678831b9A29282954530799dCcAB7710abd3F"; // Replace with the actual contract address

export default function Withdraw() {
  const [amount, setAmount] = useState<string>("");
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [balance, setBalance] = useState<ethers.BigNumber | null>(null); // To store the actual NUM balance
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.wallet.loading);
  const { toast } = useToast();

  const isAmountValid = amount && !isNaN(Number(amount)) && Number(amount) > 0;

  useEffect(() => {
    // Fetch MetaMask balance on component mount
    const fetchBalance = async () => {
      try {
        const ethereum = getSafeEthereumProvider();
        if (ethereum) {
          const provider = new ethers.BrowserProvider(ethereum);
          const signer = await provider.getSigner();
          const walletBalance = await provider.getBalance(signer.getAddress());
          setBalance(walletBalance);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast({
            title: "Error al obtener balance",
            description: error.message || "Error desconocido",
            status: "error",
          });
        } else {
          // Handle the case where error is not an instance of Error
          console.error("Unknown error:", error);
        }
      }
    };

    fetchBalance();
  }, []);

  async function handleWithdraw() {
    const numericAmount = Number(amount);

    if (!isAmountValid) {
      toast({
        title: "Monto inválido",
        description: "El monto ingresado no es válido.",
        status: "error",
      });
      return;
    }

    // Ensure the amount is not greater than the actual wallet balance (NUM)
    if (numericAmount > parseFloat(ethers.formatUnits(balance || 0, 18))) {
      toast({
        title: "Fondos insuficientes",
        description: `Tu saldo actual es ${ethers.formatUnits(
          balance || 0,
          18
        )} NUM`,
        status: "error",
      });
      return;
    }

    dispatch(setLoading(true));

    try {
      const ethereum = getSafeEthereumProvider();

      if (!ethereum) {
        toast({
          title: "MetaMask no encontrado",
          description: "Instala MetaMask para continuar.",
          status: "error",
        });
        dispatch(setWalletError("MetaMask no encontrado"));
        return;
      }

      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();

      // Create contract instance
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        NumTokenABI,
        signer
      );

      // Interact with the contract's withdrawal function (assuming it takes NUM as a parameter)
      const valueInNum = ethers.parseUnits(amount, 18); // Convert NUM amount to the correct units

      const tx = await contract.retirarNUMUSDeudor(valueInNum);

      toast({
        title: "¡Retiro confirmado!",
        description: `${numericAmount} NUM han sido retirados.`,
        status: "success",
      });
      setAmount("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error desconocido";
      toast({
        title: "Error en el retiro",
        description: message,
        status: "error",
      });
    } finally {
      dispatch(setLoading(false));
      setOpenDialog(false);
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
        sx={{ fontWeight: 700 }}
      >
        Retirar Fondos
      </Typography>

      <Box mb={4}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Saldo disponible:{" "}
          <strong>
            {balance ? ethers.formatUnits(balance, 18) : "Cargando..."} NUM
          </strong>
        </Typography>

        <TextField
          label="Cantidad a retirar (NUM)"
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

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button
            variant="contained"
            fullWidth
            size="large"
            disabled={loading || !isAmountValid}
            className="rounded-xl shadow-md font-semibold"
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
              "Retirar"
            )}
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
            <Button variant="outlined" color="secondary" disabled={loading}>
              Cancelar
            </Button>
            <Button onClick={handleWithdraw} disabled={loading}>
              {loading ? (
                <>
                  <CircularProgress size={16} sx={{ mr: 1 }} /> Confirmando...
                </>
              ) : (
                "Confirmar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Paper>
  );
}
