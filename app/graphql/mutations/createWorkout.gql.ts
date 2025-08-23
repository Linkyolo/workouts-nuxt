import { gql } from "nuxt-graphql-request/utils";

export const createWorkoutMutation = gql`
  mutation createWorkout($input: CreateWorkoutInput!) {
    createWorkout(
        input: $input
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
