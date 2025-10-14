"""
Module to handle checking data types availability in the CLIMADA API.

This module provides functionality to check the availability of specific data types for a given 
country in the CLIMADA API. It contains a class and methods to check data types, sanitize 
country names, update progress, and prepare response data.

Classes:

RunCheckDataType: 
    Handles the checking of data types availability in the CLIMADA API.

Methods:

run_check_data_type: 
    Entry point to check data types availability based on provided request parameters.
"""

import json
import sys
from time import time

from base_handler import BaseHandler
from logger_config import LoggerConfig


class RunCheckDataType:
    """
    Class for handling the checking of data types availability in the CLIMADA API.

    This class provides functionality to retrieve the country name and data type from the request,
    sanitize the country name, check if the CLIMADA API offers the specified data type for the
    given country, update progress, and generate a response based on whether the data type is
    valid or not.
    """

    def __init__(self, request):
        self.base_handler = BaseHandler()
        self.logger = LoggerConfig(logger_types=["file"])
        self.request = request

    def run_check_data_type(self) -> dict:
        """
        Run the check data type process.

        This method validates the request, retrieves the country name and data type from the
        request, sanitizes the country name, and checks if the CLIMADA API offers the specified
        data type for the given country. It updates the progress and generates a response based
        on whether the data type is valid or not.

        :return: A dictionary containing the response data and status.
        :rtype: dict
        """
        initial_time = time()

        if not self.valid_request():
            run_status_message = "Invalid request: Missing required fields"
            status_code = 3000
            self.logger.log("error", run_status_message)
            response = {
                "data": {"data": {}},
                "status": {"code": status_code, "message": run_status_message},
            }
            return response

        country_name = self.request.get("country", "")
        country_name = self.base_handler.sanitize_country_name(country_name)
        data_type = self.request.get("dataType", "")
        status_code = 2000

        self.base_handler.update_progress(10, "Checking CLIMADA API")
        is_valid_data_type = self.base_handler.check_data_type(country_name, data_type)

        if not is_valid_data_type:
            run_status_message = (
                f"No datasets available for {data_type} in {country_name} in CLIMADA's API."
            )
            data = {}
            status_code = 3000
        else:
            run_status_message = f"Fetched {data_type} data successfully."
            data = {}

        self.base_handler.update_progress(100, run_status_message)

        response = {
            "data": {"data": data},
            "status": {"code": status_code, "message": run_status_message},
        }

        self.logger.log(
            "info", f"Finished fetching {data_type} data in {time() - initial_time}sec."
        )
        return response

    def valid_request(self) -> bool:
        """
        Validate the request data to ensure required fields are present.

        This method checks if the required fields are present in the request data.

        :return: True if the request is valid, False otherwise.
        :rtype: bool
        """
        required_fields = ["country", "dataType"]
        for field in required_fields:
            if field not in self.request:
                self.logger.log("error", f"Missing required field: {field}")
                return False
        return True


if __name__ == "__main__":
    req = json.loads(sys.argv[1])
    runner = RunCheckDataType(req)
    resp = runner.run_check_data_type()
    print(json.dumps(resp))
