import { ApolloClient, InMemoryCache } from '@apollo/client'
import { HttpLink } from '@apollo/client/link/http'

const getBaseUrl = () => {
    const protocol = window.location.protocol
    const hostname = window.location.hostname
    const port = import.meta.env.VITE_BACKEND_API_PORT || '8000'
    return `${protocol}//${hostname}:${port}`
}

const httpLink = new HttpLink({
    uri: `${getBaseUrl()}/watch-cities/`,
})

export const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
})
