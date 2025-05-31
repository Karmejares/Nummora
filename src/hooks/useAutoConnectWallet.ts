import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ethers } from "ethers";
import {
  connectWallet,
  setSimulatedBalance,
  setWalletError,
} from "../store/walletSlice";

// Extendemos Ethereum para permitir on/removeListener
interface EthereumWithEvents extends ethers.Eip1193Provider {
  on?: (event: string, listener: (...args: any[]) => void) => void;
  removeListener?: (event: string, listener: (...args: any[]) => void) => void;
}

export const useAutoConnectWallet = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const autoConnect = async () => {
      try {
        if (!window.ethereum) return;

        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_accounts", []);
        if (accounts.length === 0) return;

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

    autoConnect();

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        dispatch(setWalletError("Disconnected"));
      } else {
        dispatch(connectWallet(accounts[0]));
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    const eth = window.ethereum as EthereumWithEvents;

    if (eth?.on) {
      eth.on("accountsChanged", handleAccountsChanged);
      eth.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (eth?.removeListener) {
        eth.removeListener("accountsChanged", handleAccountsChanged);
        eth.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [dispatch]);
};
