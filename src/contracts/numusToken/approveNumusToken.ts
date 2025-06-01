import { GetContract } from "@/utils/Contract";
import NumTokenABI from "@/lib/abi/NumToken.json";
import { setWalletError } from "@/store/walletSlice";
import { toast } from "@/hooks/use-toast";
import {useAppDispatch} from "@/store/hooks";
import {Dispatch} from "redux";

export const approveNumusToken = async (
  spender: string,
  amount: string,
  dispatch: Dispatch
): Promise<boolean> => {
  try {
    const NUMUSToken = await GetContract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_NUMUSTOKEN!,
      NumTokenABI
    );
    if (!NUMUSToken) {
      toast({
        title: "MetaMask no encontrado",
        description: "Instala MetaMask para continuar.",
        status: "error",
      });
      dispatch(setWalletError("MetaMask no encontrado"));
      return false;
    }

    await NUMUSToken.contract.approve(spender, amount);
    toast({
      title: "Aprobación exitosa",
      description: "El uso de saldo ha sido aprobado.",
      status: "success",
    });
    return true;
  } catch (error) {
    console.error("Error al aprobar:", error);
    toast({
      title: "Error en la aprobación",
      description: "Hubo un problema al intentar aprobar el saldo.",
      status: "error",
    });
    return false;
  }
};
