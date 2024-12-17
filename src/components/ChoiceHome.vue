<script setup>
  

</script>

<template>
  <h1>Sélectionner votre profil</h1>
  <RouterLink id="admin" to="/connexion" @click.native="setRank('admin')">
    Administrateur
  </RouterLink>
  <RouterLink id="createur" to="/connexion" @click.native="setRank('créateur')">
    Créateur
  </RouterLink>
</template>

<style scoped>
/* export default {
  name: "YourComponent",
  methods: {
    setRank(rank) {
      sessionStorage.setItem("rank", rank);
    },
  },
}; */

</style>
