// graphql/queries/workouts.gql.ts
import { gql } from "nuxt-graphql-request/utils";

export const WORKOUTS_QUERY = gql`
  query workouts{
    workouts{
      id
      type
      user{
        id
        name
      }
      exercises{
        reps
        rest
      }
      startTime
      endTime
    }
  }
`;

