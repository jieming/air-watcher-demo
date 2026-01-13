import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client/react'
import { Provider } from 'react-redux'
import { apolloClient } from './apollo-client'
import { store } from './store/store'

import WatchCityListContainer from './components/watch-city-list/WatchCityListContainer'
import CityDetailsContainer from './components/city-details/CityDetailsContainer'
import RouteNotFound from './components/common/route-not-found/RouteNotFound'
import Notification from './components/common/notification/Notification'
import './index.css'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/watch-list" replace />,
        errorElement: <RouteNotFound />,
    },
    {
        path: '/watch-list',
        element: <WatchCityListContainer />,
        children: [
            {
                path: ':cityId',
                element: <CityDetailsContainer />,
            },
        ],
    },
])

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <ApolloProvider client={apolloClient}>
                <RouterProvider router={router} />
                <Notification />
            </ApolloProvider>
        </Provider>
    </StrictMode>
)
