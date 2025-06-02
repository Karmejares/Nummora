import { useState } from "react";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLoading, setWalletError } from "@/store/walletSlice";
import {balanceOfNumusToken} from "@/contracts/numusToken/balanceOfNumusToken";
import {withdrawLenderNummoraCore} from "@/contracts/NummoraCore/withdrawLenderNummoraCore";

export function useLenderWithdraw() {
  const [amount, setAmount] = useState<string>("");
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.wallet.loading);
  const { toast } = useToast();
  const { balanceOf, balanceFormatted } = balanceOfNumusToken();

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
    await withdrawLenderNummoraCore(amount, dispatch);
    setAmount("");
    setOpenDialog(false);
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
