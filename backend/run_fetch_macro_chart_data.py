"""
Module for fetching macroeconomic chart data based on scenario inputs.

This module retrieves macroeconomic data from an Excel file based on the request parameters.
It validates the request, filters the data, and prepares it for chart rendering in the frontend.

Classes:

RunFetchMacroChartData:
    Handles the process of fetching and preparing macroeconomic data for charts.

Methods:

run_fetch_macro_chart_data:
    Entry point for retrieving macroeconomic data and structuring it for frontend charts.
"""

import json
import sys
from time import time

from constants import REQUIREMENTS_DIR
from costben.costben_handler import CostBenefitHandler
from base_handler import BaseHandler
from macroeconomic.macroeconomic_handler import MacroeconomicHandler
from logger_config import LoggerConfig


class RunFetchMacroChartData:
    def __init__(self, request):
        self.base_handler = BaseHandler()
        self.costben_handler = CostBenefitHandler()
        self.macro_handler = MacroeconomicHandler()
        self.logger = LoggerConfig(logger_types=["file"])
        self.request = request

        self.country_name = str(request.get("countryName")).strip()
        self.scenario = str(request.get("scenario")).strip()
        self.sector = str(request.get("sector")).strip()
        self.macro_variable = str(request.get("variable")).strip()

    def valid_request(self) -> bool:
        required_fields = ["countryName", "scenario", "sector", "variable"]
        for field in required_fields:
            if field not in self.request:
                self.logger.log("error", f"Missing required field: {field}")
                return False
        return True

    def run_fetch_macro_chart_data(self) -> dict:
        """
        Retrieves and prepares macroeconomic data for chart rendering.

        This method validates the request, fetches the relevant data from the Excel file,
        and structures the data for the frontend. If no data matches the request filters
        or an error occurs, it logs the error and returns an appropriate status and message.

        :return: A dictionary containing the chart data and status information.
        """
        initial_time = time()
        status_code_success = 2000
        status_code_error = 4000

        try:
            if not self.valid_request():
                run_status_message = "Invalid request: Missing required fields"
                self.logger.log("error", run_status_message)
                return {
                    "data": {"years": [], "datasets": [], "title": ""},
                    "status": {"code": status_code_error, "message": run_status_message},
                }

            # Read the data from the Excel file
            chart_data = self.macro_handler.get_cred_data_from_excel(
                REQUIREMENTS_DIR / "cred_output.xlsx",
                country_name=self.country_name,
                scenario=self.scenario,
                sector=self.sector,
                macro_variable=self.macro_variable,
            )

            # Prepare the response
            response_data = {
                "years": chart_data["years"],
                "datasets": [
                    {"label": "With adaptation", "data": chart_data["with_adaptation"]},
                    {"label": "Without adaptation", "data": chart_data["without_adaptation"]},
                ],
                "title": self.base_handler.set_macroeconomic_chart_title(
                    self.country_name, self.macro_variable
                ),
            }

            # Log successful progress
            self.base_handler.update_progress(100, "Data fetched successfully.")
            self.logger.log(
                "info",
                f"Finished fetching macroeconomic chart data in {time() - initial_time:.2f} sec.",
            )

            return {
                "data": response_data,
                "status": {
                    "code": status_code_success,
                    "message": "Macroeconomic chart data fetched successfully.",
                },
            }

        except Exception as e:
            # Log any unexpected errors
            self.logger.log("error", f"An error occurred: {str(e)}")
            return {
                "data": {"years": [], "datasets": [], "title": ""},
                "status": {
                    "code": status_code_error,
                    "message": f"An error occurred while trying to fetch Macroeconomic chart data. More info: {str(e)}",
                },
            }


if __name__ == "__main__":
    req = json.loads(sys.argv[1])
    runner = RunFetchMacroChartData(req)
    resp = runner.run_fetch_macro_chart_data()
    print(json.dumps(resp))
