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

