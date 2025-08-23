import { deleteWorkoutMutation } from "~/graphql/mutations/deleteWorkout.gql"

export const useDeleteWorkout = (id: number) => {
        const { $graphql } = useNuxtApp();

        const { data: workout, pending, error } = useAsyncData("deleteWorkout", async () => {
                const response = await $graphql.default.request(deleteWorkoutMutation, { id });
                console.log("composable got back from BE: ", response)
                return response?.workout;
        });

        return {
                workout,
                pending,
                error,
        };
};
