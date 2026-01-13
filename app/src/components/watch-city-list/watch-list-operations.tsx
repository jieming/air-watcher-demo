import { gql } from '@apollo/client'

export const GET_WATCH_CITIES = gql`
    query GetWatchCities {
        watchCities {
            id
            name
            filterWear
        }
    }
`
export const GET_WATCH_CITY = gql`
    query GetWatchCity($id: ID!) {
        watchCities(id: $id) {
            id
            name
            filterWear
        }
    }
`

export const CREATE_WATCH_CITY = gql`
    mutation CreateWatchCity($name: String!, $filterWear: Int!) {
        createWatchCity(name: $name, filterWear: $filterWear) {
            id
            name
            filterWear
        }
    }
`
