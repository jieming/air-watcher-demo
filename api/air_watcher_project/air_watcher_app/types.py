import strawberry
from strawberry.django import type
from .models import WatchCity


@type(WatchCity)
class WatchCityType:
    id: strawberry.ID
    name: str
    filter_wear: int
    lat: float
    lon: float
