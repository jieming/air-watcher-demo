import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client/react'
import { apolloClient } from './apollo-client'

import WatchCityListContainer from './components/watch-city-list/WatchCityListContainer'
import CityDetailsContainer from './components/city-details/CityDetailsContainer'
import RouteNotFound from './components/common/route-not-found/RouteNotFound'
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
        <ApolloProvider client={apolloClient}>
            <RouterProvider router={router} />
        </ApolloProvider>
    </StrictMode>
)
