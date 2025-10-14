import React from "react";
import { useTranslation } from "react-i18next";

import { Box, Button } from "@mui/material";

import APIService from "../../APIService";
import useStore from "../../store";

const OutputResultsCard = () => {
  const { t } = useTranslation();
  const {
    selectedReport,
    selectedReportType,
    selectedScenarioRunCode,
    setAlertMessage,
    setAlertSeverity,
    setAlertShowMessage,
  } = useStore();

  const handleButtonClick = (type) => {
    const body = {
      exportType: type,
      scenarioRunCode: selectedScenarioRunCode,
      report: selectedReport,
    };
    if (type === "gis") {
      setAlertMessage("GeoJSON data generated successfully.");
      setAlertSeverity("success");
      setAlertShowMessage(true);
    } else {
      APIService.ExportReport(body)
        .then((response) => {
          const { status, data } = response.result;
          const reportPath = data.report_path || "";
          const alertMessage = reportPath ? `${status.message}::${reportPath}` : status.message;

          setAlertMessage(alertMessage);
          setAlertSeverity(status.code === 2000 ? "success" : "error");
          setAlertShowMessage(true);
        })
        .catch((error) => {
          console.log(error);
          setAlertMessage("An error occurred while exporting the report.");
          setAlertSeverity("error");
          setAlertShowMessage(true);
        });
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Button Section container for both sets of buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-around" }}>
          {/* First set of buttons container */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {["pdf", "word"].map((type) => (
              <Button
                key={type}
                variant="contained"
                size="small"
                sx={{
                  marginBottom: 2,
                  bgcolor: "#FFCCCC",
                  transition: "transform 0.1s ease-in-out",
                  "&:active": {
                    transform: "scale(0.96)",
                  },
                  "&:hover": { bgcolor: "#F79191" },
                  textTransform: "none",
                }}
                onClick={() => handleButtonClick(type)}
                disabled={selectedReportType === "output_data" || selectedReportType === ""}
              >
                {t(`results_export_button_${type}`)}
              </Button>
            ))}
          </Box>

          {/* Second set of buttons container */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {["excel", "gis"].map((type) => (
              <Button
                key={type}
                variant="contained"
                size="small"
                sx={{
                  marginBottom: 2,
                  bgcolor: "#FFCCCC",
                  transition: "transform 0.1s ease-in-out",
                  "&:active": {
                    transform: "scale(0.96)",
                  },
                  "&:hover": { bgcolor: "#F79191" },
                  textTransform: "none",
                }}
                onClick={() => handleButtonClick(type)}
                disabled={
                  selectedReportType === "exposure_map_data" ||
                  selectedReportType === "hazard_map_data" ||
                  selectedReportType === "impact_map_data" ||
                  selectedReportType === "risk_plot_data" ||
                  selectedReportType === "adaptation_plot_data" ||
                  selectedReportType === ""
                }
              >
                {t(`results_export_button_${type}`)}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default OutputResultsCard;
