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
import NummoraLoanABI from "@/lib/abi/NummoraLoan.json";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLoading, setWalletError, setBalance } from "@/store/walletSlice";

const CONTRACT_ADDRESS = "0x10a678831b9A29282954530799dCcAB7710abd3F";

export default function Deposit() {
  const [amount, setAmount] = useState<string>("");
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.wallet.loading);
  const { toast } = useToast();

  const isAmountValid = amount && !isNaN(Number(amount)) && Number(amount) > 0;

  async function handleDeposit() {
    if (!isAmountValid) {
      toast({
        title: "Monto inválido",
        description: "El monto ingresado no es válido.",
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
      //const valueInEth = ethers.parseEther(amount);
      const valueInEth = ethers.parseEther(amount);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        NummoraLoanABI,
        signer
      );

      const tx = await contract.depositarPrestamista({
        value: ethers.parseEther(amount),
      });

      // ✅ Actualizar el balance directamente
      dispatch(setBalance(Number(amount).toString()));

      toast({
        title: "¡Depósito confirmado!",
        description: tx.hash,
        status: "info",
      });
      setAmount("");
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Fallo en la transacción",
          description: error.message || "",
          status: "error",
        });
      } else {
        toast({
          title: "Fallo en la transacción",
          description: "Un error desconocido ocurrió.",
          status: "error",
        });
      }
      dispatch(
        setWalletError(
          error instanceof Error ? error.message : "Error desconocido"
        )
      );
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
        Depositar Fondos
      </Typography>

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
