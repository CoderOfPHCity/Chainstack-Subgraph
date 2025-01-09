# Chainstack Subgraph Demo
Serves as a template for building subgraphs with Chainstack. It includes all necessary dependencies pre-installed and provides essential files to interact with GraphQL APIs.

You can follow along the comprehensive article guide [HERE](https://github.com/CoderOfPHCity/Chainstack-Subgraph/blob/master/Article.md)

## Dependencies
The following dependencies are included:

- @graphprotocol/graph-cli: Version ^0.93.3 – Command-line interface for working with subgraphs.
- @graphprotocol/graph-ts: Version ^0.37.0 – TypeScript library for writing subgraphs.
- graphql: Version ^16.10.0 – GraphQL library for querying APIs.
- node-fetch: Version ^3.3.2 – Fetch API for making HTTP requests.
- urql: Version ^4.2.1 – A lightweight and flexible GraphQL client for interacting with GraphQL endpoints.
### Setup
- Clone or download the project.
- Navigate to the project directory and install dependencies:

`npm init -y`
### Files Structure
```
src/: Contains client files for HTTP, Graph, and URQL interactions.
http-client.js: For making HTTP requests.
graph-client.js: For interacting with the Graph Protocol.
urql-client.js: For working with GraphQL using URQL.
config.js: Holds configuration for the project.
package.json: Includes project metadata and dependencies.
```

This template provides a solid foundation to start building your Chainstack subgraph applications.