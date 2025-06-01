import {Contract, ethers, InterfaceAbi, JsonRpcSigner} from "ethers";
import {getSafeEthereumProvider} from "@/utils/ethereum";

type ContractReturn  = {
    contract: Contract,
    provider: ethers.BrowserProvider
    signer: JsonRpcSigner
}

export const GetContract = async (
    contractAddress: string,
    ABI: InterfaceAbi
) : Promise<ContractReturn | null> => {
    const ethereum = getSafeEthereumProvider();
    if(ethereum == null){
        return null;
    }
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
        contractAddress,
        ABI,
        signer
    );

    return {contract, provider, signer}
}