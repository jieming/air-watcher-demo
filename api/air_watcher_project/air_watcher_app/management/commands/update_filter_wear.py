import logging
import sys
from django.core.management.base import BaseCommand
from django.db.models import F
from air_watcher_app.models import WatchCity
from air_watcher_app.services.openweather import fetch_air_pollution_aqi

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Increments filter_wear for cities that meet the condition."

    def handle(self, *args, **options):
        updated_count = 0
        message = "Starting to update filter_wear for watch cities."
        self.stdout.write(self.style.NOTICE(message))
        logger.info(message)

        for city in WatchCity.objects.all():
            try:
                aqi = fetch_air_pollution_aqi(city.lat, city.lon)
            except Exception as error:
                error_message = f"Failed to fetch AQI for {city.name}: {error}"
                self.stdout.write(self.style.ERROR(error_message))
                logger.error(error_message)

                continue

            # OpenWeather API returns AQI values as follows:
            # 1 = Good
            # 2 = Fair
            # 3 = Moderate
            # 4 = Poor
            # 5 = Very Poor
            if aqi >= 4:
                WatchCity.objects.filter(id=city.id).update(
                    filter_wear=F("filter_wear") + 1
                )
                updated_count += 1
                # Refresh to get updated filter_wear value
                city.refresh_from_db()
                success_message = f"Updated filter_wear for {city.name} to {city.filter_wear}."
                self.stdout.write(self.style.SUCCESS(success_message))
                logger.info(success_message)
        

        final_message = f"Updated filter_wear for {updated_count} watch cities."
        self.stdout.write(self.style.SUCCESS(final_message))
        logger.info(final_message)
      
