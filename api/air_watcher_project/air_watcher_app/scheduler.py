from apscheduler.schedulers.background import BackgroundScheduler
from django.core.management import call_command

_scheduler: BackgroundScheduler | None = None


def start_scheduler() -> None:
    global _scheduler
    if _scheduler and _scheduler.running:
        return

    scheduler = BackgroundScheduler(timezone="UTC")
    scheduler.add_job(
        call_command,
        "interval",
        args=["update_filter_wear"],
        id="update_filter_wear_hourly",
        replace_existing=True,
        hours=1,
    )
    scheduler.start()
    _scheduler = scheduler
