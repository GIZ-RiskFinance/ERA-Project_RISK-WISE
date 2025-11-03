import React from "react";
import { useTranslation } from "react-i18next";

import { Box, Card, CardActionArea, Typography, CardContent } from "@mui/material";
import useStore from "../../store";

const ScenarioMacroCard = () => {
  const { selectedMacroScenario, setSelectedMacroScenario } = useStore();
  const { t } = useTranslation();

  const scenarios = ["historical", "rcp26_rcp45", "rcp85"];

  const handleCardSelect = (scenario) => {
    if (selectedMacroScenario === scenario) {
      setSelectedMacroScenario(""); // Deselect if already selected
    } else {
      setSelectedMacroScenario(scenario);
    }
  };

  const isButtonSelected = (scenario) => selectedMacroScenario === scenario;

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
          {t("card_scenario_title")}
        </Typography>
        {scenarios.map((scenario) => (
          <CardActionArea
            key={scenario}
            onClick={() => handleCardSelect(scenario)}
            sx={{
              backgroundColor: isButtonSelected(scenario) ? "#F79191" : "#FFCCCC",
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
              {t(`card_scenario_scenarios_${scenario}`)}
            </Typography>
          </CardActionArea>
        ))}
        <Box sx={{ padding: 2, backgroundColor: "#F2F2F2", borderRadius: "8px" }}>
          <Typography variant="body2" color="text.primary">
            {t("card_scenario_remarks")}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ScenarioMacroCard;
