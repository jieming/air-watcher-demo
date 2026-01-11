import CityDetails from './CityDetails'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { GET_WATCH_CITY } from '../../watch-city-list/watch-list-operations'
import type { WatchCityQuery } from '../../watch-city-list/watch-list-types'
import LoadingIndicator from '../loading-indicator/LoadingIndicator'

const CityDetailsContainer = () => {
    const { cityId } = useParams<{ cityId: string }>()
    const { loading, error, data } = useQuery<WatchCityQuery>(GET_WATCH_CITY, {
        variables: { id: cityId },
        skip: !cityId,
    })

    if (loading) {
        return <LoadingIndicator />
    }

    if (error) {
        console.error('Error fetching city details: ', error)
    }

    return <CityDetails city={data ? data.watchCities[0] : undefined} />
}

export default CityDetailsContainer
