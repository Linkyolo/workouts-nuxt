<script setup lang="ts">
import { onMounted } from "vue";
import { useFetchUsers } from "~/composables/user/useFetchUsers";

const { users, pending, error } = useFetchUsers();
onMounted(() => {
  console.log("Munted: did it work?", users.value);
});
</script>

<template>
  <h1>Retrived:</h1>
  {{ users }}

  <div v-if="pending">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <ul v-else>
    <li v-for="user in users" :key="user.id">{{ user.name }}</li>
  </ul>
</template>
