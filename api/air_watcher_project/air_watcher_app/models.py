from django.db import models


class WatchCity(models.Model):
    name = models.CharField(max_length=50, unique=True, blank=False, null=False)
    filter_wear = models.IntegerField(default=0, blank=False, null=False)
