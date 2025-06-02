// hooks/lender/useLenderDeposit.ts
import { useState } from "react";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLoading, setWalletError, setBalance } from "@/store/walletSlice";
import { getSafeEthereumProvider } from "@/utils/ethereum";
import NummoraLoanABI from "@/lib/abi/NummoraLoan.json";

export const useLenderDeposit = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.wallet.loading);
  const { toast } = useToast();

  const [amount, setAmount] = useState<string>("");
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const isAmountValid = amount && !isNaN(Number(amount)) && Number(amount) > 0;

  const handleDeposit = async () => {
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

      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_NUMMORALOAN!,
        NummoraLoanABI,
        signer
      );

      const tx = await contract.depositarPrestamista({
        value: ethers.parseEther(amount),
      });

      dispatch(setBalance(Number(amount).toString()));

      toast({
        title: "¡Depósito confirmado!",
        description: tx.hash,
        status: "success",
      });

      setAmount("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error desconocido";
      toast({
        title: "Fallo en la transacción",
        description: message,
        status: "error",
      });
      dispatch(setWalletError(message));
    } finally {
      dispatch(setLoading(false));
      setOpenDialog(false);
    }
  };

  return {
    amount,
    setAmount,
    openDialog,
    setOpenDialog,
    isAmountValid,
    handleDeposit,
    loading,
  };
};
