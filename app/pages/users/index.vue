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
  const users = await $graphql.default.request(query);
  return users;
});

onMounted(() => {
  console.log("Munted: did it work?", users.value);
});
</script>

<template>
  <h1>Retrived:</h1>
  {{ users }}
</template>
