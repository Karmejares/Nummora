// components/ApproveBalanceCard.tsx
import React from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { useLenderApproval } from "@/hooks/Lender/useLenderApproval";

export const ApproveBalanceCard: React.FC = () => {
  const {
      checked,
      setChecked,
      isLoading, isSuccess,
      handleApprove } = useLenderApproval();

  return (
    <Paper
      elevation={6}
      className="max-w-md mx-auto p-6 sm:p-8 bg-white/80 backdrop-blur-md"
      sx={{
        borderRadius: "24px",
        border: "1px solid rgba(0,0,0,0.1)",
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ fontWeight: 700 }}
      >
        Aprobación de uso de saldo
      </Typography>

      <Box mb={3}>
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              color="primary"
            />
          }
          label="¿Aprueba que usemos el balance de su cuenta para ganar rendimiento?"
        />
      </Box>

      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={handleApprove}
        disabled={!checked || isLoading || isSuccess}
        className="rounded-xl shadow-md font-semibold"
        sx={{
          backgroundColor: "#1e293b",
          color: "#fff",
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#0f172a",
            boxShadow: "0 4px 15px rgba(15, 23, 42, 0.4)",
          },
          "&:active": {
            transform: "scale(0.97)",
          },
        }}
      >
        {isLoading ? (
          <>
            <CircularProgress size={20} sx={{ mr: 1 }} /> Aprobando...
          </>
        ) : isSuccess ? (
          "Aprobado ✅"
        ) : (
          "Aceptar"
        )}
      </Button>
    </Paper>
  );
};
