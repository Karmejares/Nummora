import { ethers } from "ethers";
import { AppDispatch } from "../store";
import {
  connectWallet,
  setSimulatedBalance,
  setWalletError,
} from "../store/walletSlice";

export const connectWithMetaMask = async (dispatch: AppDispatch) => {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask not detected");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts returned");
    }

    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    const balanceInWei = await provider.getBalance(address);
    const balanceInEth = parseFloat(ethers.formatEther(balanceInWei));

    dispatch(connectWallet(address));
    dispatch(setSimulatedBalance(balanceInEth));
  } catch (err: any) {
    dispatch(setWalletError(err.message));
  }
};
