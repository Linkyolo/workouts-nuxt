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
  workout.value.exercises.push({
    typology: "",
    reps: 0,
    sets: 0,
    rest: 0,
    name: "",
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
  <div v-if="pending" class="flex justify-center">
    <p>Loading workout...</p>
  </div>
  <UForm v-else :state="workout" class="flex flex-col items-center">
    <h1>EDIT workout</h1>
    <!-- Debug: Display workout data -->
    <pre v-if="workout">{{ JSON.stringify(workout, null, 2) }}</pre>

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
      @click="submitWorkout"
      size="md"
      color="primary"
      variant="solid"
      :disabled="pending"
    >
      Send
    </UButton>
  </UForm>
</template>
