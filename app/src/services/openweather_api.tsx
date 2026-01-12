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
