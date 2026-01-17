from unittest.mock import patch
from django.test import TestCase
from django.core.management import call_command
from io import StringIO

from ..models import WatchCity


class UpdateFilterWearCommandTest(TestCase):
    def setUp(self):
        self.city_low_aqi = WatchCity.objects.create(
            name="London", filter_wear=10, lat=51.5074, lon=-0.1278
        )
        self.city_high_aqi = WatchCity.objects.create(
            name="Beijing", filter_wear=20, lat=39.9042, lon=116.4074
        )
        self.city_very_high_aqi = WatchCity.objects.create(
            name="Delhi", filter_wear=30, lat=28.6139, lon=77.2090
        )

    @patch("air_watcher_app.management.commands.update_filter_wear.fetch_air_pollution_aqi")
    def test_update_filter_wear_threshold_at_4(self, mock_fetch_aqi):
        # Mock AQI values: London (AQI 2), Beijing (AQI 4), Delhi (AQI 5)
        mock_fetch_aqi.side_effect = [2, 4, 5]

        out = StringIO()
        call_command("update_filter_wear", stdout=out)

        self.city_high_aqi.refresh_from_db()
        self.city_very_high_aqi.refresh_from_db()
        self.city_low_aqi.refresh_from_db()

        # London (AQI 2) should not be incremented
        self.assertEqual(self.city_low_aqi.filter_wear, 10)
        # Beijing (AQI 4) should be incremented
        self.assertEqual(self.city_high_aqi.filter_wear, 21)
        # Delhi (AQI 5) should be incremented
        self.assertEqual(self.city_very_high_aqi.filter_wear, 31)

        output = out.getvalue()
        self.assertIn("Starting to update filter_wear for watch cities", output)
        self.assertIn("Updated filter_wear for Beijing", output)
        self.assertIn("Updated filter_wear for Delhi", output)
        self.assertIn("Updated filter_wear for 2 watch cities", output)
        

    @patch("air_watcher_app.management.commands.update_filter_wear.fetch_air_pollution_aqi")
    def test_update_filter_wear_handles_individual_api_error(self, mock_fetch_aqi):
        mock_fetch_aqi.side_effect = [
            RuntimeError("API error"),
            4,  
            5, 
        ]

        out = StringIO()
        call_command("update_filter_wear", stdout=out)

        self.city_high_aqi.refresh_from_db()
        self.city_very_high_aqi.refresh_from_db()
        self.city_low_aqi.refresh_from_db()

        # London failed, so not updated
        self.assertEqual(self.city_low_aqi.filter_wear, 10)
       
        self.assertEqual(self.city_high_aqi.filter_wear, 21)
        self.assertEqual(self.city_very_high_aqi.filter_wear, 31)

        output = out.getvalue()
        self.assertIn("Starting to update filter_wear for watch cities", output)
        self.assertIn("Failed to fetch AQI for London", output)
        self.assertIn("Updated filter_wear for Beijing", output)
        self.assertIn("Updated filter_wear for Delhi", output)
        self.assertIn("Updated filter_wear for 2 watch cities", output)

    @patch("air_watcher_app.management.commands.update_filter_wear.fetch_air_pollution_aqi")
    def test_update_filter_wear_no_cities_updated(self, mock_fetch_aqi):
        """Test command when no cities meet the condition"""
        mock_fetch_aqi.side_effect = [1, 2, 3]

        out = StringIO()
        call_command("update_filter_wear", stdout=out)

        output = out.getvalue()
        self.assertIn("Starting to update filter_wear for watch cities", output)
        self.assertIn("Updated filter_wear for 0 watch cities", output)
