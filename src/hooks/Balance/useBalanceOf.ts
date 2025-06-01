import { useEffect, useState } from "react";
import { ethers } from "ethers";
import {GetContract} from "@/utils/Contract";
import NumTokenABI from "@/lib/abi/NumToken.json";
import {setWalletError} from "@/store/walletSlice";
import {useAppDispatch} from "@/store/hooks";
import {useToast} from "@/hooks/use-toast";

export const useBalanceOf = () => {
    //TODO: agg balance
    const [balanceOf, setBalanceOf] = useState<string>("");
    const dispatch = useAppDispatch();
    const Toast = useToast();


    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const NUMUSToken = await GetContract(
                    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_NUMUSTOKEN!,
                    NumTokenABI
                );
                if (NUMUSToken == null) {
                    Toast.toast({
                        title: "MetaMask no encontrado",
                        description: "Instala MetaMask para continuar.",
                        status: "error",
                    });
                    dispatch(setWalletError("MetaMask no encontrado"));
                    setBalanceOf("0")
                    return;
                }

                const balanceWei = await NUMUSToken.contract.balanceOf(NUMUSToken.signer.address)
                const balanceFormatted = ethers.formatUnits(balanceWei, 18);
                setBalanceOf(balanceFormatted);
            } catch (error) {
                console.error("Error fetching balance:", error);
                setBalanceOf("0");
            }
        };

        fetchBalance();
    }, []);

    return { balanceOf };
};
