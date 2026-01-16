from django.test import TestCase
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from ..models import WatchCity


class WatchCityModelTest(TestCase):
    def test_create_watch_city_with_all_fields(self):
        watch_city = WatchCity.objects.create(name="London", filter_wear=5, lat=51.5074, lon=-0.1278)
        self.assertEqual(watch_city.name, "London")
        self.assertEqual(watch_city.filter_wear, 5)
        self.assertIsNotNone(watch_city.id)
        self.assertEqual(watch_city.lat, 51.5074)
        self.assertEqual(watch_city.lon, -0.1278)

    def test_create_watch_city_with_default_filter_wear(self):
        watch_city = WatchCity.objects.create(name="Edinburgh")
        self.assertEqual(watch_city.name, "Edinburgh")
        self.assertEqual(watch_city.filter_wear, 0)

    def test_create_watch_city_with_default_lat_lon(self):
        watch_city = WatchCity.objects.create(name="Berlin")
        self.assertEqual(watch_city.lat, 0.0)
        self.assertEqual(watch_city.lon, 0.0)

    def test_watch_city_name_max_length(self):
        name_50_chars = "a" * 50
        watch_city = WatchCity.objects.create(name=name_50_chars)
        self.assertEqual(len(watch_city.name), 50)

    def test_watch_city_name_exceeds_max_length(self):
        name_51_chars = "a" * 51
        watch_city = WatchCity(name=name_51_chars)
        with self.assertRaises(ValidationError):
            watch_city.full_clean()

    def test_watch_city_name_unique_constraint(self):
        WatchCity.objects.create(name="Paris", filter_wear=10)
        with self.assertRaises(IntegrityError):
            WatchCity.objects.create(name="Paris", filter_wear=20)
