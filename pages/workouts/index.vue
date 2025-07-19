<script setup lang="ts">
import { onMounted } from "vue";

import { gql } from "nuxt-graphql-request/utils";

const { $graphql } = useNuxtApp();

const query = gql`
  query users {
    users {
      id
      name
    }
  }
`;

const { data: users } = await useAsyncData("users", async () => {
  const data = await $graphql.default.request(query);
  return data.allPlanets.planets;
});

onMounted(() => {
  console.log("Munted: did it work?", data);
});
</script>

<template></template>
