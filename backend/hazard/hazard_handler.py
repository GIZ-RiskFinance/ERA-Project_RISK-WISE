"""
Module for handling hazard-related operations.

This module contains classes and functions for handling various types of hazards, such as 
tropical cyclones, river floods, earthquakes, wildfires, floods, and droughts. It includes
methods for fetching hazard data from different sources, processing hazard datasets, 
and generating hazard GeoJSON files.

Classes:

- `HazardHandler`: 
    Class for handling hazard-related operations.

Methods:

- `get_hazard_time_horizon`: 
    Retrieves the time horizon for a given hazard type, scenario, and time horizon.
- `get_hazard_dataset_properties`: 
    Retrieves hazard dataset properties based on hazard type, scenario, time horizon, and country.
- `get_hazard`: 
    Retrieves hazard data based on various parameters, including hazard type, 
    source, scenario, time horizon, country, and file path.
- `_get_hazard_from_client`: 
    Retrieves hazard data from an external API client.
- `_get_hazard_from_raster`: 
    Retrieves hazard data from a raster file.
- `_get_hazard_from_mat`: 
    Retrieves hazard data from a MATLAB file.
- `get_hazard_intensity_thres`: 
    Retrieves the intensity threshold for a given hazard type.
- `get_circle_radius`: 
    Retrieves the radius for generating hazard circles.
- `generate_hazard_geojson`: 
    Generates a GeoJSON file containing hazard data.
- `_get_hazard_from_hdf5`: 
    Retrieves hazard data from an HDF5 file.
- `get_hazard_from_xlsx`: 
    Retrieves hazard data from an Excel file.
- `get_hazard_code`: 
    Retrieves the hazard code corresponding to a given hazard type.
- `get_hazard_type`: 
    Retrieves the hazard type corresponding to a given hazard code.
"""

import json
from pathlib import Path

import geopandas as gpd
import numpy as np
import pandas as pd
from shapely.geometry import Point

from climada.entity import Entity
from climada.hazard import Hazard
from climada.util.api_client import Client

from base_handler import BaseHandler
from constants import (
    DATA_HAZARDS_DIR,
    DATA_TEMP_DIR,
)
from logger_config import LoggerConfig

logger = LoggerConfig(logger_types=["file"])


