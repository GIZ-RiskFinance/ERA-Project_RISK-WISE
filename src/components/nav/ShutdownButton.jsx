import React from "react";

import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";

import APIService from "../../APIService";

const onShutdownClick = () => {
  APIService.Shutdown().catch((error) => {
    console.log(error);
  });
};

const ShutdownButton = () => {
  return (
    <>
      <IconButton onClick={onShutdownClick} color="inherit" aria-label="Shutdown">
        <LogoutIcon style={{ color: "#ba000d" }} />
      </IconButton>
    </>
  );
};

export default ShutdownButton;
