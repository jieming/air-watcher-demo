import random
from django.core.management.base import BaseCommand
from air_watcher_app.models import WatchCity


class Command(BaseCommand):
    help = "Creates 10 watch cities with random filter_wear values (0-120)"

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
                filter_wear = random.randint(0, 120)
            watch_city, created = WatchCity.objects.get_or_create(
                name=city_name, defaults={"filter_wear": filter_wear}
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f'Created "{city_name}" with filter_wear={filter_wear}'
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
