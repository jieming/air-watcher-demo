import random
import os
import json
import ssl
import urllib.request
import urllib.parse
from django.core.management.base import BaseCommand
from air_watcher_app.models import WatchCity


class Command(BaseCommand):
    help = "Creates 10 watch cities with random filter_wear values (0-120)"

    def fetch_geocoding(self, city_name: str):
        """Fetch latitude and longitude for a city using OpenWeather Geocoding API."""
        api_key = os.environ.get("OPENWEATHER_API_KEY", "4e1f33381e075055f9208dbce64743dc")
        encoded_city = urllib.parse.quote(city_name)
        url = f"https://api.openweathermap.org/geo/1.0/direct?q={encoded_city}&limit=1&appid={api_key}"

        try:
            # Create SSL context that doesn't verify certificates
            ssl_context = ssl.create_default_context()
            ssl_context.check_hostname = False
            ssl_context.verify_mode = ssl.CERT_NONE

            with urllib.request.urlopen(url, context=ssl_context) as response:
                if response.status != 200:
                    raise Exception(f"API returned status {response.status}")
                data = json.loads(response.read().decode())
                if not data or len(data) == 0:
                    raise Exception(f"Location not found for {city_name}")
                return {"lat": data[0]["lat"], "lon": data[0]["lon"]}
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"Failed to fetch coordinates for {city_name}: {str(e)}")
            )
            return {"lat": 0.0, "lon": 0.0}

    def handle(self, *args, **options):
        cities = [
            "London",
            "Paris",
            "Berlin",
            "Madrid",
            "Rome",
            "Beijing",
            "Shanghai",
            "Vienna",
            "Sydney",
            "Edinburgh",
        ]

        created_count = 0
        for index, city_name in enumerate(cities):
            # Ensure first city has filter_wear > 100
            if index == 0:
                filter_wear = random.randint(101, 120)
            else:
                filter_wear = random.randint(0, 100)

            # Fetch coordinates for the city
            coordinates = self.fetch_geocoding(city_name)

            watch_city, created = WatchCity.objects.get_or_create(
                name=city_name,
                defaults={
                    "filter_wear": filter_wear,
                    "lat": coordinates["lat"],
                    "lon": coordinates["lon"],
                },
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f'Created "{city_name}" with filter_wear={filter_wear}, '
                        f'lat={coordinates["lat"]}, lon={coordinates["lon"]}'
                    )
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'City "{city_name}" already exists, skipped')
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"\nSuccessfully created {created_count} new watch cities."
            )
        )
