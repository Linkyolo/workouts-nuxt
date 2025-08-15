import { createWorkoutMutation } from "~/graphql/mutations/createWorkout.gql"

export const useCreateWorkout = (input) => {
        const { $graphql } = useNuxtApp();

        const { data: workout, pending, error } = useAsyncData("createWorkout", async () => {
                const response = await $graphql.default.request(createWorkoutMutation, { input });
                console.log("composable got back from BE: ", response)
                return response?.workout;
        });

        return {
                workout,
                pending,
                error,
        };
};
