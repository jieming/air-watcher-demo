import os
import warnings
from django.apps import AppConfig
from urllib3.exceptions import InsecureRequestWarning

from .scheduler import start_scheduler


class AirWatcherAppConfig(AppConfig):
    name = "air_watcher_app"

    def ready(self):
        # Suppress SSL warnings globally when SSL verification is disabled
        warnings.simplefilter("ignore", InsecureRequestWarning)
        
        if os.environ.get("RUN_MAIN") == "true":
            start_scheduler()
