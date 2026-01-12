import { useState, useEffect } from 'react'
import CityDetails from './CityDetails'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { GET_WATCH_CITY } from '../watch-city-list/watch-list-operations'
import type { WatchCityQuery } from '../watch-city-list/watch-list-types'
import LoadingIndicator from '../common/loading-indicator/LoadingIndicator'
import {
    fetchGeocoding,
    fetchAirPolutionData,
    type AirPollutionData,
} from '../../services/openweather_api'

const CityDetailsContainer = () => {
    const { cityId } = useParams<{ cityId: string }>()
    const { loading, error, data } = useQuery<WatchCityQuery>(GET_WATCH_CITY, {
        variables: { id: cityId },
        skip: !cityId,
    })
    const [geocodingData, setGeocodingData] = useState<{
        lat: number
        lon: number
    } | null>(null)

    const [geocodingError, setGeocodingError] = useState<string | null>(null)

    const [airPollutionData, setAirPollutionData] =
        useState<AirPollutionData | null>(null)

    const [airPollutionError, setAirPollutionError] = useState<string | null>(
        null
    )

    useEffect(() => {
        const city = data?.watchCities?.[0]
        if (!city?.name) {
            return
        }

        const loadGeocoding = async () => {
            setGeocodingError(null)
            try {
                const coordinates = await fetchGeocoding(city.name)
                setGeocodingData(coordinates)
            } catch (err) {
                setGeocodingError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to fetch coordinates'
                )
            }
        }

        loadGeocoding()
    }, [data?.watchCities])

    useEffect(() => {
        if (!geocodingData) {
            return
        }

        const loadAirPollution = async () => {
            setAirPollutionError(null)
            try {
                const pollutionData = await fetchAirPolutionData(
                    geocodingData.lat,
                    geocodingData.lon
                )
                setAirPollutionData(pollutionData)
            } catch (err) {
                setAirPollutionError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to fetch air pollution data'
                )
            }
        }

        loadAirPollution()
    }, [geocodingData])

    if (loading) {
        return <LoadingIndicator />
    }

    if (error) {
        console.error('Error fetching city details: ', error)
    }

    return (
        <CityDetails
            city={data ? data.watchCities[0] : undefined}
            coordinates={geocodingData}
            coordinatesError={geocodingError}
            airPollutionData={airPollutionData}
            airPollutionError={airPollutionError}
        />
    )
}

export default CityDetailsContainer
