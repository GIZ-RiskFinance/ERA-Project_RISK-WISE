import React from "react";

import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";

import APIService from "../../APIService";

const onRefreshClick = () => {
  APIService.Refresh().catch((error) => {
    console.log(error);
  });
};

const ReloadButton = () => {
  return (
    <>
      <IconButton onClick={onRefreshClick} color="inherit" aria-label="Refresh">
        <RefreshIcon />
      </IconButton>
    </>
  );
};

export default ReloadButton;
