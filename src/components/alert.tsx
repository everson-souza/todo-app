import React, { createContext, useContext, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import "../styles/globals.css";


export const AlertComponent = ({
    alertStatus,
    message,
    severity,
}: {
    alertStatus:boolean;
    message: string;
    severity: string;
}) => {

    return (
    <div className="alerta">
        {alertStatus ? 
            (
                <Alert severity={severity == "success" ? "success" : severity == "error" ? "error" : severity == "info" ? "info" : "warning"}>
                    {message}
                </Alert>
            ) : (null)
        }
    </div>
  );
};