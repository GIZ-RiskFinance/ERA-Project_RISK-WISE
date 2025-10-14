import React from "react";
import { useTranslation } from "react-i18next";

import { Box, Typography } from "@mui/material";

const MacroEconomicViewTitle = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        variant="h6"
        component="div"
        sx={{
          margin: "auto",
          marginBottom: 2,
          bgcolor: "#F35A5A",
          color: "white",
          fontWeight: "bold",
          textAlign: "center",
          padding: "8px",
          borderRadius: "4px",
        }}
      >
        {t(`macroeconomic_view_title`)}
      </Typography>
    </Box>
  );
};

export default MacroEconomicViewTitle;
