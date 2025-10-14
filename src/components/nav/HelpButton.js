import React from "react";

import IconButton from "@mui/material/IconButton";
import HelpIcon from "@mui/icons-material/Help";

const onHelplick = () => {
  console.log('helpClick');
};

const HelpButton = () => {
  return (
    <>
      <IconButton onClick={onHelplick} color="inherit" aria-label="Help">
        <HelpIcon />
      </IconButton>
    </>
  );
};

export default HelpButton;
