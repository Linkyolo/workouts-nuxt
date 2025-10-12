<script setup lang="ts">
import { useToast } from "#imports";
import { useFetchSingleWorkout } from "~/composables/workout/useFetchSingleWorkout";
import { useEditWorkout } from "~/composables/workout/useEditWorkout";

const props = defineProps<{
  id: number;
}>();

const emit = defineEmits<{
  close: [boolean];
}>();

const toast = useToast();

// Initialize reactive workout state
const workout = ref<Workout>({
  startTime: null,
  endTime: null,
  type: "",
  userId: 1, // TODO: Replace with dynamic user context
  exercises: [],
});

// Initialize reactive newExercise state for right panel form
const newExercise = ref({
  name: "",
  typology: "",
  reps: 0,
  sets: 0,
  rest: 0,
});

// Fetch workout data
const {
  workout: workoutData,
  pending,
  error,
} = useFetchSingleWorkout(props.id);

// Update workout state when data is fetched
watch(
  workoutData,
  (newVal) => {
    if (newVal) {
      workout.value = structuredClone(newVal);
      console.log("Updated workout state:", workout.value);
    }
  },
  { immediate: true },
);

// Handle errors
watch(error, (err) => {
  if (err) {
    toast.add({
      title: "Error fetching",
      description: "Failed to fetch workout data. Please try again.",
      color: "error",
    });
    emit("close", false);
  }
});

// Add new exercise
const addExercise = () => {
  if (!newExercise.value.name) {
    toast.add({
      title: "Error",
      description: "Exercise name is required.",
      color: "error",
    });
    return;
  }
  workout.value.exercises.push({ ...newExercise.value });
  // Reset form
  newExercise.value = {
    name: "",
    typology: "",
    reps: 0,
    sets: 0,
    rest: 0,
  };
  toast.add({
    title: "Success",
    description: "Exercise added!",
    color: "success",
  });
};

// Delete exercise
const deleteExercise = (index: number) => {
  workout.value.exercises.splice(index, 1);
};

const { editWorkout, pending: editPending } = useEditWorkout();

async function submitWorkout() {
  if (editPending.value) return;

  // Set default values if not provided
  workout.value.type = workout.value.type || "Strength & Condition";
  workout.value.startTime = workout.value.startTime || new Date().toISOString();
  workout.value.endTime = workout.value.endTime || new Date().toISOString();

  const result = await editWorkout(props.id, workout.value);
  if (result && Array.isArray(result.exercises)) {
    toast.add({
      color: "success",
      title: "Workout edited successfully!",
    });
    emit("close", true);
  } else {
    toast.add({
      color: "error",
      title: "Failed to edit workout",
    });
  }
}
</script>

<template>
  <div v-if="pending" class="flex justify-center items-center h-full">
    <p>Loading workout...</p>
  </div>

  <div
    v-else
    class="flex flex-row max-h-[80vh] overflow-hidden bg-[var(--color-bg)]"
  >
    <!-- Left: Exercise List -->
    <section
      class="p-6 min-w-60 overflow-y-auto border-r border-white/10 left-panel"
    >
      <h2 class="text-xl font-semibold mb-4 text-[var(--color-primary)]">
        Current Workout
      </h2>

      <div v-if="workout.exercises.length === 0" class="text-sm text-gray-400">
        No exercises added yet.
      </div>

      <div
        v-for="(ex, idx) in workout.exercises"
        :key="idx"
        class="flex flex-col gap-4 my-4 mx-2 p-4 bg-white/5 rounded-md"
      >
        <!-- Name and Typology -->
        <div class="flex justify-between gap-4">
          <UFormField label="Name" class="flex-2">
            <UInput placeholder="Name" v-model="ex.name" />
          </UFormField>

          <UFormField label="Typology" class="flex-2">
            <UInput placeholder="Typology" v-model="ex.typology" />
          </UFormField>
        </div>

        <!-- Reps, Sets, and Rest -->
        <div class="flex gap-4 w-full flex-wrap">
          <UFormField label="Reps" class="flex-1 min-w-[100px]">
            <UInputNumber
              v-model="ex.reps"
              placeholder="Reps"
              orientation="vertical"
            />
          </UFormField>

          <UFormField label="Sets" class="flex-1 min-w-[100px]">
            <UInputNumber
              v-model="ex.sets"
              placeholder="Sets"
              orientation="vertical"
            />
          </UFormField>

          <UFormField label="Rest" class="flex-1 min-w-[100px]">
            <UInputNumber
              v-model="ex.rest"
              placeholder="Rest"
              orientation="vertical"
            />
          </UFormField>
        </div>

        <!-- Delete Button -->
        <UButton
          icon="i-heroicons-trash"
          variant="ghost"
          @click="deleteExercise(idx)"
          class="self-end"
          title="Delete exercise"
        />
      </div>
    </section>

    <!-- Right: Add Exercise Form -->

    <section class="p-6 scrollbar-hidden">
      <h2 class="text-xl font-semibold mb-4 text-[var(--color-secondary)]">
        Add Exercise
      </h2>

      <div class="space-y-4 bg-white/5 p-6 pr-4 rounded-lg shadow-inner">
        <UFormField label="Name">
          <UInput placeholder="e.g. Bench Press" v-model="newExercise.name" />
        </UFormField>

        <UFormField label="Typology">
          <UInput placeholder="e.g. Chest" v-model="newExercise.typology" />
        </UFormField>

        <div class="flex gap-4 flex-wrap">
          <UFormField label="Reps" class="flex-1 min-w-[50px]">
            <UInputNumber
              v-model="newExercise.reps"
              placeholder="Reps"
              orientation="vertical"
              class="w-full box-border"
            />
          </UFormField>

          <UFormField label="Sets" class="flex-1 min-w-[50px]">
            <UInputNumber
              v-model="newExercise.sets"
              placeholder="Sets"
              orientation="vertical"
              class="w-full box-border"
            />
          </UFormField>

          <UFormField label="Rest (s)" class="flex-1 min-w-[50px]">
            <UInputNumber
              v-model="newExercise.rest"
              placeholder="Rest"
              orientation="vertical"
              class="w-full box-border"
            />
          </UFormField>
        </div>

        <!-- Add Exercise Button -->
        <UButton
          @click="addExercise"
          size="md"
          color="secondary"
          variant="solid"
          class="mt-6 w-full"
        >
          Add Exercise
        </UButton>

        <!-- Save Workout Button -->
        <UButton
          @click="submitWorkout"
          size="md"
          color="primary"
          variant="solid"
          :loading="editPending"
          class="mt-6 w-full"
          icon="i-heroicons-check-circle"
        >
          Save Workout
        </UButton>
      </div>
    </section>
  </div>
</template>
