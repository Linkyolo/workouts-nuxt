<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "#imports";
import { useCreateWorkout } from "~/composables/workout/useCreateWorkout";

const emit = defineEmits<{ close: [boolean] }>();

const toast = useToast();
const { createWorkout, pending, error } = useCreateWorkout();

const workout = ref<Workout>({
  startTime: null,
  endTime: null,
  type: "",
  userId: 1, // TODO: Replace with actual user context
  exercises: [],
});

// Add a new exercise
function addExercise() {
  const newExercise: Exercise = {
    typology: "",
    reps: 0,
    sets: 0,
    rest: 0,
    name: "",
  };
  workout.value.exercises.push(newExercise);
}

// Delete exercise by index
function deleteExercise(index: number) {
  workout.value.exercises.splice(index, 1);
}

// Validate workout before sending
function isWorkoutValid(): boolean {
  return (
    Array.isArray(workout.value.exercises) &&
    workout.value.exercises.length > 0 &&
    workout.value.exercises.every(
      (ex) =>
        ex.name.trim() !== "" &&
        ex.typology.trim() !== "" &&
        ex.reps > 0 &&
        ex.sets > 0,
    )
  );
}

// Submit workout
async function sendWorkout() {
  if (pending.value) return;

  if (!isWorkoutValid()) {
    toast.add({
      color: "red",
      title: "Invalid workout data",
      description:
        "Please complete all fields and add at least one valid exercise.",
    });
    return;
  }

  const currentTime = new Date().toISOString();
  const preparedWorkout = {
    ...workout.value,
    type: "Strength & Conditioning", // Default type
    startTime: currentTime,
    endTime: currentTime,
  };

  const result = await createWorkout(preparedWorkout);

  if (result) {
    toast.add({
      color: "green",
      title: "Workout created successfully!",
      icon: "i-heroicons-check-circle",
    });
    emit("close", true);
  } else {
    toast.add({
      color: "red",
      title: "Workout creation failed",
      description: error.value?.message || "An unexpected error occurred.",
      icon: "i-heroicons-exclamation-circle",
    });
  }
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
    <UButton
      @click="sendWorkout"
      size="md"
      color="primary"
      variant="solid"
      :loading="pending"
    >
      Send
    </UButton>
  </UForm>
</template>
