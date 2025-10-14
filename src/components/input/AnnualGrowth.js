import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Box, Card, CardContent, TextField, Typography } from "@mui/material";
import useStore from "../../store";

const AnnualGrowth = () => {
  const {
    selectedAppOption,
    selectedCountry,
    selectedAnnualGrowth,
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
  const [growth, setGrowth] = useState(selectedAnnualGrowth);

  const handleMouseDown = () => {
    // Deactivate input card click in case of ERA project scenario.
    // Time horizon is set to 2050
    if (selectedAppOption === "era") {
      return;
    }
    setClicked(true); // Trigger animation
  };

  const handleMouseUp = () => {
    // Deactivate input card click in case of ERA project scenario.
    // Time horizon is set to 2050
    if (selectedAppOption === "era") {
      return;
    }
    setClicked(false); // Reset animation
  };

  const handleCardClick = () => {
    // Deactivate input card click in case of ERA project scenario.
    // Time horizon is set to 2050
    if (selectedAppOption === "era") {
      setAlertMessage(t("alert_message_annual_growth_fixed_growth"));
      setAlertSeverity("info");
      setAlertShowMessage(true);
      return;
    }
    setSelectedCard("annualGrowth");
    setSelectedTab(0);
  };

  const handleBgColor = () => {
    if (selectedAppOption === "era" && selectedCountry) {
      setBgColor("#C0E7CF"); //green
    } else {
      setBgColor("#CCE1E7"); //default light blue
    }
  };

  useEffect(() => {
    handleBgColor();
    if (selectedAppOption === "era") {
      if (selectedCountry === "thailand") {
        if (selectedExposureEconomic) {
          // Set static population growth of Thailand to +2.94% if
          // economic Exposure type is selected
          setGrowth(2.94);
        } else {
          // Set static GDP growth of Thailand to -0.22% if
          // non-economic Exposure type is selected
          setGrowth(-0.22);
        }
      } else if (selectedCountry === "egypt") {
        if (selectedExposureEconomic) {
          // Set static population growth of Egypt to +4.00%% if
          // economic Exposure type is selected
          setGrowth(4);
        } else {
          // Set static GDP growth of Egypt to +1.29% if
          // non-economic Exposure type is selected
          setGrowth(1.29);
        }
      } else {
        // Reset to defaults or handle other countries as needed
        setGrowth(selectedAnnualGrowth);
      }
    } else {
      // If not "era", use the provided props values
      setGrowth(selectedAnnualGrowth);
    }
  }, [
    selectedAppOption,
    selectedCountry,
    selectedAnnualGrowth,
    selectedExposureEconomic,
    selectedExposureNonEconomic,
  ]);

  return (
    <Card
      variant="outlined"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Reset animation when the mouse leaves the card
      onClick={handleCardClick}
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
        {/* Default section if no exposure is selected*/}
        {!selectedExposureEconomic && !selectedExposureNonEconomic && (
          <Box>
            <Typography id="annual-growth-slider" gutterBottom variant="h6" component="div" m={0}>
              {t("input_annual_growth_title")}
            </Typography>
          </Box>
        )}

        {/* Annual GDP growth section */}
        {selectedExposureEconomic && (
          <Box>
            <Typography
              id="annual-growth-gdp-slider"
              gutterBottom
              variant="h6"
              component="div"
              m={0}
            >
              {selectedExposureEconomic
                ? t("input_annual_gdp_growth_title")
                : t("input_annual_population_growth_title")}
            </Typography>
            <TextField
              id="annual-growth-gdp-textfield"
              fullWidth
              variant="outlined"
              value={`${growth}%`}
              disabled
              aria-readonly={true}
              sx={{
                ".MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#A6A6A6", // Text color for disabled content
                  bgcolor: "#E6E6E6", // Background for disabled TextField
                  padding: 1,
                },
              }}
            />
          </Box>
        )}

        {/* Annual Population growth section */}
        {selectedExposureNonEconomic && (
          <Box>
            <Typography
              id="annual-growth-population-slider"
              gutterBottom
              variant="h6"
              component="div"
            >
              {t("input_annual_population_growth_title")}
            </Typography>
            <TextField
              id="annual-growth-population-textfield"
              fullWidth
              variant="outlined"
              value={`${growth}%`}
              disabled
              aria-readonly={true}
              sx={{
                ".MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#A6A6A6", // Text color for disabled content
                  bgcolor: "#E6E6E6", // Background for disabled TextField
                  padding: 1,
                },
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AnnualGrowth;
