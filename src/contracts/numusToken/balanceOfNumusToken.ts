import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { GetContract } from "@/utils/Contract";
import NumTokenABI from "@/lib/abi/NumToken.json";
import { setWalletError } from "@/store/walletSlice";
import { useAppDispatch } from "@/store/hooks";
import { useToast } from "@/hooks/use-toast";

export const balanceOfNumusToken = () => {
    const [balanceOf, setBalanceRaw] = useState<bigint>(BigInt(0));
    const [balanceFormatted, setBalanceFormatted] = useState<string>("0");
    const dispatch = useAppDispatch();
    const Toast = useToast();

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const NUMUSToken = await GetContract(
                    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_NUMUSTOKEN!,
                    NumTokenABI
                );
                if (!NUMUSToken) {
                    Toast.toast({
                        title: "MetaMask no encontrado",
                        description: "Instala MetaMask para continuar.",
                        status: "error",
                    });
                    dispatch(setWalletError("MetaMask no encontrado"));
                    return;
                }

                const balanceWei = await NUMUSToken.contract.balanceOf(NUMUSToken.signer.address);
                setBalanceRaw(balanceWei);
                setBalanceFormatted(ethers.formatUnits(balanceWei, 18));
            } catch (error) {
                console.error("Error fetching balance:", error);
                setBalanceRaw(BigInt(0));
                setBalanceFormatted("0");
            }
        };

        fetchBalance();
    }, []);

    return { balanceOf, balanceFormatted };
};
