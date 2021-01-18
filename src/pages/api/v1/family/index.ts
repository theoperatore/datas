import Knex from 'knex';
import { ApolloServer } from 'apollo-server-micro';
import { typeDefs, resolvers } from '../../../../schema';
import { PersonStoreDataSource } from '../../../../stores';
import { checkFamilyAuth } from '../../../../middlewares';

const connection = Knex({
  // mysql2 can handle the auth sequence required from
  // mysql v8...mysql cannot do that.
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    ssl: {
      ca: process.env.DB_CERT,
      rejectUnauthorized: false,
    },
  },
  debug: process.env.NODE_ENV !== 'production',
});

const dataSources = () => ({
  personStore: new PersonStoreDataSource(connection),
});

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context: ctx => checkFamilyAuth(process.env.FAMILY_API_SECRET, ctx),
});

export default apolloServer.createHandler({ path: '/api/v1/family' });

export const config = {
  api: {
    bodyParser: false,
  },
};
