import strawberry
from typing import List
from .types import WatchCityType
from .models import WatchCity


@strawberry.type
class WatchCityQuery:
    @strawberry.field
    def watch_cities(self, id: strawberry.ID = None) -> List[WatchCityType]:
        if id:
            return [WatchCity.objects.get(id=id)]

        return WatchCity.objects.all()


@strawberry.type
class WatchCityMutation:
    @strawberry.field
    def create_watch_city(
        self,
        name: str,
        filter_wear: int,
        lat: float,
        lon: float,
    ) -> WatchCityType:
        watch_city = WatchCity.objects.create(
            name=name, filter_wear=filter_wear, lat=lat, lon=lon
        )
        return watch_city

    @strawberry.field
    def update_watch_city(
        self,
        id: strawberry.ID,
        name: str,
        filter_wear: int,
        lat: float,
        lon: float,
    ) -> WatchCityType:
        watch_city = WatchCity.objects.get(id=id)
        watch_city.name = name
        watch_city.filter_wear = filter_wear
        watch_city.lat = lat
        watch_city.lon = lon
        watch_city.save()
        return watch_city

    @strawberry.field
    def delete_watch_city(self, id: strawberry.ID) -> WatchCityType:
        watch_city = WatchCity.objects.get(id=id)
        deleted_watch_city = WatchCityType(
            id=watch_city.id,
            name=watch_city.name,
            filter_wear=watch_city.filter_wear,
            lat=watch_city.lat,
            lon=watch_city.lon,
        )
        watch_city.delete()
        return deleted_watch_city


watch_city_schema = strawberry.Schema(query=WatchCityQuery, mutation=WatchCityMutation)
