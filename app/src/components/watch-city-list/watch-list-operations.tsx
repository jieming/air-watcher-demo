import { gql } from "@apollo/client"

export const GET_WATCH_CITIES = gql`
  query GetWatchCities {
    watchCities {
      id
      name
      filterWear
    }
  }
`
