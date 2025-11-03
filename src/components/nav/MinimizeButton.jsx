import React from "react";

import IconButton from "@mui/material/IconButton";
import MinimizeIcon from "@mui/icons-material/Minimize";

import APIService from "../../APIService";

const onMinimizelick = () => {
  APIService.Minimize().catch((error) => {
    console.log(error);
  });
};

const ShutdownButton = () => {
  return (
    <>
      <IconButton onClick={onMinimizelick} color="inherit" aria-label="Minimize">
        <MinimizeIcon />
      </IconButton>
    </>
  );
};

export default ShutdownButton;
