import React from "react";
import { useTranslation } from "react-i18next";

import { Box, Button, Typography } from "@mui/material";

import ResultsTypography from "./ResultsTypography";
import useStore from "../../store";

const EconomicResultsCard = () => {
  const { activeMap, activeViewControl, setActiveMap } = useStore();
  const { t } = useTranslation();

  const handleButtonClick = (type) => {
    setActiveMap(type);
  };

  const isButtonSelected = (type) => activeMap === type;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "85vh" }}>
      {/* Button Section with flex column direction */}

      {activeViewControl === "display_map" && (
        <Box sx={{ display: "flex", flexDirection: "column", marginBottom: 2 }}>
          {["hazard", "exposure", "impact"].map((type) => (
            <Button
              key={type}
              variant="contained"
              sx={{
                marginBottom: 2,
                bgcolor: isButtonSelected(type) ? "#F79191" : "#FFCCCC",
                transition: "transform 0.1s ease-in-out",
                "&:active": {
                  transform: "scale(0.96)",
                },
                "&:hover": { bgcolor: "#F79191" },
              }}
              onClick={() => handleButtonClick(type)}
            >
              {t(`results_eco_button_${type}`)}
            </Button>
          ))}
        </Box>
      )}

      {/* Result Details section */}
      <Box
        sx={{
          bgcolor: "#FFCCCC",
          padding: 2,
          borderRadius: "4px",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            borderBottom: "1px solid #6F6F6F",
            paddingBottom: 1,
            color: "#6F6F6F",
            textAlign: "center",
          }}
        >
          {t("results_eco_details")}
        </Typography>

        <ResultsTypography />
      </Box>
    </Box>
  );
};

export default EconomicResultsCard;
