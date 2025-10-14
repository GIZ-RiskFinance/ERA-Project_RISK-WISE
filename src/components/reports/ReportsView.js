import React from "react";
import { useTranslation } from "react-i18next";

import { useReportTools } from "../../utils/reportTools";
import ReportCard from "./ReportCard";
import useStore from "../../store";

import APIService from "../../APIService";

const ReportsView = () => {
  const {
    reports,
    removeReport,
    selectedReport,
    setAlertMessage,
    setAlertSeverity,
    setAlertShowMessage,
    setSelectedScenarioRunCode,
    setSelectedReport,
    updateReports,
  } = useStore();
  const { restoreScenario, getReport } = useReportTools();
  const { t } = useTranslation();

  const onCardClickHandler = (id) => {
    const report = getReport(id);
    setSelectedReport(report);
    setSelectedScenarioRunCode(report.scenarioId);
    // if (report) {
    //   if (selectedReport?.id === id) {
    //     setSelectedReport(null); // Deselect if it's already selected
    //   } else {
    //     setSelectedReport(report); // Select new report
    //   }
    //   setSelectedScenarioRunCode(report.scenarioId);
    // }
  };

  const onRemoveReportHandler = async (report) => {
    const body = { report: report };

    try {
      const response = await APIService.RemoveReport(body);

      // Ensure that the response and status exist
      const message = response?.result?.status?.message || "Failed to remove report";
      const code = response?.result?.status?.code || 5000;

      setAlertMessage(message);
      setAlertSeverity(code === 2000 ? "success" : "error");
      setAlertShowMessage(true);

      // Remove the report from the store only if the response was successful
      if (code === 2000) {
        await removeReport(report.id); // Update store after success
      }
    } catch (error) {
      console.log(error);
      setAlertMessage(t("alert_message_report_view_error_delete"));
      setAlertSeverity("error");
      setAlertShowMessage(true);
    }
  };

  const onActionReportHandler = (id, action) => {
    const index = reports.findIndex((report) => report.id === id);
    if (action === "delete") {
      const filteredReport = reports.filter((report) => report.id === id)[0];

      // Filter out all reports with the same scenarioId
      const updatedReports = reports.filter(
        (report) => report.scenarioId !== filteredReport.scenarioId
      );

      updateReports(updatedReports); // Update the frontend reports

      onRemoveReportHandler(filteredReport);
    } else if (action === "restore") {
      restoreScenario(id);
    } else {
      const lastIndex = reports.length - 1;
      const [movedReport] = reports.splice(index, 1);
      let newIndex;
      if (action === "up") {
        newIndex = index === 0 ? lastIndex : index - 1;
      } else if (action === "down") {
        newIndex = index === lastIndex ? 0 : index + 1;
      }
      const newReportData = [...reports];
      newReportData.splice(newIndex, 0, movedReport);
      updateReports(newReportData);
    }
  };

  return (
    <>
      {reports.map((report) => (
        <ReportCard
          key={report.id}
          data={report.data}
          id={report.id}
          image={report.image}
          isSelected={selectedReport?.id === report.id}
          onCardClick={onCardClickHandler}
          onReportAction={onActionReportHandler}
          title={report.title}
          type={report.type}
        />
      ))}
    </>
  );
};

export default ReportsView;
