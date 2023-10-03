const express = require('express');
const path = require('path');
const db = require('./config/connection');
// const routes = require('./routes');

const { ApolloServer } = require('apollo-server-express'); // new
const { authMiddleware } = require('./utils/auth'); // new

// const { typeDefs, resolvers } = require('./schemas'); // new

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  // typeDefs,
  // resolvers,
  context: authMiddleware,
}); // new

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
}); // new

// app.use(routes);

const startApolloServer = async () => {
  await server.start(); // new
  server.applyMiddleware({ app }); // new

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`); // what does 'server.graphqlPath' mean
      // new
    });
  }); // moved inside StartApolloServer()
}; // new

startApolloServer(); // new
