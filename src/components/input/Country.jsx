import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Box, Card, CardContent, Typography, TextField } from "@mui/material";
import useStore from "../../store";

const Country = () => {
  const { selectedCountry, setSelectedCard, setSelectedTab } = useStore();
  const { t } = useTranslation();
  const [clicked, setClicked] = useState(false); // State to manage click animation
  const [bgcolor, setBgcolor] = useState("#CCE1E7"); // State to manage background color

  const handleMouseDown = () => {
    setClicked(true); // Trigger animation
  };

  const handleMouseUp = () => {
    setClicked(false); // Reset animation
  };

  const handleClick = () => {
    setSelectedCard("country");
    setSelectedTab(0);
  };

  const handleBgColor = () => {
    if (selectedCountry) {
      setBgcolor("#C0E7CF"); // green
    } else {
      setBgcolor("#CCE1E7"); // default light blue
    }
  };

  useEffect(() => {
    handleBgColor();
  }, [selectedCountry]);

  return (
    <Card
      variant="outlined"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Reset animation when the mouse leaves the card
      onClick={handleClick}
      sx={{
        cursor: "pointer",
        bgcolor: bgcolor,
        transition: "background-color 0.3s, transform 0.1s", // Added transform to the transition
        "&:hover": {
          bgcolor: "#DAE9ED", // Change to #DAE7EA
        },
        ".MuiCardContent-root:last-child": {
          padding: 2,
        },
        transform: clicked ? "scale(0.97)" : "scale(1)", // Apply scale transform when clicked
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box>
          <Typography id="country-label" gutterBottom variant="h6" component="div" m={0}>
            {t("country")}
          </Typography>
          {selectedCountry && (
            <TextField
              id="country"
              fullWidth
              variant="outlined"
              value={t(`input_country_${selectedCountry}`)}
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

export default Country;
