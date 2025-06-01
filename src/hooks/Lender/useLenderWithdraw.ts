// hooks/useLenderWithdraw.ts
import { useState } from "react";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLoading, setWalletError } from "@/store/walletSlice";
import { useBalanceOf } from "@/hooks/Balance/useBalanceOf";
import { GetContract } from "@/utils/Contract";
import NummoraLoanABI from "@/lib/abi/NummoraLoan.json";

export function useLenderWithdraw() {
  const [amount, setAmount] = useState<string>("");
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.wallet.loading);
  const { toast } = useToast();
  const { balanceOf, balanceFormatted } = useBalanceOf();

  const handleWithdraw = async () => {
    const numericAmount = Number(amount);

    // Validación contra el balance simulado o formateado
    if (numericAmount > parseFloat(balanceFormatted)) {
      toast({
        title: "Fondos insuficientes",
        description: `Tu saldo actual es ${balanceFormatted} NUM`,
        status: "error",
      });
      return;
    }

    // Validación contra el balance real
    if (numericAmount > parseFloat(ethers.formatUnits(balanceOf || 0, 18))) {
      toast({
        title: "Fondos insuficientes",
        description: `Tu saldo actual es ${ethers.formatUnits(
          balanceOf || 0,
          18
        )} NUM`,
        status: "error",
      });
      return;
    }

    dispatch(setLoading(true));

    try {
      const contractCore = await GetContract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_NUMMORALOAN!,
        NummoraLoanABI
      );

      if (!contractCore) {
        toast({
          title: "MetaMask no encontrado",
          description: "Instala MetaMask para continuar.",
          status: "error",
        });
        dispatch(setWalletError("MetaMask no encontrado"));
        return;
      }

      const parsedAmount = ethers.parseUnits(amount.trim(), 18);
      await contractCore.contract.retirarPrestamista(parsedAmount);

      toast({
        title: "¡Retiro confirmado!",
        description: `${numericAmount} NUM han sido retirados.`,
        status: "success",
      });

      setAmount("");
      setOpenDialog(false);
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
    }
  };

  return {
    amount,
    setAmount,
    openDialog,
    setOpenDialog,
    handleWithdraw,
    balanceFormatted,
    loading,
  };
}
