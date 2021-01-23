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
    async persons(_, args) {
      return args.ids.map(id => ({ id } as Person));
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
      // TODO: if person is not found, do we want to check for that?
      // right trying to get the person.name will throw an exception
      // and fail the entire query.
      const person = await dataSources.personStore.getPerson(parent.id);
      return person.name;
    },
    personToMe: async (parent, _args, { dataSources }) => {
      const edges = await dataSources.personStore.getEdgesForPerson(parent.id);

      // TODO: this should only happen when there is an error with querying
      // the db.
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
      const edges = await dataSources.personStore.getEdgesForPerson(parent.id);

      // TODO: this should only happen when there is an error with querying
      // the db.
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
