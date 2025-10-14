"""
Module for handling macroeconomic data extraction and processing.

This module reads and processes data from Excel files, filters it based on provided
parameters, and prepares it for use in other parts of the application.
"""

import pandas as pd

from constants import REQUIREMENTS_DIR
from logger_config import LoggerConfig


class MacroeconomicHandler:
    def __init__(self):
        self.logger = LoggerConfig(logger_types=["file"])

    def get_cred_data_from_excel(
        self,
        file_path: str = None,
    ) -> dict:
        """
        Reads data from an Excel file and returns it in a structured format
        for the frontend chart.

        :param file_path: The path to the Excel file.
        """
        try:
            if not file_path:
                file_path = REQUIREMENTS_DIR / "cred_output.xlsx"

            df = pd.read_excel(file_path, sheet_name="cred_output")

            # Return early if no data matches the filters
            if df.empty:
                self.logger.log("warning", "No data found for the given filters.")
                raise ValueError("No data found for the given filters")

            data = df.to_dict(orient="records")

            return data

        except ValueError as e:
            self.logger.log("error", str(e))
            raise

        except FileNotFoundError:
            self.logger.log("error", f"Macroeconomic CRED excel file not found: {file_path}")
            return {}

        except pd.errors.EmptyDataError:
            self.logger.log(
                "error", "Macroeconomic CRED excel file is empty or contains no valid data."
            )
            return {}

        except KeyError as e:
            self.logger.log(
                "error",
                f"Missing required column in the Macroeconomic CRED excel file. More info: {e}",
            )
            return {}

        except Exception as e:
            self.logger.log("error", f"Unexpected error occurred. More info: {str(e)}")
            return {}
