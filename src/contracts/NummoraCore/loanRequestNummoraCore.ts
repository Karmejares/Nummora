import { GetContract } from "@/utils/Contract";
import NummoraLoan from "@/lib/abi/NummoraLoan.json";
import { setWalletError } from "@/store/walletSlice";
import { toast } from "@/hooks/use-toast";
import {Dispatch} from "redux";

export const loanRequestNummoraCore = async (
  amountNumus: string,
  dispatch: Dispatch
): Promise<boolean> => {
  try {
    const nummoraCore = await GetContract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_NUMMORALOAN!,
        NummoraLoan
    );
    if (!nummoraCore) {
      toast({
        title: "MetaMask no encontrado",
        description: "Instala MetaMask para continuar.",
        status: "error",
      });
      dispatch(setWalletError("MetaMask no encontrado"));
      return false;
    }

    await nummoraCore.contract.solicitarPrestamo(amountNumus);
    toast({
      title: "prestamo exitosa",
      description: "El prestamo ha sido aprobado correctamente.",
      status: "success",
    });
    return true;
  } catch (error) {
    console.error("Error al aprobar:", error);
    toast({
      title: "Error en el prestamo",
      description: "Hubo un problema al intentar realizar la peticion de prestamo.",
      status: "error",
    });
    return false;
  }
};
