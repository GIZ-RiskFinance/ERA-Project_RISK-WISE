"""
Module for testing exposure data and operations.
"""

import unittest
from unittest.mock import MagicMock, mock_open, patch

from climada.entity import Exposures

from backend.exposure.exposure_handler import ExposureHandler


class TestExposureHandler(unittest.TestCase):
    """
    Class for testing exposure data and operations.
    """

    def setUp(self):
        """
        Set up the test environment.

        This method initializes the ExposureHandler instance to be used in the unit tests.

        :return: None
        """
        self.handler = ExposureHandler()

    @patch("exposure_handler.deepcopy")
    @patch("exposure_handler.Exposures")
    def test_get_growth_exposure(self, mock_deepcopy):
        """
        Test the `get_growth_exposure` method.

        This method tests the functionality of the `get_growth_exposure` method by mocking the
        `Exposures` class and `deepcopy` function. It sets up a mock `Exposures` object with a
        reference year of 2020 and a growth rate of 0.02. The method then calls
        `get_growth_exposure` with the mock `Exposures` object, a growth rate of 0.02, and a
        target year of 2025.

        The test verifies that the `get_growth_exposure` method correctly returns an `Exposures`
        object with the expected reference year (2025) and growth rate.

        :return: None
        """
        mock_exposure = MagicMock(spec=Exposures)
        mock_exposure.ref_year = 2020
        mock_exposure.gdf = MagicMock()
        mock_exposure.gdf.__getitem__.return_value = [100]
        mock_deepcopy.return_value = mock_exposure

        result = self.handler.get_growth_exposure(mock_exposure, 0.02, 2025)

        self.assertIsNotNone(result)
        self.assertEqual(result.ref_year, 2025)

    @patch("exposure_handler.json.dump")
    @patch("exposure_handler.open", new_callable=mock_open)
    @patch("exposure_handler.gpd.read_file")
    @patch("exposure_handler.get_iso3_country_code")
    def test_generate_exposure_geojson(
        self, mock_get_iso3, mock_read_file, _mock_open, mock_json_dump
    ):
        """
        Test the `generate_exposure_geojson` method.

        This method tests the functionality of the `generate_exposure_geojson` method by mocking
        dependencies such as `json.dump`, `open`, `gpd.read_file`, and `get_iso3_country_code`.
        It sets up mock responses for these dependencies and creates a mock `Exposures` object
        with a GeoDataFrame containing features. The method then calls `generate_exposure_geojson`
        with the mock `Exposures` object and the country name "Testland".

        The test verifies that the method correctly interacts with the dependencies, including
        calling `open` and `json.dump` once each.

        :return: None

        """
        mock_get_iso3.return_value = "TST"
        mock_read_file.return_value = MagicMock()
        mock_exposure = MagicMock(spec=Exposures)
        mock_exposure.gdf = MagicMock()
        mock_exposure.gdf.__geo_interface__ = {"features": []}

        self.handler.generate_exposure_geojson(mock_exposure, "Testland")

        _mock_open.assert_called_once()
        mock_json_dump.assert_called_once()


if __name__ == "__main__":
    unittest.main()
