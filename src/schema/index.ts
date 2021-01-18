export { typeDefs } from './schema';
import { PersonStoreDataSource } from '../stores';
import { Resolvers } from './schema.generated';

type Context = {
  dataSources: {
    personStore: PersonStoreDataSource;
  };
};

export const resolvers: Resolvers<Context> = {
  Query: {
    async persons(_parent, args, { dataSources }) {
      const dbPersons = await dataSources.personStore.getPersons(args.ids);
      return dbPersons.map(p => ({
        id: p.id,
        name: p.name,
        relationships: [],
      }));
    },
  },
};
