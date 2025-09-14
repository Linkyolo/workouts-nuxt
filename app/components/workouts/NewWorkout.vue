<script setup lang="ts">
import { ref } from "vue";
import { UFormField } from "#components";
import { useToast } from "#imports";
import { useOverlay } from "#imports";
import { useCreateWorkout } from "~/composables/workout/useCreateWorkout";
import { Workout } from "~/types/Workout";
import { Exercise } from "~/types/Workout";

const workout = ref<Workout>({
  startTime: null,
  endTime: null,
  type: "",
  userId: 1, // TODO: use hashId and dynamic user context
  exercises: [],
});

const emit = defineEmits<{ close: [boolean] }>();
const toast = useToast();
const overlay = useOverlay();

// Add new exercise
function addExercise() {
  workout.value.exercises.push({
    typology: "",
    reps: 0,
    sets: 0,
    rest: 0,
    name: "",
  });
}

// Submit workout
async function sendWorkout(workoutData) {
  // Validate input
  if (!workoutData?.value) {
    throw new Error("Invalid workout data");
  }

  try {
    // Prepare workout data
    const currentTime = new Date().toISOString();
    const updatedWorkout = {
      ...workoutData.value,
      type: "Strength & Conditioning",
      startTime: currentTime,
      endTime: currentTime,
    };

    // Create workout
    const { workout: result, error } = await useCreateWorkout(updatedWorkout);

    // Log result for debugging (optional, consider using a proper logging service in production)
    console.debug("Workout creation result:", result?.value);

    // Check for errors
    if (error.value) {
      throw new Error(error.value.message || "Failed to create workout");
    }

    // Validate result
    if (
      !result.value ||
      !Array.isArray(result.value.exercises) ||
      result.value.exercises.length === 0
    ) {
      throw new Error(
        "Invalid workout response: missing or empty exercises array",
      );
    }

    // Show success notification
    toast.add({
      color: "green",
      title: "Workout created successfully!",
      icon: "i-heroicons-check-circle",
    });

    // Emit success event
    emit("close", true);
  } catch (error) {
    // Enhanced error handling
    const errorMessage =
      error.message ||
      "An unexpected error occurred while creating the workout";
    console.error("Error creating workout:", {
      message: errorMessage,
      stack: error.stack,
    });

    // Show error notification
    toast.add({
      color: "red",
      title: "Failed to create workout",
      description: errorMessage,
      icon: "i-heroicons-exclamation-circle",
    });

    // Re-throw error for upstream handling if needed
    throw error;
  }
}

function deleteExercise(index) {
  workout.value.exercises.splice(index, 1);
}
</script>

<template>
  <UForm :state="workout" class="flex flex-col items-center">
    <!-- Add Exercise Button -->
    <UButton @click="addExercise" size="md" color="secondary" variant="solid">
      Add Exercise
    </UButton>

    <!-- Exercises Inputs -->
    <div
      v-for="(ex, id) in workout.exercises"
      :key="id"
      class="modal flex gap-2 my-4 mx-8"
    >
      <UFormField label="Name" class="flex-2">
        <UInput placeholder="Name" v-model="ex.name" />
      </UFormField>

      <UFormField label="Typology" class="flex-2">
        <UInput placeholder="Typology" v-model="ex.typology" />
      </UFormField>

      <UFormField label="Reps" class="flex-1">
        <UInputNumber
          placeholder="Reps"
          v-model="ex.reps"
          orientation="vertical"
        />
      </UFormField>

      <UFormField label="Sets" class="flex-1">
        <UInputNumber
          placeholder="Sets"
          v-model="ex.sets"
          orientation="vertical"
        />
      </UFormField>

      <UFormField label="Rest" class="flex-1">
        <UInputNumber
          placeholder="Rest"
          v-model="ex.rest"
          orientation="vertical"
        />
      </UFormField>

      <UButton
        icon="i-heroicons-trash"
        variant="ghost"
        @click="deleteExercise(id)"
        class="self-end"
        title="Delete exercise"
      />
    </div>

    <!-- Submit Workout -->
    <UButton @click="sendWorkout" size="md" color="primary" variant="solid">
      Send
    </UButton>
  </UForm>
</template>
