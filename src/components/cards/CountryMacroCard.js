import React from "react";
import { useTranslation } from "react-i18next";

import { Box, Card, CardActionArea, Typography, CardContent } from "@mui/material";
import useStore from "../../store";

const countries = ["egypt", "thailand"];

const CountryMacroCard = () => {
  const { t } = useTranslation();
  const { selectedMacroCountry, setSelectedMacroCountry } = useStore();

  const handleSelect = async (country) => {
    if (selectedMacroCountry === country) {
      setSelectedMacroCountry(""); // Deselect if already selected
    } else {
      setSelectedMacroCountry(country);
    }
    // Clear the temp directory to reset maps
    await window.electron.clearTempDir();
  };

  const isButtonSelected = (country) => selectedMacroCountry === country;

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
          }}
        >
          {t("card_country_title")}
        </Typography>
        {/* Flex container for buttons, make sure it's not wrapping and it's filling the width */}
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
          {countries.map((country) => (
            <CardActionArea
              key={country}
              onClick={() => handleSelect(country)}
              sx={{
                backgroundColor: isButtonSelected(country) ? "#F79191" : "#FFCCCC",
                flexGrow: 1,
                borderRadius: "8px",
                marginLeft: 0,
                marginRight: 0,
                textAlign: "center",
                padding: "8px 0",
                margin: "8px", // Keep some space between the buttons
                "&:first-of-type": {
                  marginLeft: 0, // Remove left margin for the first button
                },
                "&:last-of-type": {
                  marginRight: 0, // Remove right margin for the last button
                },
                transition: "transform 0.1s ease-in-out", // Add transition for transform
                "&:active": {
                  transform: "scale(0.96)", // Slightly scale down when clicked
                },
              }}
            >
              <Typography variant="body1" color="text.primary">
                {t(`card_country_${country}`)}
              </Typography>
            </CardActionArea>
          ))}
        </Box>
        <Box sx={{ padding: 2, backgroundColor: "#F2F2F2", borderRadius: "8px" }}>
          <Typography variant="body2" color="text.primary">
            {t("card_country_macro_remarks")}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CountryMacroCard;
