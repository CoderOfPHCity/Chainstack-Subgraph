# Fetching Subgraph Data Using Chainstack on Kaia: A Developer's Guide

## Introduction

Efficient data retrieval and management are crucial challenges. While traditional methods of querying blockchain data directly can be resource-intensive and slow, subgraphs provide an elegant solution by indexing blockchain data and making it easily queryable. 

Building on our previous exploration of creating subgraphs on Kaia which can be found [Here](https://github.com/CoderOfPHCity/GraphQL-Subgraph-Query), this guide focuses on the practical aspects of fetching and utilizing this indexed data through Chainstack's infrastructure.

Chainstack Subgraphs offer a production-grade solution that eliminates the complexity of managing your own indexing infrastructure. 

In this tutorial, we'll explore various methods to fetch subgraph data, from simple HTTP requests to more sophisticated client libraries.

## Setting up the Prerequisites

Before we dive into the implementation, let's ensure we have everything needed to follow along:

1. Install the required dependencies:
```bash
mkdir chainstack-subgraph-demo
cd chainstack-subgraph-demo
npm init -y
npm install @graphprotocol/graph-cli @graphprotocol/graph-ts node-fetch graphql urql
```

2. Set up your environment variables:
```javascript
// config.js
module.exports = {
    CHAINSTACK_ENDPOINT: 'YOUR_CHAINSTACK_SUBGRAPH_ENDPOINT',
    API_KEY: 'YOUR_CHAINSTACK_API_KEY'
};
```

3. Create a basic project structure:
```
chainstack-subgraph-demo/
├── src/
│   ├── http-client.js
│   ├── graph-client.js
│   └── urql-client.js
├── config.js
└── package.json
```


## Using HTTP Requests

The foundation of subgraph data retrieval starts with HTTP requests. When you deploy a subgraph using Chainstack, you receive a dedicated Query URL that serves as your endpoint for data retrieval. This straightforward approach requires minimal setup while providing robust functionality.



> Note: We use node-fetch@2 specifically because it provides a more stable API for Node.js environments. While other HTTP clients like axios or got are available, node-fetch offers a familiar fetch API that's consistent with browser implementations.

### Basic Implementation
To send an HTTP request, we need to install an additional npm package called node-fetch, so:

1. Set up a new node project.
2. Open a new terminal in the root directory of your project.

Use the following command to install the node-fetch package:

`npm i node-fetch@2`

Here's a comprehensive example showing how to fetch token data from your Kaia subgraph:

```javascript
// Import the node-fetch package
const fetch = require('node-fetch');

/**
 * Function to fetch a list of tokens.
 * 
 * @param {number} number - Number of tokens required.
 */
async function getTokenList(number) {
    // Set the query URL
    const queryURL = "<https://chainstack-subgraphs-query-url>";
    
    // Define the query to fetch the specified number of tokens
    const query = `
        query {
            tokens(first: ${number}) {
                id
                name
                symbol
            }
        }
    `;
    
    // Set the request options
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
    };

    try {
        // Fetch the response
        const response = await fetch(queryURL, options);

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the body text as JSON
        const queryResult = await response.json();

        // Display the list of tokens
        console.log(queryResult.data.tokens);
    } catch (error) {
        console.error('Error fetching token list:', error);
    }
}

// Call the function to fetch a list of tokens
getTokenList(5);

```
Here's what happens in the code above;
* The `getTokenList()` sends a GraphQL query to the specified queryURL to fetch token data.
* The user can specify the number of tokens to retrieve by passing a parameter to the function.
* The query and request options are set, and the response is fetched, parsed as JSON, and logged to the console.

#

> Note: When working with Chainstack's infrastructure, it's important to implement rate limiting and error handling to ensure reliable data retrieval. The examples above include basic implementations that you can enhance based on your specific needs.


## Using graph-client

`graph-client` is a GraphQL client that is provided by The Graph protocol. The client helps manage subgraph requests. graph-client help us include complex functionalities like fetch strategies, block tracking and cross-chain subgraph handling while making requests to our subgraphs, hence extending the request capabilities.

It's particularly useful when working with Chainstack's infrastructure on Kaia, as it provides advanced features like retry mechanisms and fallback options.

### Config graph-client

To fetch data using graph client:

Set up a new node project using `npm init`

Open a terminal in the new project directory and run the following code:

1. Create a configuration file for graph-client:
```yaml
# .graphclientrc.yml
sources:
  - name: KaiaSubgraph
    handler:
      graphql:
        strategy: fallback
        sources:
          - endpoint: YOUR_CHAINSTACK_KAIA_ENDPOINT
            retry: 3
            timeout: 5000
          - endpoint: YOUR_FALLBACK_ENDPOINT
            retry: 2
            timeout: 3000
```

2. Generate the client code:


As you can see, within the configuration file, we provide the name of the subgraph that we deployed using Chainstack and the Query URL that we get from the subgraph's page in the Chainstack console.

Based on this configuration, we can generate the code for fetching subgraph data, So, open a terminal in the project and type:
```bash
npx graphclient build --fileType json
```

### Implementing Queries

Here's a comprehensive example showing how to implement various queries using graph-client:

```javascript
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

```
* `getQueryData` uses `graphClient` to execute GraphQL queries for fetching pool and token data.
* The results are logged to the console, with error handling in place to catch and log any issues.
* Using `graph-client`, you can enhance requests by specifying retry rates, connection timeouts, and fallback subgraphs for more robust data fetching.

### Advanced Configuration Options

The graph-client allows for sophisticated configuration options when working with Chainstack:

```yaml
# .graphclientrc.yml with advanced options
sources:
  - name: KaiaSubgraph
    handler:
      graphql:
        strategy: fallback
        sources:
          - endpoint: YOUR_CHAINSTACK_KAIA_ENDPOINT
            retry: 3
            timeout: 5000
            maxRetryAttempts: 5
            retryDelay: 1000
            headers:
              Authorization: "Bearer YOUR_CHAINSTACK_API_KEY"
              "Content-Type": "application/json"
          - endpoint: YOUR_FALLBACK_ENDPOINT
            retry: 2
            timeout: 3000
        validation:
          maxDepth: 10
        customFetch: "./src/customFetch.js"
```


## Using the urql Library

The `urql library` is a lightweight GraphQL client that streamlines interactions with GraphQL endpoints. It offers a user-friendly API for executing queries and mutations, ensuring type safety and efficient data fetching. 

With urql, you can create a GraphQL client in a single line and seamlessly integrate it into applications, including React components, to handle data fetching in response to user events.

Here, we are going to see how to use the urql library and JavaScript to fetch data from a subgraph. So…

Set up a new node project

Install the following packages:


`npm install urql isomorphic-unfetch`
Create a new file `src/urql-client.js` within your project

```javascript
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

```

## Conclusion

This guide has demonstrated various approaches to fetching subgraph data using Chainstack's infrastructure on Kaia. Each method has its own advantages:

- HTTP requests provide a simple, straightforward approach suitable for basic queries
- graph-client offers type safety and specialized features for Graph Protocol interaction
- URQL provides a balance of features with built-in caching and subscription support

When choosing an approach, consider your specific needs:
- Use HTTP requests for simple applications or quick prototypes
- Choose graph-client for type safety and Graph Protocol-specific features
- Opt for URQL when you need real-time updates and efficient caching

Remember to implement proper error handling, pagination, and rate limiting in your production applications. 

The complete code examples provided here can serve as a starting point for building robust blockchain data applications on Kaia using Chainstack Subgraphs.

For further reading and updates, refer to:
- [Chainstack Documentation](https://docs.chainstack.com)
- [Kaia Docs](https://docs.kaia.io/build/tools/indexers/thegraph/#1-initialize-your-subgraph-project)
- [The Graph Protocol Documentation](https://thegraph.com/docs)
- [URQL Documentation](https://formidable.com/open-source/urql/docs/)
