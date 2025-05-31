import { ethers } from "ethers";
import { AppDispatch } from "../store";
import {
  connectWallet,
  setSimulatedBalance,
  setWalletError,
} from "../store/walletSlice";
import NumTokenABI from "@/lib/abi/NumToken.json";

const CONTRACT_ADDRESS = "0x8f1aba054a294FC6Faad328Fa290E4AF37F062Bc";

export const connectWithMetaMask = async (dispatch: AppDispatch) => {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask no detectado");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    if (!accounts || accounts.length === 0) {
      throw new Error("No se encontraron cuentas");
    }

    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    // Obtenemos el contrato del token NUM
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      NumTokenABI,
      provider
    );
    const balanceBN = await contract.balanceOf(address);

    const decimals = await contract.decimals(); // asumimos que es 18, pero mejor leerlo
    const balance = parseFloat(ethers.formatUnits(balanceBN, decimals));

    dispatch(connectWallet(address));
    dispatch(setSimulatedBalance(balance));
  } catch (err: any) {
    dispatch(setWalletError(err.message));
  }
};
