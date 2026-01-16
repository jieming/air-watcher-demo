interface WatchCity {
    id: string
    name: string
    filterWear: number
    lat: number
    lon: number
}

interface WatchCityQuery {
    watchCities: WatchCity[]
}

export type { WatchCity, WatchCityQuery }
