import React, { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

const ActionAlert = ({ message, type = "info", actionLabel, onActionClick, duration = 5000 ,setAlert}) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setOpen(false);
    setAlert({ message: "", type: "" });
  }

  if (!open || !message) return null;

  return (
    <Stack sx={{ width: "100%" }} spacing={2}>
      <Alert
        severity={type}
        onClose={() => handleClose()}
        action={
          actionLabel && onActionClick ? (
            <Button color="inherit" size="small" onClick={onActionClick}>
              {actionLabel}
            </Button>
          ) : null
        }
      >
        {message}
      </Alert>
    </Stack>
  );
};

export default ActionAlert;
