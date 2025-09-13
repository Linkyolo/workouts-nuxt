import { gql } from "nuxt-graphql-request/utils";

export const editWorkoutMutation = gql`
  mutation editWorkout($id: Float!, $input: WorkoutInput!) {
    editWorkout(id: $id, input: $input) {
      type
      exercises {
        reps
        rest
        sets
        typology
        name
      }
      startTime
      endTime
    }
  }
`;
