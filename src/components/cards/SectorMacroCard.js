import React from "react";
import { useTranslation } from "react-i18next";

import { Box, Card, CardActionArea, Typography, CardContent } from "@mui/material";
import useStore from "../../store";

const SectorMacroCard = () => {
  const {
    credOutputData,
    selectedMacroCountry,
    selectedMacroSector,
    selectedMacroVariable,
    setSelectedMacroSector,
  } = useStore();
  const { t } = useTranslation();

  // Extract distinct economic sectors
  const sectors = Array.from(
    new Set(
      credOutputData
        .filter(
          (row) =>
            row.country === selectedMacroCountry && row.economic_indicator === selectedMacroVariable
        )
        .map((row) => row.economic_sector)
    )
  );

  const handleCardSelect = (sector) => {
    if (selectedMacroSector === sector) {
      setSelectedMacroSector(""); // Deselect if already selected
    } else {
      setSelectedMacroSector(sector);
    }
  };

  const isButtonSelected = (sector) => selectedMacroSector === sector;

  return (
    <Card
      sx={{
        maxWidth: 800,
        margin: "auto",
        bgcolor: "#DCEFF2",
        border: "2px solid #3B919D",
        borderRadius: "16px",
        marginBottom: "16px",
      }}
    >
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          color="text.primary"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            backgroundColor: "#F79191",
            borderRadius: "8px",
            padding: "8px",
            marginBottom: "24px",
          }}
        >
          {t("card_macro_sector_title")}
        </Typography>
        {selectedMacroVariable &&
          sectors.map((sector) => (
            <CardActionArea
              key={sector}
              onClick={() => handleCardSelect(sector)}
              sx={{
                backgroundColor: isButtonSelected(sector) ? "#F79191" : "#FFCCCC",
                borderRadius: "8px",
                margin: "16px", // Space around buttons
                marginLeft: 0,
                textAlign: "center",
                padding: "8px 0",
                transition: "transform 0.1s ease-in-out", // Add transition for transform
                "&:active": {
                  transform: "scale(0.96)", // Slightly scale down when clicked
                },
              }}
            >
              <Typography variant="body1" color="text.primary" sx={{ textAlign: "center" }}>
                {t(`card_macro_sector_${sector}`)}
              </Typography>
            </CardActionArea>
          ))}
        <Box sx={{ padding: 2, backgroundColor: "#F2F2F2", borderRadius: "8px" }}>
          <Typography variant="body2" color="text.primary">
            {t("card_macro_sector_remarks")}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SectorMacroCard;
