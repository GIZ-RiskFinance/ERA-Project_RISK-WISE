"""
Module for exporting reports based on scenario data.

This module provides functionality to generate Excel reports from scenario metadata. It validates
requests, gathers necessary data, and uses the ReportHandler class to generate and export reports.

Classes:

RunExportReport:
    Handles the process of exporting reports based on the provided request data.

Methods:

run_export_report:
    Entry point for generating and exporting Excel reports.
"""

import json
import sys
from time import time

from base_handler import BaseHandler
from hazard.hazard_handler import HazardHandler
from logger_config import LoggerConfig
from report.report_handler import ReportHandler, ReportParameters


class RunExportReport:
    """
    Class for handling the export of reports based on scenario data.

    This class provides functionality to validate the request, gather scenario metadata,
    and generate an Excel report using the ReportHandler class.
    """

    def __init__(self, request):
        """
        Initialize the RunExportReport instance.

        This initializes the necessary handler instances and stores the request data.

        :param request: The request data containing export parameters.
        :type request: dict
        """
        self.base_handler = BaseHandler()
        self.hazard_handler = HazardHandler()
        self.logger = LoggerConfig(logger_types=["file"])
        self.request = request

    def run_export_report(self) -> dict:
        """
        Run the process to export an Excel report based on the scenario data.

        This method validates the request, gathers scenario metadata, and generates
        an Excel report. It handles any errors that occur during the process.

        :return: A dictionary containing the response data and status.
        :rtype: dict
        """
        initial_time = time()

        try:
            # Validate the request
            if not self.valid_request():
                run_status_message = "Invalid request: Missing required fields"
                status_code = 3000
                self.logger.log("error", run_status_message)
                response = {
                    "data": {"report_path": ""},
                    "status": {"code": status_code, "message": run_status_message},
                }
                return response

            # Extract necessary information from the request
            export_type = self.request.get("exportType", "")
            scenario_code = self.request.get("scenarioRunCode", "")
            report = self.request.get("report")
            report_type = report.get("type")
            report_id = report.get("id")

            status_code = 2000
            self.base_handler.update_progress(20, "Setting up report parameters...")

            # Gather scenario metadata
            scenario_metadata = self.base_handler.get_scenario_metadata(scenario_code)
            report_parameters = ReportParameters(
                country_code=self.base_handler.get_iso3_country_code(
                    scenario_metadata.get("country_name")
                ),
                country_name=scenario_metadata.get("country_name"),
                hazard=scenario_metadata.get("hazard_type"),
                hazard_code=self.hazard_handler.get_hazard_code(
                    scenario_metadata.get("hazard_type")
                ),
                scenario=scenario_metadata.get("scenario"),
                scenario_id=scenario_code,
                time_horizon=f"{scenario_metadata.get('ref_year')} - {scenario_metadata.get('future_year')}",
                exposure_economic=scenario_metadata.get("exposure_economic"),
                exposure_non_economic=scenario_metadata.get("exposure_non_economic"),
                annual_population_growth=(
                    scenario_metadata.get("annual_growth")
                    if scenario_metadata.get("exposure_economic")
                    else None
                ),
                annual_gdp_growth=(
                    scenario_metadata.get("annual_growth")
                    if scenario_metadata.get("exposure_non_economic")
                    else None
                ),
            )
            if export_type == "excel":
                self.base_handler.update_progress(30, "Generating excel report...")

                # Generate the report
                report_handler = ReportHandler(report_parameters)
                report_filepath = report_handler.get_report_file_path(export_type)
                report_handler.generate_excel_report()

                run_status_message = "Generated excel report successfully."
                response = {
                    "data": {"report_path": str(report_filepath)},
                    "status": {"code": status_code, "message": run_status_message},
                }
            elif export_type == "word":
                self.base_handler.update_progress(30, "Generating word report...")
                # Generate the report
                report_handler = ReportHandler(report_parameters)
                report_filepath = report_handler.get_report_file_path(export_type, report_type)
                report_handler.generate_word_report(report_type, scenario_code, report_id)

                run_status_message = "Generated word report successfully."
                response = {
                    "data": {"report_path": str(report_filepath)},
                    "status": {"code": status_code, "message": run_status_message},
                }
            elif export_type == "pdf":
                self.base_handler.update_progress(30, "Generating PDF report...")
                # Generate the report
                report_handler = ReportHandler(report_parameters)
                report_filepath = report_handler.get_report_file_path(export_type, report_type)
                report_handler.generate_pdf_report(report_type, scenario_code, report_id)

                run_status_message = "Generated PDF report successfully."
                response = {
                    "data": {"report_path": str(report_filepath)},
                    "status": {"code": status_code, "message": run_status_message},
                }

            self.base_handler.update_progress(100, run_status_message)

        except Exception as e:
            run_status_message = f"An error occurred: {str(e)}"
            status_code = 4000
            self.logger.log("error", run_status_message)
            response = {
                "data": {"report_path": ""},
                "status": {"code": status_code, "message": run_status_message},
            }

        finally:
            self.logger.log(
                "info", f"Finished generating excel report in {time() - initial_time}sec."
            )
            self.base_handler.update_progress(100, run_status_message)

        return response

    def valid_request(self) -> bool:
        """
        Validate the request data to ensure required fields are present.

        This method checks if the required fields are present in the request data.

        :return: True if the request is valid, False otherwise.
        :rtype: bool
        """
        required_fields = ["exportType", "scenarioRunCode"]
        for field in required_fields:
            if field not in self.request:
                self.logger.log("error", f"Missing required field: {field}")
                return False
        return True


if __name__ == "__main__":
    req = json.loads(sys.argv[1])
    runner = RunExportReport(req)
    resp = runner.run_export_report()
    print(json.dumps(resp))
