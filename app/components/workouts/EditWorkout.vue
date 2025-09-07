<script setup lang="ts">
import { ref } from "vue";
import { UFormField } from "#components";
import { useToast } from "#imports";
import { useOverlay } from "#imports";
import { useFetchSingleWorkout } from "~/composables/workout/useFetchSingleWorkout";
import { Workout } from "~/types/Workout";

const props = defineProps<{
  id: number;
}>();

// Initialize reactive workout state
const workout = ref<Workout>({
  startTime: null,
  endTime: null,
  type: "",
  userId: 1, // TODO: Replace with dynamic user context (e.g., useAuth().user.id)
  exercises: [],
});

const emit = defineEmits<{
  close: [boolean];
}>();

const toast = useToast();
const overlay = useOverlay();

// Fetch workout data
const {
  workout: workoutData,
  pending,
  error,
} = await useFetchSingleWorkout(props.id);

// Update workout state when data is fetched
watch(
  workoutData,
  (newVal) => {
    console.log("workout datTA detected...", newVal);
    if (newVal) {
      workout.value = {
        ...newVal,
        exercises: Array.isArray(newVal.exercises) ? [...newVal.exercises] : [],
      };
    } else {
      toast.add({
        title: "Workout not found",
        description: "Workout not found",
        color: "error",
      });
      emit("close", false);
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

// Debugging
onMounted(() => {
  console.log("Mounted: workout.value", workout.value);
  console.log("Mounted: workoutData.value", workoutData.value);
  console.log("Mounted: pending", pending.value);
});

// Submit workout
async function sendWorkout() {
  workout.value.type = "Strength & Condition";
  const now = new Date().toISOString();
  workout.value.startTime = now;
  workout.value.endTime = now;

  try {
    // TODO CHANGE to the edit
    // const { workout: result } = await useCreateWorkout(workout.value);

    const result = "ok";
    console.log("result from useCreateqQuery", result);
    if (result.value?.exercises?.length) {
      toast.add({
        color: "success",
        title: "Workout created successfully!",
      });
      emit("close", true);
    } else {
      throw new Error("Workout missing exercises.");
    }
  } catch (error) {
    console.error("Error creating workout:", error);
    toast.add({
      color: "error",
      title: "Failed to create workout",
    });
  }
}
</script>

<template>
  <UForm :state="workout" class="flex flex-col items-center">
    <h1>EDIT workout</h1>
    <!-- Add Exercise Button -->

    {{ workout }}

    <UButton @click="addExercise" size="md" color="secondary" variant="solid">
      Add Exercise
    </UButton>

    <!-- Exercises Inputs -->
    <div
      v-for="(ex, id) in workout?.exercises"
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
