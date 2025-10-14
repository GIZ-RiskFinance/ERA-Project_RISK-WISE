import React from "react";
import { useTranslation } from "react-i18next";

import { Box, Card, CardContent, Slider, Typography } from "@mui/material";
import useStore from "../../store";

const TimeHorizonCard = () => {
  const { setSelectedTimeHorizon } = useStore();
  const { t } = useTranslation();

  // Initial range state
  const [value, setValue] = React.useState([2024, 2050]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSelectedTimeHorizon(newValue);
  };

  return (
    <Card
      sx={{
        maxWidth: 800,
        margin: "auto",
        bgcolor: "#DCEFF2",
        border: "2px solid #3B919D",
        borderRadius: "16px",
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
            marginBottom: "16px",
          }}
        >
          {t("card_timehorizon_title")}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center", // Center children horizontally
            backgroundColor: "#FFCCCC",
            borderRadius: "8px",
            padding: "20px 0",
            marginBottom: "16px",
          }}
        >
          <Typography
            id="timehorizon-slider"
            gutterBottom
            variant="body1"
            component="div"
            textAlign="center"
            color="text.primary"
          >
            {t("card_timehorizon_subtitle")}
          </Typography>
          <Slider
            aria-label="Time horizon selector"
            defaultValue={[2024, 2050]}
            value={value}
            onChange={handleChange}
            valueLabelDisplay="on"
            min={2024}
            max={2075}
            marks={[
              { value: 2024, label: "2024" },
              { value: 2050, label: "2050" },
              { value: 2075, label: "2075" },
            ]}
            sx={{
              color: "#F79191", // Slider track and thumb color
              marginTop: "48px",
              width: "90%", // Adjust width to be less than container to center properly
              "& .MuiSlider-thumb": {
                height: 24,
                width: 24,
                backgroundColor: "#fff",
                border: "2px solid currentColor",
                "&:focus, &:hover, &.Mui-active": {
                  boxShadow: "inherit",
                },
              },
              "& .MuiSlider-valueLabel": {
                color: "black",
                variant: "body2",
                fontWeight: "bold",
                borderRadius: "16px",
                borderColor: "black",
                backgroundColor: "#F79191",
              },
              "& .MuiSlider-track": {
                height: 16,
                borderRadius: 4,
              },
              "& .MuiSlider-rail": {
                color: "#d8d8d8",
                opacity: 1,
                height: 8,
                borderRadius: 4,
              },
            }}
          />
        </Box>
        <Box sx={{ padding: 2, backgroundColor: "#F2F2F2", borderRadius: "8px" }}>
          <Typography variant="body2" color="text.primary">
            {t("card_timehorison_remarks")}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TimeHorizonCard;
