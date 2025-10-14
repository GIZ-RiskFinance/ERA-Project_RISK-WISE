import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Box, Button } from "@mui/material";
import InsightsIcon from "@mui/icons-material/Insights";

import useStore from "../../store";
import { useMacroTools } from "../../utils/macroTools";

const RunPlotMacroButton = () => {
  const { t } = useTranslation();
  const {
    credOutputData,
    selectedMacroCountry,
    selectedMacroScenario,
    selectedMacroSector,
    selectedMacroVariable,
    setActiveViewControl,
  } = useStore();

  const { generateChartFromCREDData } = useMacroTools();

  const [isPlotButtonDisabled, setIsPlotButtonDisabled] = useState(true);

  const isValid = () =>
    selectedMacroCountry && selectedMacroScenario && selectedMacroSector && selectedMacroVariable;

  useEffect(() => {
    setIsPlotButtonDisabled(!isValid());
  }, [selectedMacroCountry, selectedMacroScenario, selectedMacroSector, selectedMacroVariable]);

  const handleRunButton = () => {
    const filters = {
      selectedMacroCountry,
      selectedMacroScenario,
      selectedMacroSector,
      selectedMacroVariable,
    };

    generateChartFromCREDData(credOutputData, filters);
    setActiveViewControl("display_macro_chart");
  };

  return (
    <Box sx={{ textAlign: "center", mt: 2 }}>
      <Button
        disabled={isPlotButtonDisabled}
        onClick={handleRunButton}
        size="medium"
        startIcon={<InsightsIcon />}
        sx={{
          minWidth: "120px",
          bgcolor: "#F79191",
          "&:hover": { bgcolor: "#FFCCCC" },
        }}
        variant="contained"
      >
        {t("run_macro_plot_button")}
      </Button>
    </Box>
  );
};

export default RunPlotMacroButton;
