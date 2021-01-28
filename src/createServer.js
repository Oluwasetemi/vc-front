/* eslint-disable */
import {altairExpress} from 'altair-express-middleware';
import {ApolloServer, PubSub} from 'apollo-server-express';
import cors from 'cors';
import express from 'express';
import {readFileSync} from 'fs';
import expressPlayground from 'graphql-playground-middleware-express';
import {createServer} from 'http';
import path from 'path';
import remark from 'remark';
import html from 'remark-html';
import recommended from 'remark-preset-lint-recommended';
import report from 'vfile-reporter';
import dbConnection from './db';
import resolvers from './resolvers';
import typeDefs from './typeDefs';
import {findUserFromToken} from './utils/auth';
import stripe from './utils/stripe';

const defaultQueries = readFileSync(
  path.join(__dirname, '..', 'all_development_queries.graphql'),
  'UTF-8',
);

if (!defaultQueries) {
  console.log('Set up your default Queries');
}

async function startServer() {
  try {
    // setup the db
    let dbUrl = process.env.DATABASE_URL;
    if (process.env.NODE_ENV === 'test') {
      dbUrl = process.env.DATABASE_TEST_URL;
    }

    if (process.env.NODE_ENV === 'development') {
      process.env.FRONTEND_URL = 'https://virtual-closets.com';
    }
    // setup the database
    const db = dbConnection(dbUrl);

    // set up the express app
    const app = express();

    // Send it an object with typeDefs(the schema) and resolvers
    const pubsub = new PubSub();
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      introspection: true,
      async context({req, connection}) {
        const context = {stripe};
        const headers = req ? req.headers : connection.context.Authorization;
        if (!headers) {
          return {...context, pubsub};
        }
        const authorization = headers && headers.authorization;

        try {
          const matches = authorization.match(/^bearer (\S+)$/i);
          const user = await findUserFromToken(matches[1]);

          if (!user) {
            throw new Error('Invalid token');
          }

          return {...context, user, pubsub};
        } catch (error) {
          return {...context, pubsub};
        }
      },
    });

    let httpServer = createServer(app);
    server.installSubscriptionHandlers(httpServer);

    // setup middleware using the app
    const corsOptions = {
      credentials: true,
      origin: '*',
      optionsSuccessStatus: 200,
    };

    app.use(cors(corsOptions));

    // TODO: Use express middleware to populate current user (JWT)
    // 2. create a middleware that populates the user in the request
    // app.use(async (req, res, next) => {
    //   try {
    //     const {authorization: token} = req.headers;

    //     if (token) {
    //       const {id} = await verify(token);

    //       // check validity of the user id
    //       const user = await findUserById(id);

    //       if (!user) return next();

    //       req.userId = id;
    //       req.user = user;
    //     }
    //     next();
    //   } catch (error) {
    //     throw new Error(error.message);
    //   }
    // });

    server.applyMiddleware({app});

    app.get('/', (req, res) => {
      res.redirect('graphiql');
    });

    app.get('/graphiql', expressPlayground({endpoint: '/graphql'}));

    // Mount your altair GraphQL client
    app.use(
      '/altair',
      altairExpress({
        endpointURL: '/graphql',
        subscriptionsEndpoint: `ws://localhost:${
          process.env.PORT || 4000
        }/graphql`,
        initialQuery: defaultQueries,
      }),
    );

    app.get('/changelog', async (req, res) => {
      // read file
      const changeLogString = await readFileSync(
        path.join(__dirname, '..', 'changelog.md'),
        'UTF-8',
      );
      // parse the string of the file to html
      remark()
        .use(recommended)
        .use(html)
        .process(changeLogString, function (err, file) {
          console.error(report(err || file));
          // console.log(String(file))
          // output the changelog html
          const htmlFile = String(file);
          return res.send(String(file));
        });
    });
    app.get('/query', async (req, res) => {
      // read file
      const changeLogString = await readFileSync(
        path.join(__dirname, '..', 'queries.md'),
        'UTF-8',
      );
      // parse the string of the file to html
      remark()
        .use(recommended)
        .use(html)
        .process(changeLogString, function (err, file) {
          console.error(report(err || file));
          // console.log(String(file))
          // output the changelog html
          const htmlFile = String(file);
          return res.send(String(file));
        });
    });

    return {httpServer, server, app};
  } catch (error) {
    console.log(error.stack);
    throw new Error(error.message);
  }
}

export default startServer;
