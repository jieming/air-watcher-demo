from django.test import TestCase
from django.core.exceptions import ObjectDoesNotExist
from ..schema import WatchCityQuery, WatchCityMutation
from ..models import WatchCity


class WatchCityQueryTest(TestCase):
    def setUp(self):
        self.city1 = WatchCity.objects.create(
            name="London", filter_wear=5, lat=51.5074, lon=-0.1278
        )
        self.city2 = WatchCity.objects.create(
            name="Edinburgh", filter_wear=3, lat=55.9533, lon=-3.1883
        )
        self.query = WatchCityQuery()

    def test_watch_cities_without_id(self):
        result = self.query.watch_cities()
        self.assertEqual(len(result), 2)
        city_names = [city.name for city in result]
        self.assertIn("London", city_names)
        self.assertIn("Edinburgh", city_names)
        self.assertEqual(result[0].filter_wear, 5)
        self.assertEqual(result[1].filter_wear, 3)
        self.assertEqual(result[0].lat, 51.5074)
        self.assertEqual(result[0].lon, -0.1278)
        self.assertEqual(result[1].lat, 55.9533)
        self.assertEqual(result[1].lon, -3.1883)

    def test_watch_cities_with_id(self):
        result = self.query.watch_cities(id=str(self.city1.id))
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0].name, "London")
        self.assertEqual(result[0].filter_wear, 5)
        self.assertEqual(result[0].lat, 51.5074)
        self.assertEqual(result[0].lon, -0.1278)

    def test_watch_cities_with_nonexistent_id(self):
        with self.assertRaises(ObjectDoesNotExist):
            self.query.watch_cities(id="999")


class WatchCityMutationTest(TestCase):
    def setUp(self):
        self.mutation = WatchCityMutation()
        self.city = WatchCity.objects.create(
            name="Oxford", filter_wear=2, lat=51.7520, lon=-1.2577
        )

    def test_create_watch_city(self):
        result = self.mutation.create_watch_city(
            name="Cambridge", filter_wear=4, lat=52.2053, lon=0.1218
        )
        self.assertEqual(result.name, "Cambridge")
        self.assertEqual(result.filter_wear, 4)
        self.assertEqual(result.lat, 52.2053)
        self.assertEqual(result.lon, 0.1218)
        self.assertIsNotNone(result.id)
        created_city = WatchCity.objects.get(id=result.id)
        self.assertEqual(created_city.name, "Cambridge")
        self.assertEqual(created_city.filter_wear, 4)
        self.assertEqual(created_city.lat, 52.2053)
        self.assertEqual(created_city.lon, 0.1218)

    def test_update_watch_city(self):
        result = self.mutation.update_watch_city(
            id=str(self.city.id),
            name="Oxford Updated",
            filter_wear=10,
            lat=51.7521,
            lon=-1.2578,
        )
        self.assertEqual(result.name, "Oxford Updated")
        self.assertEqual(result.filter_wear, 10)
        self.assertEqual(result.lat, 51.7521)
        self.assertEqual(result.lon, -1.2578)
        
        updated_city = WatchCity.objects.get(id=self.city.id)
        self.assertEqual(updated_city.name, "Oxford Updated")
        self.assertEqual(updated_city.filter_wear, 10)
        self.assertEqual(updated_city.lat, 51.7521)
        self.assertEqual(updated_city.lon, -1.2578)

    def test_update_watch_city_with_nonexistent_id(self):
        with self.assertRaises(ObjectDoesNotExist):
            self.mutation.update_watch_city(
                id="999", name="Non-existent", filter_wear=1, lat=0.0, lon=0.0
            )

    def test_delete_watch_city(self):
        """Test deleting a watch city."""
        city_id = str(self.city.id)
        city_name = self.city.name
        city_filter_wear = self.city.filter_wear
        city_lat = self.city.lat
        city_lon = self.city.lon
        
        result = self.mutation.delete_watch_city(id=city_id)
        
        self.assertEqual(result.name, city_name)
        self.assertEqual(result.filter_wear, city_filter_wear)
        self.assertEqual(result.lat, city_lat)
        self.assertEqual(result.lon, city_lon)
        
        with self.assertRaises(ObjectDoesNotExist):
            WatchCity.objects.get(id=city_id)

    def test_delete_watch_city_with_nonexistent_id(self):
        with self.assertRaises(ObjectDoesNotExist):
            self.mutation.delete_watch_city(id="999")
