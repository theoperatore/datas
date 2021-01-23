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
        personToMe: [],
        meToPerson: [],
      }));
    },
    async search(_, args, { dataSources }) {
      const results = await dataSources.personStore.search(
        args.name,
        args.limit,
        args.offset,
      );
      const persons = results.map(p => ({
        id: p.id,
        name: p.name,
        personToMe: [],
        meToPerson: [],
      }));

      return {
        persons,
      };
    },
  },
  Mutation: {
    async createPerson(_parent, args, { dataSources }) {
      const person = await dataSources.personStore.createPerson(args.name);
      // just await don't return. let the normal graph resolution process
      // query for the created edges.
      // there is a possible out-of-sync error condition here, where the
      // person gets created successfully, but the relationships do not.
      // Since this isn't done in a transaction they won't get rolled back...
      // mabye this isn't a problem yet?
      await dataSources.personStore.createRelationships(
        person.id,
        args.relationships,
      );

      return {
        id: person.id,
        name: person.name,

        // even though some might have been created, let the normal graph
        // resllution process fill this out
        personToMe: [],
        meToPerson: [],
      };
    },
  },
  Person: {
    name: async (parent, _args, { dataSources }) => {
      if (parent.name) return parent.name;

      const [person] = await dataSources.personStore.getPersons([parent.id]);
      return person.name;
    },
    personToMe: async (parent, _args, { dataSources }) => {
      const edgesMap = await dataSources.personStore.getEdgesForPerson(
        parent.id,
      );
      const edges = edgesMap.get(parent.id);

      if (!edges) return [];

      return edges.parents.map(edge => {
        return {
          id: edge.id,
          type: edge.rel_type,
          person: {
            id: edge.a_id,
          } as Person,
        } as Relationship;
      });
    },
    meToPerson: async (parent, _args, { dataSources }) => {
      const edgesMap = await dataSources.personStore.getEdgesForPerson(
        parent.id,
      );
      const edges = edgesMap.get(parent.id);

      if (!edges) return [];

      return edges.children.map(edge => {
        return {
          id: edge.id,
          type: edge.rel_type,
          person: {
            id: edge.b_id,
          } as Person,
        } as Relationship;
      });
    },
  },
};
