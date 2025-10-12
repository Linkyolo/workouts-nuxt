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

// // Add a new exercise
// function addExercise() {
//   const newExercise: Exercise = {
//     typology: "",
//     reps: 0,
//     sets: 0,
//     rest: 0,
//     name: "",
//   };
//   workout.value.exercises.push(newExercise);
// }

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

const newExercise = ref<Exercise>({
  typology: "",
  reps: 0,
  sets: 0,
  rest: 0,
  name: "",
});

function addExercise() {
  if (
    newExercise.value.name.trim() === "" ||
    newExercise.value.typology.trim() === "" ||
    newExercise.value.reps <= 0 ||
    newExercise.value.sets <= 0
  ) {
    toast.add({
      color: "red",
      title: "Invalid Exercise",
      description: "Please fill out all fields correctly.",
    });
    return;
  }

  workout.value.exercises.push({ ...newExercise.value });

  // Reset form
  newExercise.value = {
    typology: "",
    reps: 0,
    sets: 0,
    rest: 0,
    name: "",
  };
}
</script>

<template>
  <div
    class="flex flex-col md:flex-row h-screen bg-[var(--color-bg)] text-white"
  >
    <!-- Left: Exercise List -->
    <section
      class="md:w-1/2 w-full p-6 overflow-y-auto border-r border-white/10"
    >
      <h2 class="text-xl font-semibold mb-4 text-[var(--color-primary)]">
        Your Workout
      </h2>

      <div v-if="workout.exercises.length === 0" class="text-sm text-gray-400">
        No exercises added yet.
      </div>

      <ul class="space-y-4">
        <li
          v-for="(ex, idx) in workout.exercises"
          :key="idx"
          class="flex justify-between items-center p-4 bg-white/5 rounded-md"
        >
          <div>
            <p class="font-medium">{{ ex.name || "Unnamed Exercise" }}</p>
            <p class="text-sm text-gray-300">
              {{ ex.typology }} | {{ ex.sets }}x{{ ex.reps }} ({{ ex.rest }}s
              rest)
            </p>
          </div>
          <button
            class="text-red-400 hover:text-red-600 text-xl"
            @click="deleteExercise(idx)"
            title="Remove"
          >
            &times;
          </button>
        </li>
      </ul>
    </section>

    <!-- Right: Add Exercise Form -->
    <section class="md:w-1/2 w-full p-6">
      <h2 class="text-xl font-semibold mb-4 text-[var(--color-secondary)]">
        Add Exercise
      </h2>

      <div class="space-y-4 bg-white/5 p-6 rounded-lg shadow-inner">
        <UFormField label="Name">
          <UInput placeholder="e.g. Bench Press" v-model="newExercise.name" />
        </UFormField>

        <UFormField label="Typology">
          <UInput placeholder="e.g. Chest" v-model="newExercise.typology" />
        </UFormField>

        <div class="flex gap-4 flex-wrap">
          <!-- Reps -->
          <UFormField label="Reps" class="flex-1 min-w-[120px]">
            <UInputNumber
              v-model="newExercise.reps"
              placeholder="Reps"
              orientation="vertical"
              class="w-full box-border"
            />
          </UFormField>

          <!-- Sets -->
          <UFormField label="Sets" class="flex-1 min-w-[120px]">
            <UInputNumber
              v-model="newExercise.sets"
              placeholder="Sets"
              orientation="vertical"
              class="w-full box-border"
            />
          </UFormField>

          <!-- Rest -->
          <UFormField label="Rest (s)" class="flex-1 min-w-[120px]">
            <UInputNumber
              v-model="newExercise.rest"
              placeholder="Rest"
              orientation="vertical"
              class="w-full box-border"
            />
          </UFormField>
        </div>

        <UButton
          @click="addExercise"
          size="md"
          color="primary"
          class="mt-4"
          icon="i-heroicons-plus-circle"
        >
          Add to Workout
        </UButton>
      </div>

      <!-- Submit Workout -->
      <UButton
        @click="sendWorkout"
        size="md"
        color="tertiary"
        variant="solid"
        :loading="pending"
        class="mt-6"
        icon="i-heroicons-check-circle"
      >
        Submit Workout
      </UButton>
    </section>
  </div>
</template>
