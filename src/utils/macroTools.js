import { useTranslation } from "react-i18next";

import APIService from "../APIService";

import useStore from "../store";

export const useMacroTools = () => {
  const { t } = useTranslation();
  const {
    setAlertMessage,
    setAlertSeverity,
    setAlertShowMessage,
    setCredOutputData,
    setMacroEconomicChartData,
    setMacroEconomicChartTitle,
  } = useStore.getState();

  const loadCREDOutputData = () => {
    APIService.FetchCREDOutputData()
      .then((response) => {
        setAlertMessage(response.result.status.message);
        response.result.status.code === 2000
          ? setAlertSeverity("success")
          : setAlertSeverity("error");
        setCredOutputData(response.result.data);
      })
      .catch((error) => {
        setAlertShowMessage(true);
        console.log(error);
      });
  };

  const generateChartFromCREDData = (credOutputData, filters) => {
    const {
      selectedMacroCountry,
      selectedMacroScenario,
      selectedMacroSector,
      selectedMacroVariable,
    } = filters;

    try {
      // Filter data based on selected filters
      const filteredData = credOutputData.filter(
        (row) =>
          row.country === selectedMacroCountry &&
          row.scenario === selectedMacroScenario &&
          row.economic_sector === selectedMacroSector &&
          row.economic_indicator === selectedMacroVariable
      );

      if (filteredData.length === 0) {
        throw new Error("No data available for the selected filters.");
      }

      // Group data by adaptation value
      const groupedData = filteredData.reduce((acc, row) => {
        const adaptationLabel =
          row.adpatation === null || row.adpatation === "None"
            ? "Without adaptation"
            : `${row.adpatation * 100}% Adaptation`;

        if (!acc[adaptationLabel]) {
          acc[adaptationLabel] = { years: [], values: [] };
        }
        acc[adaptationLabel].years.push(row.year);
        acc[adaptationLabel].values.push(row.proportion_change_from_baseline);

        return acc;
      }, {});

      // Create datasets for the chart
      const datasets = Object.keys(groupedData).map((label) => ({
        label,
        data: groupedData[label].values,
        borderColor: label.includes("Without") ? "rgba(255, 99, 132, 1)" : "rgba(75, 192, 192, 1)",
        backgroundColor: label.includes("Without")
          ? "rgba(255, 99, 132, 0.2)"
          : "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      }));

      const chartData = {
        labels: [...new Set(filteredData.map((row) => row.year))],
        datasets,
      };

      const chartTitle = `${t(`input_macro_variable_${selectedMacroVariable}`)} - ${t(
        `input_macro_sector_${selectedMacroSector}`
      )}`;

      // Update the Zustand store
      setMacroEconomicChartData(chartData);
      setMacroEconomicChartTitle(chartTitle);

      setAlertMessage("Chart generated successfully.");
      setAlertSeverity("success");
      setAlertShowMessage(true);
    } catch (error) {
      setAlertMessage(error.message || "Error generating chart.");
      setAlertSeverity("error");
      setAlertShowMessage(true);
      console.error(error);
    }
  };

  return {
    loadCREDOutputData,
    generateChartFromCREDData,
  };
};
