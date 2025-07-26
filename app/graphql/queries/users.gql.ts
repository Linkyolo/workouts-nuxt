
// graphql/queries/users.gql.ts
import { gql } from "nuxt-graphql-request/utils";

export const USERS_QUERY = gql`
  query users {
    users {
      id
      name
    }
  }
`;

