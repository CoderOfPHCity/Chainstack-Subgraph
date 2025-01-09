// src/urql-client.js

require('isomorphic-unfetch'); // Polyfill for older browsers
const { createClient } = require('urql');

// Set the query URL
const queryURL = "<CHAINSTACK_SUBGRAPH_QUERY_URL>";

// Create a new GraphQL client
const client = createClient({
    url: queryURL,
});

// Query to fetch the pool data
const poolsQuery = `
query {
    pools(first: 10) {
        id
        token0 {
            name
            id
            symbol
        }
        token1 {
            name
            id
            symbol
        }
        blockNumber
        timestamp
    }
}`;

/**
 * Function to fetch and log pool data using the URQL client.
 */
async function fetchData() {
    try {
        const queryResult = await client.query(poolsQuery).toPromise();
        console.log(queryResult.data.pools);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchData();

