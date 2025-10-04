import { createWorkoutMutation } from "~/graphql/mutations/createWorkout.gql";
import type { Workout } from "~/types/Workout";

export const useCreateWorkout = () => {
        const { $graphql } = useNuxtApp();

        const pending = ref(false);
        const error = ref<Error | null>(null);
        const workout = ref<Workout | null>(null);

        const createWorkout = async (input: Partial<Workout>) => {
                pending.value = true;
                error.value = null;

                try {
                        const response = await $graphql.default.request(createWorkoutMutation, { input });
                        console.log("createWorkout response from BE:", response);

                        workout.value = response?.createWorkout ?? null;
                        return workout.value;
                } catch (err) {
                        console.error("Create workout error:", err);
                        error.value = err as Error;
                        return null;
                } finally {
                        pending.value = false;
                }
        };

        return {
                createWorkout,
                workout,
                pending,
                error,
        };
};
