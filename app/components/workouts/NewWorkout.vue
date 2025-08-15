<script setup lang="ts">
import { UFormField } from "#components";
import { useCreateWorkout } from "~/composables/workout/useCreateWorkout";

type Exercise = {
  typology: String;
  reps: String;
  rest: Number;
  name: String;
};

type Workout = {
  startTime: Date;
  endTime: Date;
  type: String;
  //TODO use hashId instead
  user: 1;
  exercises: Exercise[];
};
const workout = ref<Workout>({
  startTime: null,
  endTime: null,
  type: "",
  //TODO use hashId instead
  // user: 1,
  userId: 1,
  exercises: [],
});

const emit = defineEmits<{ close: [boolean] }>();

function onClick() {
  const newExercise: Exercise = {
    typology: "",
    reps: 0,
    sets: 0,
    rest: 1,
    name: "",
  } as Exercise;
  // workout.value.exercises = [...workout.value?.exercises, newExercise];
  workout.value.exercises.push(newExercise);
}

const toast = useToast();
const overlay = useOverlay();

async function sendWorkout() {
  workout.value.type = "Strength & Condition";

  console.log("Would send this to the BE:", workout.value);
  workout.value.startTime = new Date().toISOString();
  workout.value.endTime = new Date().toISOString();
  const res = useCreateWorkout(workout.value);

  console.log("res", res);

  if (res.workout.value.exercises.length > 0) {
    toast.add({
      color: "success",
      id: "modal-success",
    });
  } else {
    toast.add({
      color: "error",
      id: "modal-dismiss",
    });
  }
}
</script>
<template>
  <UForm :state="workout">
    <UButton @click="onClick" size="md" color="secondary" variant="solid"
      >add Exercise</UButton
    >
    <div v-for="(ex, id) in workout?.exercises" class="flex">
      <UFormField label="Exercise name">
        <UInput palceholder="name" v-model="ex.name" />
      </UFormField>
      <UFormField label="typology">
        <UInput palceholder="Exercise typology" v-model="ex.typology" />
      </UFormField>
      <UFormField label="reps">
        <UInputNumber palceholder="Exercise reps" v-model="ex.reps" />
      </UFormField>

      <UFormField label="sets">
        <UInputNumber palceholder="Sets" v-model="ex.sets" />
      </UFormField>
      <UFormField label="rest">
        <UInputNumber palceholder="Exercise rest" v-model="ex.rest" />
      </UFormField>
    </div>

    <UButton @click="sendWorkout" size="md" color="primary" variant="solid"
      >Send</UButton
    >
  </UForm>
</template>
