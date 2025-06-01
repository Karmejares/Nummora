import { GetContract } from "@/utils/Contract";
import NummoraLoan from "@/lib/abi/NummoraLoan.json";
import { setWalletError } from "@/store/walletSlice";
import { toast } from "@/hooks/use-toast";
import {Dispatch} from "redux";
import {ethers, LogDescription} from "ethers";

export const PayLoanNummoraCore = async (
  loanId: string,
  amountToPayCCOP: string,
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

    const tx = await nummoraCore.contract.pagarPrestamo(
        BigInt(loanId),
        {
          value: ethers.parseEther(amountToPayCCOP),
        }
    );

    await tx.wait();

    const key = "nummora_loans";
    const existing = sessionStorage.getItem(key);
    const currentLoans = existing ? JSON.parse(existing) : [];
    const updatedLoans = currentLoans.filter((loan: any) => loan.loanId !== loanId);

    sessionStorage.setItem(key, JSON.stringify(updatedLoans));

    toast({
      title: "¡Pago confirmado confirmado!",
      description: tx.hash,
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
