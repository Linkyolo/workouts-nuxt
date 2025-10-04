import { deleteWorkoutMutation } from "~/graphql/mutations/deleteWorkout.gql";

export const useDeleteWorkout = () => {
        const { $graphql } = useNuxtApp();

        const pending = ref(false);
        const error = ref<Error | null>(null);

        const deleteWorkout = async (id: number) => {
                pending.value = true;
                error.value = null;

                try {
                        const response = await $graphql.default.request(deleteWorkoutMutation, { id });
                        console.log("Deleted workout response:", response);
                        // return response?.workout; // or return response if you want to use it
                        return true
                } catch (err) {
                        console.error("Delete workout error:", err);
                        error.value = err as Error;
                        return false;
                } finally {
                        pending.value = false;
                }
        };

        return {
                deleteWorkout,
                pending,
                error,
        };
};
