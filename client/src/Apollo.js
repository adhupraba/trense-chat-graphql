import React from 'react'
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, split } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'
import App from './App'

let httpLink = createHttpLink({
    uri: 'http://localhost:4000'
})

const authLink = setContext((operation, { headers }) => {
    const token = localStorage.getItem('token')
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    }
})

httpLink = authLink.concat(httpLink)

const wsLink = new WebSocketLink({
    uri: 'ws://localhost:4000/graphql',
    options: {
        reconnect: true,
        connectionParams: {
            // you can name the key as anything
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
    }
})

const splitLink = split(({ query }) => {
    const definition = getMainDefinition(query)
    return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
    )
}, wsLink, httpLink)

const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache()
})

const Apollo = () => {
    return (
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    )
}

export default Apollo