class HazardHandler:
    """
    Class for handling hazard-related operations.

    This class provides methods for retrieving hazard data from various sources, processing
    hazard datasets, and generating hazard GeoJSON files.
    """

    def __init__(self):
        self.client = Client()
        self.base_handler = BaseHandler()

    # TODO: Needs to be refactored
    def get_hazard_time_horizon(self, hazard_type: str, scenario: str, time_horizon: str) -> str:
        """
        Get the time horizon for a specific hazard type and scenario.

        This method retrieves the time horizon for a specified hazard type and scenario.
        It uses predefined mappings for historical data and future projections. If the scenario
        is historical, it returns the corresponding time horizon from the historical dataset.
        For future scenarios, it maps the time horizon based on the hazard type and provided
        time horizon. If no match is found, it returns an empty string.

        :param hazard_type: The type of hazard for which to retrieve the time horizon.
        :type hazard_type: str
        :param scenario: The scenario type, either "historical" or "future".
        :type scenario: str
        :param time_horizon: The time horizon for future scenarios.
        :type time_horizon: str
        :return: The time horizon corresponding to the specified hazard type and scenario.
        :rtype: str
        """
        try:
            historical_time_horizons = {
                "storm_europe": "1940_2014",
                "river_flood": "1980_2000",
                "tropical_cyclone": "1980_2000",
                "earthquake": "",
                "flood": "2002_2019",
                "wildfire": "2001_2020",
            }

            tropical_cyclone_future_mapping = {
                "2010_2030": "2020",
                "2030_2050": "2040",
                "2050_2070": "2060",
                "2070_2090": "2080",
            }

            # Check if the scenario is historical
            if scenario == "historical":
                # Return the time horizon for historical scenarios, if available for the
                # given hazard type
                return historical_time_horizons.get(hazard_type, "")

            # Check if the hazard type is river flood
            if hazard_type == "river_flood":
                # Return the provided time horizon for river flood hazards
                return time_horizon

            # Check if the hazard type is tropical cyclone
            if hazard_type == "tropical_cyclone":
                # Return the mapped time horizon for future tropical cyclone scenarios,
                # if available
                return tropical_cyclone_future_mapping.get(time_horizon, "")

            # Default return if no match found
            return ""

        except Exception as exception:
            logger.log(
                "error",
                f"Error while trying to match hazard time horizon datasets. More info: {exception}",
            )
            return ""

    def get_hazard_dataset_properties(
        self, hazard_type: str, scenario: str, time_horizon: str, country: str
    ) -> dict:
        """
        Get the properties of a hazard dataset based on its type, scenario, time horizon,
        and country, to be used as search parameters in the CLIMADA API Client

        This method retrieves the properties of a hazard dataset based on its type, scenario,
        time horizon, and country. It determines the appropriate properties based on the provided
        parameters and returns them as a dictionary, to be used as search parameters in the
        CLIMADA API Client.

        :param hazard_type: The type of hazard for which to retrieve the dataset properties.
        :type hazard_type: str
        :param scenario: The scenario type, either "historical" or "future".
        :type scenario: str
        :param time_horizon: The time horizon for future scenarios.
        :type time_horizon: str
        :param country: The name of the country for which to retrieve the dataset properties.
        :type country: str
        :return: A dictionary containing the properties of the hazard dataset.
        :rtype: dict
        """
        hazard_properties = {}
        time_horizon = self.get_hazard_time_horizon(hazard_type, scenario, time_horizon)
        if hazard_type == "river_flood":
            hazard_properties = {
                "country_name": country,
                "climate_scenario": scenario,
                "year_range": time_horizon,
            }
        if hazard_type == "tropical_cyclone":
            hazard_properties = {
                "country_name": country,
                "climate_scenario": scenario if scenario != "historical" else None,
                "ref_year": time_horizon,
            }
        if hazard_type == "wildfire":
            hazard_properties = {
                "country_name": country,
                "climate_scenario": "histocial",
                "year_range": time_horizon,
            }
        if hazard_type == "earthquake":
            hazard_properties = {
                "country_name": country,
            }
        if hazard_type == "flood":
            hazard_properties = {
                "country_name": country,
                "year_range": time_horizon,
            }

        return hazard_properties

    def get_hazard(
        self,
        hazard_type: str,
        source: str = None,
        scenario: str = None,
        time_horizon: str = None,
        country: str = None,
        filepath: Path = None,
    ) -> Hazard:
        """
        Retrieve a Hazard object.

        This method retrieves a Hazard object based on the specified parameters, including the
        hazard type, source, scenario, time horizon, country, and filepath. It returns a Hazard
        object representing the retrieved dataset. Hazard objects can be obtained from external
        .mat, .hdf5 or raster files, or from the CLIMADA API Client.

        :param hazard_type: The type of hazard dataset to retrieve.
        :type hazard_type: str
        :param source: The source of the hazard dataset
            (e.g., "mat", "hdf5", "climada_api", "raster").
        :type source: str, optional
        :param scenario: The scenario type for future projections.
        :type scenario: str, optional
        :param time_horizon: The time horizon for future scenarios.
        :type time_horizon: str, optional
        :param country: The name of the country associated with the hazard dataset.
        :type country: str, optional
        :param filepath: The filepath to the hazard dataset file.
        :type filepath: Path, optional
        :return: A Hazard object representing the retrieved hazard dataset.
        :rtype: Hazard
        :raises ValueError: If the specified source is invalid.
        """
        if source and source not in ["mat", "hdf5", "climada_api", "raster"]:
            status_message = (
                "Error while trying to create hazard object. "
                "Source must be chosen from ['mat', 'hdf5', 'climada_api', 'raster']"
            )
            logger.log("error", status_message)
            raise ValueError(status_message)
        if not source:
            if hazard_type == "drought":
                source = "hdf5"
            if hazard_type == "flood":
                source = "raster"
            if hazard_type == "heatwaves":
                source = "hdf5"
        if source == "climada_api":
            hazard = self._get_hazard_from_client(hazard_type, scenario, time_horizon, country)
        if source == "raster":
            hazard = self._get_hazard_from_raster(filepath, hazard_type)
        if source == "mat":
            hazard = self._get_hazard_from_mat(filepath)
        if source == "hdf5":
            hazard = self._get_hazard_from_h5(filepath)
            # Quick fix to change the hazard type from DR to D for droughts
            if hazard_type == "drought":
                hazard.haz_type = "D"

        return hazard

    def _get_hazard_from_client(
        self, hazard_type: str, scenario: str, time_horizon: str, country: str
    ):
        """
        Retrieve a hazard dataset from the Climada API.

        This method retrieves a hazard dataset from the Climada API based on the specified hazard
        type, scenario, time horizon, and country. It returns a Hazard object representing the
        retrieved dataset.

        :param hazard_type: The type of hazard dataset to retrieve.
        :type hazard_type: str
        :param scenario: The scenario type for future projections.
        :type scenario: str
        :param time_horizon: The time horizon for future scenarios.
        :type time_horizon: str
        :param country: The name of the country associated with the hazard dataset.
        :type country: str
        :return: A Hazard object representing the retrieved hazard dataset.
        :rtype: Hazard
        :raises ValueError: If an error occurs while retrieving the hazard dataset.
        """
        hazard_properties = self.get_hazard_dataset_properties(
            hazard_type, scenario, time_horizon, country
        )
        try:
            hazard = self.client.get_hazard(
                hazard_type=hazard_type,
                properties=hazard_properties,
                dump_dir=DATA_HAZARDS_DIR,
            )
            hazard.intensity_thres = self.get_hazard_intensity_thres(hazard)
            status_message = "Finished fetching hazards from client"
            logger.log("info", status_message)
            return hazard

        except Exception as exc:
            status_message = f"Error while trying to create hazard object. More info: {exc}"
            logger.log("error", status_message)
            raise ValueError(status_message) from exc

    def _get_hazard_from_raster(self, filepath: Path, hazard_type: str) -> Hazard:
        try:
            hazard_code = self.get_hazard_code(hazard_type)
            # Fallback return periods scenario 10, 25, 50, 100 years
            frequency = [0.1, 0.04, 0.02, 0.01]
            if hazard_code == "HW":
                # Return periods for heatwaves are 10, 25, 50, 75, 100 years
                frequency = [0.1, 0.04, 0.02, 0.01333, 0.01]
            elif hazard_code == "FL":
                # Return periods for floods are 2, 5, 10, 25 years
                frequency = [0.5, 0.2, 0.1, 0.04]
            events = [i for i in range(1, len(frequency) + 1)]
            hazard = Hazard.from_raster(
                DATA_HAZARDS_DIR / filepath,
                attrs={
                    "frequency": np.array(frequency),
                    "event_id": np.array(events),
                    "units": "m",
                },
                haz_type=hazard_code,
                band=events,
            )
            # Set intensity threshold. This step is required to generate meaningful maps
            # as CLIMADA sets intensity_thres = 10 and in certain hazards this excludes all values.
            intensity_thres = self.get_hazard_intensity_thres(hazard_type)
            hazard.intensity_thres = intensity_thres

            # Set the hazard code
            hazard.haz_type = hazard_code
            # Hazard intensity units are set according to the selected Entity file.
            hazard.units = "m"

            # This step is required to generate the lat/long columns and avoid issues
            # with array size mismatch
            hazard.centroids.set_geometry_points()
            hazard.check()

            return hazard
        except Exception as exception:
            logger.log(
                "error",
                "An unexpected error occurred while trying to create hazard object from mat file."
                f"More info: {exception}",
            )
            return None

    def _get_hazard_from_h5(self, filepath: Path) -> Hazard:
        """
        Retrieve a hazard dataset from an HDF5 file.

        This method retrieves a hazard dataset from an HDF5 file located at the specified
        filepath. It returns a Hazard object representing the retrieved dataset.

        :param filepath: The filepath to the HDF5 file containing the hazard dataset.
        :type filepath: Path
        :return: A Hazard object representing the retrieved hazard dataset.
        :rtype: Hazard
        """
        try:
            hazard = Hazard().from_hdf5(DATA_HAZARDS_DIR / filepath)
            hazard_type = hazard.haz_type
            # Set intensity threshold according to hazard type
            intensity_thres = self.get_hazard_intensity_thres(hazard_type)
            hazard.intensity_thres = intensity_thres
            hazard.check()

            return hazard
        except Exception as exception:
            logger.log(
                "error",
                "An unexpected error occurred while trying to create hazard object from h5 file."
                f"More info: {exception}",
            )
            return None

    def _get_hazard_from_mat(self, filepath: Path) -> Hazard:
        """
        Retrieve a hazard dataset from a MATLAB file.

        This method retrieves a hazard dataset from a MATLAB file located at the specified
        filepath. It returns a Hazard object representing the retrieved dataset.

        :param filepath: The filepath to the MATLAB file containing the hazard dataset.
        :type filepath: Path
        :return: A Hazard object representing the retrieved hazard dataset.
        :rtype: Hazard
        :raises ValueError: If an error occurs while retrieving the hazard dataset.
        """
        try:
            hazard = Hazard().from_mat(DATA_HAZARDS_DIR / filepath)
            hazard_type = hazard.haz_type
            # Set intensity threshold according to hazard type
            intensity_thres = self.get_hazard_intensity_thres(hazard_type)
            hazard.intensity_thres = intensity_thres
            # Hazard intensity units are set according to the selected Entity file.
            hazard.units = ""

            return hazard
        except Exception as exception:
            logger.log(
                "error",
                "An unexpected error occurred while trying to create hazard object from mat file."
                f"More info: {exception}",
            )
            return None

    def get_hazard_intensity_thres(self, hazard_type: str) -> float:
        """
        Get the intensity threshold for a given hazard type.

        This method returns the intensity threshold corresponding to the specified hazard type.

        :param hazard_type: The type of hazard for which to retrieve the intensity threshold.
        :type hazard_type: str
        :return: The intensity threshold for the specified hazard type.
        :rtype: float
        """
        intensity_thres = -100
        if hazard_type == "RF":
            intensity_thres = 1
        elif hazard_type == "FL":
            intensity_thres = 0
        elif hazard_type == "HW":
            intensity_thres = 0
        elif hazard_type in ["D", "DR"]:
            intensity_thres = -4  # TODO: Test if this is correct
        return intensity_thres

    def get_hazard_intensity_units_from_entity(self, entity: Entity) -> str:
        """
        Retrieve the intensity unit associated from the Entity impact function.

        This method extracts the unique category ID from an entity's exposures and uses it to
        fetch the corresponding impact function. It then retrieves the intensity unit from this
        impact function. If the entity's exposures have more than one unique category ID,
        a ValueError is raised.

        :param entity: The entity containing exposure data and impact functions.
        :type entity: Entity
        :return: The intensity unit associated with the entity's category ID.
        :rtype: str
        :raises ValueError: If there are multiple different category IDs in the impact functions.
        """
        # Extract unique category IDs from the entity's geodataframe
        category_ids = entity.exposures.gdf["category_id"].unique()

        # Check if all category IDs are identical (only one unique value)
        if len(np.unique(category_ids)) != 1:
            # If there are multiple unique category IDs, raise an error
            raise ValueError(
                "There are multiple different 'category_id' values in the entity's exposures."
            )

        # Retrieve the impact function associated with the first (and only) category ID
        impf = entity.impact_funcs.get_func(fun_id=category_ids[0])[0]

        # Return the intensity unit, default to an empty string if not present
        return impf.intensity_unit or ""

    def get_custom_rp_per_hazard(self, hazard_code: str) -> tuple:
        """
        This method returns the return periods in tuple form, from a UNU-EHS tailored
        hazard file.

        :param hazard_code: The hazard code.
        :type hazard_code: str
        :return: Return periods.
        :rtype: tuple
        """
        if hazard_code in ["FL"]:
            return (2, 5, 10, 25)
        elif hazard_code in ["D", "HW"]:
            return (10, 25, 50, 75, 100)
        return (10, 25, 50, 100)

    def get_circle_radius(self, hazard_type: str) -> int:
        """
        Return the radius of a circle based on the hazard type.

        This method returns the radius of a circle based on the specified hazard type.

        :param hazard_type: The type of hazard.
        :type hazard_type: str
        :return: The radius of the circle.
        :rtype: int
        """
        radius = 2000
        if hazard_type == "D":
            radius = 11000
        if hazard_type == "FL":
            radius = 2000
        if hazard_type == "HW":
            radius = 9000
        return radius

    def assign_levels(self, hazard_gdf, percentile_values):
        for rp, levels in percentile_values.items():
            # Determine if the levels are ascending or descending
            is_ascending = levels[0] < levels[-1]

            # Initialize an empty list to store the levels
            level_column = []

            # Iterate through each row in the DataFrame
            for index, row in hazard_gdf.iterrows():
                value = row[rp]

                # Determine the level based on the value
                if is_ascending:
                    if value < levels[0]:
                        level_column.append(1)
                    elif value >= levels[-1]:
                        level_column.append(len(levels))
                    else:
                        for i in range(1, len(levels)):
                            if levels[i - 1] <= value < levels[i]:
                                level_column.append(i)
                                break
                else:
                    if value > levels[0]:
                        level_column.append(1)
                    elif value <= levels[-1]:
                        level_column.append(len(levels))
                    else:
                        for i in range(1, len(levels)):
                            # Adjusted comparison to ensure correct level assignment
                            if levels[i - 1] >= value > levels[i]:
                                level_column.append(i)
                                break

            # Add the level column to the DataFrame
            hazard_gdf[rp + "_level"] = level_column

        return hazard_gdf

    def generate_hazard_geojson(
        self,
        hazard: Hazard,
        country_name: str,
        return_periods: tuple,
    ):
        """
        Generate GeoJSON data for hazard points.

        This method generates GeoJSON data for hazard points based on the specified hazard,
        country name, and return periods.

        :param hazard: The hazard object.
        :type hazard: Hazard
        :param country_name: The name of the country.
        :type country_name: str
        :param return_periods: Tuple of return periods, defaults to (10, 15, 20, 25).
        :type return_periods: tuple, optional
        """
        try:
            country_iso3 = self.base_handler.get_iso3_country_code(country_name)
            admin_gdf = self.base_handler.get_admin_data(country_iso3, 2)

            # The latest .h5 Thailand - Drought hazard files have minor inconsistencies compared
            # to the other ones (lat/lon values not present). Use this to populate the coord
            # hazard attribute from the meta group if no centroid lat/lon values are available.
            hazard._set_coords_centroids()

            coords = np.array(hazard.centroids.coord)
            # TODO: There's an issue with the UNU EHS ERA hazard datasets. These datasets contain
            # the RPL calculated values and not the absolute hazard intensity values.
            # This means that calculating the local exceedance intensity values is wrong,
            # as it's already pre-calculated. Each dataset contains bands that represent
            # the separate return periods, so hazard.intensity can be used directly to
            # get the return period losses, without using the local_exceedance_inten method.

            # Local exceedance intensity calculation
            # local_exceedance_inten = hazard.local_exceedance_inten(return_periods)
            # local_exceedance_inten = pd.DataFrame(local_exceedance_inten).T

            local_exceedance_inten = pd.DataFrame(
                hazard.intensity.toarray().T, columns=[f"rp{year}" for year in return_periods]
            )
            data = np.column_stack((coords, local_exceedance_inten))
            columns = ["latitude", "longitude"] + [f"rp{rp}" for rp in return_periods]

            hazard_df = pd.DataFrame(data, columns=columns)

            # Round the hazard rp values to 2 decimal places. Update is vectorized and efficient
            # for large datasets
            hazard_df.update(hazard_df[[f"rp{rp}" for rp in return_periods]].round(1))
            geometry = [Point(xy) for xy in zip(hazard_df["longitude"], hazard_df["latitude"])]
            hazard_gdf = gpd.GeoDataFrame(hazard_df, geometry=geometry, crs="EPSG:4326")

            # Filter hazard_gdf to exclude rows where all return period values are zero
            hazard_gdf = hazard_gdf[
                (hazard_gdf[[f"rp{rp}" for rp in return_periods]] != 0).any(axis=1)
            ]

            # Calculate percentiles for each return period
            percentile_values = {}
            percentiles = (20, 40, 60, 80)
            for rp in return_periods:
                rp_data = hazard_gdf[f"rp{rp}"]
                percentile_values[f"rp{rp}"] = np.percentile(rp_data, percentiles).round(1).tolist()
                if hazard.haz_type == "D":
                    percentile_values[f"rp{rp}"].reverse()
                    percentile_values[f"rp{rp}"].append(-4)
                else:
                    percentile_values[f"rp{rp}"].insert(0, 0)

            # Assign levels based on the percentile values
            hazard_gdf = self.assign_levels(hazard_gdf, percentile_values)

            # Spatial join with administrative area
            joined_gdf = gpd.sjoin(hazard_gdf, admin_gdf, how="left", predicate="within")
            # Remove points outside of the country
            joined_gdf = joined_gdf[~joined_gdf["country"].isna()]
            joined_gdf = joined_gdf.drop(columns=["latitude", "longitude", "index_right"])
            joined_gdf = joined_gdf.reset_index(drop=True)

            radius = self.get_circle_radius(hazard.haz_type)

            # Convert to GeoJSON for this layer and add to all_layers_geojson
            hazard_geojson = joined_gdf.__geo_interface__
            hazard_geojson["_metadata"] = {
                "percentile_values": percentile_values,
                "radius": radius,
                "return_periods": return_periods,
                "title": f"Hazard ({hazard.units})" if hazard.units else "Hazard",
                "unit": hazard.units,
            }

            # Save the combined GeoJSON file
            map_data_filepath = DATA_TEMP_DIR / "hazards_geodata.json"
            with open(map_data_filepath, "w", encoding="utf-8") as f:
                json.dump(hazard_geojson, f)
        except Exception as exception:
            logger.log("error", f"An unexpected error occurred. More info: {exception}")

    def get_hazard_code(self, hazard_type: str) -> str:
        """
        Retrieve the code corresponding to a given hazard type.

        This function maps a hazard type to its corresponding hazard code. If the hazard type
        is not recognized, it raises a ValueError.

        :param hazard_type: The type of hazard as a string.
        :type hazard_type: str
        :return: The hazard code corresponding to the provided hazard type.
        :rtype: str
        :raises ValueError: If the hazard type is not recognized.
        """
        # Map hazard types to their corresponding codes
        hazard_codes = {
            "tropical_cyclone": "TC",
            "river_flood": "RF",
            "storm_europe": "WS",
            "wildfire": "BF",
            "earthquake": "EQ",
            "flood": "FL",
            "flash_flood": "FL",
            "drought": "D",
            "heatwaves": "HW",
        }

        # Retrieve the code for the given hazard type
        code = hazard_codes.get(hazard_type, None)

        # Raise an exception if the hazard type is not found
        if code is None:
            # raise ValueError(f"Hazard type '{hazard_type}' is not recognized.")
            logger.log(
                "error",
                f"Hazard type '{hazard_type}' is not recognized.",
            )

        return code

    def get_hazard_name(self, hazard_code: str) -> str:
        """
        Retrieve the hazard type corresponding to a given hazard code.

        This function maps a hazard code to its corresponding hazard type. If the hazard code
        is not recognized, it raises a ValueError.

        :param hazard_code: The hazard code as a string.
        :type hazard_code: str
        :return: The hazard type corresponding to the provided hazard code.
        :rtype: str
        :raises ValueError: If the hazard code is not recognized.
        """
        # Map hazard codes to their corresponding types
        hazard_names = {
            "TC": "tropical_cyclone",
            "RF": "river_flood",
            "WS": "storm_europe",
            "BF": "wildfire",
            "EQ": "earthquake",
            "FL": "flood",
            "D": "drought",
            "HW": "heatwaves",
        }

        # Retrieve the hazard type for the given hazard code
        hazard_type = hazard_names.get(hazard_code, None)

        # Raise an exception if the hazard code is not found
        if hazard_type is None:
            logger.log(
                "error",
                f"Hazard code '{hazard_code}' is not recognized.",
            )

        return hazard_type

    def get_hazard_filename(self, hazard_code: str, country_code: str, scenario: str) -> str:
        """
        Get the hazard filename based on the request parameters.
        This helper method sets the hazard filename in a specific format to be searched
        in the data/hazards directory

        :param is_historical: Flag indicating whether historical hazard should be retrieved.
        :type is_historical: bool
        :return: The hazard filename.
        :rtype: str
        """
        if hazard_code == "D":
            hazard_filename = f"hazard_{hazard_code}_{country_code}_{scenario}.h5"
        elif hazard_code == "FL":
            hazard_filename = f"hazard_{hazard_code}_{country_code}_{scenario}.tif"
        elif hazard_code == "HW":
            hazard_filename = f"hazard_{hazard_code}_{country_code}_{scenario}.h5"
        return hazard_filename

    def generate_hazard_report_dataset(
        self, hazard: Hazard, country_name: str, return_periods: tuple
    ) -> pd.DataFrame:
        """
        Generate a dataset for hazard reporting.

        This method generates a dataset by spatially joining hazard data with administrative boundaries.
        It creates a DataFrame that includes columns for hazard return periods and administrative layers.

        :param hazard: The Hazard object containing the hazard data.
        :type hazard: Hazard
        :param country_name: The name of the country for which the dataset is generated.
        :type country_name: str
        :param return_periods: Tuple of return periods to include in the dataset.
        :type return_periods: tuple
        :return: A DataFrame containing the merged hazard and administrative data.
        :rtype: pd.DataFrame

        Example usage:

        .. code-block:: python

            final_df = base_handler.generate_hazard_report_dataset(hazard, "EGY", (10, 15, 20, 25))
            print(final_df.head())
        """
        try:
            # Cast hazard data to a DataFrame
            coords = np.array(hazard.centroids.coord)
            local_exceedance_inten = pd.DataFrame(
                hazard.intensity.toarray().T, columns=[f"rp{year}" for year in return_periods]
            )
            data = np.column_stack((coords, local_exceedance_inten))
            columns = ["latitude", "longitude"] + [f"rp{rp}" for rp in return_periods]

            hazard_df = pd.DataFrame(data, columns=columns)
            hazard_df.update(hazard_df[[f"rp{rp}" for rp in return_periods]].round(1))
            geometry = [Point(xy) for xy in zip(hazard_df["longitude"], hazard_df["latitude"])]
            hazard_gdf = gpd.GeoDataFrame(hazard_df, geometry=geometry, crs="EPSG:4326")

            # Filter out rows where all return period values are zero
            hazard_gdf = hazard_gdf[
                (hazard_gdf[[f"rp{rp}" for rp in return_periods]] != 0).any(axis=1)
            ]

            # Retrieve the admin_gdf and perform spatial join
            country_iso3 = self.base_handler.get_iso3_country_code(country_name)
            layers = [1, 2]
            final_gdf = hazard_gdf.copy()

            # Iterate through each administrative layer
            for layer in layers:
                try:
                    # Retrieve the admin_gdf for the current layer
                    admin_gdf = self.base_handler.get_admin_data(country_iso3, layer)

                    # Perform spatial join with the current layer
                    joined_gdf = gpd.sjoin(final_gdf, admin_gdf, how="left", predicate="within")

                    # Add the admin column for this layer to final_gdf
                    final_gdf[f"admin{layer}"] = joined_gdf["name"]
                except Exception as e:
                    logger.log("error", f"Error processing layer {layer}: {str(e)}")
                    # Continue with the next layer if an error occurs
                    continue

            # Keep only the necessary columns for the final report
            final_df = final_gdf[
                ["admin1", "admin2", "latitude", "longitude"] + [f"rp{rp}" for rp in return_periods]
            ]

            # Clean up the DataFrame
            final_df = final_df.dropna(subset=["admin1", "admin2"], how="all")
            final_df = final_df.reset_index(drop=True)

            # Rename the columns
            column_mapping = {
                "admin1": "Admin 1",
                "admin2": "Admin 2",
                "latitude": "Latitude",
                "longitude": "Longitude",
            }
            # Add dynamic RP column renaming to the mapping
            column_mapping.update({f"rp{rp}": f"RP{rp}" for rp in return_periods})

            # Apply the renaming
            final_df = final_df.rename(columns=column_mapping)

            return final_df

        except AttributeError as e:
            logger.log("error", f"Invalid Hazard object: {str(e)}")
        except Exception as e:
            logger.log("error", f"An unexpected error occurred: {str(e)}")

        return pd.DataFrame()  # Return an empty DataFrame in case of failure
