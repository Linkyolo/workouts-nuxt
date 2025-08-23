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
