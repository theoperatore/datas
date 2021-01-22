export { typeDefs } from './schema';
import { PersonStoreDataSource } from '../stores';
import { Resolvers, Relationship, Person } from './schema.generated';

type Context = {
  dataSources: {
    personStore: PersonStoreDataSource;
  };
};

export const resolvers: Resolvers<Context> = {
  Query: {
    async persons(_parent, args, { dataSources }) {
      const dbPersons = await dataSources.personStore.getPersons(args.ids);
      return dbPersons.map(person => ({
        id: person.id,
        name: person.name,
        relationships: [],
      }));
    },
  },
  Person: {
    relationships: async (parent, _args, { dataSources }) => {
      const edgesMap = await dataSources.personStore.getEdgesForPerson(
        parent.id,
      );
      const edges = edgesMap.get(parent.id);

      if (!edges) return [];

      return edges.map(edge => {
        return {
          id: edge.id,
          type: edge.rel_type,
          other: {
            id: edge.a_id === parent.id ? edge.b_id : edge.a_id,
          } as Person,
        } as Relationship;
      });
    },
  },
};
