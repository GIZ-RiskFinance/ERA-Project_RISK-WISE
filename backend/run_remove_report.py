"""
Module to handle the removal of report directories based on a provided code.

This module provides functionality to remove a report directory and its contents
from the file system based on a specified code. It contains a class and methods to 
validate the request, remove the directory, update progress, and prepare response data.

Classes:

RunRemoveReport:
    Handles the removal of report directories based on provided request parameters.

Methods:

valid_request:
    Validates the incoming request to ensure it contains all required fields.

run_remove_report:
    Entry point to remove the report directory based on provided request parameters.
"""

import json
import os
import shutil
import sys
from time import time

from base_handler import BaseHandler
from logger_config import LoggerConfig

from constants import REPORTS_DIR


class RunRemoveReport:
    """
    Class for handling the removal of report directories based on a provided code.

    This class provides functionality to validate the request, determine the directory path,
    remove the directory and its contents if it exists, update progress, and generate a
    response indicating the outcome of the operation.
    """

    def __init__(self, request):
        """
        Initialize the RunRemoveReport instance.

        :param request: The request data containing the 'code' field required to identify
                        the report directory.
        :type request: dict
        """
        self.base_handler = BaseHandler()
        self.logger = LoggerConfig(logger_types=["file"])
        self.request = request

    def valid_request(self) -> bool:
        """
        Validate the request data to ensure required fields are present.

        This method checks if the required fields are present in the request data.

        :return: True if the request is valid, False otherwise.
        :rtype: bool
        """
        required_fields = ["report"]
        for field in required_fields:
            if field not in self.request:
                self.logger.log("error", f"Missing required field: {field}")
                return False
        return True

    def run_remove_report(self) -> dict:
        """
        Run the process to remove the report directory or image file.

        :return: A dictionary containing the response data and status.
        :rtype: dict
        """
        initial_time = time()
        run_status_message = ""  # Initialize run_status_message to avoid UnboundLocalError

        if not self.valid_request():
            run_status_message = "Invalid request: Missing required fields"
            status_code = 4000
            self.logger.log("error", run_status_message)
            return {
                "data": {},
                "status": {"code": status_code, "message": run_status_message},
            }

        # Retrieve the report and type
        report = self.request.get("report")
        report_type = report.get("type")
        status_code = 2000

        if report_type == "output_data":
            report_code = report.get("id")
            report_dir = os.path.join(REPORTS_DIR, report_code)

            self.base_handler.update_progress(10, "Removing report directory and components...")

            # Check if the directory exists
            if os.path.exists(report_dir) and os.path.isdir(report_dir):
                try:
                    shutil.rmtree(report_dir)
                    run_status_message = f"Successfully removed report::{REPORTS_DIR}"
                    self.logger.log("info", run_status_message)
                except Exception as e:
                    run_status_message = f"Failed to remove the report directory: {e}"
                    status_code = 5000
                    self.logger.log("error", run_status_message)
            else:
                run_status_message = f"Report directory not found: {report_dir}"
                status_code = 4004
                self.logger.log("error", run_status_message)
        else:
            image_path = report.get("image")
            self.base_handler.update_progress(10, "Removing the specified image file...")

            if os.path.exists(image_path) and os.path.isfile(image_path):
                try:
                    os.remove(image_path)
                    run_status_message = f"Successfully removed image file"
                    self.logger.log("info", run_status_message)
                except Exception as e:
                    run_status_message = f"Failed to remove image file: {e}"
                    status_code = 5000
                    self.logger.log("error", run_status_message)
            else:
                run_status_message = f"Image file not found: {image_path}"
                status_code = 4004
                self.logger.log("error", run_status_message)

        self.base_handler.update_progress(100, run_status_message)

        # Prepare the response
        response = {
            "data": {},
            "status": {"code": status_code, "message": run_status_message},
        }

        self.logger.log(
            "info",
            f"Finished removing report directory in {time() - initial_time:.2f} sec.",
        )
        return response


if __name__ == "__main__":
    req = json.loads(sys.argv[1])
    runner = RunRemoveReport(req)
    resp = runner.run_remove_report()
    print(json.dumps(resp))
