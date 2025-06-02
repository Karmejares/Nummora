import React from "react";
import {
  Button,
  TextField,
  Typography,
  Paper,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { useLenderWithdraw } from "@/hooks/Lender/useLenderWithdraw";

export default function Withdraw() {
  const {
    amount,
    setAmount,
    openDialog,
    setOpenDialog,
    handleWithdraw,
    balanceFormatted,
    loading,
  } = useLenderWithdraw();

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
        variant="h4"
        component="h2"
        gutterBottom
        sx={{ fontWeight: 700 }}
      >
        Retirar Fondos
      </Typography>

      <Box mb={4}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Saldo disponible:{" "}
          <strong>{balanceFormatted || "Cargando..."} NUM</strong>
        </Typography>

        <TextField
          label="Cantidad a retirar (NUM)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          disabled={loading}
          variant="outlined"
          inputProps={{
            step: "1000",
            className: "bg-white rounded-xl",
          }}
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button
            variant="contained"
            fullWidth
            size="large"
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
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} /> Procesando...
              </>
            ) : (
              "Retirar"
            )}
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Retiro</DialogTitle>
          </DialogHeader>
          <Typography>
            ¿Estás seguro de que deseas retirar <strong>{amount} NUM</strong>?
          </Typography>
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button
              variant="outlined"
              color="secondary"
              disabled={loading}
              onClick={() => setOpenDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleWithdraw} disabled={loading}>
              {loading ? (
                <>
                  <CircularProgress size={16} sx={{ mr: 1 }} /> Confirmando...
                </>
              ) : (
                "Confirmar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Paper>
  );
}
