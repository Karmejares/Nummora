import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { GetContract } from "@/utils/Contract";
import NummoraLoan from "@/lib/abi/NummoraLoan.json";
import { setWalletError } from "@/store/walletSlice";
import { useToast } from "@/hooks/use-toast";
import {useAppDispatch} from "@/store/hooks";

export const borrowerLimitNummoraCore = () => {
    const [borrowerLimit, setBorrowerLimit] = useState<bigint>(BigInt(0));
    const [borrowerLimitFormatted, setBorrowerLimitFormatted] = useState<string>("0");
    const Toast = useToast();
    const dispatch = useAppDispatch()

    useEffect(() => {
        const fetchBorrowerLimit = async () => {
            try {
                const nummoraCore = await GetContract(
                    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_NUMMORALOAN!,
                    NummoraLoan
                );
                if (!nummoraCore) {
                    Toast.toast({
                        title: "MetaMask no encontrado",
                        description: "Instala MetaMask para continuar.",
                        status: "error",
                    });
                    dispatch(setWalletError("MetaMask no encontrado"));
                    return;
                }

                const limitBorrower = await nummoraCore.contract.deudorLimits(nummoraCore.signer.address)
                setBorrowerLimit(limitBorrower);
                setBorrowerLimitFormatted(ethers.formatUnits(limitBorrower, 18));
            } catch (error) {
                console.error("Error fetching balance:", error);
                setBorrowerLimit(BigInt(0));
                setBorrowerLimitFormatted("0");
            }
        };

        fetchBorrowerLimit();
    }, []);

    return { borrowerLimit, borrowerLimitFormatted };
};
