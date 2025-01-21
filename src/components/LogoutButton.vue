<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function logOut() {
  sessionStorage.removeItem("id");
  sessionStorage.removeItem("userRank");
  router.push('/');
}
</script>

<template>
  <button @click="logOut">Se déconnecter</button>
</template>

<style scoped></style>
