import { gql } from '@apollo/client'

export const GET_WATCH_CITIES = gql`
    query GetWatchCities {
        watchCities {
            id
            name
            filterWear
            lat
            lon
        }
    }
`
export const GET_WATCH_CITY = gql`
    query GetWatchCity($id: ID!) {
        watchCities(id: $id) {
            id
            name
            filterWear
            lat
            lon
        }
    }
`

export const CREATE_WATCH_CITY = gql`
    mutation CreateWatchCity($name: String!, $filterWear: Int!, $lat: Float!, $lon: Float!) {
        createWatchCity(name: $name, filterWear: $filterWear, lat: $lat, lon: $lon) {
            id
            name
            filterWear
            lat
            lon
        }
    }
`
