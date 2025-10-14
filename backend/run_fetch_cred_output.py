import json
import sys
from time import time

from constants import REQUIREMENTS_DIR
from base_handler import BaseHandler
from macroeconomic.macroeconomic_handler import MacroeconomicHandler
from logger_config import LoggerConfig


class RunFetchCredOutput:
    def __init__(self):
        self.base_handler = BaseHandler()
        self.logger = LoggerConfig(logger_types=["file"])
        self.macro_handler = MacroeconomicHandler()

    def run_fetch_cred_output(self) -> dict:
        initial_time = time()
        status_code_success = 2000
        status_code_error = 4000

        try:
            # Read the data from the Excel file
            cred_data = self.macro_handler.get_cred_data_from_excel()

            # Log successful progress
            self.base_handler.update_progress(100, "CRED data fetched successfully.")
            self.logger.log(
                "info",
                f"Finished fetching macroeconomic chart data in {time() - initial_time:.2f} sec.",
            )

            return {
                "data": cred_data,
                "status": {
                    "code": status_code_success,
                    "message": "CRED output data fetched successfully.",
                },
            }

        except Exception as e:
            # Log any unexpected errors
            self.logger.log("error", f"An error occurred: {str(e)}")
            return {
                "data": [],
                "status": {
                    "code": status_code_error,
                    "message": f"An error occurred while trying to fetch CRED outputdata. More info: {str(e)}",
                },
            }


if __name__ == "__main__":
    req = json.loads(sys.argv[1])
    runner = RunFetchCredOutput(req)
    resp = runner.run_fetch_cred_output()
    print(json.dumps(resp))
