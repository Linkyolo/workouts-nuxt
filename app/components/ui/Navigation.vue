<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
const items = ref<NavigationMenuItem[][]>([
  [
    {
      label: "Links",
      type: "label",
    },
    {
      label: "Home",
      icon: "i-heroicons-home-solid",
      to: "/",
    },

    {
      label: "Workouts",
      icon: "mdi:weight-lifter",
      to: "/workouts",
    },
  ],
]);
</script>

<template>
  <UContainer class="flex justify-center items-center">
    <UNavigationMenu
      orientation="horizontal"
      :items="items"
      class="data-[orientation=vertical]:w-48"
    />
  </UContainer>
</template>
