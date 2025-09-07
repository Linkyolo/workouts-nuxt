import { gql } from "nuxt-graphql-request/utils";

export const SINGLE_WORKOUT_QUERY = gql`
  query workout($id: Float!){
    workout(id: $id){
      type
      user{
        id
        name
      }
      exercises{
        reps
        rest
        typology
        name
      }
      startTime
      endTime
    }
  }
`;

