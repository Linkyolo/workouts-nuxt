<script setup lang="ts">
import { onMounted } from "vue";
import { useFetchWorkouts } from "~/composables/workout/useFetchWorkouts";
import NewWorkout from "~/components/workouts/NewWorkout.vue";
const { workouts, pending, error } = await useFetchWorkouts();

onMounted(() => {
  console.log("Munted:workouts ", workouts);
});

const columns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "type",
    header: "type",
  },
  {
    accessorKey: "startTime",
    header: "StartTime",
  },

  {
    accessorKey: "startTime",
    header: "StartTime",
  },
  {
    accessorKey: "exercises",
    header: "Exercises",
  },
  {
    id: "action",
  },
];

function getDropdownActions(): DropdownMenuItem[][] {
  return [
    [
      {
        label: "Details",
        icon: "i-lucide-copy",
        onSelect: () => {
          console.log("WIll edit...");
        },
      },
    ],
    [
      {
        label: "Edit",
        icon: "i-lucide-edit",
      },
      {
        label: "Delete",
        icon: "i-lucide-trash",
        color: "error",
      },
    ],
  ];
}

const showCreateWorkout = ref(false);
function onShowNewWorkout() {
  console.log("BTN clicked");
  showCreateWorkout.value = !showCreateWorkout.value;
}
</script>

<template>
  <div v-if="pending">
    <p>Pending request...</p>
    <NuxtLoadingIndicator />
  </div>
  <h1>Retrived:</h1>
  {{ workouts }}

  <h1>Table:</h1>
  <!--Create workout modal-->
  <div>
    <UModal :close="{ onClick: () => emit('close', false) }">
      <UButton
        label="New Workout"
        color="secondary"
        variant="subtle"
        @click="onShowNewWorkout"
      />
      <template #content>
        <NewWorkout />
      </template>
    </UModal>
  </div>

  <UTable :data="workouts" :columns="columns" class="flex-1">
    <!---Exercises-->
    <template #exercises-cell="{ row }">
      {{ row.original.exercises }}

      <div v-for="ex in row.original.exercises">
        <ol>
          <li>
            <p>name: {{ ex?.name }}</p>
            <p>reps: {{ ex?.rest }}</p>
            <p>rest: {{ ex?.reps }}</p>
          </li>
        </ol>
      </div>
    </template>
    <template #action-cell="{ row }">
      <UDropdownMenu :items="getDropdownActions()">
        <UButton
          icon="i-lucide-ellipsis-vertical"
          color="neutral"
          variant="ghost"
          aria-label="Actions"
        />
      </UDropdownMenu>
    </template>
  </UTable>
  <div v-if="error">Error Retring data</div>
</template>
