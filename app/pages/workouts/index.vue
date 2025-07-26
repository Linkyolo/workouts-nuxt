<script setup lang="ts">
import { onMounted } from "vue";
import { useFetchWorkouts } from "~/composables/workout/useFetchWorkouts";

const { workouts, pending, error } = await useFetchWorkouts();

onMounted(() => {
  console.log("Munted:workouts ", workouts);
});
</script>

<template>
  <div v-if="pending">Pending request...</div>
  <h1>Retrived:</h1>
  {{ workouts }}

  <h1>Table:</h1>
  <UTable :data="workouts" class="flex-1" />

  <div v-if="error">Error Retring data</div>
</template>
