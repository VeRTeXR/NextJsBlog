import { ApolloClient, InMemoryCache } from 'apollo-boost'
// import { createHttpLink } from 'apollo-link-http'
import { createUploadLink } from 'apollo-upload-client'
import { setContext } from 'apollo-link-context'
import fetch from 'isomorphic-unfetch'
import config from '../config'
let apolloClient = null
// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
    global.fetch = fetch
}
function create (initialState, { getToken, req }) {
    // const httpLink = createHttpLink({
    //   uri: `${config.backendBaseUrl}/graphql/`,
    //   credentials: 'same-origin'
    // })
    const uploadLink = createUploadLink({
        uri: `${config.backendBaseUrl}/graphql/${req && req.url && req.url.indexOf('build_cache') > 0? '?build_cache=1': ''}`,
        credentials: 'same-origin'
    })
    const authLink = setContext((_, { headers }) => {
        const token = getToken()
        return {
            headers: {
                ...headers,
                authorization: token ? `JWT ${token}` : '',
                "Access-Control-Request-Method": "POST"
            }
        }
    })
    // TODO: implement cache later
    const defaultOptions = {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
            errorPolicy: 'ignore',
        },
        query: {
            fetchPolicy: 'cache-and-network',
            errorPolicy: 'all',
        },
    }
    // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
    return new ApolloClient({
        connectToDevTools: process.browser,
        ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
        link: authLink.concat(uploadLink),
        cache: new InMemoryCache().restore(initialState || {}),
        // defaultOptions: defaultOptions
    })
}
export default function initApollo (initialState, options) {
    // Make sure to create a new client for every server-side request so that data
    // isn't shared between connections (which would be bad)
    if (!process.browser) {
        return create(initialState, options)
    }
    // Reuse client on the client-side
    if (!apolloClient) {
        apolloClient = create(initialState, options)
    }
    return apolloClient
}