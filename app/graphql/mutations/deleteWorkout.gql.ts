import { gql } from "nuxt-graphql-request/utils";

//TODO Use HashId as a type instead of float
export const deleteWorkoutMutation = gql`
  mutation deleteWorkout($id: Float!) {
    deleteWorkout(
        id: $id
    ) {
      type
      exercises {
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
