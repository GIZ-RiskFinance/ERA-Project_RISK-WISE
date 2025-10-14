import { useTranslation } from "react-i18next";

import APIService from "../APIService";
import useStore from "../store";
import { useMapTools } from "../utils/mapTools";

import outputIconTha from "../assets/folder_grey_network_icon_512.png";
import outputIconEgy from "../assets/folder_grey_cloud_icon_512.png";

export const useReportTools = () => {
  const { t } = useTranslation();
  const { copyFolderToTemp } = useMapTools();
  const {
    reports,
    addReport,
    setAlertMessage,
    setAlertSeverity,
    setAlertShowMessage,
    setIsScenarioRunCompleted,
    setSelectedCountry,
    setSelectedHazard,
    setSelectedScenario,
    setSelectedExposureEconomic,
    setSelectedExposureNonEconomic,
    setSelectedTimeHorizon,
    setSelectedAnnualGrowth,
    setIsValidHazard,
    setIsValidExposureEconomic,
    setIsValidExposureNonEconomic,
    setMapTitle,
    setScenarioRunCode,
    setSelectedReport,
  } = useStore.getState();

  const fetchReports = async () => {
    try {
      const response = await APIService.FetchReports();
      const { data, status } = response.result;

      if (status.code === 2000) {
        // Loop through each report and add it to the store if it doesn't already exist
        data.forEach((report) => {
          const existingReport = getReport(report.id);

          if (!existingReport) {
            const reportData = {
              id: report.id,
              scenarioId: report.scenario_id,
              data: `${report.data.country_name} - ${report.data.hazard_type} - ${
                report.data.scenario
              } - ${
                report.data.exposure_economic
                  ? report.data.exposure_economic
                  : report.data.exposure_non_economic
              } - ${report.data.ref_year},${report.data.ref_year} - ${report.data.annual_growth} `,
              params: report.data,
              image:
                report.type === "output_data"
                  ? report.data.country_name === "thailand"
                    ? outputIconTha
                    : outputIconEgy
                  : report.image,
              title: ` ${t(`results_report_card_hazard_${report.data.hazard_type}`)} ${t(
                "results_report_card_title_risk_analysis"
              )} ${t("map_legend_legacy_title_for_suffix")} ${t(
                `results_report_card_country_${report.data.country_name}`
              )} ${t("map_legend_legacy_title_in_suffix")} ${report.data.future_year} (${t(
                `results_report_card_scenario_${report.data.scenario}`
              )}).`,
              type: report.type,
            };
            addReport(reportData);
          }
        });
      } else {
        setAlertMessage(`${"alert_message_report_tools_error_fetch_reports"}: ${status.message}`);
        setAlertSeverity("error");
        setAlertShowMessage(true);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      setAlertMessage(t("alert_message_report_tools_error_fetch_reports"));
      setAlertSeverity("error");
      setAlertShowMessage(true);
    }
  };

  const getReport = (id) => {
    return reports.find((report) => report.id === id) || null;
  };

  const restoreScenario = async (id) => {
    try {
      const reportPath = await window.electron.fetchReportDir();
      const scenario = getReport(id);

      if (!scenario) {
        throw new Error(`Scenario with id ${id} not found.`);
      }

      setSelectedReport(scenario);
      const scenarioParams = scenario.params;

      // Set scenario details
      setScenarioRunCode(id);
      setIsScenarioRunCompleted(true);
      setSelectedCountry(scenarioParams.country_name);
      setSelectedHazard(scenarioParams.hazard_type);
      setIsValidHazard(true);
      setSelectedScenario(scenarioParams.scenario);
      setMapTitle(scenario.title);

      if (scenarioParams.exposure_economic) {
        setSelectedExposureEconomic(scenarioParams.exposure_economic);
        setIsValidExposureEconomic(true);
      } else {
        setSelectedExposureNonEconomic(scenarioParams.exposure_non_economic);
        setIsValidExposureNonEconomic(true);
      }

      setSelectedTimeHorizon([scenarioParams.ref_year, scenarioParams.future_year]);
      setSelectedAnnualGrowth(scenarioParams.annual_growth);

      // Copy folder to temp
      const sourceFolder = `${reportPath}\\${id}`;
      await copyFolderToTemp(sourceFolder);
    } catch (error) {
      console.error("Error restoring scenario:", error);
      setAlertMessage(t("alert_message_report_tools_error_restore_report"));
      setAlertSeverity("error");
    } finally {
      setAlertShowMessage(true);
    }
  };

  const reportExists = (reportId) => {
    return reports.some((r) => r && r.id === reportId);
  };

  return {
    fetchReports,
    restoreScenario,
    reportExists,
    getReport,
  };
};
