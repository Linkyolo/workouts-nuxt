<script setup lang="ts">
import { useFetchWorkouts } from "~/composables/workout/useFetchWorkouts";
import NewWorkout from "~/components/workouts/NewWorkout.vue";
import EditWorkout from "~/components/workouts/EditWorkout.vue";
import { useDeleteWorkout } from "~/composables/workout/useDeleteWorkout";
import { useFormatDate } from "~/utils/useFormatDate";
const { workouts, pending, error } = await useFetchWorkouts();

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
    accessorKey: "endTime",
    header: "EndTime",
  },
  {
    accessorKey: "exercises",
    header: "Exercises",
  },
  {
    id: "action",
  },
];

const selectedID = ref<number | null>(null);
const showCreateWorkout = ref(false);
const showEditWorkout = ref(false);

function getDropdownActions(id: number): DropdownMenuItem[][] {
  return [
    [
      {
        label: "Details",
        icon: "i-lucide-copy",
        onSelect: () => {
          console.log("WIll show detailed for id=...", id);
        },
      },
    ],
    [
      {
        label: "Edit",
        icon: "i-lucide-edit",
        onSelect: () => {
          console.log("WIll edit id=...", id);
          onShowEditWorkout(id);
        },
      },
      {
        label: "Delete",
        icon: "i-lucide-trash",
        color: "error",
        onSelect: () => {
          console.log("onSelect has id: ", id);
          //TODO change number to HashID
          deleteWorkout(Number(id));
        },
      },
    ],
  ];
}

function onShowNewWorkout() {
  showCreateWorkout.value = !showCreateWorkout.value;
}

function onShowEditWorkout(id: number) {
  selectedID.value = id;
  showEditWorkout.value = !showEditWorkout.value;
}
// Close modal
function closeModal() {
  showCreateWorkout.value = false;
  showEditWorkout.value = false;
}

const deleteWorkout = (id: number) => {
  const res = useDeleteWorkout(id);
  console.log("Deletetion res:", res);
};
</script>

<template>
  <div v-if="pending">
    <p>Pending request...</p>
    <NuxtLoadingIndicator />
  </div>

  <h1>Table:</h1>

  <!-- Button to open Create Workout modal -->
  <UButton
    label="New Workout"
    color="secondary"
    variant="subtle"
    @click="onShowNewWorkout"
  />
  <!-- Single Modal for both Create and Edit -->
  <div>
    <UModal
      dismissible
      :open="showCreateWorkout || showEditWorkout"
      @update:model-value="closeModal"
    >
      <template #content>
        <NewWorkout v-if="showCreateWorkout" />
        <EditWorkout :id="parseInt(selectedID)" v-if="showEditWorkout" />
      </template>
    </UModal>
  </div>

  <UTable :data="workouts" :columns="columns" class="flex-1">
    <!---startTime-->
    <template #startTime-cell="{ row }">
      {{ useFormatDate(row.original.startTime) }}
    </template>

    <template #endTime-cell="{ row }">
      {{ useFormatDate(row.original.endTime) }}
    </template>
    <!-- Exercises -->
    <template #exercises-cell="{ row }">
      <div v-for="(ex, index) in row.original.exercises" :key="index">
        <div @click="onShowEditWorkout(row.original.id)" class="cursor-pointer">
          <ol>
            <li>
              <p>name: {{ ex?.name }}</p>
              <p>reps: {{ ex?.reps }}</p>
              <p>rest: {{ ex?.rest }}</p>
            </li>
          </ol>
        </div>
      </div>
    </template>

    <template #action-cell="{ row }">
      <UDropdownMenu :items="getDropdownActions(row.original.id)">
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
  <div v-if="error">{{ error }}</div>
</template>
