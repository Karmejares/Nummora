import React, { useState } from "react";
import { Button, TextField, Typography, Paper, Box } from "@mui/material";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import { getSafeEthereumProvider } from "@/utils/ethereum";

export default function Deposit() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const Toast = useToast();

  async function handleDeposit() {
    if (!amount || isNaN(Number(amount))) {
      Toast.toast({ title: "Invalid amount", status: "error" });
      return;
    }
    setLoading(true);

    try {
      const ethereum = getSafeEthereumProvider();

      if (!ethereum) {
        Toast.toast({
          title: "MetaMask not found",
          description: "Please install MetaMask to continue.",
          status: "error",
        });
        return;
      }
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const valueInEth = ethers.parseEther(amount);

      const tx = await signer.sendTransaction({
        to: "YOUR_CONTRACT_ADDRESS",
        value: valueInEth,
      });

      Toast.toast({
        title: "Transaction sent!",
        description: tx.hash,
        status: "info",
      });
      await tx.wait();
      Toast.toast({ title: "Transaction confirmed!", status: "success" });
    } catch (error) {
      if (error instanceof Error) {
        Toast.toast({
          title: "Transaction failed",
          description: error.message || "",
          status: "error",
        });
      } else {
        Toast.toast({
          title: "Transaction failed",
          description: "An unknown error occurred.",
          status: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Paper
      elevation={6}
      className="max-w-md mx-auto p-8 rounded-2xl bg-white/80 backdrop-blur-md"
      sx={{
        borderRadius: "24px",
        border: "1px solid rgba(0,0,0,0.1)",
      }}
    >
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        className="font-semibold text-gray-900"
        sx={{ fontWeight: 700 }}
      >
        Deposit Funds
      </Typography>

      <TextField
        label="Amount (ETH)"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
        disabled={loading}
        variant="outlined"
        className="mb-6"
        slotProps={{
          input: {
            inputProps: { step: "0.0001", className: "bg-white rounded-xl" },
          },
        }}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        disabled={loading}
        onClick={handleDeposit}
        className="rounded-xl"
        sx={{
          fontWeight: "600",
          textTransform: "none",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: "#2c3e50",
            boxShadow: "0 4px 15px rgba(44, 62, 80, 0.4)",
          },
          "&:active": {
            transform: "scale(0.97)",
          },
        }}
      >
        {loading ? "Processing..." : "Deposit"}
      </Button>
    </Paper>
  );
}
