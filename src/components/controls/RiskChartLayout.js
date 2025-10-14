import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Paper, Typography, Box } from "@mui/material";

const RiskChartLayout = () => {
  const { t } = useTranslation();
  const [riskChartUrl, setRiskChartUrl] = useState(null);

  const fetchRiskChart = async () => {
    try {
      const tempPath = await window.electron.fetchTempDir();
      const response = await fetch(`${tempPath}/risks_waterfall_plot.png`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Assuming the image is accessible via URL directly after fetching
      setRiskChartUrl(`${tempPath}/risks_waterfall_plot.png`);
    } catch (error) {
      console.error("Error fetching risk chart data:", error);
      setRiskChartUrl(null);
    }
  };

  useEffect(() => {
    fetchRiskChart();
  }, []); // Fetch the risk chart when the component mounts

  return (
    <div style={{ height: "80%", display: "flex", flexDirection: "column" }}>
      <Paper
        elevation={3}
        style={{
          flex: 1,
          borderRadius: "15px",
          marginBottom: "16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Box textAlign="center" p={3} style={{ width: "100%", height: "100%" }}>
          {riskChartUrl ? (
            <img
              src={riskChartUrl}
              alt="Risk Chart"
              style={{
                maxWidth: "80%",
                maxHeight: "80%",
                objectFit: "contain",
                objectPosition: "center center",
              }}
            />
          ) : (
            <Typography variant="body1">
              {t("economic_non_economic_risk_display_chart_loading_error")}
            </Typography>
          )}
        </Box>
      </Paper>
    </div>
  );
};

export default RiskChartLayout;
