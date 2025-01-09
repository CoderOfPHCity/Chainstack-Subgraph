// src/graph-client.js
// Import the generated graph client
const graphClient = require('./.graphclient');

// Query to fetch pool data
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

// Query to fetch token data
const tokenQuery = `
query {
    tokens(first: 10) {
        id
        name
        symbol
    }
}`;

/**
 * Function to fetch and log pool and token data.
 */
async function getQueryData() {
    try {
        // Fetch pool data
        const poolsResult = await graphClient.execute(poolsQuery, {});
        console.log('Pools:', poolsResult.data.pools);

        // Fetch token data
        const tokenResult = await graphClient.execute(tokenQuery, {});
        console.log('Tokens:', tokenResult.data.tokens);
    } catch (error) {
        console.error('Error fetching query data:', error);
    }
}

// Call the function to fetch and log the data
getQueryData();

