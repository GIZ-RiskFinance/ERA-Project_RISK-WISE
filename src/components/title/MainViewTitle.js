import React from "react";
import { useTranslation } from "react-i18next";

import useStore from "../../store";

import { Box, Typography } from "@mui/material";

const MainViewTitle = () => {
  const { mapTitle, selectedTab } = useStore();
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
        {mapTitle && selectedTab === 1 ? `${mapTitle}` : t(`main_view_tab_${selectedTab}_title`)}
      </Typography>
    </Box>
  );
};

export default MainViewTitle;
