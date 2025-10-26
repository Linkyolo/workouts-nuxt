<script setup lang="ts">
import { useFetchWorkouts } from "~/composables/workout/useFetchWorkouts";
import NewWorkout from "~/components/workouts/NewWorkout.vue";
import EditWorkout from "~/components/workouts/EditWorkout.vue";
import { useDeleteWorkout } from "~/composables/workout/useDeleteWorkout";
import { useFormatDate } from "~/utils/useFormatDate";
const { workouts, pending, error, refreshWorkouts } = await useFetchWorkouts();

const toast = useToast();
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
          refreshWorkouts();
        },
      },
      {
        label: "Delete",
        icon: "i-lucide-trash",
        color: "error",
        onSelect: () => {
          console.log("onSelect has id: ", id);
          //TODO change number to HashID
          handleDeleteWorkout(Number(id));
          refreshWorkouts();
        },
      },
    ],
  ];
}

function onShowNewWorkout() {
  showCreateWorkout.value = true;
  showEditWorkout.value = false;
}

function onShowEditWorkout(id: number) {
  selectedID.value = id;
  showEditWorkout.value = true;
  showCreateWorkout.value = false;
}
// Close modal
function closeModal() {
  showCreateWorkout.value = false;
  showEditWorkout.value = false;
  refreshWorkouts();
}

const {
  deleteWorkout,
  pending: deletePending,
  error: deleteError,
} = useDeleteWorkout();

const handleDeleteWorkout = async (id: number) => {
  const success = await deleteWorkout(id);

  if (success) {
    toast.add({
      color: "success",
      title: "Workout deleted successfully!",
    });
    refreshWorkouts();
  } else {
    toast.add({
      color: "red",
      title: "Failed to delete workout",
      description: deleteError.value?.message || "An error occurred.",
    });
  }
};

const isModalOpen = computed({
  get: () => showCreateWorkout.value || showEditWorkout.value,
  set: (value: boolean) => {
    if (!value) closeModal(); // close both when modal is dismissed
  },
});
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
      v-model:open="isModalOpen"
      dismissible
      class="w-full"
      :ui="{ content: 'max-w-4xl' }"
    >
      <template #content>
        <NewWorkout v-if="showCreateWorkout" />
        <EditWorkout :id="parseInt(selectedID)" v-if="showEditWorkout" />
      </template>
    </UModal>
  </div>
  <UTable
    :data="workouts"
    :columns="columns"
    class="flex-1"
    :ui="{
      tr: 'even:bg-secondary/10 odd:bg-tertiary/10 ',
    }"
  >
    <!---startTime-->
    <template #startTime-cell="{ row }">
      {{ useFormatDate(row.original.startTime) }}
    </template>

    <template #endTime-cell="{ row }">
      {{ useFormatDate(row.original.endTime) }}
    </template>
    <!-- Exercises -->

    <template #exercises-cell="{ row }">
      <div
        @click="onShowEditWorkout(row.original.id)"
        class="cursor-pointer space-y-2"
      >
        <ol>
          <li
            v-for="(ex, index) in row.original.exercises"
            :key="index"
            :style="{
              backgroundColor:
                index % 2 === 0
                  ? 'rgba(7, 197, 105, 0.1)' // light version of --color-primary
                  : 'rgba(255, 127, 80, 0.1)', // light version of --color-secondary
            }"
            class="p-3 rounded-md border border-transparent hover:border-primary transition"
          >
            <p><strong>Name:</strong> {{ ex?.name }}</p>
            <p><strong>Reps:</strong> {{ ex?.reps }}</p>
            <p><strong>Sets:</strong> {{ ex?.sets }}</p>
            <p><strong>Rest:</strong> {{ ex?.rest }}</p>
          </li>
        </ol>
      </div>
    </template>

    <template #action-cell="{ row }">
      <UDropdownMenu :items="getDropdownActions(row.original.id)">
        <UButton
          icon="i-lucide-ellipsis-vertical"
          color="secondary"
          variant="ghost"
          aria-label="Actions"
        />
      </UDropdownMenu>
    </template>
  </UTable>
  <div v-if="error">Error Retring data</div>
  <div v-if="error">{{ error }}</div>
</template>
