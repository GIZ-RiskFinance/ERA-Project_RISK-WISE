"""
Translation Management Module

This module provides functionality for managing translations in JSON format.
It includes classes to handle loading translation files, creating Excel files
with translations in multiple languages, validating the contents of these
Excel files against the original data, and generating JSON files from the
validated translations. The supported languages in this implementation are
English, Arabic, and Thai.

Key Classes:
- TranslationFileManager: Manages loading and processing translation files.
- TranslationValidator: Validates the structure and content of translation
  Excel files against the original English data.
- JSONGenerator: Generates JSON files from validated translation data.

Logging is configured to record any validation errors or mismatches in
translations for further review.
"""

import json
import logging
from pathlib import Path
import pandas as pd

# Constants for paths and logging
LOCALES_PATH = Path("src/locales")
ROOT_PATH = Path.cwd()
LOG_FILE = ROOT_PATH / "translation_validation.log"

# Configure logging
logging.basicConfig(
    filename=LOG_FILE,
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    filemode="w",  # Overwrite the log file each time
)


class TranslationFileManager:
    """Manages loading and processing translation files.

    This class provides methods to load JSON translation files and create
    an Excel file containing translations in multiple languages.
    """

    def __init__(self, translation_files):
        self.translation_files = translation_files

    def load_json(self, file_path):
        """Load JSON data from a specified file.

        Args:
            file_path (Path): The path to the JSON file to load.

        Returns:
            dict: The loaded JSON data.

        Raises:
            FileNotFoundError: If the JSON file does not exist.
            json.JSONDecodeError: If the file is not a valid JSON.
        """
        try:
            with open(file_path, "r", encoding="utf-8") as file:
                return json.load(file)

        except FileNotFoundError as e:
            logging.error(f"File not found: {file_path}. Error: {e}")
            raise  # Re-raise the exception to notify the caller

        except json.JSONDecodeError as e:
            logging.error(f"Invalid JSON in file: {file_path}. Error: {e}")
            raise  # Re-raise the exception to notify the caller

        except Exception as e:
            logging.error(f"An unexpected error occurred while loading JSON from {file_path}: {e}")
            raise  # Re-raise the exception to notify the caller

    def create_translation_excel(self, output_file="translations.xlsx"):
        """Create an Excel file with translations for multiple languages.

        This method loads translation data for English, Arabic, and Thai,
        then writes it to an Excel file with three separate sheets.

        Args:
            output_file (str): The name of the output Excel file.
        """
        try:
            # Load English data
            en_data = self.load_json(self.translation_files["en"])
            en_df = pd.DataFrame(list(en_data.items()), columns=["Key", "English"])

            # Load Arabic and Thai data
            ar_data = self.load_json(self.translation_files["ar"])
            th_data = self.load_json(self.translation_files["th"])

            # Prepare DataFrames for Arabic and Thai translations
            ar_df = pd.DataFrame(
                {
                    "Key": en_data.keys(),
                    "English": en_data.values(),
                    "Arabic": [ar_data.get(key, "") for key in en_data.keys()],
                }
            )
            th_df = pd.DataFrame(
                {
                    "Key": en_data.keys(),
                    "English": en_data.values(),
                    "Thai": [th_data.get(key, "") for key in en_data.keys()],
                }
            )

            # Write the data to an Excel file with three sheets
            with pd.ExcelWriter(output_file) as writer:
                en_df.to_excel(writer, sheet_name="English", index=False)
                ar_df.to_excel(writer, sheet_name="Arabic", index=False)
                th_df.to_excel(writer, sheet_name="Thai", index=False)

            print(f"Excel file '{output_file}' created with English, Arabic, and Thai sheets.")

        except FileNotFoundError as e:
            logging.error(f"File not found error: {e}. Please ensure the translation files exist.")
            print(f"Error: {e}. Check the log file for details.")

        except Exception as e:
            logging.error(f"An unexpected error occurred while creating the Excel file: {e}")
            print("An unexpected error occurred. Check the log file for details.")


