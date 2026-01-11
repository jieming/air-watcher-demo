import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client/react'
import { apolloClient } from './apollo-client'
import WatchCityListContainer from './components/watch-city-list/WatchCityListContainer'

import './index.css'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/watch-list" replace />,
    },
    {
        path: '/watch-list',
        element: <WatchCityListContainer />,
    },
])

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ApolloProvider client={apolloClient}>
            <RouterProvider router={router} />
        </ApolloProvider>
    </StrictMode>
)
