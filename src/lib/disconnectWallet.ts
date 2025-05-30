import { AppDispatch } from "../store";
import { disconnectWallet, setWalletError } from "../store/walletSlice";

export const disconnectFromWallet = (dispatch: AppDispatch) => {
  try {
    dispatch(disconnectWallet());
    dispatch(setWalletError(null));
    // Optional: Clear any related state (e.g., transactions)
    // window.location.reload(); // Optionally refresh
  } catch (error: any) {
    dispatch(setWalletError("Error disconnecting from wallet."));
  }
};
