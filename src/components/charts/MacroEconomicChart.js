import React from "react";
import { Box, Typography } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";

import useStore from "../../store";

// Register all necessary elements
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MacroEconomicChart = () => {
  const {
    credOutputData,
    selectedMacroCountry,
    selectedMacroScenario,
    selectedMacroSector,
    selectedMacroVariable,
    macroEconomicChartTitle,
  } = useStore();

  // Filter data based on selected filters
  const filteredData = credOutputData.filter(
    (row) =>
      row.country === selectedMacroCountry &&
      row.scenario === selectedMacroScenario &&
      row.economic_sector === selectedMacroSector &&
      row.economic_indicator === selectedMacroVariable
  );

  // Group data by adaptation value
  const groupedData = filteredData.reduce((acc, row) => {
    const adaptationKey = row.adpatation === 0 ? "None" : row.adpatation;

    if (!acc[adaptationKey]) {
      acc[adaptationKey] = { years: [], values: [] };
    }
    acc[adaptationKey].years.push(row.year);
    acc[adaptationKey].values.push(row.proportion_change_from_baseline);

    return acc;
  }, {});

  const datasets = Object.keys(groupedData).map((key) => {
    let borderColor;
    let backgroundColor;

    if (key === "None") {
      // No adaptation
      borderColor = "rgba(255, 99, 132, 1)"; // Red
      backgroundColor = "rgba(255, 99, 132, 0.2)";
    } else if (key === "0.25") {
      // 25% Adaptation
      borderColor = "rgba(255, 206, 86, 1)"; // Yellow
      backgroundColor = "rgba(255, 206, 86, 0.2)";
    } else if (key === "0.33") {
      // 33% Adaptation
      borderColor = "rgba(54, 162, 235, 1)"; // Blue
      backgroundColor = "rgba(54, 162, 235, 0.2)";
    } else if (key === "0.5") {
      // 50% Adaptation
      borderColor = "rgba(255, 159, 64, 1)"; // Orange
      backgroundColor = "rgba(255, 159, 64, 0.2)";
    } else if (key === "0.67") {
      // 67% Adaptation
      borderColor = "rgba(75, 192, 192, 1)"; // Green
      backgroundColor = "rgba(75, 192, 192, 0.2)";
    } else {
      // Fallback for unexpected adaptation values
      borderColor = "rgba(153, 102, 255, 1)"; // Purple
      backgroundColor = "rgba(153, 102, 255, 0.2)";
    }

    const label = key === "None" ? "Without adaptation" : `${key * 100}% Adaptation`;

    return {
      label,
      data: groupedData[key].values,
      borderColor,
      backgroundColor,
      fill: true,
      tension: 0.4,
    };
  });

  const transformedData = {
    labels: filteredData.length > 0 ? [...new Set(filteredData.map((row) => row.year))] : [],
    datasets,
  };

  const options = {
    scales: {
      x: { type: "category" },
      y: { beginAtZero: true },
    },
    plugins: {
      legend: { display: true },
      title: { display: true, text: macroEconomicChartTitle },
    },
  };

  return (
    <Box
      sx={{
        margin: "auto",
        bgcolor: "#DCEFF2",
        border: "2px solid #3B919D",
        borderRadius: "16px",
        padding: "16px",
        marginBottom: "16px",
        overflow: "hidden",
      }}
    >
      <Box sx={{ height: "100%", overflowY: "auto" }}>
        <div>
          {filteredData.length > 0 ? (
            <Line data={transformedData} options={options} />
          ) : (
            <Typography variant="h6" align="center" color="textSecondary">
              No data available for the selected filters
            </Typography>
          )}
        </div>
      </Box>
    </Box>
  );
};

export default MacroEconomicChart;
