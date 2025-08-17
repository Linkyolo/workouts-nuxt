<script setup lang="ts">
import { ref } from "vue";
import { UFormField } from "#components";
import { useToast } from "#imports";
import { useOverlay } from "#imports";
import { useCreateWorkout } from "~/composables/workout/useCreateWorkout";

type Exercise = {
  typology: string;
  reps: number;
  sets: number;
  rest: number;
  name: string;
};

type Workout = {
  startTime: string | null;
  endTime: string | null;
  type: string;
  userId: number;
  exercises: Exercise[];
};

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
async function sendWorkout() {
  workout.value.type = "Strength & Condition";
  const now = new Date().toISOString();
  workout.value.startTime = now;
  workout.value.endTime = now;

  try {
    const { workout: result } = await useCreateWorkout(workout.value);

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
  <UForm :state="workout">
    <!-- Add Exercise Button -->
    <UButton @click="addExercise" size="md" color="secondary" variant="solid">
      Add Exercise
    </UButton>

    <!-- Exercises Inputs -->
    <div
      v-for="(ex, id) in workout.exercises"
      :key="id"
      class="flex flex-wrap gap-4 my-4"
    >
      <UFormField label="Exercise Name">
        <UInput placeholder="Name" v-model="ex.name" />
      </UFormField>

      <UFormField label="Typology">
        <UInput placeholder="Typology" v-model="ex.typology" />
      </UFormField>

      <UFormField label="Reps">
        <UInputNumber placeholder="Reps" v-model="ex.reps" />
      </UFormField>

      <UFormField label="Sets">
        <UInputNumber placeholder="Sets" v-model="ex.sets" />
      </UFormField>

      <UFormField label="Rest (sec)">
        <UInputNumber placeholder="Rest" v-model="ex.rest" />
      </UFormField>
    </div>

    <!-- Submit Workout -->
    <UButton @click="sendWorkout" size="md" color="primary" variant="solid">
      Send
    </UButton>
  </UForm>
</template>
