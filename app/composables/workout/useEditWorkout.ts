import { editWorkoutMutation } from "~/graphql/mutations/editWorkout.gql";

export const useEditWorkout = (id, input) => {
        const { $graphql } = useNuxtApp();

        const { data: workout, pending, error } = useAsyncData(
                "editWorkout",
                async () => {
                        const response = await $graphql.default.request(editWorkoutMutation, {
                                id,
                                input,
                        });
                        console.log("composable got back from BE (edit):", response);
                        return response?.editWorkout;
                }
        );

        return {
                workout,
                pending,
                error,
        };
};
