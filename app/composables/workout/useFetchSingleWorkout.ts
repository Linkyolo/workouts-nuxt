import { useAsyncData, useNuxtApp } from "#imports";
import { SINGLE_WORKOUT_QUERY } from "~/graphql/queries/fetchWorkout.gql";
import type { Workout } from "~/types/Workout";

export const useFetchSingleWorkout = (id: number | string) => {
        const { $graphql } = useNuxtApp();

        const { data: workoutData, pending, error } = useAsyncData(
                `workout-${id}`, // Dynamic key to avoid cache conflicts
                async () => {
                        try {
                                const response = await $graphql.default.request(SINGLE_WORKOUT_QUERY, { id });
                                console.log("composable SINGLE_WORKOUT_QUERY response", response);

                                // Map the response to match the Workout type
                                if (response?.workout) {
                                        return {
                                                startTime: response.workout.startTime || null,
                                                endTime: response.workout.endTime || null,
                                                type: response.workout.type || "",
                                                userId: Number(response.workout.user?.id) || 1, // Map user.id to userId
                                                exercises: Array.isArray(response.workout.exercises)
                                                        ? response.workout.exercises
                                                        : [],
                                        } as Workout;
                                }
                                return null; // Return null if no workout is found
                        } catch (err) {
                                console.error("Error fetching workout:", err);
                                throw err; // Let useAsyncData handle the error
                        }
                },
                {
                        default: () => null, // Default to null to avoid undefined
                }
        );

        return {
                workout: workoutData,
                pending,
                error,
        };
};
