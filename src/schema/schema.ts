import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
  type Query {
    persons(ids: [ID!] = []): [Person!]
  }

  type Person {
    id: ID!
    name: String!
    relationships: [Relationship!]!
  }

  type Relationship {
    id: ID!
    other: Person!
    type: RelationshipType!
  }

  enum RelationshipType {
    CHILD
    PARENT
    SPOUSE
  }
`;
