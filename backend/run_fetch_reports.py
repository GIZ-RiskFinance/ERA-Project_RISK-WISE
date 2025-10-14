"""
Module to handle the fetching of report data from a specified directory.

This module provides functionality to retrieve report data from a specified directory,
process the data, and return it in a structured format. It contains a class and methods 
to fetch available reports, process metadata, and prepare response data.

Classes:

RunFetchReports:
    Handles the fetching and processing of report data from the specified reports directory.

Methods:

run_fetch_reports:
    Entry point to fetch and process report data, returning it as a structured response.
"""

import json
from pathlib import Path
import sys
from time import time

from base_handler import BaseHandler
from report.report_handler import ReportViewObject
from logger_config import LoggerConfig
from constants import REPORTS_DIR


class RunFetchReports:
    """
    Class for handling the fetching and processing of report data from the reports directory.

    This class provides functionality to iterate through report directories, extract relevant
    metadata, create report objects, and generate a response containing the processed report data.
    """

    def __init__(self):
        """
        Initialize the RunFetchReports instance.

        This initializes the BaseHandler and LoggerConfig instances required for handling
        operations and logging within the report fetching process.
        """
        self.base_handler = BaseHandler()
        self.logger = LoggerConfig(logger_types=["file"])

    def check_for_snapshot_images(self, report_dir: Path) -> list:
        """
        Check if the report directory contains snapshot images and determine their type.

        :param report_dir: Path to the report directory to scan for snapshot images.
        :return: List of tuples containing the snapshot image file path and its determined report type.
        :rtype: list
        """
        snapshot_images = []

        for file_path in report_dir.glob("snapshot_*.png"):
            file_name = file_path.name

            # Determine report type based on the filename
            if "snapshot_risk_plot_data" in file_name:
                report_type = "risk_plot_data"
            elif "snapshot_adaptation_plot_data" in file_name:
                report_type = "adaptation_plot_data"
            elif "snapshot_exposure_map_data" in file_name:
                report_type = "exposure_map_data"
            elif "snapshot_hazard_map_data" in file_name:
                report_type = "hazard_map_data"
            elif "snapshot_impact_map_data" in file_name:
                report_type = "impact_map_data"
            else:
                continue  # Skip if the filename doesn't match known patterns

            snapshot_images.append((str(file_path), report_type))  # Append the file path and type

        return snapshot_images

    def run_fetch_reports(self) -> dict:
        """
        Run the process to fetch report data from the reports directory.

        This method iterates through the directories within the reports directory, processes
        each directory to extract metadata and create report objects, and compiles the results
        into a structured response.

        :return: A dictionary containing the response data and status.
        :rtype: dict
        """
        initial_time = time()
        status_code = 2000
        run_status_message = ""
        self.base_handler.update_progress(10, "Fetching available data from reports directory...")
        reports = []

        try:
            # Iterate through each folder in REPORTS_DIR
            for report_dir in Path(REPORTS_DIR).iterdir():
                if report_dir.is_dir():
                    scenario_id = report_dir.name
                    metadata = self.base_handler.read_results_metadata_file(
                        report_dir / "_metadata.txt"
                    )
                    title = report_dir.name

                    # Always create an output_data report
                    output_report = ReportViewObject(
                        id=scenario_id,  # TODO: Change
                        scenario_id=scenario_id,
                        data=metadata,
                        image="",  # Placeholder, if no specific image is found
                        title=title,
                        type="output_data",  # Default report type
                    )
                    reports.append(output_report)

                    # Check for snapshot images in the current report directory
                    snapshot_images = self.check_for_snapshot_images(report_dir)

                    # If snapshot images are found, create a report object for each snapshot
                    for image_path, report_type in snapshot_images:
                        file_name = Path(image_path).name
                        # Extract the ID by splitting the filename at the last underscore and removing the extension
                        report_file_id = file_name.rsplit("_", 1)[-1].split(".")[0]

                        snapshot_report = ReportViewObject(
                            id=report_file_id,  # Use extracted ID from the filename
                            scenario_id=scenario_id,
                            data=metadata,
                            image=image_path,
                            title=title,
                            type=report_type,  # Use determined report type
                        )
                        reports.append(snapshot_report)

                run_status_message = "Fetched data from reports directory successfully."

        except Exception as exc:
            run_status_message = (
                f"Error while trying to fetch data from reports directory. More info: {exc}"
            )
            status_code = 3000
            self.logger.log("error", run_status_message)

        self.base_handler.update_progress(100, run_status_message)

        # Prepare the response
        response = {
            "data": [report.__dict__ for report in reports],
            "status": {"code": status_code, "message": run_status_message},
        }

        self.logger.log(
            "info",
            f"Finished fetching data from reports directory in {time() - initial_time:.2f} sec.",
        )
        return response


if __name__ == "__main__":
    req = json.loads(sys.argv[1])
    runner = RunFetchReports()
    resp = runner.run_fetch_reports()
    print(json.dumps(resp))
