const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const {authMiddleWare} = require('./utils/auth');
const {typeDefs, resolvers} = require('./schemas');

const path = require('path');
const db = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleWare,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../client/build/index.html')));
  app.get('/favicon.ico', (req, res) => res.sendFile(path.join(__dirname, '../client/public/favicon.ico')));
}



const launchApolloServer = async () => {
  await apolloServer.start();
  apolloServer.applyMiddleware({app});

  db.once('open', () => {
    app.listen(PORT, () => console.log('server up'));
  });
}

launchApolloServer();

