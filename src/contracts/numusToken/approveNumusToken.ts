import {useEffect, useState} from "react";
import {GetContract} from "@/utils/Contract";
import NumTokenABI from "@/lib/abi/NumToken.json";
import {setWalletError} from "@/store/walletSlice";
import {useAppDispatch} from "@/store/hooks";
import {useToast} from "@/hooks/use-toast";

export const approveNumusToken = (
    spender:string,
    amount:string
) => {
    const [isSusscess, setIsSusscess] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const Toast = useToast();

    useEffect(() => {
        const sendApprove = async () => {
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
                    return;
                }
                    await NUMUSToken.contract.approve(spender, amount);
                setIsSusscess(true)
            } catch (error) {
                console.error("Error fetching balance:", error);
            }
        };

        sendApprove();
    }, []);

    return isSusscess;
}