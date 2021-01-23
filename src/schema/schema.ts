import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
  type Query {
    persons(ids: [ID!] = []): [Person!]!
  }

  type Mutation {
    createPerson(
      name: String!
      relationships: [RelationshipInput!] = []
    ): Person!
  }

  input RelationshipInput {
    otherId: ID!
    type: RelationshipType!
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
