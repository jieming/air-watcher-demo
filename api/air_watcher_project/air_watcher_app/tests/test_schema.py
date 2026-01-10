from django.test import TestCase
from django.core.exceptions import ObjectDoesNotExist
from ..schema import WatchCityQuery, WatchCityMutation
from ..models import WatchCity


class WatchCityQueryTest(TestCase):
    def setUp(self):
        self.city1 = WatchCity.objects.create(name="London", filter_wear=5)
        self.city2 = WatchCity.objects.create(name="Edinburgh", filter_wear=3)
        self.query = WatchCityQuery()

    def test_watch_cities_without_id(self):
        result = self.query.watch_cities()
        self.assertEqual(len(result), 2)
        city_names = [city.name for city in result]
        self.assertIn("London", city_names)
        self.assertIn("Edinburgh", city_names)

    def test_watch_cities_with_id(self):
        result = self.query.watch_cities(id=str(self.city1.id))
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0].name, "London")
        self.assertEqual(result[0].filter_wear, 5)

    def test_watch_cities_with_nonexistent_id(self):
        with self.assertRaises(ObjectDoesNotExist):
            self.query.watch_cities(id="999")


class WatchCityMutationTest(TestCase):
    def setUp(self):
        self.mutation = WatchCityMutation()
        self.city = WatchCity.objects.create(name="Oxford", filter_wear=2)

    def test_create_watch_city(self):
        result = self.mutation.create_watch_city(name="Cambridge", filter_wear=4)
        self.assertEqual(result.name, "Cambridge")
        self.assertEqual(result.filter_wear, 4)
        self.assertIsNotNone(result.id)
        
        # Verify db persistence
        created_city = WatchCity.objects.get(id=result.id)
        self.assertEqual(created_city.name, "Cambridge")
        self.assertEqual(created_city.filter_wear, 4)

    def test_update_watch_city(self):
        result = self.mutation.update_watch_city(
            id=str(self.city.id), name="Oxford Updated", filter_wear=10
        )
        self.assertEqual(result.name, "Oxford Updated")
        self.assertEqual(result.filter_wear, 10)
        
        # Verify db update
        updated_city = WatchCity.objects.get(id=self.city.id)
        self.assertEqual(updated_city.name, "Oxford Updated")
        self.assertEqual(updated_city.filter_wear, 10)

    def test_update_watch_city_with_nonexistent_id(self):
        with self.assertRaises(ObjectDoesNotExist):
            self.mutation.update_watch_city(
                id="999", name="Non-existent", filter_wear=1
            )

    def test_delete_watch_city(self):
        """Test deleting a watch city."""
        city_id = str(self.city.id)
        city_name = self.city.name
        city_filter_wear = self.city.filter_wear
        
        result = self.mutation.delete_watch_city(id=city_id)
        
        # Verify the returned object
        self.assertEqual(result.name, city_name)
        self.assertEqual(result.filter_wear, city_filter_wear)
        
        # Verify db deletion
        with self.assertRaises(ObjectDoesNotExist):
            WatchCity.objects.get(id=city_id)

    def test_delete_watch_city_with_nonexistent_id(self):
        with self.assertRaises(ObjectDoesNotExist):
            self.mutation.delete_watch_city(id="999")
