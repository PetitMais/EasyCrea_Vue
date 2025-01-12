<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function setRank(rank) {
  sessionStorage.setItem('choiceRank', rank);
}

</script>

<template>
  <h1>Sélectionner votre profil</h1>
  <RouterLink id="admin" to="/connexion" @click="() => setRank('admin')">
    Administrateur
  </RouterLink>
  <RouterLink id="createur" to="/connexion" @click="() => setRank('créateur')">
    Créateur
  </RouterLink>
</template>

<style scoped>

</style>
