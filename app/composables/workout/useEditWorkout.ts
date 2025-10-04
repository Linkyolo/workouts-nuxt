import { editWorkoutMutation } from "~/graphql/mutations/editWorkout.gql";
import type { Workout } from "~/types/Workout";

export const useEditWorkout = () => {
        const { $graphql } = useNuxtApp();

        const pending = ref(false);
        const error = ref<Error | null>(null);
        const workout = ref<Workout | null>(null);

        const editWorkout = async (id: number, input: Workout) => {
                pending.value = true;
                error.value = null;

                try {
                        const response = await $graphql.default.request(editWorkoutMutation, {
                                id,
                                input,
                        });

                        console.log("composable got back from BE (edit):", response);
                        workout.value = response?.editWorkout ?? null;
                        return workout.value;
                } catch (err) {
                        console.error("Edit workout error:", err);
                        error.value = err as Error;
                        return null;
                } finally {
                        pending.value = false;
                }
        };

        return {
                editWorkout,
                workout,
                pending,
                error,
        };
};
