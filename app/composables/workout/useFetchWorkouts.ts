import { WORKOUTS_QUERY } from "~/graphql/queries/workouts.gql"

export const useFetchWorkouts = () => {
        const { $graphql } = useNuxtApp();

        const { data: workouts, pending, error } = useAsyncData("workouts", async () => {
                const response = await $graphql.default.request(WORKOUTS_QUERY);
                console.log("composable got", response)
                return response?.workouts;
        });

        return {
                workouts,
                pending,
                error,
        };
};
