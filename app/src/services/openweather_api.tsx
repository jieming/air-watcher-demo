interface GeocodingResponse {
    name: string
    lat: number
    lon: number
    country: string
}

interface Coordinates {
    lat: number
    lon: number
}

export const fetchGeocoding = async (
    cityName: string
): Promise<Coordinates> => {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
    const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${apiKey}`
    )

    if (!response.ok) {
        throw new Error('Failed to fetch geocoding data')
    }

    const geocodingResults: GeocodingResponse[] = await response.json()

    if (!geocodingResults || geocodingResults.length === 0) {
        throw new Error('Location not found')
    }

    return {
        lat: geocodingResults[0].lat,
        lon: geocodingResults[0].lon,
    }
}

interface AirPollutionDetails {
    dt: number
    main: {
        aqi: number
    }
    components: {
        co: number
        no: number
        no2: number
        o3: number
        so2: number
        pm2_5: number
        pm10: number
        nh3: number
    }
}

interface AirPollutionResponse {
    coord: [number, number]
    list: AirPollutionDetails[]
}

export interface AirPollutionData {
    aqi: number
    components: {
        co: number
        no: number
        no2: number
        o3: number
        so2: number
        pm2_5: number
        pm10: number
        nh3: number
    }
}

export const fetchAirPolutionData = async (
    lat: number,
    lon: number
): Promise<AirPollutionData> => {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    )

    if (!response.ok) {
        throw new Error('Failed to fetch air pollution data')
    }

    const airPollutionData: AirPollutionResponse = await response.json()

    if (!airPollutionData.list || airPollutionData.list.length === 0) {
        throw new Error('Air pollution data not found')
    }

    const latestData = airPollutionData.list[0]

    return {
        aqi: latestData.main.aqi,
        components: latestData.components,
    }
}
