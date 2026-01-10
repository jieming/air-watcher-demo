import { useQuery } from "@apollo/client/react"
import { GET_WATCH_CITIES } from "./watch-list-operations"
import type { WatchCityQuery } from "./watch-list-types"

import WatchCityList from "./WatchCityList"
import LoadingIndicator from "../common/LoadingIndicator"

const WatchCityListContainer = () => {
  const { loading, error, data } = useQuery<WatchCityQuery>(GET_WATCH_CITIES)

  if (loading) {
    return <LoadingIndicator />
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return <WatchCityList cities={data ? data.watchCities : []} />
}

export default WatchCityListContainer
