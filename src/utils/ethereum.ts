import { ethers } from "ethers";

/**
 * Devuelve el proveedor Ethereum inyectado por MetaMask si está disponible.
 * @returns ethers.Eip1193Provider | null
 */
export function getSafeEthereumProvider(): ethers.Eip1193Provider | null {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    return window.ethereum as ethers.Eip1193Provider;
  }
  return null;
}
