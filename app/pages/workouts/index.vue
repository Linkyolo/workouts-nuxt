<script setup lang="ts">
import { onMounted } from "vue";

import { gql } from "nuxt-graphql-request/utils";

const { $graphql } = useNuxtApp();

const query = gql`
  query workouts {
    date
    type
    user {
      id
      name
    }
  }
`;

const { data: workouts } = await useAsyncData("users", async () => {
  const workouts = await $graphql.default.request(query);
  return workouts;
});

onMounted(() => {
  console.log("Munted: did it work?", workouts.value);
});
</script>

<template>
  <h1>Retrived:</h1>
  {{ workouts }}
</template>
