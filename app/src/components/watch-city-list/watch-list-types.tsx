interface WatchCity {
  id: string
  name: string
  filterWear: number
}

interface WatchCityQuery {
  watchCities: WatchCity[]
}

export type { WatchCity, WatchCityQuery }
