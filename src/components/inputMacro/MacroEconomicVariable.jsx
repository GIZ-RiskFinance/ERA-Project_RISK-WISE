import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Box, Card, CardContent, TextField, Typography } from "@mui/material";
import useStore from "../../store";

const MacroEconomicVariable = () => {
  const { setSelectedMacroCard, setActiveViewControl, selectedMacroVariable } = useStore();
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
    setSelectedMacroCard("macroVariable");
    setActiveViewControl("display_macro_parameters")
  };

  const handleBgColor = () => {
    if (selectedMacroVariable) {
      setBgColor("#C0E7CF"); // green
    } else {
      setBgColor("#CCE1E7"); // default light blue
    }
  };

  useEffect(() => {
    handleBgColor();
  }, [selectedMacroVariable]);

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
          <Typography id="macro-variable-title" gutterBottom variant="h6" component="div" m={0}>
            {t("input_macro_economic_variable_title")}
          </Typography>
          {selectedMacroVariable && (
            <TextField
              id="macro-variable-textfield"
              fullWidth
              variant="outlined"
              value={t(`input_macro_variable_${selectedMacroVariable}`)}
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

export default MacroEconomicVariable;
