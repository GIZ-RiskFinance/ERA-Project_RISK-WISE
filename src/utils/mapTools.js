import { useTranslation } from "react-i18next";

import L from "leaflet";
import "leaflet-simple-map-screenshoter";

import useStore from "../store";
import APIService from "../APIService";

export const useMapTools = () => {
  const { t } = useTranslation();
  const {
    activeMap,
    activeMapRef,
    activeViewControl,
    addReport,
    isScenarioRunCompleted,
    reports,
    scenarioRunCode,
    setAlertMessage,
    setAlertSeverity,
    setAlertShowMessage,
    selectedAnnualGrowth,
    selectedCountry,
    selectedExposureEconomic,
    selectedExposureNonEconomic,
    selectedHazard,
    selectedReport,
    selectedScenario,
    selectedSubTab,
    selectedTimeHorizon,
  } = useStore();

  const takeScreenshot = (map, filePath) => {
    return new Promise((resolve, reject) => {
      const screenshoter = L.simpleMapScreenshoter().addTo(map);
      screenshoter
        .takeScreen("blob")
        .then((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result.split(",")[1];
            window.electron.saveScreenshot(base64data, filePath);
          };
          reader.readAsDataURL(blob);
        })
        .catch((e) => {
          console.error(e);
          reject(e); // Reject the promise if an error occurs
        });

      // Listen for the save screenshot response
      window.electron.onSaveScreenshotReply((event, { success, error, filePath }) => {
        if (success) {
          setAlertMessage(`${t("alert_message_successful_screenshot")}::${filePath}`);
          setAlertSeverity("success");
          setAlertShowMessage(true);
          resolve(filePath); // Resolve the promise with the file path on success
        } else {
          setAlertMessage(`${t("alert_message_error_screenshot")}: ${error}`);
          setAlertSeverity("error");
          setAlertShowMessage(true);
          reject(new Error(error)); // Reject the promise on error
        }
      });
    });
  };

  const handleAddToOutput = () => {
    const isReportExisting = reportExists(selectedReport?.id);
    // New scenario run
    if (isScenarioRunCompleted && !selectedReport) {
      APIService.AddToOutput(scenarioRunCode)
        .then((response) => {
          setAlertMessage(response.result.status.message);
          if (response.result.status.code === 2000) {
            setAlertSeverity("success");
          } else {
            setAlertSeverity("error");
          }
          setAlertShowMessage(true);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    // Restored scenario (already exists)
    if (selectedReport && isReportExisting) {
      setAlertMessage(t("alert_message_report_available"));
      setAlertSeverity("info");
      setAlertShowMessage(true);
    }
    // Not selected restored scenario and no new scenario run
    if (!selectedReport && !isScenarioRunCompleted) {
      setAlertMessage(t("alert_message_select_report"));
      setAlertSeverity("error");
      setAlertShowMessage(true);
    }
  };

  const handleAddData = () => {
    if (isScenarioRunCompleted) {
      APIService.AddToOutput(scenarioRunCode);
    }
  };

  const getSaveMapTitle = () => {
    let title = "";
    if (activeMap === "hazard") {
      title = `${t(`results_report_card_hazard_type_${activeMap}`)} ${t(
        "map_legend_legacy_title_map_suffix"
      )} ${t("map_legend_legacy_title_of_suffix")} ${t(
        `results_report_card_hazard_${selectedHazard}`
      )} ${t("map_legend_legacy_title_in_suffix")} ${t(
        `results_report_card_country_${selectedCountry}`
      )}`;
    } else if (activeMap === "exposure") {
      title = `${t(`results_report_card_hazard_type_${activeMap}`)} ${t(
        "map_legend_legacy_title_map_suffix"
      )} ${t("map_legend_legacy_title_of_suffix")} ${
        selectedExposureEconomic
          ? t(`results_report_card_exposure_${selectedExposureEconomic}`)
          : t(`results_report_card_exposure_${selectedExposureNonEconomic}`)
      } ${t("map_legend_legacy_title_in_suffix")} ${t(
        `results_report_card_country_${selectedCountry}`
      )}`;
    } else {
      title = `${t(`results_report_card_hazard_type_${activeMap}`)} ${t(
        "map_legend_legacy_title_map_suffix"
      )} ${t("map_legend_legacy_title_of_suffix")} ${t(
        `results_report_card_hazard_${selectedHazard}`
      )} ${t("map_legend_legacy_title_on_suffix")} ${
        selectedExposureEconomic
          ? t(`results_report_card_exposure_${selectedExposureEconomic}`)
          : t(`results_report_card_exposure_${selectedExposureNonEconomic}`)
      } ${t("map_legend_legacy_title_in_suffix")} ${t(
        `results_report_card_country_${selectedCountry}`
      )}`;
    }

    return title;
  };

  const handleSaveMap = async () => {
    const reportPath = await window.electron.fetchReportDir();

    if (!selectedReport) {
      setAlertMessage(t("alert_message_select_report"));
      setAlertSeverity("error");
      setAlertShowMessage(true);
    }
    if (isScenarioRunCompleted || selectedReport) {
      const id = new Date().getTime().toString();
      const filepath = `${reportPath}\\${scenarioRunCode}\\snapshot_${activeMap}_map_data_${id}.png`;
      takeScreenshot(activeMapRef, filepath)
        .then(() => {
          handleAddData();
        })
        .then(() => {
          const outputData = {
            id: id,
            scenarioId: `${scenarioRunCode}`,
            data: `${selectedCountry} - ${selectedHazard} - ${selectedScenario} - ${
              selectedExposureEconomic ? selectedExposureEconomic : selectedExposureNonEconomic
            } - ${selectedTimeHorizon} - ${selectedAnnualGrowth}`,
            image: filepath,
            title: getSaveMapTitle(),
            type: `${activeMap}_map_data`,
          };
          addReport(outputData);
        })
        .catch((error) => {
          console.error("Error in taking screenshot or saving it:", error);
        });
    }
  };

  const copyFolderToTemp = (sourceFolder) => {
    return new Promise((resolve, reject) => {
      // Get the temp folder path first
      window.electron.fetchTempDir().then((tempFolder) => {
        const destinationFolder = `${tempFolder}`;

        // Invoke folder copy
        window.electron.copyFolder(sourceFolder, destinationFolder);

        // Listen for the response
        window.electron.onCopyFolderReply((event, { success, error, destinationFolder }) => {
          if (success) {
            resolve(destinationFolder); // Resolve the promise on success
          } else {
            reject(new Error(error)); // Reject the promise on error
          }
        });
      });
    });
  };

  const copyFileToReports = (sourcePath, destinationPath) => {
    return new Promise((resolve, reject) => {
      window.electron.copyFile(sourcePath, destinationPath);

      // Listen for the copy file response
      window.electron.onCopyFileReply((event, { success, error, destinationPath }) => {
        if (success) {
          setAlertMessage(t("alert_message_successful_copy_file"));
          setAlertSeverity("success");
          setAlertShowMessage(true);
          resolve(destinationPath); // Resolve the promise with the destination path on success
        } else {
          setAlertMessage(`${t("alert_message_error_copy_file")}: ${error}`);
          setAlertSeverity("error");
          setAlertShowMessage(true);
          reject(new Error(error)); // Reject the promise on error
        }
      });
    });
  };

  const reportExists = (reportId) => {
    return reports.some((r) => r && r.id === reportId);
  };

  const handleSaveImage = async () => {
    const tempPath = await window.electron.fetchTempDir();
    const reportPath = await window.electron.fetchReportDir();

    if (!selectedReport) {
      setAlertMessage(t("alert_message_select_report"));
      setAlertSeverity("error");
      setAlertShowMessage(true);
    }

    // Checks if the scenario has finished running, the selected sub tab is Risk
    // and the selected view control is the display chart
    if (
      (isScenarioRunCompleted || selectedReport) &&
      activeViewControl === "display_chart" &&
      selectedSubTab === 0
    ) {
      const id = new Date().getTime().toString();
      const sourceFile = `${tempPath}\\risks_waterfall_plot.png`;
      const destinationFile = `${reportPath}\\${scenarioRunCode}\\snapshot_risk_plot_data_${id}.png`;

      copyFileToReports(sourceFile, destinationFile)
        .then(() => {
          handleAddData();
        })
        .then(() => {
          const outputData = {
            id: id,
            scenarioId: `${scenarioRunCode}`,
            data: `${selectedCountry} - ${selectedHazard} - ${selectedScenario} - ${
              selectedExposureEconomic ? selectedExposureEconomic : selectedExposureNonEconomic
            } - ${selectedTimeHorizon} - ${selectedAnnualGrowth}`,
            image: destinationFile,
            title: `${t("results_report_card_risk_plot_title")} ${t(
              `results_report_card_hazard_${selectedHazard}`
            )}${t("map_legend_legacy_title_on_suffix")} ${
              selectedExposureEconomic
                ? t(`results_report_card_exposure_${selectedExposureEconomic}`)
                : t(`results_report_card_exposure_${selectedExposureNonEconomic}`)
            } - ${t(`results_report_card_country_${selectedCountry}`)}`,
            type: "risk_plot_data",
          };
          addReport(outputData);
        })
        .catch((error) => {
          console.error("Error while trying to save the Risk plot. More info:", error);
        });
    }

    // Checks if the scenario has finished running, the selected sub tab is Adaptation
    // and the selected view control is the display chart
    if (
      (isScenarioRunCompleted || selectedReport) &&
      activeViewControl === "display_chart" &&
      selectedSubTab === 1
    ) {
      const id = new Date().getTime().toString();
      const sourceFile = `${tempPath}\\cost_benefit_plot.png`;
      const destinationFile = `${reportPath}\\${scenarioRunCode}\\snapshot_adaptation_plot_data_${id}.png`;

      copyFileToReports(sourceFile, destinationFile)
        .then(() => {
          const outputData = {
            id: id,
            scenarioId: `${scenarioRunCode}`,
            data: `${selectedCountry} - ${selectedHazard} - ${selectedScenario} - ${
              selectedExposureEconomic ? selectedExposureEconomic : selectedExposureNonEconomic
            } - ${selectedTimeHorizon} - ${selectedAnnualGrowth}`,
            image: destinationFile,
            title: `${t("results_report_card_adaptation_plot_title")} ${t(
              `results_report_card_hazard_${selectedHazard}`
            )} - ${t(`results_report_card_country_${selectedCountry}`)}`,
            type: "adaptation_plot_data",
          };
          addReport(outputData);
        })
        .catch((error) => {
          console.error(
            "Error while trying to save the Adaptation measures plot. More info:",
            error
          );
        });
    }
  };

  return {
    copyFolderToTemp,
    handleAddToOutput,
    handleSaveImage,
    handleSaveMap,
  };
};
