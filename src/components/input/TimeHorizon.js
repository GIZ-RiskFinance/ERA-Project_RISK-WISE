import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Box, Card, CardContent, TextField, Typography } from "@mui/material";

import useStore from "../../store";

const TimeHorizon = () => {
  const {
    selectedAppOption,
    selectedCountry,
    selectedTimeHorizon,
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

  const handleClick = () => {
    // Deactivate input card click in case of ERA project scenario.
    // Time horizon is set to 2050
    if (selectedAppOption === "era") {
      setAlertMessage(t("alert_message_time_horizon_fixed_time"));
      setAlertSeverity("info");
      setAlertShowMessage(true);
      return;
    }
    setSelectedCard("timeHorizon");
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
  }, [selectedAppOption, selectedCountry]);

  return (
    <Box>
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
            <Typography id="time-horizon-dropdown" gutterBottom variant="h6" component="div" m={0}>
              {t("time_horizon_title")}
            </Typography>
            {selectedTimeHorizon && (
              <TextField
                id="timeHorizon"
                fullWidth
                variant="outlined"
                value={`${selectedTimeHorizon[0]} - ${selectedTimeHorizon[1]}`}
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
    </Box>
  );
};

export default TimeHorizon;
