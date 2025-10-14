"""
Module to handle cleaning up the temporary directory.

This module provides functionality to clear all files within the specified temporary directory,
handling errors gracefully and logging progress.

Classes:

RunClearTempDir:
    Handles the clearing of the temporary directory.
"""

import json
import sys

from constants import DATA_TEMP_DIR
from logger_config import LoggerConfig


class RunClearTempDir:
    """
    Class for handling the clearing of the temporary directory.

    This class provides functionality to delete all files in the specified temporary directory,
    logging any errors or successes encountered during the operation.
    """

    def __init__(self):
        self.logger = LoggerConfig(logger_types=["file"])

    def run_clear_temp_dir(self) -> dict:
        """
        Clear the temporary directory.

        This method deletes all files in the temporary directory, handling any errors and logging
        the process.

        :return: A dictionary with the status of the operation and any error message.
        """
        try:
            for file in DATA_TEMP_DIR.glob("*"):
                file.unlink(missing_ok=True)
            self.logger.log("info", "Successfully cleared all files in the temporary directory.")
            return {
                "success": True,
                "message": "Successfully cleared all files in the temporary directory.",
            }
        except Exception as exc:
            error_message = f"Error while trying to clear temp directory. More info: {exc}"
            self.logger.log("error", error_message)
            return {"success": False, "error": error_message}


if __name__ == "__main__":
    req = json.loads(sys.argv[1])
    runner = RunClearTempDir(req)
    resp = runner.run_clear_temp_dir()
    print(json.dumps(resp))  # Print the result as a JSON string
