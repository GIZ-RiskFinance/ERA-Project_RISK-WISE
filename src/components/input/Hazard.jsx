import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Box, Card, CardContent, TextField, Typography } from "@mui/material";
import useStore from "../../store";

const Hazard = () => {
  const { isValidHazard, selectedHazard, setSelectedCard, setSelectedTab } = useStore();
  const { t } = useTranslation();
  const [clicked, setClicked] = useState(false); // State to manage click animation
  const [bgColor, setBgColor] = useState("#CCE1E7"); // State to manage background color

  const handleMouseDown = () => {
    setClicked(true); // Trigger animation
  };

  const handleMouseUp = () => {
    setClicked(false); // Reset animation
  };

  const handleClick = () => {
    setSelectedCard("hazard");
    setSelectedTab(0);
  };

  const handleBgColor = () => {
    if (selectedHazard && isValidHazard) {
      setBgColor("#C0E7CF"); //green
    } else if (selectedHazard && !isValidHazard) {
      setBgColor("#FFB3B3"); //red
    } else {
      setBgColor("#CCE1E7"); //default light blue
    }
  };

  useEffect(() => {
    handleBgColor();
  }, [selectedHazard, isValidHazard]);

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
          <Typography id="hazard-dropdown" gutterBottom variant="h6" component="div" m={0}>
            {t("hazard_title")}
          </Typography>
          {selectedHazard && (
            <TextField
              id="hazard"
              fullWidth
              variant="outlined"
              value={t(`input_hazard_${selectedHazard}`)}
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

export default Hazard;
