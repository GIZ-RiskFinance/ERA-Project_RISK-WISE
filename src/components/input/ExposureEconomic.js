import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Box, Card, CardContent, TextField, Typography } from "@mui/material";
import useStore from "../../store";

const ExposureEconomic = () => {
  const {
    isValidExposureEconomic,
    setAlertMessage,
    setAlertSeverity,
    setAlertShowMessage,
    setSelectedCard,
    setSelectedTab,
    selectedCountry,
    selectedExposureEconomic,
    selectedExposureNonEconomic,
    selectedHazard,
  } = useStore();
  const { t } = useTranslation();
  const [clicked, setClicked] = useState(false); // State to manage click animation
  const [bgColor, setBgColor] = useState("#CCE1E7"); // State to manage background color

  const handleMouseDown = () => {
    // Deactivate input card click in case non-economic exposure is selected
    if (selectedExposureNonEconomic) {
      return;
    } else if (selectedCountry === "thailand" && selectedHazard === "heatwaves") {
      return;
    } else {
      setClicked(true); // Trigger animation
    }
  };

  const handleMouseUp = () => {
    // Deactivate input card click in case non-economic exposure is selected
    if (selectedExposureNonEconomic) {
      return;
    } else if (selectedCountry === "thailand" && selectedHazard === "heatwaves") {
      return;
    } else {
      setClicked(false); // Reset animation
    }
  };

  const handleClick = () => {
    if (selectedExposureNonEconomic) {
      setAlertMessage(t("alert_message_exposure_economic_select_asset"));
      setAlertSeverity("info");
      setAlertShowMessage(true);
      return;
    } else if (selectedCountry === "thailand" && selectedHazard === "heatwaves") {
      setAlertMessage(t("alert_message_exposure_economic_no_asset"));
      setAlertSeverity("info");
      setAlertShowMessage(true);
      return;
    } else {
      setSelectedCard("exposureEconomic");
      setSelectedTab(0);
    }
  };

  const handleBgColor = () => {
    if (selectedExposureEconomic && isValidExposureEconomic) {
      setBgColor("#C0E7CF"); //green
    } else if (selectedExposureEconomic && !isValidExposureEconomic) {
      setBgColor("#FFB3B3"); //red
    } else if (selectedExposureNonEconomic) {
      setBgColor("#CFCFCF"); //grey
      // Added to handle missing asset datasets for heatwaves in Thailand
    } else if (selectedCountry === "thailand" && selectedHazard === "heatwaves") {
      setBgColor("#CFCFCF"); //grey
    } else {
      setBgColor("#CCE1E7"); //default light blue
    }
  };

  useEffect(() => {
    handleBgColor();
  }, [
    isValidExposureEconomic,
    selectedExposureEconomic,
    selectedCountry,
    selectedExposureNonEconomic,
    selectedHazard,
  ]);

  return (
    <Card
      variant="outlined"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Reset animation when the mouse leaves the card
      onClick={handleClick}
      sx={{
        cursor: "pointer",
        bgcolor: bgColor,
        transition: "background-color 0.3s, transform 0.1s", // Added transform to the transition
        "&:hover": {
          bgcolor: "#DAE7EA",
        },
        ".MuiCardContent-root:last-child": {
          padding: 2,
        },
        transform: clicked ? "scale(0.97)" : "scale(1)", // Apply scale transform when clicked
      }}
    >
      <CardContent>
        <Box>
          <Typography id="exposure-dropdown" gutterBottom variant="h6" component="div" m={0}>
            {t("input_exposure_economic_title")}
          </Typography>
          {selectedExposureEconomic && (
            <TextField
              id="exposure-economic-textfield"
              fullWidth
              variant="outlined"
              value={t(`input_exposure_economic_${selectedExposureEconomic}`)}
              disabled
              InputProps={{
                readOnly: true,
              }}
              sx={{
                ".MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#A6A6A6", // Change the text color for disabled content
                  bgcolor: "#E6E6E6", // Change background for disabled TextField
                  padding: 1,
                },
              }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ExposureEconomic;
