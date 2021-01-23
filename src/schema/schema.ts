import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
  type Query {
    search(name: String!, limit: Int = 10, offset: Int = 0): SearchResult!
    persons(ids: [ID!] = []): [Person!]!
  }

  type Mutation {
    createPerson(
      name: String!
      relationships: [RelationshipInput!] = []
    ): Person!
    linkPersons(from: ID!, to: ID!, type: RelationshipType!): Boolean
  }

  input RelationshipInput {
    otherId: ID!
    type: RelationshipType!
  }

  type SearchResult {
    persons: [Person!]!
  }

  type Person {
    id: ID!
    name: String!
    personToMe: [Relationship!]!
    meToPerson: [Relationship!]!
  }

  type Relationship {
    id: ID!
    person: Person!
    type: RelationshipType!
  }

  enum RelationshipType {
    PARENT_OF
    SPOUSE
  }
`;
