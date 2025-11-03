import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Box, Card, CardContent, TextField, Typography } from "@mui/material";
import useStore from "../../store";

const ExposureNonEconomic = () => {
  const {
    isValidExposureNonEconomic,
    selectedExposureEconomic,
    selectedExposureNonEconomic,
    setAlertMessage,
    setAlertSeverity,
    setAlertShowMessage,
    setSelectedCard,
    setSelectedTab,
  } = useStore();
  const { t } = useTranslation();
  const [clicked, setClicked] = useState(false); // State to manage click animation
  const [bgColor, setBgColor] = useState("#CCE1E7"); // State to manage background color

  const handleMouseDown = () => {
    if (selectedExposureEconomic) {
      return;
    }
    setClicked(true); // Trigger animation
  };

  const handleMouseUp = () => {
    if (selectedExposureEconomic) {
      return;
    }
    setClicked(false); // Reset animation
  };

  const handleClick = () => {
    if (selectedExposureEconomic) {
      setAlertMessage(t("alert_message_exposure_non_economic_select_asset"));
      setAlertSeverity("info");
      setAlertShowMessage(true);
      return;
    }
    setSelectedCard("exposureNonEconomic");
    setSelectedTab(0);
  };

  const handleBgColor = () => {
    if (selectedExposureNonEconomic && isValidExposureNonEconomic) {
      setBgColor("#C0E7CF"); //green
    } else if (selectedExposureNonEconomic && !isValidExposureNonEconomic) {
      setBgColor("#FFB3B3"); //red
    } else if (selectedExposureEconomic) {
      setBgColor("#CFCFCF"); //grey
    } else {
      setBgColor("#CCE1E7"); //default light blue
    }
  };

  useEffect(() => {
    handleBgColor();
  }, [isValidExposureNonEconomic, selectedExposureEconomic, selectedExposureNonEconomic]);

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
            {t("input_exposure_non_economic_title")}
          </Typography>
          {selectedExposureNonEconomic && (
            <TextField
              id="exposure-non-economic-textfield"
              fullWidth
              variant="outlined"
              value={t(`input_exposure_non_economic_${selectedExposureNonEconomic}`)}
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

export default ExposureNonEconomic;
