import json
import os
from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from docx2pdf import convert
from docx.shared import Mm
from docxtpl import DocxTemplate, InlineImage
from pythoncom import CoInitialize
import pandas as pd
import xlsxwriter

from constants import DATA_TEMP_DIR, REPORTS_DIR, REQUIREMENTS_DIR
from base_handler import BaseHandler
from logger_config import LoggerConfig


@dataclass
class ReportParameters:
    annual_population_growth: Optional[str] = None
    annual_gdp_growth: Optional[str] = None
    country_code: Optional[str] = None
    country_name: Optional[str] = None
    exposure_economic: Optional[str] = None
    exposure_non_economic: Optional[str] = None
    hazard: Optional[str] = None
    hazard_code: Optional[str] = None
    scenario: Optional[str] = None
    scenario_id: Optional[str] = None
    time_horizon: Optional[str] = None


@dataclass
class ReportViewObject:
    id: str
    scenario_id: str
    data: dict
    image: str
    title: str
    type: str


class ReportHandler:
    def __init__(self, report_parameters: ReportParameters) -> None:
        self.report_parameters = report_parameters
        self.target_dir = REPORTS_DIR / self.report_parameters.scenario_id or DATA_TEMP_DIR
        self.logger = LoggerConfig(logger_types=["file"])
        self.base_handler = BaseHandler()

    def get_report_file_path(self, export_type: str, report_type: str = None) -> str:
        scenario_id = self.report_parameters.scenario_id
        export_types = {"excel": "xlsx", "pdf": "pdf", "word": "docx"}
        extension = export_types.get(export_type)
        identification = ""

        if report_type:
            report_types = {
                "risk_plot_data": "risk_analysis",
                "adaptation_plot_data": "adaptation_plot",
                "exposure_map_data": "asset_data",
                "hazard_map_data": "hazard_data",
                "impact_map_data": "impact_data",
            }
            identification = report_types[report_type]

        # Construct the report file path within the target directory
        if export_type == "excel":
            report_file_path = self.target_dir / f"{scenario_id}_data_report.{extension}"
        elif export_type == "word":
            report_file_path = self.target_dir / f"{scenario_id}_{identification}.{extension}"
        else:
            report_file_path = self.target_dir / f"{scenario_id}_{identification}.{extension}"
        return str(report_file_path)

    def _generate_general_information_tab(self, workbook):
        ws = workbook.add_worksheet("General Information")

        # Hide gridlines
        ws.hide_gridlines(option=2)

        # Define formats
        bold_20_format = workbook.add_format({"bold": True, "font_size": 20})
        bold_11_format = workbook.add_format({"bold": True, "font_size": 11})
        normal_11_format = workbook.add_format({"font_size": 11})
        italic_11_format = workbook.add_format({"italic": True, "font_size": 11, "align": "left"})
        disclaimer_format = workbook.add_format(
            {"italic": True, "font_size": 11, "align": "left", "text_wrap": True}
        )

        # Input Fields Title
        ws.write("B2", "Input fields", bold_20_format)

        # Row 3 is empty
        ws.set_row(2, None, None)  # Row index is 2 (0-based)

        # Input Fields
        inputs = [
            ("B4", "Country", self.report_parameters.country_name),
            ("B5", "Hazard", self.report_parameters.hazard),
            ("B6", "Scenario", self.report_parameters.scenario),
            ("B7", "Time Horizon", self.report_parameters.time_horizon),
            ("B8", "Exposure of Economic Assets", self.report_parameters.exposure_economic or "-"),
            (
                "B9",
                "Exposure of Non-Economic Assets",
                self.report_parameters.exposure_non_economic or "-",
            ),
            (
                "B10",
                "Annual Population Growth",
                (
                    f"{self.report_parameters.annual_population_growth}%"
                    if self.report_parameters.annual_population_growth
                    else "-"
                ),
            ),
            (
                "B11",
                "Annual GDP Growth",
                (
                    f"{self.report_parameters.annual_gdp_growth}%"
                    if self.report_parameters.annual_gdp_growth
                    else "-"
                ),
            ),
        ]

        for cell, label, value in inputs:
            ws.write(cell, label, bold_11_format)
            col_c_cell = cell.replace("B", "C")
            ws.write(col_c_cell, value, normal_11_format)

        # Report Created By
        ws.write("B14", "Report created by", bold_11_format)
        ws.write("B16", "User name", bold_11_format)
        ws.write("C16", os.getlogin(), normal_11_format)
        ws.write("B17", "Date", bold_11_format)
        ws.write("C17", datetime.now().strftime("%Y-%m-%d"), normal_11_format)
        ws.write("B18", "Time", bold_11_format)
        ws.write("C18", datetime.now().strftime("%H:%M:%S"), normal_11_format)

        # Disclaimer
        ws.write("B23", "Disclaimer:", italic_11_format)

        disclaimer = (
            "The user interface has been developed by GIZ and UNU-EHS/MCII to showcase the result of Enhancing Climate Risk Assessment (ERA) "
            "for Improved Country Risk Financing Strategies and allow users to explore CLIMADA tool for conducting climate risk analysis in Egypt "
            "and Thailand.\n"
            "The user interface is free software. You can redistribute and/or modify it. The installation and use of the user interface is done at "
            "the user's discretion and risk.\n"
            "The user agrees to be solely responsible for any damage to the computer system, loss of data or any other damage resulting from "
            "installation or use of the software.\n"
            "GIZ and UNU-EHS/MCII shall not be responsible or liable for any damages arising in connection with downloading, installation, modifying "
            "or any other use of the software.\n"
            "GIZ and UNU-EHS/MCII shall assume no responsibility for any errors or other mistakes or inaccuracies in the software, in the results "
            "produced by the software or in the related documentation.\n\n"
            "License for CLIMADA:\n"
            "Copyright (C) 2017 ETH Zurich, CLIMADA contributors listed in AUTHORS. CLIMADA is free software: you can redistribute it and/or modify "
            "it under the terms of the GNU General Public License Version 3, 29 June 2007 as published by the Free Software Foundation, https://www.gnu.org/licenses/gpl-3.0.html.\n"
            "CLIMADA is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY "
            "or FITNESS FOR A PARTICULAR PURPOSE.\n"
            "See the GNU General Public License for more details: https://www.gnu.org/licenses/gpl-3.0.html."
        )

        ws.merge_range("B25:H35", disclaimer, disclaimer_format)

        # Set column width
        ws.set_column("B:B", 40)
        ws.set_column("C:C", 60)

    def _generate_hazard_tab(self, workbook):
        hazard_df = pd.read_parquet(self.target_dir / "hazard_report_data.parquet")

        ws = workbook.add_worksheet("Hazard")

        # Define a format for headers
        bold_format = workbook.add_format({"bold": True})

        # Write column headers with bold formatting
        for col_num, value in enumerate(hazard_df.columns):
            ws.write(0, col_num, value, bold_format)

        # Write data from DataFrame
        for row_num, row_data in enumerate(hazard_df.values.tolist(), start=1):
            for col_num, cell_data in enumerate(row_data):
                ws.write(row_num, col_num, cell_data)

    def _generate_exposure_tab(self, workbook):
        exposure_df = pd.read_parquet(self.target_dir / "exposure_report_data.parquet")

        ws = workbook.add_worksheet("Exposure")

        # Define a format for headers
        bold_format = workbook.add_format({"bold": True})

        # Write column headers with bold formatting
        for col_num, value in enumerate(exposure_df.columns):
            ws.write(0, col_num, value, bold_format)

        # Write data from DataFrame
        for row_num, row_data in enumerate(exposure_df.values.tolist(), start=1):
            for col_num, cell_data in enumerate(row_data):
                ws.write(row_num, col_num, cell_data)

    def _generate_impact_tab(self, workbook):
        impact_df = pd.read_parquet(self.target_dir / "impact_report_data.parquet")

        ws = workbook.add_worksheet("Impact")

        # Define a format for headers
        bold_format = workbook.add_format({"bold": True})

        # Write column headers with bold formatting
        for col_num, value in enumerate(impact_df.columns):
            ws.write(0, col_num, value, bold_format)

        # Write data from DataFrame
        for row_num, row_data in enumerate(impact_df.values.tolist(), start=1):
            for col_num, cell_data in enumerate(row_data):
                ws.write(row_num, col_num, cell_data)

    def _save_report(self, workbook):
        workbook.close()

    def generate_excel_report(self):
        report_file_path = self.get_report_file_path(export_type="excel")
        workbook = xlsxwriter.Workbook(filename=report_file_path)
        self._generate_general_information_tab(workbook)
        self._generate_hazard_tab(workbook)
        self._generate_exposure_tab(workbook)
        self._generate_impact_tab(workbook)
        self._save_report(workbook)

    def _get_image_title(self, report_type: str) -> str:
        report_types = {
            "risk_plot_data": "",
            "adaptation_plot_data": "",
            "exposure_map_data": "Assets/Values distribution",
            "hazard_map_data": "Hazard distribution",
            "impact_map_data": "Impact distribution",
        }
        if report_type:
            return report_types[report_type]
        return ""

    def _get_section_title(self, report_type: str) -> str:
        report_types = {
            "risk_plot_data": "Risk analysis",
            "adaptation_plot_data": "Cost-Benefit analysis",
            "exposure_map_data": "Assets/Values",
            "hazard_map_data": "Hazard",
            "impact_map_data": "Impact analysis",
        }
        if report_type:
            return report_types[report_type]
        return "Title"

    def _get_section_description(
        self, country_name: str, hazard_type: str, asset_type: str, report_type: str
    ) -> str:
        report_key_types = {
            "risk_plot_data": "1_0_display_chart_hazard",
            "adaptation_plot_data": "1_1_display_chart_hazard",
            "exposure_map_data": "1_0_display_map_exposure",
            "hazard_map_data": "1_0_display_map_hazard",
            "impact_map_data": "1_0_display_map_impact",
        }
        key_extension = report_key_types.get(report_type)
        report_key = f"results_era_{country_name}_{hazard_type}_{asset_type}_{key_extension}"

        file_path = REQUIREMENTS_DIR / "report_data.json"
        with open(file_path, "r") as file:
            data = json.load(file)

        return data.get(report_key)

    def generate_word_report(self, report_type: str, scenario_id: str, report_id: str):
        # Create new document
        report_template = DocxTemplate(REQUIREMENTS_DIR / "report_template.docx")
        report_file_path = self.get_report_file_path(export_type="word", report_type=report_type)

        # Set beautified parameters
        asset_type = (
            self.report_parameters.exposure_economic
            if self.report_parameters.exposure_economic
            else self.report_parameters.exposure_non_economic
        )

        hazard_type_beautified = self.base_handler.beautify_hazard_type(
            self.report_parameters.hazard
        )
        scenario_beautified = self.base_handler.beautify_scenario(self.report_parameters.scenario)
        asset_type_beautified = self.base_handler.beautify_asset(asset_type)
        country_name_beautified = self.report_parameters.country_name.capitalize()
        time_horizon_beautified = self.report_parameters.time_horizon
        annual_population_growth_beautified = (
            f"{self.report_parameters.annual_population_growth} %"
            if self.report_parameters.annual_population_growth is not None
            else "N/A"
        )
        annual_gdp_growth_beautified = (
            f"{self.report_parameters.annual_gdp_growth} %"
            if self.report_parameters.annual_gdp_growth is not None
            else "N/A"
        )

        # Set report input fields section
        report_title = f"Report"
        report_subtitle = f"Summary of the Impact of {hazard_type_beautified} on {asset_type_beautified} in {country_name_beautified}"

        section_title = self._get_section_title(report_type)
        section_description = self._get_section_description(
            self.report_parameters.country_name,
            self.report_parameters.hazard,
            asset_type,
            report_type,
        )

        image_title = self._get_image_title(report_type)

        # Set report custom section parameters
        image_path = os.path.join(
            REPORTS_DIR, scenario_id, f"snapshot_{report_type}_{report_id}.png"
        )
        image = InlineImage(
            tpl=report_template, image_descriptor=image_path, width=Mm(115), height=Mm(80)
        )
        # Set report dynamic context
        context = {
            "report_title": report_title,
            "report_subtitle": report_subtitle,
            "hazard_type": hazard_type_beautified,
            "scenario": scenario_beautified,
            "time_horizon": time_horizon_beautified,
            "exposure_economic": (
                asset_type_beautified
                if self.report_parameters.exposure_economic is not None
                else "N/A"
            ),
            "exposure_non_economic": (
                asset_type_beautified
                if self.report_parameters.exposure_non_economic is not None
                else "N/A"
            ),
            "annual_population_growth": annual_population_growth_beautified,
            "annual_gdp_growth": annual_gdp_growth_beautified,
            "created_by": str(os.getlogin()),
            "created_date": str(datetime.now().strftime("%Y-%m-%d")),
            "created_time": str(datetime.now().strftime("%H:%M:%S")),
            "section_title": section_title,
            "section_description": section_description,
            "image_title": image_title,
            "image": image,
        }

        # Render context into template's placeholders
        report_template.render(context)
        # Save document as .docx
        report_template.save(report_file_path)
        CoInitialize()

    def generate_pdf_report(self, report_type: str, scenario_id: str, report_id: str):
        # Step 1: Generate Word report
        self.generate_word_report(
            report_type=report_type, scenario_id=scenario_id, report_id=report_id
        )

        # Step 2: Define paths for Word and PDF files
        word_file_path = self.get_report_file_path(export_type="word", report_type=report_type)
        pdf_file_path = self.get_report_file_path(export_type="pdf", report_type=report_type)

        # Step 3: Convert Word to PDF
        convert(word_file_path, pdf_file_path)

