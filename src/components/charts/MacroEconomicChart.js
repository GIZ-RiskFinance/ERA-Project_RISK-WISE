import React from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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

  // Build sorted year labels
  const labels =
    filteredData.length > 0
      ? [...new Set(filteredData.map((row) => row.year))].sort((a, b) => a - b)
      : [];

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

    const label =
      key === "None"
        ? t("macro_display_chart_no_adaptation")
        : `${(parseFloat(key) * 100).toFixed(2)}% ${t("macro_display_chart_adaptation")}`;

    return {
      label,
      // change proportions to percent values for display
      data: groupedData[key].values.map((v) => v * 100),
      borderColor,
      backgroundColor,
      fill: true,
      tension: 0.4,
    };
  });

  const transformedData = {
    labels,
    datasets,
  };

  const options = {
    scales: {
      x: {
        type: "category",
        title: {
          display: true,
          text: t("macro_display_chart_x_axis_label"),
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: t("macro_display_chart_y_axis_label"),
        },
        ticks: {
          callback: (val) => `${Number(val).toFixed(2)}%`,
        },
      },
    },
    plugins: {
      legend: { display: true },
      title: { display: true, text: macroEconomicChartTitle },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const y = ctx.parsed.y;
            return `${ctx.dataset.label}: ${y.toFixed(2)}%`;
          },
        },
      },
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
              {t("macro_display_chart_not_available")}
            </Typography>
          )}
        </div>
      </Box>
    </Box>
  );
};

export default MacroEconomicChart;
