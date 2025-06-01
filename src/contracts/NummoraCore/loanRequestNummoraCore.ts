import { GetContract } from "@/utils/Contract";
import NummoraLoan from "@/lib/abi/NummoraLoan.json";
import { setWalletError } from "@/store/walletSlice";
import { toast } from "@/hooks/use-toast";
import {Dispatch} from "redux";
import {ethers, LogDescription} from "ethers";

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

    var tx = await nummoraCore.contract.solicitarPrestamo(amountNumus);
    const receipt = await tx.wait();

    const event: LogDescription | null = receipt.logs
        .map((log: { topics: ReadonlyArray<string>; data: string; }) => {
          try {
            return nummoraCore.contract.interface.parseLog(log);
          } catch {
            return null;
          }
        }).find((log: { name: string; }) => log?.name === "LoanRequested");

    if (event) {
      const { loanId, deudor, amountToPayCCOP, amountNUMUS } = event.args;

      const key = "nummora_loans";
      const existing = sessionStorage.getItem(key);
      const currentLoans = existing ? JSON.parse(existing) : [];

      const newLoan = {
        loanId: loanId.toString(),
        monto: ethers.formatUnits(amountNUMUS, 18),
        toPay: ethers.formatUnits(amountToPayCCOP, 18),
        lender: deudor,
      };

      sessionStorage.setItem(key, JSON.stringify([...currentLoans, newLoan]));
    }
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
