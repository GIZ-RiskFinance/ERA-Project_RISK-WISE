import React from "react";
import { useTranslation } from "react-i18next";

import { Paper, Typography, Box } from "@mui/material";
import ConstructionIcon from "@mui/icons-material/Construction";

const PageUnderConstructionView = () => {
  const { t } = useTranslation();

  return (
    <div style={{ height: "80%", display: "flex", flexDirection: "column" }}>
      <Paper
        elevation={3}
        style={{
          flex: 1,
          borderRadius: "15px",
          marginBottom: "16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Box textAlign="center" p={3}>
          <ConstructionIcon color="warning" style={{ fontSize: "64px" }} />
          <Typography variant="h4" gutterBottom>
            {t("general_main_view_progress_dev_title")}
          </Typography>
          <Typography variant="subtitle1">
            {t("general_main_view_progress_dev_subtitle")}
          </Typography>
        </Box>
      </Paper>
    </div>
  );
};

export default PageUnderConstructionView;
