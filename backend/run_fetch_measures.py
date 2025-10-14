"""
Module to handle fetching adaptation measures based on provided hazard type.

This module provides functionality to fetch adaptation measures based on a specified hazard type.
It contains a class and methods to fetch adaptation measures from an Excel file, beautify hazard 
types, and prepare response data.

Classes:

RunFetchScenario: 
    Handles the fetching of adaptation measures based on provided parameters.

Methods:

run_fetch_measures: 
    Entry point to fetch adaptation measures based on provided request parameters.
"""

import json
import sys
from time import time

from costben.costben_handler import CostBenefitHandler

from base_handler import BaseHandler
from hazard.hazard_handler import HazardHandler
from logger_config import LoggerConfig


class RunFetchScenario:
    """
    Class for handling the fetching of adaptation measures based on provided hazard type.

    This class provides functionality to retrieve the hazard type from the request, get the
    hazard code, fetch adaptation measures from an Excel file based on the hazard code,
    update progress, and generate a response containing the fetched adaptation measures.
    """

    def __init__(self, request):
        self.base_handler = BaseHandler()
        self.costben_handler = CostBenefitHandler()
        self.hazard_handler = HazardHandler()
        self.logger = LoggerConfig(logger_types=["file"])
        self.request = request

    def valid_request(self) -> bool:
        """
        Validate the request data to ensure required fields are present.

        This method checks if the required fields are present in the request data.

        :return: True if the request is valid, False otherwise.
        :rtype: bool
        """
        required_fields = ["hazardType"]
        for field in required_fields:
            if field not in self.request:
                self.logger.log("error", f"Missing required field: {field}")
                return False
        return True

    def run_fetch_measures(self) -> dict:
        """
        Run the process to fetch adaptation measures.

        This method validates the request, retrieves the hazard type from the request,
        gets the hazard code, and fetches the adaptation measures from an Excel file based
        on the hazard code. It updates the progress and generates a response containing the
        fetched adaptation measures.

        :return: A dictionary containing the response data and status.
        :rtype: dict
        """
        initial_time = time()

        if not self.valid_request():
            run_status_message = "Invalid request: Missing required fields"
            status_code = 4000
            self.logger.log("error", run_status_message)
            response = {
                "data": {"adaptationMeasures": []},
                "status": {"code": status_code, "message": run_status_message},
            }
            return response

        hazard_type = self.request.get("hazardType", "")
        hazard_code = self.hazard_handler.get_hazard_code(hazard_type)
        hazard_beautified = self.base_handler.beautify_hazard_type(hazard_type)
        status_code = 2000

        measure_set = self.costben_handler.get_measure_set_from_excel(hazard_code)

        self.base_handler.update_progress(10, "Fetching adaptation measures...")
        if not hazard_code or not measure_set:
            run_status_message = f"No available adaptation measures for {hazard_beautified}."
            adaptation_measures = []
            status_code = 3000
        else:
            run_status_message = (
                f"Fetched adaptation measures for {hazard_beautified} successfully."
            )
            adaptation_measures = measure_set.get_names(hazard_code)

        data = {"adaptationMeasures": adaptation_measures}

        self.base_handler.update_progress(100, run_status_message)

        response = {
            "data": data,
            "status": {"code": status_code, "message": run_status_message},
        }

        # Clear files in temp directory
        self.logger.log(
            "info", f"Finished fetching adaptation measures data in {time() - initial_time}sec."
        )
        return response


if __name__ == "__main__":
    req = json.loads(sys.argv[1])
    runner = RunFetchScenario(req)
    resp = runner.run_fetch_measures()
    print(json.dumps(resp))
