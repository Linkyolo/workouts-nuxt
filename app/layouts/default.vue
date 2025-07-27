<script setup lang="ts">
import Navigation from "../components/ui/Navigation.vue";
</script>
<template>
  <UContainer class="flex flex-col h-screen">
    <Navigation class="flex-none" />
    <div class="grow">
      <slot />
    </div>
    <!---  for the future  <Footer class="flex-none" /> --->
  </UContainer>
</template>
