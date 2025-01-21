<script setup>
import DeckList from './../components/DeckList.vue';
import LogoutButton from './../components/LogoutButton.vue';
const userRank = sessionStorage.getItem("userRank");

</script>

<template>
  <LogoutButton></LogoutButton>

  <main>
    <h1>Liste des decks</h1>

    <button v-if="userRank === 'admin'" @click="$router.push('/deck/add')">Ajouter un deck</button>

    <DeckList></DeckList>

  </main>
</template>

<style>
button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
