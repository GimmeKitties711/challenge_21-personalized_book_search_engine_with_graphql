const express = require('express');
const path = require('path');
const db = require('./config/connection');

const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
}); // set up the Apollo Server with the necessary components

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const startApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app }); // apply the Apollo Server instance to the Express server as middleware
  db.once('open', () => { // add a one-time event listener that will execute when the database connection is opened
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`); // localhost:3001
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`); // link to GraphQL Sandbox
    });
  }); // moved event listener inside StartApolloServer()
};

startApolloServer(); // call the function that starts the server
