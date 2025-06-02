import { GetContract } from "@/utils/Contract";
import NummoraLoan from "@/lib/abi/NummoraLoan.json";
import { setWalletError } from "@/store/walletSlice";
import { toast } from "@/hooks/use-toast";
import {ethers} from "ethers";
import {Dispatch} from "redux";

export const withdrawLenderNummoraCore = async (
  amountNumus: string,
  dispatch: Dispatch
): Promise<boolean> => {
  try {
    const NummoraCore = await GetContract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_NUMMORALOAN!,
      NummoraLoan
    );
    if (!NummoraCore) {
      toast({
        title: "MetaMask no encontrado",
        description: "Instala MetaMask para continuar.",
        status: "error",
      });
      dispatch(setWalletError("MetaMask no encontrado"));
      return false;
    }

    const parsedAmount = ethers.parseUnits(amountNumus.trim(), 18);
    await NummoraCore.contract.retirarPrestamista(parsedAmount);
    toast({
      title: "Retiro exitoso",
      description: "En breves veras reflejado su dinero en tu wallet",
      status: "success",
    });
    return true;
  } catch (error) {
    console.error("Error al aprobar:", error);
    toast({
      title: "Error al retirar",
      description: "Hubo un problema al intentar retirar el saldo.",
      status: "error",
    });
    return false;
  }
};
