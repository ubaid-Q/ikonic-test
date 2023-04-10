import { Alert, AlertColor, Snackbar } from "@mui/material";
import React from "react";

export function SnackBar({
  open,
  onClose,
  severity,
  message,
}: {
  open: boolean;
  onClose: any;
  severity: AlertColor;
  message: any;
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
