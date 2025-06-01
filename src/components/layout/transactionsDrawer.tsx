"use client";

import React from "react";
import {
  Drawer,
  IconButton,
  Tabs,
  Tab,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { X } from "lucide-react";
import Deposit from "../ui/deposit";
import Withdraw from "../ui/withdraw";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";

interface TransactionsDrawerProps {
  open: boolean;
  onClose?: () => void;
}

export default function TransactionsDrawer({
  open,
  onClose,
}: TransactionsDrawerProps) {
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box className="w-full sm:w-[400px] h-full flex flex-col bg-[hsl(var(--drawer))] text-[hsl(var(--foreground))]">
        {/* Header */}
        <Box className="flex items-center justify-between px-4 py-3 border-b border-[hsl(var(--border))]">
          <Typography variant="h6" className="font-semibold text-lg">
            Transacciones
          </Typography>
          <IconButton onClick={onClose} size="small" aria-label="Cerrar">
            <X />
          </IconButton>
        </Box>

        {/* Tabs */}
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": {
              fontWeight: 500,
              color: "hsl(var(--muted-foreground))",
            },
            "& .Mui-selected": {
              color: "hsl(var(--primary))",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "hsl(var(--primary))",
            },
          }}
        >
          <Tab
            label={
              <Box className="flex items-center gap-1">
                <AttachMoneyIcon fontSize="small" />
                Depósito
              </Box>
            }
          />
          <Tab
            label={
              <Box className="flex items-center gap-1">
                <CurrencyExchangeIcon fontSize="small" />
                Retiro
              </Box>
            }
          />
        </Tabs>

        <Divider className="border-[hsl(var(--muted))]" />

        {/* Content */}
        <Box className="flex-grow overflow-y-auto p-4 bg-[hsl(var(--background))]">
          {tabIndex === 0 && <Deposit />}
          {tabIndex === 1 && <Withdraw />}
        </Box>
      </Box>
    </Drawer>
  );
}