class TranslationValidator:
    """Validates the structure and content of translation Excel files.

    This class compares the keys and values in the Excel file against
    the original English JSON data to ensure consistency.
    """

    def __init__(self, translation_manager):
        self.translation_manager = translation_manager
        self.original_en_data = translation_manager.load_json(
            translation_manager.translation_files["en"]
        )

    def validate_excel(self, excel_file="translations.xlsx"):
        """Validate the contents of the translation Excel file.

        This method checks if the keys and English values match the
        original data and logs any mismatches.

        Args:
            excel_file (str): The name of the Excel file to validate.

        Returns:
            bool: True if valid, False otherwise.
        """
        try:
            # Load the Excel file
            xls = pd.ExcelFile(excel_file)
            is_valid = True

            for lang in ["English", "Arabic", "Thai"]:
                try:
                    df = pd.read_excel(xls, sheet_name=lang).fillna(
                        ""
                    )  # Fill NA values with empty strings

                    # Check if the keys match the original English keys
                    if df["Key"].tolist() != list(self.original_en_data.keys()):
                        is_valid = False
                        logging.error(f"Keys in '{lang}' sheet do not match the original data.")
                        for i, (key, original_key) in enumerate(
                            zip(df["Key"], self.original_en_data.keys())
                        ):
                            if key != original_key:
                                logging.info(
                                    f"Mismatched Key at row {i + 2}: '{key}' (Expected: '{original_key}')"
                                )

                    # Validate English values in the corresponding sheet
                    if lang == "English" and df["English"].tolist() != list(
                        self.original_en_data.values()
                    ):
                        is_valid = False
                        logging.error(
                            f"English values in '{lang}' sheet do not match the original data."
                        )
                        for i, (value, original_value) in enumerate(
                            zip(df["English"], self.original_en_data.values())
                        ):
                            if value != original_value:
                                logging.info(
                                    f"Mismatched English Value at row {i + 2}: '{value}' (Expected: '{original_value}')"
                                )

                except Exception as e:
                    logging.error(f"Error processing '{lang}' sheet: {e}")
                    is_valid = False  # Mark as invalid if any error occurs

            return is_valid

        except FileNotFoundError:
            logging.error(f"Excel file '{excel_file}' not found.")
            print(f"Excel file '{excel_file}' not found. Check the log file for details.")
            return False

        except Exception as e:
            logging.error(f"Unexpected error while validating Excel file: {e}")
            print("An unexpected error occurred. Check the log file for details.")
            return False


class JSONGenerator:
    """Generates JSON files from validated translation data.

    This class takes the validated data from an Excel file and generates
    JSON files for each supported language.
    """

    def __init__(self, translation_manager, validator):
        self.translation_manager = translation_manager
        self.validator = validator

    def generate_json_from_excel(self, excel_file="translations.xlsx", output_dir=LOCALES_PATH):
        """Generate JSON files from the translation Excel file.

        This method checks the validity of the Excel file, and if valid,
        creates JSON files for each language.

        Args:
            excel_file (str): The name of the Excel file to read.
            output_dir (Path): The directory where the JSON files will be saved.
        """
        try:
            # Validate the Excel file
            if not self.validator.validate_excel(excel_file):
                print("Validation failed. Check the log file for details.")
                return

            # Load the Excel file
            xls = pd.ExcelFile(excel_file)

            # Process each sheet and save it to JSON
            for lang in ["English", "Arabic", "Thai"]:
                try:
                    df = pd.read_excel(xls, sheet_name=lang).fillna(
                        ""
                    )  # Fill NA values with empty strings
                    lang_code = lang.lower()[:2]  # Get the first two letters for language code

                    # Extract keys and values into a dictionary
                    data = dict(zip(df["Key"], df[lang] if lang != "English" else df["English"]))

                    # Define the output path for the JSON file
                    output_path = output_dir / f"{lang_code}.json"

                    # Write dictionary to JSON
                    with open(output_path, "w", encoding="utf-8") as file:
                        json.dump(data, file, ensure_ascii=False, indent=4)

                    print(f"Generated '{output_path}' with {len(data)} entries.")

                except Exception as e:
                    logging.error(f"Error processing '{lang}' sheet: {e}")
                    print(f"Error processing '{lang}' sheet. Check the log file for details.")

        except FileNotFoundError:
            logging.error(f"Excel file '{excel_file}' not found.")
            print(f"Excel file '{excel_file}' not found. Check the log file for details.")

        except Exception as e:
            logging.error(f"Unexpected error: {e}")
            print("An unexpected error occurred. Check the log file for details.")


# Setup paths for translation files
translation_files = {
    "en": LOCALES_PATH / "en.json",
    "ar": LOCALES_PATH / "ar.json",
    "th": LOCALES_PATH / "th.json",
}

# Initialize classes
manager = TranslationFileManager(translation_files)
validator = TranslationValidator(manager)
generator = JSONGenerator(manager, validator)

# Execute processes
# manager.create_translation_excel()
generator.generate_json_from_excel(output_dir=ROOT_PATH)
