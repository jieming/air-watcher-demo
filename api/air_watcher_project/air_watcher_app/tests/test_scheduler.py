from unittest.mock import patch, Mock, call
from django.test import TestCase
import time

from .. import scheduler
from ..scheduler import start_scheduler


class SchedulerTest(TestCase):
    def setUp(self):
        scheduler._scheduler = None

    def tearDown(self):
        if scheduler._scheduler and hasattr(scheduler._scheduler, 'running') and scheduler._scheduler.running:
            scheduler._scheduler.shutdown()
        scheduler._scheduler = None

    @patch("air_watcher_app.scheduler.BackgroundScheduler")
    def test_create_and_start_scheduler(self, mock_scheduler_class):
        mock_scheduler = Mock()
        mock_scheduler.running = False
        mock_scheduler_class.return_value = mock_scheduler

        start_scheduler()

        # Verify scheduler was created
        mock_scheduler_class.assert_called_once_with(timezone="UTC")
        # Verify job was added
        mock_scheduler.add_job.assert_called_once()
        # Verify scheduler was started
        mock_scheduler.start.assert_called_once()

    @patch("air_watcher_app.scheduler.BackgroundScheduler")
    def test_scheduler_configurations(self, mock_scheduler_class):
        mock_scheduler = Mock()
        mock_scheduler.running = False
        mock_scheduler_class.return_value = mock_scheduler

        start_scheduler()

        add_job_call = mock_scheduler.add_job.call_args

        self.assertEqual(add_job_call[0][0].__name__, "call_command")
        self.assertEqual(add_job_call[0][1], "interval")
        self.assertEqual(add_job_call[1]["args"], ["update_filter_wear"])
        self.assertEqual(add_job_call[1]["id"], "update_filter_wear_hourly")
        self.assertTrue(add_job_call[1]["replace_existing"])
        self.assertEqual(add_job_call[1]["hours"], 1)

    @patch("air_watcher_app.scheduler.BackgroundScheduler")
    def test_start_scheduler_does_not_start_twice(self, mock_scheduler_class):
        mock_scheduler = Mock()
        # Set scheduler to running so it doesn't start again
        mock_scheduler.running = True
        mock_scheduler_class.return_value = mock_scheduler

        scheduler._scheduler = mock_scheduler

        start_scheduler()

        mock_scheduler_class.assert_not_called()
        mock_scheduler.start.assert_not_called()

    @patch("air_watcher_app.scheduler.call_command")
    def test_scheduler_runs_command_with_short_interval(self, mock_call_command):
        from apscheduler.schedulers.background import BackgroundScheduler

        # Create a scheduler with 1 second interval for testing
        test_scheduler = BackgroundScheduler(timezone="UTC")
        test_scheduler.add_job(
            mock_call_command,
            "interval",
            args=["update_filter_wear"],
            id="test_update_filter_wear",
            replace_existing=True,
            seconds=1,
        )
        test_scheduler.start()

        try:
            time.sleep(2.5)

            # Verify command was called (at least once, possibly twice)
            self.assertGreaterEqual(mock_call_command.call_count, 1)
           
            mock_call_command.assert_has_calls(
                [call("update_filter_wear")] * mock_call_command.call_count
            )
        finally:
            test_scheduler.shutdown()
