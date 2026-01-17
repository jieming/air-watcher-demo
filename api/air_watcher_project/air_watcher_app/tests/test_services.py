from unittest.mock import patch, Mock
from django.test import TestCase
import requests

from ..services.openweather import fetch_air_pollution_aqi


class OpenWeatherServiceTest(TestCase):
    @patch.dict("os.environ", {"OPENWEATHER_API_KEY": "test_api_key"})
    @patch("air_watcher_app.services.openweather.requests.get")
    def test_fetch_air_pollution_aqi_success(self, mock_get):
        mock_response = Mock()
        mock_response.json.return_value = {
            "list": [
                {
                    "main": {"aqi": 3},
                    "components": {},
                }
            ]
        }
        mock_response.raise_for_status = Mock()
        mock_get.return_value = mock_response

        result = fetch_air_pollution_aqi(51.5074, -0.1278)

        self.assertEqual(result, 3)
        mock_get.assert_called_once()
        call_args = mock_get.call_args
        self.assertEqual(call_args[1]["params"]["lat"], 51.5074)
        self.assertEqual(call_args[1]["params"]["lon"], -0.1278)
        self.assertEqual(call_args[1]["params"]["appid"], "test_api_key")
        self.assertFalse(call_args[1]["verify"])
        self.assertEqual(call_args[1]["timeout"], 10)

    @patch.dict("os.environ", {}, clear=True)
    def test_fetch_air_pollution_aqi_missing_api_key(self):
        with self.assertRaises(RuntimeError) as context:
            fetch_air_pollution_aqi(51.5074, -0.1278)

        self.assertIn("OPENWEATHER_API_KEY is not set", str(context.exception))

    @patch.dict("os.environ", {"OPENWEATHER_API_KEY": "test_api_key"})
    @patch("air_watcher_app.services.openweather.requests.get")
    def test_fetch_air_pollution_aqi_http_error(self, mock_get):
        """Test that HTTP errors are raised"""
        mock_response = Mock()
        mock_response.raise_for_status.side_effect = requests.HTTPError("404 Not Found")
        mock_get.return_value = mock_response

        with self.assertRaises(requests.HTTPError):
            fetch_air_pollution_aqi(51.5074, -0.1278)

    @patch.dict("os.environ", {"OPENWEATHER_API_KEY": "test_api_key"})
    @patch("air_watcher_app.services.openweather.requests.get")
    def test_fetch_air_pollution_aqi_missing_list(self, mock_get):
        mock_response = Mock()
        mock_response.json.return_value = {}
        mock_response.raise_for_status = Mock()
        mock_get.return_value = mock_response

        with self.assertRaises(RuntimeError) as context:
            fetch_air_pollution_aqi(51.5074, -0.1278)

        self.assertIn("Air pollution data not found", str(context.exception))

    @patch.dict("os.environ", {"OPENWEATHER_API_KEY": "test_api_key"})
    @patch("air_watcher_app.services.openweather.requests.get")
    def test_fetch_air_pollution_aqi_empty_list(self, mock_get):
        mock_response = Mock()
        mock_response.json.return_value = {"list": []}
        mock_response.raise_for_status = Mock()
        mock_get.return_value = mock_response

        with self.assertRaises(RuntimeError) as context:
            fetch_air_pollution_aqi(51.5074, -0.1278)

        self.assertIn("Air pollution data not found", str(context.exception))